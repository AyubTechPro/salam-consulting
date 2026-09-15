"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, CheckCircle, FileText, Award, Plane } from 'lucide-react';

const servicesData = [
  { id: 'consultation', icon: BookOpen, size: 'col-span-1 md:col-span-2 lg:col-span-2' },
  { id: 'selection', icon: MapPin, size: 'col-span-1 md:col-span-1 lg:col-span-1' },
  { id: 'admission', icon: CheckCircle, size: 'col-span-1 md:col-span-1 lg:col-span-1' },
  { id: 'documentation', icon: FileText, size: 'col-span-1 md:col-span-1 lg:col-span-1' },
  { id: 'scholarship', icon: Award, size: 'col-span-1 md:col-span-1 lg:col-span-2' },
  { id: 'visa', icon: FileText, size: 'col-span-1 md:col-span-1 lg:col-span-1' },
  { id: 'predeparture', icon: Plane, size: 'col-span-1 md:col-span-1 lg:col-span-4' },
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
              className={`${service.size} group relative bg-white border border-slate-200 overflow-hidden flex flex-col justify-between p-6 md:p-10 transition-all duration-300 hover:shadow-md hover:border-slate-300 min-h-[280px] lg:min-h-[320px] rounded-2xl`}
            >
              {/* Icon & Number */}
              <div className="relative z-10 flex justify-between items-start mb-12">
                <div className={`w-12 h-12 flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors duration-300 tracking-tighter select-none">
                  0{index + 1}
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 mt-auto">
                <h3 className={`font-bold text-slate-900 tracking-tight mb-3 ${isLarge ? 'text-3xl' : 'text-2xl'}`}>
                  {t(`items.${service.id}.title`).replace(/^\d+\.\s*/, '')}
                </h3>
                <p className={`text-slate-500 font-medium leading-relaxed ${isLarge ? 'text-lg max-w-md' : 'text-base'}`}>
                  {t(`items.${service.id}.description`)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
