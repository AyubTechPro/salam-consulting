"use client";

import { useState, useTransition } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Calendar, Clock, MapPin, Mail, AlignLeft, CheckSquare, X, Globe, Smartphone, Monitor, Compass, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Lead = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  ip_address: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  referrer?: string;
};

const getLocaleObj = (localeCode: string) => {
  if (localeCode === 'ru' || localeCode === 'tg') return ru;
  return enUS;
};

export default function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Admin.kanban');
  const tLeads = useTranslations('Admin.leads');
  const params = useParams();
  const localeStr = (params?.locale as string) || 'en';
  const dateLocale = getLocaleObj(localeStr);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    }
  };

  const COLUMNS = [
    { id: 'new', title: tLeads('status.new'), color: 'bg-blue-50 text-blue-700 border-blue-200/50' },
    { id: 'contacted', title: tLeads('status.contacted'), color: 'bg-amber-50 text-amber-700 border-amber-200/50' },
    { id: 'meeting', title: tLeads('status.meeting'), color: 'bg-purple-50 text-purple-700 border-purple-200/50' },
    { id: 'contract', title: tLeads('status.contract'), color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50' },
    { id: 'mou', title: tLeads('status.mou'), color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' },
    { id: 'rejected', title: tLeads('status.rejected'), color: 'bg-zinc-50 text-zinc-700 border-zinc-200/50' }
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
          <input 
            type="text" 
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all font-medium text-sm placeholder:text-zinc-400 shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className="flex-shrink-0 w-80 flex flex-col bg-zinc-50/50 rounded-lg border border-zinc-200 snap-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="p-2 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 rounded-t-lg">
              <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${col.color}`}>
                {col.title}
              </div>
              <span className="text-xs font-medium text-zinc-400 mr-1">
                {filteredLeads.filter(l => l.status === col.id).length}
              </span>
            </div>
            
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {filteredLeads.filter(l => l.status === col.id).map(lead => {
                const isVIP = lead.email.endsWith('.edu') || (lead.email.includes('corporate') || lead.email.includes('admin') || lead.email.includes('ceo'));
                return (
                <div 
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onClick={() => setSelectedLead(lead)}
                  className={`bg-white p-3 rounded-md shadow-sm cursor-grab active:cursor-grabbing transition-all group border ${isVIP ? 'border-amber-300 shadow-amber-100/50' : 'border-zinc-200 hover:border-zinc-300'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-zinc-900 text-sm truncate">{lead.name}</h4>
                    {isVIP && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase rounded-sm border border-amber-200">VIP</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{lead.subject || lead.message}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(lead.created_at), { locale: dateLocale, addSuffix: true })}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold ${isVIP ? 'bg-amber-50 border border-amber-200 text-amber-600' : 'bg-zinc-100 border border-zinc-200 text-zinc-600'}`}>
                      {lead.name.charAt(0)}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out Drawer for Lead Details */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
              onClick={() => setSelectedLead(null)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-white shadow-2xl z-[101] flex flex-col border-l border-zinc-200"
            >
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">{selectedLead.name}</h2>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                  </a>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-zinc-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FAFAFA]">
                {/* Status Switcher inside Drawer */}
                <div className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">{t('pipelineStage')}</span>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedLead({...selectedLead, status: newStatus});
                      updateLeadStatus(selectedLead.id, newStatus);
                    }}
                    className="bg-zinc-50 border border-zinc-200 font-medium text-sm px-3 py-1.5 rounded-md cursor-pointer outline-none focus:ring-1 focus:ring-zinc-400"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>

                {/* Initial Request */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5" /> {t('initialRequest')}
                  </h3>
                  <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm">
                    <p className="text-sm font-semibold text-zinc-900 mb-2">{selectedLead.subject}</p>
                    <p className="text-sm text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedLead.message}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-100 text-xs font-medium text-zinc-400 flex items-center justify-between">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(selectedLead.created_at), 'PPP at p', { locale: dateLocale })}</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry & Analytics */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <BarChart className="w-3.5 h-3.5" /> {t('smartTelemetry')}
                  </h3>
                  <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-zinc-100 text-zinc-600 rounded-md"><Compass className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t('trafficSource')}</p>
                        <p className="text-sm font-medium text-zinc-900 mt-0.5">
                          {selectedLead.utm_source ? `${t('campaign')}: ${selectedLead.utm_source}` : t('directOrganic')}
                        </p>
                        <p className="text-xs font-medium text-zinc-400 truncate max-w-[150px]" title={selectedLead.referrer}>
                          {t('ref')}: {selectedLead.referrer || t('unknown')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-zinc-100 text-zinc-600 rounded-md">
                        {selectedLead.device_type === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t('deviceOS')}</p>
                        <p className="text-sm font-medium text-zinc-900 mt-0.5">
                          {selectedLead.device_type === 'Mobile' ? t('mobile') : (selectedLead.device_type === 'Desktop' ? t('desktop') : (selectedLead.device_type || t('unknown')))} - {selectedLead.os || t('unknownOS')}
                        </p>
                        <p className="text-xs font-medium text-zinc-400">
                          {selectedLead.browser || t('unknownBrowser')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2 border-t border-zinc-100 pt-4 mt-2">
                      <div className="mt-0.5 p-1.5 bg-zinc-100 text-zinc-600 rounded-md"><Globe className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t('locationData')}</p>
                        <p className="text-sm font-medium text-zinc-900 mt-0.5">
                          {selectedLead.city !== 'Unknown' && selectedLead.city ? `${selectedLead.city}, ` : ''}{selectedLead.country || t('unknownLocation')}
                        </p>
                        <p className="text-xs font-medium text-zinc-400">
                          {t('ip')}: {selectedLead.ip_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Tasks - Restored Feature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlignLeft className="w-3.5 h-3.5" /> {t('internalNotes')}
                    </h3>
                    <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-200/60 shadow-sm text-sm font-medium text-yellow-800/80 text-center h-28 flex flex-col items-center justify-center">
                      <p>{t('internalNotesDesc')}</p>
                      <button className="mt-2 text-xs font-semibold bg-yellow-100/80 px-3 py-1.5 rounded-md hover:bg-yellow-200/80 text-yellow-900 transition-colors border border-yellow-200">{t('addNote')}</button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <CheckSquare className="w-3.5 h-3.5" /> {t('tasks')}
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm text-sm font-medium text-zinc-400 text-center h-28 flex flex-col items-center justify-center">
                      <p>{t('noPendingTasks')}</p>
                      <button className="mt-2 text-xs font-semibold bg-zinc-100 px-3 py-1.5 rounded-md hover:bg-zinc-200 text-zinc-700 transition-colors border border-zinc-200">{t('addTask')}</button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  function updateLeadStatus(id: string, status: string) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    supabase.from('leads').update({ status }).eq('id', id).then();
  }
}
