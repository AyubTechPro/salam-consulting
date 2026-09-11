"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const destinationsData = [
  { 
    id: 'korea', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Gyeongbokgung_Palace_in_Seoul.jpg/1280px-Gyeongbokgung_Palace_in_Seoul.jpg',
    desc: 'Experience world-class education amidst a vibrant mix of ancient tradition and futuristic technology.'
  },
  { 
    id: 'turkiye', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/1280px-Hagia_Sophia_Mars_2013.jpg',
    desc: 'Study at the crossroads of Europe and Asia, where history and modern academia meet.'
  },
  { 
    id: 'malaysia', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Petronas_Towers_in_Kuala_Lumpur.jpg/1280px-Petronas_Towers_in_Kuala_Lumpur.jpg',
    desc: 'A tropical hub for international students offering affordable, high-quality global degrees.'
  },
  { 
    id: 'china', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/1280px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
    desc: 'Immerse yourself in a rapidly growing academic powerhouse with vast scholarship opportunities.'
  },
  { 
    id: 'azerbaijan', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Baku_Flame_Towers.jpg/1280px-Baku_Flame_Towers.jpg',
    desc: 'Discover modern campuses in the Land of Fire, bridging Eastern and Western cultures.'
  },
  { 
    id: 'uzbekistan', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Registan_Square.jpg/1280px-Registan_Square.jpg',
    desc: 'Study in the historic heart of the Silk Road with rapidly expanding international partnerships.'
  },
];

export default function Destinations() {
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
          className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide max-w-2xl"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
        {destinationsData.map((dest, index) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`relative rounded-3xl overflow-hidden group cursor-default shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${dest.image})` }}
            />
            
            {/* Dark Overlay that deepens on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {t(dest.id)}
              </h3>
              
              <div className="overflow-hidden">
                <p className="text-white/90 text-lg font-medium leading-relaxed transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {dest.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
