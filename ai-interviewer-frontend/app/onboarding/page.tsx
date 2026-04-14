"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("token");

  const [role, setRole] = useState<"user" | "org_admin" | "recruiter" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin Form State
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // 1. AUTO-DETECT ROLE BASED ON TOKEN
  useEffect(() => {
    if (inviteToken) {
      setRole("recruiter"); // Forced role for invitees
    }
  }, [inviteToken]);

  const handleSubmit = async () => {
    if (!user || !role) return;
    setLoading(true);
    setError("");

    try {
      const payload = {
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        full_name: user.fullName,
        role: role,
        // Admin fields
        company_name: role === "org_admin" ? companyName : "",
        company_website: role === "org_admin" ? companyWebsite : "",
        // Employee fields
        invite_token: role === "recruiter" ? inviteToken : null,
      };

      const res = await fetch("http://localhost:8000/api/auth/sync_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to create account");
      }

      // Redirect Logic
      if (role === "user") {
        router.push("/dashboard"); // Student Dashboard
      } else {
        router.push("/recruiter"); // Admin/Recruiter Dashboard
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // SCENARIO A: INVITED EMPLOYEE (Has Token)
  // ----------------------------------------------------
  if (inviteToken) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-purple-500/30 rounded-xl p-8 shadow-2xl text-center">
          <div className="text-4xl mb-4">📩</div>
          <h1 className="text-2xl font-bold mb-2">You've been invited!</h1>
          <p className="text-gray-400 mb-6">
            You are joining your organization's hiring team.
          </p>
          
          <div className="bg-gray-800 p-4 rounded-lg mb-6 text-left">
            <div className="text-xs text-gray-500 uppercase font-bold">Your Account</div>
            <div className="font-medium">{user?.fullName}</div>
            <div className="text-sm text-gray-400">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>

          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all"
          >
            {loading ? "Joining Team..." : "Accept & Join Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCENARIO B: REGULAR SIGNUP (Student or New Company)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome! 👋</h1>
        <p className="text-gray-400 text-center mb-8">
          How do you plan to use AI Interviewer?
        </p>

        {/* ROLE SELECTION */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setRole("user")}
            className={`p-4 rounded-lg border text-center transition-all ${
              role === "user"
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-gray-700 hover:border-gray-500 text-gray-400"
            }`}
          >
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold">Student</div>
            <div className="text-xs mt-1 opacity-70">I want to practice interviews</div>
          </button>

          <button
            onClick={() => setRole("org_admin")}
            className={`p-4 rounded-lg border text-center transition-all ${
              role === "org_admin"
                ? "border-purple-500 bg-purple-500/10 text-purple-400"
                : "border-gray-700 hover:border-gray-500 text-gray-400"
            }`}
          >
            <div className="text-2xl mb-2">🏢</div>
            <div className="font-semibold">Employer</div>
            <div className="text-xs mt-1 opacity-70">I want to create a Company</div>
          </button>
        </div>

        {/* ADMIN FORM */}
        {role === "org_admin" && (
          <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded text-sm text-purple-200">
              You are creating a new Organization. You will be the <strong>Super Admin</strong>.
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Name</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Website</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. acme.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

        <button
          onClick={handleSubmit}
          disabled={!role || loading || (role === "org_admin" && !companyName)}
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            !role || (role === "org_admin" && !companyName)
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : role === "org_admin"
              ? "bg-purple-600 hover:bg-purple-500 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {loading ? "Setting up..." : "Get Started →"}
        </button>
      </div>
    </div>
  );
}