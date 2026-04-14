"use client";
import { useUser } from "@clerk/nextjs";

export default function RecruiterPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.firstName} 👋</h1>
          <p className="text-gray-400">Here's what's happening at your organization today.</p>
        </div>
        <button className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
             + Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <div className="text-4xl font-bold text-white mb-1">0</div>
            <div className="text-sm font-medium text-blue-400">Active Jobs</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <div className="text-4xl font-bold text-white mb-1">0</div>
            <div className="text-sm font-medium text-purple-400">Candidates</div>
        </div>
      </div>
    </div>
  );
}