"use client";

import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/routing';
import { Home, Map, Phone } from 'lucide-react';

export default function MobileNav() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();

  // Don't show on admin routes
  if (pathname.includes('/admin')) {
    return null;
  }

  const navLinks = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('destinations'), href: '/study-abroad', icon: Map },
    { name: t('contact'), href: '/contact', icon: Phone },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex flex-col items-center gap-1 min-w-[72px] p-2 rounded-xl transition-all active:scale-95 ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[11px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
