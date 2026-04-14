"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Award, Clock, ChevronRight, Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ average: 0, total: 0, best: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        // Sync & Fetch
        await fetch(`http://localhost:8000/api/auth/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ name: user.fullName, email: user.primaryEmailAddress?.emailAddress })
        });
        const res = await fetch(`http://localhost:8000/api/interviews/user/${user.id}`);
        const data = await res.json();
        setInterviews(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    if (isLoaded) fetchData();
  }, [isLoaded, user, getToken]);

  useEffect(() => {
    if (interviews.length > 0) {
      const completed = interviews.filter((i: any) => i.has_scorecard);
      const scores = completed.map(i => i.score || 0);
      const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
      setStats({ average: Math.round(avg), total: interviews.length, best: Math.max(0, ...scores) });
    }
  }, [interviews]);

  const chartData = interviews.filter((i: any) => i.has_scorecard).map((i: any) => ({
      date: new Date(i.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}),
      score: i.score || 0
    })).reverse();

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

  return (
    <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h2>
                <p className="text-blue-100 mt-2 max-w-xl">You've completed {stats.total} sessions. Ready to improve your skills further?</p>
                <div className="mt-6 flex gap-3">
                    <Link href="/candidate/setup" className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-bold shadow hover:bg-blue-50 transition flex items-center">
                        <Plus className="w-5 h-5 mr-2" /> Start New Practice
                    </Link>
                </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                <TrendingUp className="w-64 h-64" />
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Average Score" value={`${stats.average}%`} icon={<TrendingUp className="w-6 h-6 text-blue-600"/>} color="bg-blue-50" />
            <StatCard label="Best Performance" value={`${stats.best}%`} icon={<Award className="w-6 h-6 text-purple-600"/>} color="bg-purple-50" />
            <StatCard label="Total Sessions" value={stats.total} icon={<Clock className="w-6 h-6 text-green-600"/>} color="bg-green-50" />
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Trajectory</h3>
                <div className="h-72 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 100]} />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                            <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent History</h3>
                    <Link href="/dashboard/history" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                    {interviews.slice(0, 5).map((i: any) => (
                        <Link key={i.interview_id} href={`/dashboard/${i.interview_id}`} className="block group">
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">{i.job_role}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(i.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${i.has_scorecard ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {i.has_scorecard ? `${i.score}%` : 'Pending'}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                </div>
                            </div>
                        </Link>
                    ))}
                    {interviews.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No sessions yet.</p>}
                </div>
            </div>
        </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
            </div>
        </div>
    )
}