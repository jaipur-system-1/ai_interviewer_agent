"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Target, 
  Zap, 
  BrainCircuit, 
  MessageSquare,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function InterviewReport() {
  const params = useParams();
  const { getToken } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await getToken();
        // Updated Endpoint
        const res = await fetch(`http://localhost:8000/api/interviews/${params.id}`, {
             headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            setReport(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchReport();
  }, [params.id, getToken]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  if (!report || !report.scorecard) return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <h2 className="text-xl font-bold text-gray-900">AI is analyzing your interview...</h2>
          <p className="text-gray-500 mt-2">This usually takes 30-60 seconds. Please refresh in a moment.</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-blue-100 text-blue-700 rounded-full font-bold hover:bg-blue-200 transition">
            Refresh Status
          </button>
      </div>
  );

  const { scorecard, transcript, job_role } = report;

  // Transform Skill Data for Radar Chart
  const radarData = scorecard.skill_breakdown?.map((skill: any) => ({
    subject: skill.name,
    A: skill.score,
    fullMark: 100,
  })) || [];

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance Report</h1>
                <p className="text-gray-500">{job_role} • {new Date(report.created_at).toLocaleDateString()}</p>
            </div>
        </div>

        {/* 1. TOP CARDS: Score & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Overall Score */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${
                    scorecard.overall_score >= 80 ? 'bg-green-500' : scorecard.overall_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Overall Score</span>
                <span className="text-6xl font-black text-gray-900 mb-2">{scorecard.overall_score}</span>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                    scorecard.recommendation === 'Strong Hire' || scorecard.recommendation === 'Hire' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {scorecard.recommendation}
                </span>
            </div>

            {/* Executive Summary */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm relative">
                 <div className="absolute top-8 left-8">
                    <MessageSquare className="w-8 h-8 text-blue-100 fill-blue-600" />
                 </div>
                 <div className="pl-12">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Executive Summary</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{scorecard.summary}</p>
                 </div>
            </div>
        </div>

        {/* 2. SKILL RADAR & BEHAVIOR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Skill Radar Chart */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 px-2 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" /> Skill Breakdown
                </h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Candidate" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Behavioral Analysis */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" /> Behavioral Analysis
                </h3>
                <div className="space-y-4">
                    {scorecard.behavioral_analysis?.map((trait: any, i: number) => (
                        <div key={i} className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className={`mt-1 p-1 rounded-full ${trait.status === 'Positive' ? 'bg-green-100 text-green-600' : trait.status === 'Negative' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {trait.status === 'Positive' ? <CheckCircle2 className="w-4 h-4" /> : trait.status === 'Negative' ? <XCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            </div>
                            <div className="ml-4">
                                <h4 className="font-bold text-gray-900 text-sm">{trait.label}</h4>
                                <p className="text-sm text-gray-500 mt-1">{trait.observation}</p>
                            </div>
                        </div>
                    ))}
                    {(!scorecard.behavioral_analysis || scorecard.behavioral_analysis.length === 0) && (
                        <p className="text-gray-400 text-center italic">No behavioral data generated.</p>
                    )}
                </div>
            </div>
        </div>

        {/* 3. COACHING PLAN */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center relative z-10">
                <TrendingUp className="w-6 h-6 mr-2" /> Personalized Growth Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-3">
                    <h4 className="font-bold text-indigo-800 text-sm uppercase tracking-wide opacity-70">Key Strengths</h4>
                    <ul className="space-y-2">
                        {scorecard.key_strengths?.map((s: string, i: number) => (
                            <li key={i} className="flex items-center text-indigo-900 font-medium">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-3">
                    <h4 className="font-bold text-indigo-800 text-sm uppercase tracking-wide opacity-70">Areas to Improve</h4>
                    <ul className="space-y-2">
                         {scorecard.areas_for_improvement?.map((s: string, i: number) => (
                            <li key={i} className="flex items-center text-indigo-900 font-medium">
                                <Zap className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-indigo-200/50 relative z-10">
                <h4 className="font-bold text-indigo-900 mb-3">Coach's Tips</h4>
                <div className="grid gap-3">
                    {scorecard.coaching_tips?.map((tip: string, i: number) => (
                        <div key={i} className="bg-white/60 p-3 rounded-lg text-indigo-800 text-sm font-medium border border-indigo-100 shadow-sm">
                            💡 {tip}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 4. TRANSCRIPT */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Transcript Analysis</h3>
             </div>
             <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                {transcript.map((msg: any, i: number) => {
                    // Hide system messages if any leaked
                    if (msg.role === 'system') return null;
                    const isUser = msg.role === 'user';
                    return (
                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                isUser 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                            }`}>
                                <p className="font-bold text-xs mb-1 opacity-70">{isUser ? 'YOU' : 'AI INTERVIEWER'}</p>
                                {msg.content}
                            </div>
                        </div>
                    )
                })}
             </div>
        </div>
    </div>
  );
}