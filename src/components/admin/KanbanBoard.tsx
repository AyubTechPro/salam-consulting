"use client";

import { useState, useMemo } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { Search, Clock, Mail, AlignLeft, X, Globe, Smartphone, Monitor, Compass, BarChart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export type Lead = {
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
  notes?: { id: string; text: string; created_at: string }[];
};

const getLocaleObj = (localeCode: string) => {
  if (localeCode === 'ru' || localeCode === 'tg') return ru;
  return enUS;
};

export default function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = useTranslations('Admin.kanban');
  const tLeads = useTranslations('Admin.leads');
  const params = useParams();
  const localeStr = (params?.locale as string) || 'en';
  const dateLocale = getLocaleObj(localeStr);

  const isVIP = (email: string) => {
    const e = email.toLowerCase();
    return e.endsWith('.edu') || e.includes('corporate') || e.includes('admin') || e.includes('ceo') || e.includes('university') || e.includes('stanford') || e.includes('harvard');
  };

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.email.toLowerCase().includes(q) ||
      (l.subject && l.subject.toLowerCase().includes(q)) ||
      (l.country && l.country.toLowerCase().includes(q)) ||
      (l.city && l.city.toLowerCase().includes(q))
    );
  }, [leads, search]);

  const COLUMNS = useMemo(() => {
    const getLabel = (status: string, fallback: string) => {
      try {
        return tLeads(`status.${status}`) || fallback;
      } catch {
        return fallback;
      }
    };

    return [
      { id: 'new', title: getLabel('new', 'New Inquiry'), color: 'bg-blue-50 text-blue-700 border-blue-200/60' },
      { id: 'contacted', title: getLabel('contacted', 'Contacted'), color: 'bg-amber-50 text-amber-700 border-amber-200/60' },
      { id: 'meeting', title: getLabel('meeting', 'Meeting Scheduled'), color: 'bg-purple-50 text-purple-700 border-purple-200/60' },
      { id: 'contract', title: getLabel('contract', 'Contract Sent'), color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60' },
      { id: 'mou', title: getLabel('mou', 'MOU Signed'), color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
      { id: 'enrolled', title: getLabel('enrolled', 'Enrolled'), color: 'bg-teal-50 text-teal-700 border-teal-200/60' },
      { id: 'rejected', title: getLabel('rejected', 'Rejected'), color: 'bg-zinc-50 text-zinc-700 border-zinc-200/60' }
    ];
  }, [tLeads]);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumn === colId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    setDraggedLeadId(null);
    if (!leadId) return;

    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead || targetLead.status === newStatus) return;

    const previousStatus = targetLead.status;
    setErrorMessage(null);

    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update lead status');
      }
    } catch (err: unknown) {
      // Revert optimistic update on failure
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: previousStatus } : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: previousStatus } : null);
      }
      const msg = err instanceof Error ? err.message : 'Network error moving lead';
      setErrorMessage(`Could not move ${targetLead.name}: ${msg}`);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const targetLead = leads.find(l => l.id === id);
    if (!targetLead || targetLead.status === newStatus) return;

    const previousStatus = targetLead.status;
    setErrorMessage(null);

    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update lead status');
      }
    } catch (err: unknown) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: previousStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => prev ? { ...prev, status: previousStatus } : null);
      }
      const msg = err instanceof Error ? err.message : 'Network error updating lead status';
      setErrorMessage(`Failed to update status for ${targetLead.name}: ${msg}`);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Search and Counts Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder={t('search') || 'Search clients, emails, countries...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm placeholder:text-zinc-400 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-zinc-500">
          {tLeads('leadsCount', { count: filteredLeads.length })}
        </div>
      </div>

      {/* Network Error Toast / Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center justify-between shadow-sm"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{errorMessage}</span>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-red-400 hover:text-red-700 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Columns Container */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x select-none">
        {COLUMNS.map(col => {
          const colLeads = filteredLeads.filter(l => l.status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div 
              key={col.id} 
              className={`flex-shrink-0 w-80 flex flex-col bg-zinc-50/70 rounded-xl border transition-colors snap-center ${
                isOver ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-500/10' : 'border-zinc-200/80'
              }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="p-3 border-b border-zinc-200/70 flex items-center justify-between bg-zinc-50/90 rounded-t-xl">
                <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </div>
                <span className="text-xs font-bold text-zinc-400 bg-white px-2 py-0.5 rounded-full border border-zinc-200/60 shadow-2xs">
                  {colLeads.length}
                </span>
              </div>
              
              <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto min-h-[120px]">
                {colLeads.map(lead => {
                  const vip = isVIP(lead.email);
                  const isDragging = draggedLeadId === lead.id;

                  return (
                    <div 
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedLead(lead)}
                      className={`bg-white p-3.5 rounded-xl shadow-xs cursor-grab active:cursor-grabbing transition-all border group
                        hover:shadow-md hover:-translate-y-0.5
                        ${vip ? 'border-amber-200/80 hover:border-amber-300 ring-1 ring-amber-100/50' : 'border-zinc-200/80 hover:border-zinc-300'}
                        ${isDragging ? 'opacity-40 scale-[0.98] ring-2 ring-blue-400/50' : 'opacity-100'}
                      `}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-zinc-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {lead.name}
                        </h4>
                        {vip && (
                          <span className="shrink-0 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-black uppercase rounded tracking-widest shadow-2xs">
                            VIP
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 font-medium">
                        {lead.subject || lead.message}
                      </p>
                      
                      {/* Tags & Badges */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {lead.country && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-600 bg-zinc-100/80 px-2 py-0.5 rounded-md border border-zinc-200/50" title={`${lead.city ? `${lead.city}, ` : ''}${lead.country}`}>
                            <Globe className="w-3 h-3 text-zinc-400" />
                            <span className="truncate max-w-[80px]">{lead.country}</span>
                          </span>
                        )}
                        {lead.device_type && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200/40">
                            {lead.device_type === 'Mobile' ? <Smartphone className="w-2.5 h-2.5 text-zinc-400" /> : <Monitor className="w-2.5 h-2.5 text-zinc-400" />}
                            <span>{lead.os || lead.device_type}</span>
                          </span>
                        )}
                      </div>

                      {/* Footer: Date and Avatar */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(lead.created_at), { locale: dateLocale, addSuffix: true })}
                        </span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-2xs ${
                          vip ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' : 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200'
                        }`}>
                          {lead.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colLeads.length === 0 && (
                  <div className="h-28 rounded-lg border border-dashed border-zinc-200/70 flex items-center justify-center text-xs font-semibold text-zinc-400">
                    No inquiries
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-zinc-900">{selectedLead.name}</h2>
                    {isVIP(selectedLead.email) && (
                      <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black uppercase rounded tracking-widest shadow-2xs">
                        VIP
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                  </a>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-zinc-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FAFAFA]">
                {/* Status Switcher inside Drawer */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{t('pipelineStage')}</span>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 font-bold text-sm px-3 py-1.5 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>

                {/* Initial Request */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5" /> {t('initialRequest')}
                  </h3>
                  <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                    <p className="text-sm font-bold text-zinc-900 mb-2">{selectedLead.subject}</p>
                    <p className="text-sm text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedLead.message}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-100 text-xs font-medium text-zinc-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(selectedLead.created_at), 'PPP at p', { locale: dateLocale })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry & Analytics */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <BarChart className="w-3.5 h-3.5" /> {t('smartTelemetry')}
                  </h3>
                  <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-zinc-100 text-zinc-600 rounded-md"><Compass className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t('trafficSource')}</p>
                        <p className="text-sm font-bold text-zinc-900 mt-0.5">
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
                        <p className="text-sm font-bold text-zinc-900 mt-0.5">
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
                        <p className="text-sm font-bold text-zinc-900 mt-0.5">
                          {selectedLead.city !== 'Unknown' && selectedLead.city ? `${selectedLead.city}, ` : ''}{selectedLead.country || t('unknownLocation')}
                        </p>
                        <p className="text-xs font-medium text-zinc-400">
                          {t('ip')}: {selectedLead.ip_address}
                        </p>
                      </div>
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
}
