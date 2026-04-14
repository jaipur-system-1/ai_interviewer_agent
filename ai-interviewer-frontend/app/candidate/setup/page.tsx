"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { 
  Play, 
  Loader2, 
  Briefcase, 
  BarChart, 
  Code2, 
  Layers, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";

export default function InterviewSetup() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState("Mid-Level");
  const [focusArea, setFocusArea] = useState("General Coding");
  const [techStack, setTechStack] = useState("");
  const [personality, setPersonality] = useState("Professional");
  const [loading, setLoading] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      
      const res = await fetch(`http://localhost:8000/api/interviews/start`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          candidate_id: user?.id, 
          job_role: jobRole,
          difficulty: difficulty,
          focus_area: focusArea,
          tech_stack: techStack,
          personality: personality // Sending the new persona setting
        })
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      router.push(`/candidate/${data.interview_id}/room`);
    } catch (err) {
      alert("Failed to start interview. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
           <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 transition font-medium group">
             <div className="bg-gray-100 p-2 rounded-lg mr-3 group-hover:bg-gray-200 transition">
                <ArrowLeft className="w-4 h-4" /> 
             </div>
             Back to Dashboard
           </Link>
           
           <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">Configuration</p>
                <p className="text-xs text-gray-500">Step 1 of 2</p>
             </div>
             <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
             </div>
           </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex justify-center p-6 md:p-12 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
         </div>

         <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            
            {/* Left Sidebar: Context & Tips */}
            <div className="lg:col-span-4 space-y-8 mt-4 hidden lg:block">
               <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Configure Your <br/><span className="text-blue-600">Simulation.</span></h1>
                  <p className="text-gray-500 leading-relaxed text-lg">
                     Our AI constructs a unique persona based on these settings. Be specific for the best results.
                  </p>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center">
                     <Sparkles className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                     Pro Tips
                  </h3>
                  <ul className="space-y-3">
                     {[
                        "Choose 'Senior' to face deeper architectural questions.",
                        "Add 'System Design' to practice whiteboard scenarios.",
                        "Select 'Ruthless' mode to prepare for stress interviews."
                     ].map((tip, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                           <CheckCircle2 className="w-4 h-4 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                           {tip}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Right Column: The Form */}
            <div className="lg:col-span-8">
               <form onSubmit={handleStart} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                  
                  {/* Mobile Heading */}
                  <div className="lg:hidden mb-8 text-center">
                     <h1 className="text-3xl font-bold text-gray-900">Configure Session</h1>
                     <p className="text-gray-500 mt-2">Customize the AI interviewer persona.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                     
                     {/* Job Role */}
                     <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Target Role</label>
                        <div className="relative group">
                           <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition" />
                           <input 
                              required
                              type="text"
                              placeholder="e.g. Full Stack Engineer, DevOps Specialist"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                              value={jobRole}
                              onChange={(e) => setJobRole(e.target.value)}
                           />
                        </div>
                     </div>

                     {/* Difficulty */}
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty Level</label>
                        <div className="relative group">
                           <BarChart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition" />
                           <select 
                              className="w-full pl-12 pr-10 py-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium appearance-none cursor-pointer"
                              value={difficulty}
                              onChange={(e) => setDifficulty(e.target.value)}
                           >
                              <option>Junior / Intern</option>
                              <option>Mid-Level</option>
                              <option>Senior</option>
                              <option>Staff / Principal</option>
                           </select>
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                           </div>
                        </div>
                     </div>

                     {/* Focus Area */}
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Focus Area</label>
                        <div className="relative group">
                           <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition" />
                           <select 
                              className="w-full pl-12 pr-10 py-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium appearance-none cursor-pointer"
                              value={focusArea}
                              onChange={(e) => setFocusArea(e.target.value)}
                           >
                              <option>General Coding</option>
                              <option>Data Structures & Algo</option>
                              <option>System Design</option>
                              <option>Behavioral / HR</option>
                           </select>
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                           </div>
                        </div>
                     </div>

                     {/* Personality Mode (NEW) */}
                     <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                           <BrainCircuit className="w-4 h-4 mr-2 text-purple-600"/> Interviewer Persona
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {/* Option 1: Friendly */}
                           <div 
                              onClick={() => setPersonality("Friendly")}
                              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${personality === "Friendly" ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"}`}
                           >
                              <div className="font-bold text-gray-900 mb-1">Friendly</div>
                              <div className="text-xs text-gray-500">Warm, encouraging HR style. Good for warmups.</div>
                           </div>

                           {/* Option 2: Professional */}
                           <div 
                              onClick={() => setPersonality("Professional")}
                              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${personality === "Professional" ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
                           >
                              <div className="font-bold text-gray-900 mb-1">Professional</div>
                              <div className="text-xs text-gray-500">Standard Tech Lead. Objective and direct.</div>
                           </div>

                           {/* Option 3: Strict */}
                           <div 
                              onClick={() => setPersonality("Strict")}
                              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${personality === "Strict" ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-gray-200"}`}
                           >
                              <div className="font-bold text-gray-900 mb-1">Ruthless</div>
                              <div className="text-xs text-gray-500">High pressure. Challenges every answer.</div>
                           </div>
                        </div>
                     </div>

                     {/* Tech Stack */}
                     <div className="col-span-2">
                        <div className="flex justify-between mb-2">
                           <label className="block text-sm font-bold text-gray-700">Tech Stack</label>
                           <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded">Optional</span>
                        </div>
                        <div className="relative group">
                           <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition" />
                           <input 
                              type="text"
                              placeholder="e.g. React, Python, AWS, Docker"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                              value={techStack}
                              onChange={(e) => setTechStack(e.target.value)}
                           />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 flex items-center">
                           <HelpCircle className="w-3 h-3 mr-1" />
                           Separate multiple technologies with commas
                        </p>
                     </div>
                  </div>

                  <button 
                     disabled={loading || !jobRole}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center group"
                  >
                     {loading ? (
                        <>
                           <Loader2 className="animate-spin mr-2 w-5 h-5" /> Initializing Environment...
                        </>
                     ) : (
                        <>
                           Start Simulation 
                           <Play className="ml-2 w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                        </>
                     )}
                  </button>
               </form>
            </div>
         </div>
      </main>
    </div>
  );
}