"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function InterviewRoom() {
  const params = useParams();
  const interviewId = params.id as string;
  const [isJoined, setIsJoined] = useState(false);

  // CRITICAL FIX: 
  // 1. Must match Backend URL: 'practice-' (was 'ai-practice-')
  // 2. Add config to skip the "Enter Name" lobby
  const ROOM_URL = `https://meet.jit.si/practice-${interviewId}#config.prejoinPageEnabled=false`;

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-gray-950 text-white px-6 py-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isJoined ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
          <h1 className="font-semibold tracking-wide">Live AI Interview Session</h1>
        </div>
        <div className="text-sm text-gray-400 font-mono">Session ID: {interviewId.slice(0, 8)}...</div>
      </div>

      {/* Jitsi Iframe */}
      <div className="flex-1 w-full h-full relative bg-black">
        <iframe
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          src={ROOM_URL}
          className="w-full h-full border-0"
          onLoad={() => setIsJoined(true)}
        />
        
        {!isJoined && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-0">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
                    <p>Connecting to secure room...</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}