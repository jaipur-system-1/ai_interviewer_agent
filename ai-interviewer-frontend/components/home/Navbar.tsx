"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path ? "text-blue-600 font-semibold bg-blue-50/50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${scrolled || pathname !== '/' ? "bg-white/90 backdrop-blur-md shadow-sm border-gray-100 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">AI</div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Interviewer<span className="text-blue-600">.io</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1 p-1 bg-white/50 backdrop-blur-sm rounded-full border border-gray-100/50 shadow-sm">
          <NavLink href="/features" label="Features" isActive={isActive('/features')} />
          <NavLink href="/pricing" label="Pricing" isActive={isActive('/pricing')} />
          <NavLink href="/about" label="About" isActive={isActive('/about')} />
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard" className="flex items-center px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition px-4">Log In</Link>
            <SignInButton mode="modal">
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-full hover:bg-black transition shadow-lg">Get Started</button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-600 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden absolute w-full"
          >
            <div className="flex flex-col p-6 space-y-4 font-medium text-gray-600">
              <Link href="/features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, label, isActive }: any) {
    return (
        <Link href={href} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive}`}>
            {label}
        </Link>
    )
}