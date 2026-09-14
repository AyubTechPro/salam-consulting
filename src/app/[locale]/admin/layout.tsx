"use client";

import { useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Settings, LogOut, Menu, Globe, ShieldCheck, FileText } from 'lucide-react';
import Link from 'next/link';
import { CommandPalette } from '@/components/admin/CommandPalette';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale || 'en';
  const t = useTranslations('Admin.sidebar');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  const navItems = [
    { name: t('dashboard'), href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: t('leads'), href: `/${locale}/admin/leads`, icon: Users },
    { name: t('content') || 'Content', href: `/${locale}/admin/content`, icon: FileText },
    { name: t('settings'), href: `/${locale}/admin/settings`, icon: Settings },
  ];

  const switchLanguage = (newLocale: string) => {
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${currentPathWithoutLocale}`);
    router.refresh();
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-slate-300 border-r border-white/5">
      <div className="p-6 flex items-center gap-3 text-white font-black tracking-widest text-xl border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        SALAM <span className="text-blue-500">HQ</span>
      </div>
      
      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="relative group"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium z-10 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}>
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          {t('logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans selection:bg-blue-200">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 h-screen sticky top-0 shadow-2xl z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 h-full relative z-50 shadow-2xl"
            >
              <Sidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md h-16 border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight hidden sm:block">
              {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <CommandPalette />
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-full border border-slate-200/50">
              <button 
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${locale === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                EN
              </button>
              <button 
                onClick={() => switchLanguage('tg')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${locale === 'tg' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                TG
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
