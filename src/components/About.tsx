"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Target, Eye, Globe, ShieldCheck, Zap, Users } from 'lucide-react';

export default function About() {
  const t = useTranslations('About');

  // Vercel-style subtle fade up variant
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="max-w-4xl mb-24">
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 drop-shadow-sm"
        >
          {t('title')}
        </motion.h1>
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-slate-500 font-normal tracking-tight max-w-2xl"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        
        {/* Mission Card (Spans 1 col) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="md:col-span-1 p-6 md:p-10 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{t('missionTitle')}</h2>
          <p className="text-slate-600 leading-relaxed font-medium">{t('missionDesc')}</p>
        </motion.div>

        {/* Vision Card (Spans 1 col) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 p-6 md:p-10 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{t('visionTitle')}</h2>
          <p className="text-slate-600 leading-relaxed font-medium">{t('visionDesc')}</p>
        </motion.div>

        {/* Origin Story (Spans 1 col horizontally, maybe we can make it a tall card, or span 2 cols depending on layout. Let's make it span the 3rd col, but taller) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 md:row-span-2 p-6 md:p-10 rounded-3xl border border-slate-200 bg-slate-900 text-white relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.3),transparent_50%)]" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md group-hover:rotate-12 transition-transform shadow-sm">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black mb-6 tracking-tight">{t('storyTitle')}</h2>
            <p className="text-lg text-slate-300 leading-relaxed font-normal">
              {t('storyDesc')}
            </p>
          </div>
        </motion.div>

        {/* B2B Value Proposition (Spans 2 cols to fill the space left by the tall Origin Story) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 p-6 md:p-10 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col justify-center"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shadow-sm"><ShieldCheck className="w-5 h-5 text-blue-600" /></div>
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shadow-sm"><Zap className="w-5 h-5 text-blue-600" /></div>
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shadow-sm"><Users className="w-5 h-5 text-blue-600" /></div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('whyUsTitle')}</h2>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-3xl">
            {t('whyUsDesc')}
          </p>
        </motion.div>
      </div>

    </div>
  );
}
