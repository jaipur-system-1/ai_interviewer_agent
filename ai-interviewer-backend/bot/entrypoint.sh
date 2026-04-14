#!/bin/bash

# 1. Start Virtual Screen
Xvfb :99 -screen 0 1280x720x24 -ac -noreset &
pulseaudio -D --exit-idle-time=-1
sleep 1

# 2. CABLE 1: THE MOUTH (Python plays here -> Chrome hears it)
pactl load-module module-null-sink sink_name=AIMouth sink_properties=device.description="AIMouth"
# CRITICAL FIX: Remap the mouth monitor to a "Virtual Mic" so Chrome accepts it
pactl load-module module-remap-source master=AIMouth.monitor source_name=VirtualMic source_properties=device.description="VirtualMic"
# Tell Chrome to use the Virtual Mic as default
pacmd set-default-source VirtualMic

# 3. CABLE 2: THE EARS (Chrome plays here -> Python listens to it)
pactl load-module module-null-sink sink_name=AIEars sink_properties=device.description="AIEars"
# Tell Chrome to play incoming meeting audio to the Ears
pacmd set-default-sink AIEars

# 4. Unmute everything & Max Volume
pactl set-sink-mute AIMouth 0
pactl set-source-mute VirtualMic 0
pactl set-sink-mute AIEars 0
pactl set-source-mute AIEars.monitor 0

pactl set-sink-volume AIMouth 100%
pactl set-source-volume VirtualMic 100%
pactl set-sink-volume AIEars 100%
pactl set-source-volume AIEars.monitor 100%

# 5. Run Python
exec python3 main_server.py "$@"

and i will use this only and start new phase 

will improve latency and things later