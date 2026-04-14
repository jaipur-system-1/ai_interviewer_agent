"use client";
import { Mic, ShieldCheck, LineChart, Code2, Cpu, Terminal } from "lucide-react";

export default function Features() {
  const features = [
    { icon: <Mic className="w-6 h-6 text-white"/>, bg: "bg-blue-600", title: "Zero Latency Voice AI", desc: "Feels like a human. Interrupts when you ramble." },
    { icon: <ShieldCheck className="w-6 h-6 text-white"/>, bg: "bg-purple-600", title: "Anti-Cheat Engine", desc: "Tracks tab switching and copy-paste events." },
    { icon: <LineChart className="w-6 h-6 text-white"/>, bg: "bg-green-600", title: "100-Point Scorecards", desc: "Granular scores on Algorithms & System Design." },
    { icon: <Code2 className="w-6 h-6 text-white"/>, bg: "bg-orange-600", title: "Custom Scenarios", desc: "Recruiters can upload proprietary questions." },
    { icon: <Cpu className="w-6 h-6 text-white"/>, bg: "bg-red-600", title: "System Design Board", desc: "Collaborative whiteboard for architecture." },
    { icon: <Terminal className="w-6 h-6 text-white"/>, bg: "bg-gray-800", title: "Live Code Execution", desc: "Run code in 40+ languages securely." },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Enterprise-Grade Features</h2>
          <p className="text-gray-500 mt-4">Everything you need to conduct world-class technical rounds.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className={`${f.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition duration-300`}>{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}