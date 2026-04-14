"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Calendar, BarChart3, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:8000/api/interviews/user/${user.id}`);
        if (res.ok) {
            const data = await res.json();
            // Sort by date descending (newest first)
            setInterviews(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, getToken]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Interview History</h1>
            <p className="text-gray-500">Track your progress over time.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {interviews.length === 0 ? (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">No interviews yet</h3>
                <p className="text-gray-500 mb-6">Start your first AI practice session to see data here.</p>
                <Link href="/candidate/setup" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                    Start Practice
                </Link>
            </div>
        ) : (
            <div className="divide-y divide-gray-100">
                {interviews.map((interview) => (
                    <Link key={interview.interview_id} href={`/dashboard/${interview.interview_id}`} className="block hover:bg-gray-50 transition group">
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${interview.has_scorecard ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {interview.has_scorecard ? <CheckCircle2 className="w-6 h-6"/> : <Loader2 className="w-6 h-6 animate-spin"/>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">{interview.job_role}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(interview.created_at).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{new Date(interview.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                {interview.has_scorecard && (
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Score</p>
                                        <p className={`text-2xl font-black ${
                                            (interview.score || 0) >= 80 ? 'text-green-600' : 
                                            (interview.score || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {interview.score || 0}%
                                        </p>
                                    </div>
                                )}
                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:text-blue-500 transition">
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}