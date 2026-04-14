import asyncio
import os
import subprocess
import threading
import speech_recognition as sr
from playwright.async_api import async_playwright
import edge_tts
from ctypes import *
from contextlib import contextmanager
from groq import Groq
import json
import urllib.request

# --- CONFIG ---
MEETING_LINK = os.getenv("MEETING_LINK", "https://meet.jit.si/aiinterviewe")
if "#" not in MEETING_LINK:
    MEETING_LINK += "#config.prejoinPageEnabled=false&userInfo.displayName=%22AI%20Interviewer%22&config.disableAP=true"

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

CANDIDATE_NAME = os.getenv("CANDIDATE_NAME", "the candidate")
JOB_ROLE = os.getenv("JOB_ROLE", "a software role")
INTERVIEW_ID = os.getenv("INTERVIEW_ID", "unknown")

# --- NEW: Read the RAG Context File ---
RESUME_CONTEXT = "No resume provided."
context_file = f"/app/context_{INTERVIEW_ID}.txt"
if os.path.exists(context_file):
    with open(context_file, "r", encoding="utf-8") as f:
        RESUME_CONTEXT = f.read()
CUSTOM_INSTRUCTIONS = os.getenv("CUSTOM_INSTRUCTIONS", "")
# --- DYNAMIC RAG SYSTEM PROMPT ---
chat_history = [
    {
        "role": "system", 
        "content": CUSTOM_INSTRUCTIONS
    }
]

# --- STATE MANAGEMENT ---
current_playback = None
is_speaking = False
interrupted = False

# ALSA Error Suppressor
ERROR_HANDLER_FUNC = CFUNCTYPE(None, c_char_p, c_int, c_char_p, c_int, c_char_p)
def py_error_handler(filename, line, function, err, fmt): pass
c_error_handler = ERROR_HANDLER_FUNC(py_error_handler)
@contextmanager
def no_alsa_error():
    try:
        asound = cdll.LoadLibrary('libasound.so.2')
        asound.snd_lib_error_set_handler(c_error_handler)
        yield
        asound.snd_lib_error_set_handler(None)
    except: yield

