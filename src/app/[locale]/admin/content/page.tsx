"use client";

import { useState } from 'react';
import { Plus, Map, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentCMSPage() {
  const [activeTab, setActiveTab] = useState<'destinations' | 'partners'>('destinations');
  
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Content Management</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage platform content directly without editing code.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'destinations' ? 'border-black text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          <Map className="w-4 h-4" /> Destinations
        </button>
        <button 
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'partners' ? 'border-black text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          <Building2 className="w-4 h-4" /> Partners
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
          {activeTab === 'destinations' ? <DestinationsCMS /> : <PartnersCMS />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DestinationsCMS() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-zinc-800 transition-colors text-sm focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1">
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3 border border-zinc-200 shadow-sm">
          <Map className="w-5 h-5 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">No Destinations Found</h3>
        <p className="text-zinc-500 font-medium text-xs max-w-sm mx-auto">
          Add destinations here to override and manage them dynamically. Requires SQL schema execution.
        </p>
      </div>
    </div>
  );
}

function PartnersCMS() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-zinc-800 transition-colors text-sm focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3 border border-zinc-200 shadow-sm">
          <Building2 className="w-5 h-5 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">No Partners Found</h3>
        <p className="text-zinc-500 font-medium text-xs max-w-sm mx-auto">
          Add university or corporate partners here to display them globally on the platform.
        </p>
      </div>
    </div>
  );
}
