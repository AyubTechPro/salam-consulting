"use client";

import { useState, useEffect } from 'react';
import { Plus, Map, Building2, X, Trash2, ExternalLink } from 'lucide-react';
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
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });

  useEffect(() => {
    fetch('/api/admin/content/destinations')
      .then(res => res.json())
      .then(data => {
        if (data.destinations) setDestinations(data.destinations);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/content/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const { destination } = await res.json();
        setDestinations([destination, ...destinations]);
        setIsModalOpen(false);
        setFormData({ name: '', description: '', image_url: '' });
      } else {
        alert(t('error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch('/api/admin/content/destinations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setDestinations(destinations.filter(d => d.id !== id));
    } catch (e) {
      alert(t('error'));
    }
  };

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

      {isLoading ? (
        <div className="py-20 text-center text-zinc-400">Loading...</div>
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3 border border-zinc-200 shadow-sm">
            <Map className="w-5 h-5 text-zinc-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-1">{t('noDestinationsTitle')}</h3>
          <p className="text-zinc-500 font-medium text-xs max-w-sm mx-auto">{t('noDestinationsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map(dest => (
            <div key={dest.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden group">
              {dest.image_url ? (
                <div className="h-32 bg-zinc-100 overflow-hidden relative">
                  <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-zinc-50 flex items-center justify-center border-b border-zinc-100">
                  <Map className="w-8 h-8 text-zinc-300" />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-zinc-900 truncate">{dest.name}</h3>
                  <button onClick={() => handleDelete(dest.id)} className="text-zinc-400 hover:text-red-500 transition-colors p-1" title={t('delete')}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-zinc-500 line-clamp-2">{dest.description || 'No description'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900">{t('addDestinationModalTitle')}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t('nameLabel')} *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. United Kingdom" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t('imageUrlLabel')}</label>
                  <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t('descriptionLabel')}</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 rounded-md transition-colors">{t('cancel')}</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-bold bg-black text-white hover:bg-zinc-800 rounded-md transition-colors shadow-sm disabled:opacity-50">{isSubmitting ? t('saving') : t('save')}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PartnersCMS({ t }: { t: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', logo_url: '', website_url: '' });

  useEffect(() => {
    fetch('/api/admin/content/partners')
      .then(res => res.json())
      .then(data => {
        if (data.partners) setPartners(data.partners);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/content/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const { partner } = await res.json();
        setPartners([partner, ...partners]);
        setIsModalOpen(false);
        setFormData({ name: '', logo_url: '', website_url: '' });
      } else {
        alert(t('error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch('/api/admin/content/partners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setPartners(partners.filter(p => p.id !== id));
    } catch (e) {
      alert(t('error'));
    }
  };

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

      {isLoading ? (
        <div className="py-20 text-center text-zinc-400">Loading...</div>
      ) : partners.length === 0 ? (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3 border border-zinc-200 shadow-sm">
            <Building2 className="w-5 h-5 text-zinc-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-1">{t('noPartnersTitle')}</h3>
          <p className="text-zinc-500 font-medium text-xs max-w-sm mx-auto">{t('noPartnersDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map(partner => (
            <div key={partner.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex flex-col items-center text-center relative group">
              <button onClick={() => handleDelete(partner.id)} className="absolute top-2 right-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white rounded-full p-1 shadow-sm border border-zinc-100">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {partner.logo_url ? (
                <img src={partner.logo_url} alt={partner.name} className="w-16 h-16 object-contain mb-3" />
              ) : (
                <div className="w-16 h-16 bg-zinc-50 rounded-xl flex items-center justify-center mb-3 border border-zinc-100">
                  <Building2 className="w-6 h-6 text-zinc-300" />
                </div>
              )}
              <h3 className="text-sm font-bold text-zinc-900 mb-1 truncate w-full">{partner.name}</h3>
              {partner.website_url && (
                <a href={partner.website_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                  Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900">{t('addPartnerModalTitle')}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t('nameLabel')} *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. Harvard University" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t('logoUrlLabel')}</label>
                  <input value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">{t('websiteUrlLabel')}</label>
                  <input type="url" value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="https://..." />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 rounded-md transition-colors">{t('cancel')}</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-bold bg-black text-white hover:bg-zinc-800 rounded-md transition-colors shadow-sm disabled:opacity-50">{isSubmitting ? t('saving') : t('save')}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
