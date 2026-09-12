"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const partnerImages = [
  "IMG_20260726_141839_731 (1).jpg",
  "IMG_5841.jpg",
  "IMG_5847.jpg",
  "IMG_6624.JPG",
  "IMG_6634.PNG.jpg",
  "IMG_67221.JPG",
  "IMG_67931.JPG",
  "IMG_68341.JPG",
  "IMG_69801.JPG"
];

// Duplicate the array to create a seamless infinite loop
const infinitePartners = [...partnerImages, ...partnerImages, ...partnerImages];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-24 w-full overflow-hidden bg-white relative border-t border-slate-200">
      {/* Gradients on edges for smooth fading effect */}
      <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Event Gallery Marquee */}
      <div className="flex w-max">
        <motion.div
          animate={{ x: ["-33.33%", "0%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40,
          }}
          className="flex gap-8 px-4"
        >
          {infinitePartners.map((src, index) => (
            <div
              key={`gallery-${src}-${index}`}
              onClick={() => setSelectedImage(src)}
              className="relative w-[300px] md:w-[450px] h-[250px] md:h-[320px] flex-shrink-0 rounded-3xl overflow-hidden group cursor-pointer border border-slate-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-[0_15px_40px_rgba(37,99,235,0.15)]"
            >
              <Image 
                src={`/partners/${src}`} 
                alt="Salam Consulting Event" 
                fill 
                sizes="(max-width: 768px) 300px, 450px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">View</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button 
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-blue-400 transition-colors bg-white/10 rounded-full p-4 backdrop-blur-md active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking image
            >
              <Image
                src={`/partners/${selectedImage}`}
                alt="Salam Consulting Event Enlarged"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
