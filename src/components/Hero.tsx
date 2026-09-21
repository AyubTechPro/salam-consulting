"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('Hero');

  // Parent container variant for staggering children
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // Vercel-style subtle fade up variant for individual elements
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden pt-24 bg-[#FAFAFA]">
      {/* Vercel-style clean subtle glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 mix-blend-multiply" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="z-10 flex flex-col items-center w-full"
      >


        <motion.h1 
          variants={item}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight text-center max-w-5xl leading-[1.15] sm:leading-[1.1] md:leading-[1.05] px-2 text-slate-900"
        >
          {/* Apply a premium, deep gradient to the text */}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-700 drop-shadow-sm">
            {t('title')}
          </span>
        </motion.h1>

        <motion.p 
          variants={item}
          className="mt-8 text-lg md:text-xl text-center max-w-2xl text-slate-600 font-medium tracking-wide"
        >
          {t('description')}
        </motion.p>

        <motion.div 
          variants={item}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link 
            href="/contact" 
            className="w-full sm:w-auto group relative flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_rgba(37,99,235,0.35)]"
          >
            {t('primaryBtn')} 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/study-abroad" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
          >
            {t('secondaryBtn')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
