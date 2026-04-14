"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { Upload, FileText, Calendar, CheckCircle, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/api/candidates/me/${user?.id}`, {
         headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setProfile(await res.json());
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchProfile(); }, [user]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);
      await fetch(`http://localhost:8000/api/candidates/resume-upload/${user?.id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      fetchProfile();
    } catch (e) { alert("Upload error"); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">Candidate Profile</h1>
           <p className="text-gray-500">Manage your resume and AI personalization settings.</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Master Resume</h3>
              <p className="text-sm text-gray-500">Used to generate tailored interview questions.</p>
            </div>
          </div>
          {profile?.resume?.has_resume && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" /> Active
            </span>
          )}
        </div>

        <div className="p-8">
          {profile?.resume?.has_resume ? (
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                   <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{profile.resume.filename || "Uploaded_Resume.pdf"}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Uploaded {profile.resume.uploaded_at ? new Date(profile.resume.uploaded_at).toLocaleDateString() : "Recently"}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm flex items-center">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <RefreshCw className="w-4 h-4 mr-2 text-gray-500" />}
                  Replace File
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition relative">
              <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-gray-900 font-medium">Upload your Resume</h3>
              <p className="text-gray-500 text-sm mt-1">PDF files up to 10MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}