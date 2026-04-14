"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Dynamic Background Blob */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-[100px] -z-10 opacity-60" 
      />

      <div className="max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-8 border border-blue-100"
        >
          <span className="flex w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
          Live System: 1,240+ Interviews Conducted
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-tight"
        >
          Stop Guessing. <br className="hidden md:block"/>
          Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Mastering Interviews.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          A safe space to fail, learn, and rebuild confidence with AI. 
          <span className="hidden md:inline"> Automated screening that filters the noise for recruiters.</span>
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-xl shadow-blue-200 hover:scale-105 transform duration-200">
                Start Practice Free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-xl shadow-blue-200 hover:scale-105 transform duration-200">
              Go to Dashboard
            </Link>
          </SignedIn>

          <button className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition flex items-center justify-center group">
            <Play className="mr-2 w-5 h-5 group-hover:fill-current transition" /> Watch Demo
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 pt-8 border-t border-gray-100"
        >
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Built to land offers at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition duration-500">
             {["GOOGLE", "AMAZON", "META", "NETFLIX", "UBER"].map(logo => (
               <span key={logo} className="text-2xl font-black text-gray-800 cursor-default">{logo}</span>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}