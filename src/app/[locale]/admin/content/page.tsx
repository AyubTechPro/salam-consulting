"use client";

import { useState } from 'react';
import { Plus, Image as ImageIcon, Map, Building2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentCMSPage() {
  const [activeTab, setActiveTab] = useState<'destinations' | 'partners'>('destinations');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Content Management</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage platform content directly without editing code.</p>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center gap-2 pb-4 font-bold transition-colors border-b-2 ${activeTab === 'destinations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Map className="w-4 h-4" /> Destinations
        </button>
        <button 
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 pb-4 font-bold transition-colors border-b-2 ${activeTab === 'partners' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Building2 className="w-4 h-4" /> Partners
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'destinations' ? <DestinationsCMS /> : <PartnersCMS />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DestinationsCMS() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-16 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <Map className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">No Destinations Found</h3>
        <p className="text-slate-500 font-medium text-sm mb-6 max-w-md mx-auto">
          Currently, destinations are loaded from the code. Add destinations here to override and manage them dynamically. (Requires SQL schema execution)
        </p>
      </div>
    </div>
  );
}

function PartnersCMS() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-16 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">No Partners Found</h3>
        <p className="text-slate-500 font-medium text-sm mb-6 max-w-md mx-auto">
          Add university or corporate partners here to display them globally on the platform.
        </p>
      </div>
    </div>
  );
}
