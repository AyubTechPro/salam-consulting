"use client";

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link, routing } from '@/i18n/routing';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯' },
];

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  if (pathname.includes('/admin')) {
    return null;
  }

  const currentLang = languages.find(l => l.code === locale) || languages.find(l => l.code === routing.defaultLocale) || languages[0];

  const changeLanguage = (locale: string) => {
    router.replace(pathname, { locale });
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('destinations'), href: '/study-abroad' },
    { name: t('contact'), href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      
      {/* Left: Logo (Large and Original) */}
      <div className="flex items-center w-auto md:w-1/4">
        <Link href="/" className="hover:scale-[1.02] transition-transform">
          <Image 
            src="/logo/salamconsulting-logo-original.svg" 
            alt="Salam Consulting Logo" 
            width={240} 
            height={60}
            priority
            className="h-12 w-auto drop-shadow-sm" 
          />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center justify-center gap-2 w-2/4">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="text-[14px] font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100 transition-all duration-300"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right: Language Switcher & Mobile Menu */}
      <div className="flex items-center justify-end gap-4 sm:gap-6 w-auto md:w-1/4">
        {/* Premium Silicon Valley Language Switcher (Desktop) */}
        <div 
          className="relative hidden sm:block"
          onMouseEnter={() => setIsLangOpen(true)}
          onMouseLeave={() => setIsLangOpen(false)}
        >
          <button 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm"
          >
            <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <span className="text-xl leading-none">{currentLang.flag}</span>
              <span className="uppercase tracking-widest text-xs">{currentLang.code}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-4 w-44 bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                <div className="p-2 flex flex-col gap-1">
                  {languages.map((lang) => (
                    <button 
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)} 
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-slate-50 rounded-lg transition-colors ${currentLang.code === lang.code ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'}`}
                    >
                      <span className="text-2xl leading-none">{lang.flag}</span>
                      <span className="tracking-wider">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900 transition-colors relative w-10 h-10 flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileMenuOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl sm:text-2xl font-bold text-slate-700 hover:text-slate-900 px-4 py-4 hover:bg-slate-50 rounded-2xl transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <span className="text-slate-300 group-hover:text-slate-500 transition-colors group-hover:translate-x-1 duration-300">→</span>
                </Link>
              ))}
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
              
              <div className="flex justify-between px-4 gap-2">
                {languages.map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)} 
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${currentLang.code === lang.code ? 'bg-slate-100 border-slate-300 shadow-inner' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-xs font-bold text-slate-700 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
