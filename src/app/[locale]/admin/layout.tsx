"use client";

import { useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Settings, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale || 'en';
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  const navItems = [
    { name: 'Overview', href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: 'Leads CRM', href: `/${locale}/admin/leads`, icon: Users },
    { name: 'Settings', href: `/${locale}/admin/settings`, icon: Settings },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="p-6 flex items-center gap-3 text-white font-black tracking-widest text-xl border-b border-slate-800">
        <ShieldCheck className="w-8 h-8 text-blue-500" />
        SALAM HQ
      </div>
      
      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          Secure Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 h-screen sticky top-0 shadow-2xl z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="w-72 h-full relative z-50 shadow-2xl"
          >
            <Sidebar />
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800">
              {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                AD
              </div>
              <span className="font-bold text-slate-700 text-sm hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
