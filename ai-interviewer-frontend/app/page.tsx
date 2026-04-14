"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, Play, Mic, ShieldCheck, Code2, Users, Clock, Globe } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-[100px] -z-10 opacity-60"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-8 border border-blue-100 shadow-sm"
          >
            <span className="flex w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
            v2.0 Live: System Design & Behavioral Rounds
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]"
          >
            Stop Guessing. <br className="hidden md:block"/>
            Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Mastering Interviews.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            A safe space to fail, learn, and rebuild confidence with AI. <br className="hidden md:block"/>
            Automated technical screening that filters the noise for recruiters.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center hover:scale-105 transform duration-200">
                      Start Practice Free <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center hover:scale-105 transform duration-200">
                    Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </SignedIn>

            <Link href="/features" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition flex items-center justify-center shadow-sm hover:shadow-md group">
               Explore Features <Play className="ml-2 w-4 h-4 fill-current text-gray-400 group-hover:text-gray-600 transition" />
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Built to land offers at</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition duration-700">
               {["GOOGLE", "AMAZON", "META", "NETFLIX", "UBER"].map(logo => (
                 <span key={logo} className="text-2xl font-black text-gray-800 cursor-default">{logo}</span>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Enterprise-Grade Architecture</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              We combine state-of-the-art LLMs with rigorous testing standards to create an evaluation that is fair, consistent, and deeply technical.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <FeatureHighlight 
                icon={<Mic className="text-blue-600 w-6 h-6" />}
                title="Voice-First AI"
                desc="Interrupts naturally. Probes deeper. Feels like a real Senior Engineer."
             />
             <FeatureHighlight 
                icon={<ShieldCheck className="text-purple-600 w-6 h-6" />}
                title="Anti-Cheat Engine"
                desc="Tracks tab switching, copy-pasting, and multiple voice detection."
             />
             <FeatureHighlight 
                icon={<Code2 className="text-green-600 w-6 h-6" />}
                title="Live Code Execution"
                desc="Sandboxed environment for Python, Java, C++, and 40+ other languages."
             />
          </div>

          <div className="mt-12 text-center">
             <Link href="/features" className="text-blue-600 font-bold hover:underline inline-flex items-center">
                View all capabilities <ArrowRight className="ml-1 w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

      {/* --- RECRUITER TEASER --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">For Hiring Teams</span>
                <h2 className="text-4xl font-black text-gray-900 mt-2 mb-6">Cut Screening Time by 90%</h2>
                <div className="space-y-6">
                    <Benefit icon={<Users />} text="Eliminate the resume black hole." />
                    <Benefit icon={<Clock />} text="Save senior engineers 20+ hours per week." />
                    <Benefit icon={<Globe />} text="Hire purely on skill, removing unconscious bias." />
                </div>
                <div className="mt-10">
                    <Link href="/pricing" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition shadow-lg inline-flex items-center">
                        View Pricing <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
            <div className="relative">
                 {/* Abstract UI Mockup */}
                 <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-2xl transform rotate-1 hover:rotate-0 transition duration-500">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">98</div>
                        <div>
                            <h4 className="font-bold text-gray-900">Candidate Match</h4>
                            <p className="text-sm text-gray-500">System Design Expert</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Strong Hire</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Top 5%</span>
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* --- FOUNDER TEASER --- */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-3xl font-bold mb-6">"I built this because I was tired of rejection based on nervousness, not skill."</h2>
           <Link href="/about" className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4">
              Read the Founder's Story
           </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- HELPER COMPONENTS ---

function FeatureHighlight({ icon, title, desc }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="mb-4 bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm">{desc}</p>
        </div>
    )
}

function Benefit({ icon, text }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">{icon}</div>
            <p className="text-gray-700 font-medium">{text}</p>
        </div>
    )
}