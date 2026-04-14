"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
      <aside className="w-64 border-r border-gray-800 flex flex-col bg-gray-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg">
              {user?.firstName?.[0] || "C"}
            </div>
            <div>
              <h2 className="font-bold truncate text-sm">Hiring Portal</h2>
              <p className="text-xs text-gray-500">Admin Console</p>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 mt-4">Menu</p>
          <Link href="/recruiter" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${pathname === "/recruiter" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}`}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/recruiter/team" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${pathname.includes("/team") ? "bg-purple-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}`}>
            <span>👥</span> Team
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-900/80">
          <div className="flex items-center gap-3 px-2">
            <UserButton afterSignOutUrl="/" />
            <div className="text-xs text-gray-400">My Account</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}