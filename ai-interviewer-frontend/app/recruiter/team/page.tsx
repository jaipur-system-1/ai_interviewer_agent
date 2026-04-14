"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function TeamPage() {
  const { user } = useUser();
  const [orgData, setOrgData] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    async function fetchTeam() {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:8000/api/org/members/${user.id}`);
            if (res.ok) setOrgData(await res.json());
        } catch (e) { console.error(e); }
    }
    fetchTeam();
  }, [user]);

  const handleInvite = async () => {
    if (!user) return;
    setIsInviting(true);
    try {
        const res = await fetch("http://localhost:8000/api/org/invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: inviteEmail, admin_clerk_id: user.id })
        });
        const data = await res.json();
        if (res.ok) {
            setInviteLink(data.invite_link);
        } else {
            alert(data.detail);
        }
    } catch (e) { console.error(e); } finally {
        setIsInviting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Team Management</h1>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <h3 className="font-semibold mb-4 text-white">Invite New Member</h3>
        <div className="flex gap-4">
            <input 
                className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 focus:border-purple-500 outline-none"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
            />
            <button 
                onClick={handleInvite}
                disabled={isInviting || !inviteEmail}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-lg font-bold disabled:opacity-50"
            >
                {isInviting ? "Sending..." : "Send Invite"}
            </button>
        </div>
        
        {inviteLink && (
             <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm font-medium mb-2">✅ Invitation Link Generated:</p>
                <code className="block bg-black p-2 rounded text-xs text-gray-400 font-mono break-all">{inviteLink}</code>
             </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-800/50 text-gray-400 uppercase font-medium text-xs">
                <tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
                {orgData?.members?.map((m: any) => (
                    <tr key={m.email}>
                        <td className="px-6 py-4 font-medium text-white">{m.email}</td>
                        <td className="px-6 py-4 capitalize">{m.role}</td>
                        <td className="px-6 py-4 text-green-400">Active</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}