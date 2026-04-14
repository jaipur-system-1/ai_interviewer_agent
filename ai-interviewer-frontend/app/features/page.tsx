"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Mic, ShieldCheck, Code2, Zap, Layout, Globe } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-gray-900 mb-6">A Complete Interview Ecosystem.</h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          We don't just ask questions. We simulate the entire technical hiring lifecycle—from system design whiteboarding to runtime complexity analysis.
        </p>
      </section>

      {/* Bento Grid Features */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-8">
            
            {/* Feature 1: Large Box */}
            <div className="md:col-span-2 row-span-2 bg-gray-50 rounded-3xl p-10 border border-gray-100 flex flex-col justify-between overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6"><Mic /></div>
                    <h3 className="text-3xl font-bold mb-4">Zero-Latency Voice AI</h3>
                    <p className="text-gray-500 max-w-md">Our specialized LLM pipeline processes audio in under 200ms. It feels like a real conversation, interrupting naturally when you ramble and probing deeper when you're vague.</p>
                </div>
                {/* Abstract Visual representation */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent translate-x-10 translate-y-10 rounded-tl-3xl"></div>
            </div>

            {/* Feature 2: Small Box */}
            <div className="bg-gray-900 text-white rounded-3xl p-8 border border-gray-800 relative overflow-hidden group">
                <div className="relative z-10">
                     <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mb-4"><ShieldCheck /></div>
                    <h3 className="text-xl font-bold mb-2">Anti-Cheat Proctoring</h3>
                    <p className="text-gray-400 text-sm">Tracks tab switching, clipboard events, and multiple voices.</p>
                </div>
            </div>

            {/* Feature 3: Small Box */}
            <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center text-blue-700 mb-4"><Code2 /></div>
                <h3 className="text-xl font-bold mb-2">Multi-Language Support</h3>
                <p className="text-gray-500 text-sm">Python, Java, C++, Go, and Rust with real-time compilation.</p>
            </div>

             {/* Feature 4: Wide Box */}
             <div className="md:col-span-3 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6"><Zap /></div>
                    <h3 className="text-2xl font-bold mb-4">Granular Performance Analytics</h3>
                    <p className="text-gray-500">We don't just say "Pass". We break down performance into 12 vectors including Code Cleanliness, Edge Case Handling, and System Scalability.</p>
                </div>
                <div className="flex-1 h-64 w-full bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 font-mono text-sm">
                    [Chart Visualization Component]
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}