# --- NON-BLOCKING MOUTH ---
async def speak(text):
    global current_playback, is_speaking, interrupted
    is_speaking = True
    interrupted = False
    print(f"\n[Bot] 🔊 Speaking: {text}\n")
    
    mp3_path = "/tmp/speech.mp3"
    wav_path = "/tmp/speech.wav"
    communicate = edge_tts.Communicate(text, "en-US-AvaNeural")
    await communicate.save(mp3_path)
    subprocess.run(["ffmpeg", "-y", "-i", mp3_path, "-acodec", "pcm_s16le", "-ar", "48000", "-ac", "1", wav_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    current_playback = subprocess.Popen(["paplay", "--device=AIMouth", wav_path])
    
    while current_playback.poll() is None:
        if interrupted:
            current_playback.kill()  # 🔪 CRITICAL FIX: Use KILL for absolute immediate silence
            print("🛑 [Bot] Playback killed successfully.")
            break
        await asyncio.sleep(0.05)
        
    is_speaking = False

# --- BACKGROUND EARS ---
def background_listener(loop, speech_queue):
    recognizer = sr.Recognizer()
    recognizer.energy_threshold = 300 
    recognizer.dynamic_energy_threshold = False 

    with no_alsa_error():
        mic_index = None
        for i, name in enumerate(sr.Microphone.list_microphone_names()):
            if "aiears" in name.lower():
                mic_index = i
                break
        
        with sr.Microphone(device_index=mic_index) as source:
            print("[Ears] 🔴 Background continuous listening started...")
            while True:
                try:
                    # Listen for user speech
                    audio = recognizer.listen(source, timeout=1, phrase_time_limit=10)
                    
                    # ⚡ THE BARGE-IN FIX ⚡
                    # The exact millisecond the mic captures your voice, we stop the bot.
                    # We DO NOT wait for Google to transcribe it first.
                    global interrupted, is_speaking
                    if is_speaking:
                        interrupted = True
                        print("⚡ [Barge-in] Voice detected! Halting bot audio instantly...")

                    print("[Ears] ⏳ Transcribing...")
                    text = recognizer.recognize_google(audio)
                    
                    if text:
                        print(f"\n✨ [CANDIDATE]: {text} ✨\n")
                        asyncio.run_coroutine_threadsafe(speech_queue.put(text), loop)

                except sr.WaitTimeoutError:
                    pass 
                except sr.UnknownValueError:
                    pass 
                except Exception as e:
                    pass

# --- BRAIN ---
def get_ai_response(user_text=None):
    # 1. Add User Input to History
    if user_text:
        chat_history.append({
            "role": "user",
            "content": user_text
        })

        # --- THE SECRET WEAPON: DYNAMIC INSTRUCTION ---
        # We inject a temporary system message to force the AI to "think" like a grader.
        # This overrides the "helpful assistant" bias.
        
        evaluation_prompt = f"""
        [SYSTEM INSTRUCTION: ACT AS A SENIOR ENGINEER, NOT A SUPPORT BOT]
        
        The candidate just said: "{user_text}"
        
        1. ANALYZE BEHAVIOR:
           - Is the candidate trolling, rude, or refusing to answer? -> If YES, say "This isn't working. I'm ending the interview." and STOP.
           - Is the answer vague? -> If YES, interrupt and say "That is too vague. Give me a specific example."
           - Did they say "what" or "I didn't hear"? -> If YES, repeat the question firmly ONCE.

        2. DECISION:
           - If they are hostile ("you are bad", "why answer"), do NOT apologize. Be cold. End it.
           - If they answered, ask a hard follow-up (e.g., "But how does that scale?").

        3. OUTPUT RULES:
           - NO parentheses like (Note: ...).
           - NO apologies ("I'm sorry you feel that way").
           - Max 2 sentences.
        """

        chat_history.append({
            "role": "system",
            "content": evaluation_prompt
        })
    
    print("🧠 [Brain] Thinking (with Evaluation Layer)...")

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=chat_history,
            max_tokens=150,
            temperature=0.6, # Lower temp = more strict/focused
        )

        ai_reply = response.choices[0].message.content

        # Cleanup: Remove the "Director's Note" from history so it doesn't pollute the context window
        if user_text:
            chat_history.pop() 

        # Add AI reply to history
        chat_history.append({
            "role": "assistant",
            "content": ai_reply
        })

        return ai_reply

    except Exception as e:
        print(f"❌ [Brain] Error: {e}")
        return "I'm having trouble processing that. Let's move to the next question."


# --- MAIN LOOP ---
async def main():
    speech_queue = asyncio.Queue()
    loop = asyncio.get_running_loop()
    
    listener_thread = threading.Thread(target=background_listener, args=(loop, speech_queue), daemon=True)
    listener_thread.start()

    async with async_playwright() as p:
        print(f"[Bot] Launching Interviewer...")
        browser = await p.chromium.launch(
            headless=False,
            args=["--use-fake-ui-for-media-stream", "--no-sandbox", "--disable-dev-shm-usage", "--start-maximized"]
        )
        context = await browser.new_context()
        await context.grant_permissions(['microphone', 'camera'])
        page = await context.new_page()
        
        try:
            print(f"[Bot] Navigating to {MEETING_LINK}...")
            await page.goto(MEETING_LINK, timeout=60000)
            await page.wait_for_timeout(5000)

            try:
                await page.wait_for_selector('[aria-label="Leave"]', timeout=15000)
                print("✅ [Verified] Bot is inside!")
            except:
                if await page.locator('[aria-label="Join meeting"]').is_visible():
                    await page.locator('[aria-label="Join meeting"]').click()
                    await page.wait_for_timeout(5000)

            # 1. INITIAL GREETING
            initial_greeting = await asyncio.to_thread(get_ai_response, None)
            await speak(initial_greeting)
            
            # 2. FINITE INTERVIEW LOOP (e.g., exactly 2 interactions for testing)
            QUESTIONS_TO_ASK = 6
            
            for _ in range(QUESTIONS_TO_ASK):
                user_text = await speech_queue.get()
                ai_reply = await asyncio.to_thread(get_ai_response, user_text)
                await speak(ai_reply)

            # 3. GRACEFUL EXIT
            await speak("Thank you so much for your time. I have all the information I need. The HR team will be in touch with you shortly. Have a great day!")
            await asyncio.sleep(2) # Give it a second to finish speaking
            
            # 4. SEND TRANSCRIPT TO FASTAPI
            if INTERVIEW_ID != "unknown":
                print("💾 [Bot] Sending transcript back to HQ...")
                # host.docker.internal is how Docker talks to your Windows localhost
                api_url = f"http://host.docker.internal:8000/api/interviews/{INTERVIEW_ID}/transcript"
                
                payload = json.dumps({"transcript": chat_history}).encode('utf-8')
                req = urllib.request.Request(api_url, data=payload, headers={'Content-Type': 'application/json'}, method='PATCH')
                
                try:
                    urllib.request.urlopen(req, timeout=10)
                    print("✅ [Bot] Transcript saved successfully!")
                except Exception as e:
                    print(f"❌ [Bot] Failed to save transcript: {e}")

            # 5. LEAVE THE MEETING
            print("🚪 [Bot] Clicking 'Leave' button...")
            leave_button = page.locator('[aria-label="Leave"]')
            if await leave_button.is_visible():
                await leave_button.click()
                await page.wait_for_timeout(2000)

        except Exception as e:
            print(f"❌ [Crash] {e}")
        finally:
            await browser.close()
            print("[Bot] Session Ended")

if __name__ == "__main__":
    asyncio.run(main())