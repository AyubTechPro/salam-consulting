"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, CheckCircle, FileText, Award, Plane } from 'lucide-react';

const servicesData = [
  { id: 'consultation', icon: BookOpen, size: 'col-span-1 md:col-span-2 lg:col-span-2', gradient: 'from-blue-500/5 via-blue-500/10 to-transparent', hoverBorder: 'group-hover:border-blue-200', iconColor: 'text-blue-500', bgGlow: 'group-hover:bg-blue-500/5' },
  { id: 'selection', icon: MapPin, size: 'col-span-1 md:col-span-1 lg:col-span-1', gradient: 'from-purple-500/5 via-purple-500/10 to-transparent', hoverBorder: 'group-hover:border-purple-200', iconColor: 'text-purple-500', bgGlow: 'group-hover:bg-purple-500/5' },
  { id: 'admission', icon: CheckCircle, size: 'col-span-1 md:col-span-1 lg:col-span-1', gradient: 'from-green-500/5 via-green-500/10 to-transparent', hoverBorder: 'group-hover:border-green-200', iconColor: 'text-green-500', bgGlow: 'group-hover:bg-green-500/5' },
  { id: 'documentation', icon: FileText, size: 'col-span-1 md:col-span-1 lg:col-span-1', gradient: 'from-amber-500/5 via-amber-500/10 to-transparent', hoverBorder: 'group-hover:border-amber-200', iconColor: 'text-amber-500', bgGlow: 'group-hover:bg-amber-500/5' },
  { id: 'scholarship', icon: Award, size: 'col-span-1 md:col-span-1 lg:col-span-2', gradient: 'from-rose-500/5 via-rose-500/10 to-transparent', hoverBorder: 'group-hover:border-rose-200', iconColor: 'text-rose-500', bgGlow: 'group-hover:bg-rose-500/5' },
  { id: 'visa', icon: FileText, size: 'col-span-1 md:col-span-1 lg:col-span-1', gradient: 'from-indigo-500/5 via-indigo-500/10 to-transparent', hoverBorder: 'group-hover:border-indigo-200', iconColor: 'text-indigo-500', bgGlow: 'group-hover:bg-indigo-500/5' },
  { id: 'predeparture', icon: Plane, size: 'col-span-1 md:col-span-1 lg:col-span-4', gradient: 'from-sky-500/5 via-sky-500/10 to-transparent', hoverBorder: 'group-hover:border-sky-200', iconColor: 'text-sky-500', bgGlow: 'group-hover:bg-sky-500/5' },
];

export default function Services() {
  const t = useTranslations('Services');

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section className="py-16 md:py-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto bg-white w-full" id="services">
      
      <div className="max-w-3xl mb-24 mx-auto text-center">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 drop-shadow-sm"
        >
          {t('title')}
        </motion.h2>
        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {servicesData.map((service, index) => {
          const Icon = service.icon;
          const isLarge = service.size.includes('col-span-2') || service.size.includes('col-span-4');
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" as const }}
              className={`${service.size} group relative bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col justify-between p-6 md:p-10 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 ${service.hoverBorder} min-h-[280px] lg:min-h-[320px]`}
            >
              {/* Animated Background Glow on Hover */}
              <div className={`absolute inset-0 transition-colors duration-500 ease-out ${service.bgGlow}`} />
              
              {/* Corner Radial Gradient */}
              <div className={`absolute top-0 right-0 w-[150%] h-[150%] -translate-y-1/2 translate-x-1/4 bg-gradient-to-bl ${service.gradient} opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full blur-3xl pointer-events-none`} />

              {/* Icon & Number */}
              <div className="relative z-10 flex justify-between items-start mb-12">
                <div className={`w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 ${service.iconColor} relative overflow-hidden`}>
                  {/* Small internal glow inside icon box */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${service.iconColor.replace('text-', 'bg-')}`} />
                  <Icon className="w-8 h-8 relative z-10" />
                </div>
                <div className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors duration-500 tracking-tighter select-none">
                  0{index + 1}
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 mt-auto">
                <h3 className={`font-black text-slate-900 tracking-tight mb-4 ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                  {t(`items.${service.id}.title`).replace(/^\d+\.\s*/, '')}
                </h3>
                <p className={`text-slate-500 font-medium leading-relaxed ${isLarge ? 'text-lg max-w-md' : 'text-base'}`}>
                  {t(`items.${service.id}.description`)}
                </p>
              </div>

              {/* Massive background watermark icon */}
              <div className="absolute -bottom-10 -right-10 text-slate-50 opacity-10 md:opacity-0 group-hover:opacity-50 transition-opacity duration-700 group-hover:scale-110 transform-gpu pointer-events-none">
                <Icon strokeWidth={0.5} className={isLarge ? "w-96 h-96" : "w-64 h-64"} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
