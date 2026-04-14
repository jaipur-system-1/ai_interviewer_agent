"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // <-- NEW IMPORT
import { UploadCloud, CheckCircle, Video, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function CandidatePortal() {
  const router = useRouter();
  const params = useParams(); // <-- NEW: Bulletproof way to get URL params
  const candidateId = params.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "ready" | "starting">("idle");
  const [jobRole, setJobRole] = useState("Senior Software Engineer"); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !candidateId) return;
    setStatus("uploading");
    try {
      // Now this securely passes your real ID instead of "undefined"
      await api.uploadResume(candidateId, file);
      setStatus("ready");
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume. Ensure FastAPI is running!");
      setStatus("idle");
    }
  };

  const handleStartInterview = async () => {
    if (!candidateId) return;
    setStatus("starting");
    try {
      await api.startInterview(candidateId, jobRole);
      router.push(`/candidate/${candidateId}/room`);
    } catch (error) {
      console.error(error);
      alert("Failed to launch AI Bot.");
      setStatus("ready");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">AI Interview Portal</h1>
          <p className="opacity-90 mt-1">Applying for: {jobRole}</p>
        </div>

        <div className="p-8">
          {status === "idle" || status === "uploading" ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">Welcome! Let's get started.</h2>
                <p className="text-gray-500 mt-2 text-sm">Please upload your latest resume. Our AI will review it to personalize your interview questions.</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition">
                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="w-12 h-12 text-blue-500 mb-3" />
                  <span className="text-gray-700 font-medium">{file ? file.name : "Click to upload PDF resume"}</span>
                  <span className="text-gray-400 text-xs mt-1">Max size: 5MB</span>
                </label>
              </div>

              <button 
                onClick={handleUpload} 
                disabled={!file || status === "uploading"}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center"
              >
                {status === "uploading" ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading...</> : "Submit Resume"}
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Resume Analyzed Successfully</h2>
              <p className="text-gray-500 text-sm">Your camera and microphone will be tested on the next screen. The AI Interviewer is waiting for you.</p>
              
              <button 
                onClick={handleStartInterview}
                disabled={status === "starting"}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center"
              >
                {status === "starting" ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting to AI...</> : <><Video className="w-5 h-5 mr-2" /> Join Live Interview</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}