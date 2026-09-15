"use client";

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomeAbout() {
  const t = useTranslations('HomeAbout');
  return (
    <section className="py-16 md:py-32 w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-t border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-12 h-12 text-slate-400 flex items-center justify-center">
            <Quote className="w-8 h-8" />
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.3] md:leading-snug tracking-tight mb-8"
        >
          {t.rich('title', {
            name: (chunks) => <span className="text-slate-900 underline decoration-slate-200 underline-offset-4">{chunks}</span>
          })}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto"
        >
          {t('description')}
        </motion.p>
      </div>
    </section>
  );
}
