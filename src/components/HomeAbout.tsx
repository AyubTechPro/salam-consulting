"use client";

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomeAbout() {
  const t = useTranslations('HomeAbout');
  return (
    <section className="py-16 md:py-32 w-full bg-white relative overflow-hidden flex items-center justify-center">
      
      {/* Decorative blurred gradients for premium feel */}
      <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-indigo-50/60 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm border border-blue-100/50">
            <Quote className="w-8 h-8" />
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.3] md:leading-snug tracking-tight mb-8"
        >
          {t.rich('title', {
            name: (chunks) => <span className="text-blue-600">{chunks}</span>
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
