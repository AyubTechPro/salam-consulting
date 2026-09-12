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
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden pt-24 bg-white">
      {/* Vercel-style subtle grid background for Light Mode */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
      
      {/* Minimalist Blue glow exactly at the top center */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] md:w-[600px] md:h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" 
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="z-10 flex flex-col items-center w-full"
      >


        <motion.h1 
          variants={item}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-center max-w-5xl leading-[1.1] sm:leading-[1.05] px-2"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 drop-shadow-sm">
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
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link 
            href="/contact" 
            className="w-full sm:w-auto group relative flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-blue-700 transition-all shadow-[0_0_0_1px_rgba(37,99,235,1)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-95"
          >
            {t('primaryBtn')} 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/study-abroad" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            {t('secondaryBtn')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
