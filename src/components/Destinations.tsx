"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fallbackDestinations = [
  { id: 'korea', image: '/destinations/korea-v2.jpg' },
  { id: 'turkiye', image: '/destinations/turkiye-v2.jpg' },
  { id: 'malaysia', image: '/destinations/malaysia-v2.jpg' },
  { id: 'china', image: '/destinations/china-v2.jpg' },
  { id: 'azerbaijan', image: '/destinations/azerbaijan-v2.jpg' },
  { id: 'uzbekistan', image: '/destinations/uzbekistan-v2.jpg' },
];

type DynamicDestination = {
  id: string;
  name: string;
  description: string;
  image_url: string;
};

export default function Destinations({ destinations = [] }: { destinations?: DynamicDestination[] }) {
  const t = useTranslations('Destinations');

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto bg-white w-full" id="destinations">
      
      <div className="max-w-4xl mb-16">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 drop-shadow-sm leading-tight"
        >
          {t('title')}
        </motion.h2>
        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide max-w-2xl"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px] sm:auto-rows-[400px]">
        {destinations.length > 0 ? (
          destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`relative rounded-3xl overflow-hidden group cursor-default shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
          >
              {/* Background Image */}
              <Image 
                src={dest.image_url || '/destinations/placeholder.jpg'}
                alt={dest.name}
                fill
                priority={index < 3}
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Dark Overlay that deepens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 sm:opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3 transform translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-500">
                  {dest.name}
                </h3>
                
                <div className="overflow-hidden">
                  <p className="text-white/90 text-sm sm:text-lg font-medium leading-relaxed transform translate-y-0 opacity-100 sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-500 sm:delay-100">
                    {dest.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          fallbackDestinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl overflow-hidden group cursor-default shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
            >
              {/* Background Image */}
              <Image 
                src={dest.image}
                alt={t(dest.id)}
                fill
                priority={index < 3}
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Dark Overlay that deepens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 sm:opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3 transform translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-500">
                  {t(dest.id)}
                </h3>
                
                <div className="overflow-hidden">
                  <p className="text-white/90 text-sm sm:text-lg font-medium leading-relaxed transform translate-y-0 opacity-100 sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-500 sm:delay-100">
                    {t(`${dest.id}Desc`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
