"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

const logoImages = [
  "IMG_20260731_183409_681.PNG",
  "KNU-VerticalSignature (1).gif",
  "file_00000000ed64824386de0a706beb1296.png",
  "IMG_7086.JPG"
];

// Duplicate the array to create a seamless infinite loop
const infiniteFallbackLogos = [...logoImages, ...logoImages, ...logoImages, ...logoImages, ...logoImages];

type DynamicPartner = {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
};

export default function PartnerLogos({ partners = [] }: { partners?: DynamicPartner[] }) {
  const t = useTranslations('Partners');

  // Ensure enough items for a smooth infinite scroll by duplicating the array
  const displayPartners = partners.length > 0 
    ? [...partners, ...partners, ...partners, ...partners, ...partners] 
    : [];

  return (
    <section className="py-12 md:py-20 w-full overflow-hidden bg-white relative border-t border-b border-slate-200" id="partners">
      {/* Gradients on edges for smooth fading effect */}
      <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="text-center max-w-4xl mx-auto mb-12 px-4 relative z-20">
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-16">
        {/* Logos Marquee */}
        <div className="flex w-max">
          <motion.div
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
            className="flex items-center gap-12 px-4"
          >
            {partners.length > 0 ? (
              displayPartners.map((partner, index) => (
                <div
                  key={`partner-${partner.id}-${index}`}
                  className="relative w-48 h-24 md:w-64 md:h-32 flex-shrink-0 bg-white rounded-3xl flex items-center justify-center p-6 border border-slate-100 hover:border-blue-100 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.12)] hover:-translate-y-2 group"
                >
                  <Image 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    fill 
                    sizes="(max-width: 768px) 192px, 256px"
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))
            ) : (
              infiniteFallbackLogos.map((src, index) => (
                <div
                  key={`logo-${src}-${index}`}
                  className="relative w-48 h-24 md:w-64 md:h-32 flex-shrink-0 bg-white rounded-3xl flex items-center justify-center p-6 border border-slate-100 hover:border-blue-100 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.12)] hover:-translate-y-2 group"
                >
                  <Image 
                    src={`/logo parners/${src}`} 
                    alt="Partner Logo" 
                    fill 
                    sizes="(max-width: 768px) 192px, 256px"
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
