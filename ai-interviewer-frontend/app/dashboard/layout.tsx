"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  LogOut, 
  Settings, 
  ChevronRight 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
    { name: "My Profile", icon: <FileText className="w-5 h-5" />, href: "/dashboard/profile" }, // Note: We will move profile here
    { name: "New Practice", icon: <Plus className="w-5 h-5" />, href: "/candidate/setup" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20 shadow-sm">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-8 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">AI</div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Interviewer<span className="text-blue-600">.io</span></span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4 mt-4">Main Menu</div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-200">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/"/>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">My Account</span>
                <span className="text-xs text-gray-500">Free Plan</span>
              </div>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-72">
        {/* Top Header (Mobile support/Breadcrumbs could go here) */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
           <div className="text-sm text-gray-500 flex items-center">
             <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
             <ChevronRight className="w-4 h-4 mx-2" />
             <span className="font-medium text-gray-900 capitalize">
               {pathname.split("/").pop() || "Overview"}
             </span>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}