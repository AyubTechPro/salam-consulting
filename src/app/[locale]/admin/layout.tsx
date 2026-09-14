"use client";

import { useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Settings, LogOut, Menu, Globe, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-[#FAFAFA] text-zinc-900 border-r border-zinc-200">
      <div className="p-5 flex items-center gap-3 text-zinc-900 font-semibold tracking-tight text-sm border-b border-zinc-200">
        <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        Salam HQ
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="relative group outline-none"
            >
              <div className={`relative flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm font-medium z-10 ${
                isActive ? 'bg-zinc-100/80 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50'
              }`}>
                <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'}`} strokeWidth={isActive ? 2 : 1.5} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-zinc-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-sm font-medium text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 outline-none"
        >
          <LogOut className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
          {t('logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-zinc-200 text-zinc-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen sticky top-0 z-20">
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 h-full relative z-50 shadow-2xl"
            >
              <Sidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header - Vercel Style */}
        <header className="bg-white h-14 border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-md transition-colors"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-zinc-900">
                {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <CommandPalette />
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-zinc-100/50 p-0.5 rounded-md border border-zinc-200">
              <button 
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-sm transition-all ${locale === 'en' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                EN
              </button>
              <button 
                onClick={() => switchLanguage('tg')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-sm transition-all ${locale === 'tg' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                TG
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 text-white flex items-center justify-center font-semibold text-[10px] shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
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
