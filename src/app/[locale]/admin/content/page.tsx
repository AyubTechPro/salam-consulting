"use client";

import { useState } from 'react';
import { Plus, Map, Building2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ContentCMSPage() {
  const t = useTranslations('Admin.content');
  const [activeTab, setActiveTab] = useState<'destinations' | 'partners'>('destinations');
  
  return (
    <div className="space-y-6 relative">
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{t('title')}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="flex items-center gap-6 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'destinations' ? 'border-black text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          <Map className="w-4 h-4" /> {t('destinations')}
        </button>
        <button 
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'partners' ? 'border-black text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          <Building2 className="w-4 h-4" /> {t('partners')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'destinations' ? <DestinationsCMS t={t} /> : <PartnersCMS t={t} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DestinationsCMS({ t }: { t: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-zinc-800 transition-colors text-sm focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1"
        >
          <Plus className="w-4 h-4" /> {t('addDestination')}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3 border border-zinc-200 shadow-sm">
          <Map className="w-5 h-5 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">{t('noDestinationsTitle')}</h3>
        <p className="text-zinc-500 font-medium text-xs max-w-sm mx-auto">
          {t('noDestinationsDesc')}
        </p>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 border border-zinc-200 overflow-hidden">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900">{t('addDestination')}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6">
                <p className="text-sm text-zinc-500 mb-4">Database schema update required to enable dynamic content insertion.</p>
                <button onClick={() => setIsModalOpen(false)} className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-md text-sm transition-colors border border-zinc-200">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PartnersCMS({ t }: { t: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-zinc-800 transition-colors text-sm focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1"
        >
          <Plus className="w-4 h-4" /> {t('addPartner')}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3 border border-zinc-200 shadow-sm">
          <Building2 className="w-5 h-5 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">{t('noPartnersTitle')}</h3>
        <p className="text-zinc-500 font-medium text-xs max-w-sm mx-auto">
          {t('noPartnersDesc')}
        </p>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 border border-zinc-200 overflow-hidden">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900">{t('addPartner')}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6">
                <p className="text-sm text-zinc-500 mb-4">Database schema update required to enable dynamic content insertion.</p>
                <button onClick={() => setIsModalOpen(false)} className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-md text-sm transition-colors border border-zinc-200">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
