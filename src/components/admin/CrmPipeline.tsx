"use client";

import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { Search, Clock, Mail, AlignLeft, X, Globe, Smartphone, Monitor, Compass, BarChart, ChevronRight } from 'lucide-react';
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
  notes?: { id: string; text: string; created_at: string }[];
};

const getLocaleObj = (localeCode: string) => {
  if (localeCode === 'ru' || localeCode === 'tg') return ru;
  return enUS;
};

export default function CrmPipeline({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const t = useTranslations('Admin.kanban');
  const tLeads = useTranslations('Admin.leads');
  const params = useParams();
  const localeStr = (params?.locale as string) || 'en';
  const dateLocale = getLocaleObj(localeStr);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(search.toLowerCase()) || 
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.subject && l.subject.toLowerCase().includes(search.toLowerCase()))
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
      { id: 'new', title: getLabel('new', 'New Inquiry'), color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { id: 'contacted', title: getLabel('contacted', 'Contacted'), color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { id: 'meeting', title: getLabel('meeting', 'Meeting Scheduled'), color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { id: 'contract', title: getLabel('contract', 'Contract Sent'), color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { id: 'mou', title: getLabel('mou', 'MOU Signed'), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { id: 'enrolled', title: getLabel('enrolled', 'Enrolled'), color: 'bg-teal-50 text-teal-700 border-teal-200' },
      { id: 'rejected', title: getLabel('rejected', 'Rejected'), color: 'bg-zinc-50 text-zinc-700 border-zinc-200' }
    ];
  }, [tLeads]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const targetLead = leads.find(l => l.id === id);
    if (!targetLead || targetLead.status === newStatus) return;

    const previousStatus = targetLead.status;
    setStatusError(null);
    setUpdatingStatusId(id);

    // Optimistic UI update
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
      // Revert optimistic update on network or server rejection
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: previousStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => prev ? { ...prev, status: previousStatus } : null);
      }
      const msg = err instanceof Error ? err.message : 'Network error updating lead status';
      setStatusError(`Failed to update status for ${targetLead.name}: ${msg}`);
      setTimeout(() => setStatusError(null), 5000);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const isVIP = (email: string) => {
    const e = email.toLowerCase();
    return e.endsWith('.edu') || e.includes('corporate') || e.includes('admin') || e.includes('ceo') || e.includes('university') || e.includes('stanford') || e.includes('harvard');
  };

  const handleUpdateName = async () => {
    if (!selectedLead || editNameValue.trim() === '' || editNameValue === selectedLead.name) {
      setIsEditingName(false);
      return;
    }
    const previousName = selectedLead.name;
    const updatedName = editNameValue.trim();
    setNameError(null);
    setIsUpdatingName(true);
    setIsEditingName(false);

    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, name: updatedName } : l));
    setSelectedLead(prev => prev ? { ...prev, name: updatedName } : null);

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, name: updatedName })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update client name');
      }
    } catch (err: unknown) {
      // Revert name on failure
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, name: previousName } : l));
      setSelectedLead(prev => prev ? { ...prev, name: previousName } : null);
      const msg = err instanceof Error ? err.message : 'Network error updating name';
      setNameError(msg);
      setTimeout(() => setNameError(null), 5000);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || newNote.trim() === '' || isSubmittingNote) return;
    setIsSubmittingNote(true);
    setNoteError(null);

    try {
      const res = await fetch('/api/admin/leads/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, text: newNote.trim() })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to save note');
      }

      const { note } = await res.json();
      const updatedNotes = [...(selectedLead.notes || []), note];
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l));
      setSelectedLead(prev => prev ? { ...prev, notes: updatedNotes } : null);
      setNewNote('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error saving note';
      setNoteError(msg);
      setTimeout(() => setNoteError(null), 5000);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Command Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder={t('search') || 'Search clients...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm placeholder:text-zinc-400 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]"
          />
        </div>
        <div className="text-xs font-semibold text-zinc-500">
          {tLeads('leadsCount', { count: filteredLeads.length })}
        </div>
      </div>

      {/* Network Error Toast / Banner */}
      <AnimatePresence>
        {statusError && (
          <motion.div 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center justify-between shadow-sm"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{statusError}</span>
            </div>
            <button 
              onClick={() => setStatusError(null)} 
              className="text-red-400 hover:text-red-700 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Linear-Style Data Table */}
      <div className="flex-1 bg-white rounded-xl border border-zinc-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 bg-zinc-50/80 backdrop-blur-sm text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-4">{tLeads('table.client')}</div>
          <div className="col-span-3">{tLeads('table.status')}</div>
          <div className="col-span-3">{tLeads('table.telemetry')}</div>
          <div className="col-span-2 text-right">{tLeads('table.date')}</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          {filteredLeads.map((lead) => {
            const vip = isVIP(lead.email);
            return (
              <div 
                key={lead.id} 
                className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-zinc-100/50 hover:bg-zinc-50/80 transition-colors items-center cursor-pointer group"
                onClick={() => setSelectedLead(lead)}
              >
                {/* Client Info */}
                <div className="col-span-4 flex items-center gap-3 overflow-hidden pr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm
                    ${vip ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' : 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200'}`}>
                    {lead.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 truncate">{lead.name}</h4>
                      {vip && <span className="shrink-0 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[9px] font-black uppercase rounded tracking-widest shadow-sm">{tLeads('vipClient')}</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                      <p className="text-xs font-medium text-zinc-500 truncate">{lead.email}</p>
                    </div>
                  </div>
                </div>

                {/* Inline Status Dropdown */}
                <div className="col-span-3 flex items-center" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <select
                      value={lead.status}
                      disabled={updatingStatusId === lead.id}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-bold border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-wider
                        ${COLUMNS.find(c => c.id === lead.status)?.color || 'bg-zinc-50 text-zinc-700 border-zinc-200'}
                        ${updatingStatusId === lead.id ? 'opacity-60 cursor-wait' : ''}
                      `}
                    >
                      {COLUMNS.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                      {updatingStatusId === lead.id ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Telemetry Snippet */}
                <div className="col-span-3 flex items-center gap-4 text-xs text-zinc-500 font-medium">
                  {lead.country ? (
                    <div className="flex items-center gap-1.5" title={`${lead.city}, ${lead.country}`}>
                      <Globe className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate max-w-[80px]">{lead.country}</span>
                    </div>
                  ) : (
                    <span className="text-zinc-300">-</span>
                  )}
                  {lead.device_type && (
                    <div className="flex items-center gap-1.5" title={`${lead.os} - ${lead.browser}`}>
                      {lead.device_type === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-zinc-400" /> : <Monitor className="w-3.5 h-3.5 text-zinc-400" />}
                      <span className="truncate max-w-[60px]">{lead.os}</span>
                    </div>
                  )}
                </div>

                {/* Date & Action */}
                <div className="col-span-2 flex items-center justify-end gap-3 text-xs text-zinc-400 font-semibold">
                  <span className="truncate">{formatDistanceToNow(new Date(lead.created_at), { locale: dateLocale, addSuffix: true })}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-2" />
                </div>
              </div>
            );
          })}
          {filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-3">
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-zinc-300" />
              </div>
              <p className="text-sm font-medium">{tLeads('noClientsFound')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Drawer for Lead Details (Silicon Valley Style) */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-[100]"
              onClick={() => setSelectedLead(null)}
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-white shadow-2xl z-[101] flex flex-col border-l border-zinc-200/50"
            >
              {/* Drawer Header & Quick Actions */}
              <div className="px-6 py-5 border-b border-zinc-100 flex items-start justify-between bg-white sticky top-0 z-10">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0 shadow-sm mt-1
                    ${isVIP(selectedLead.email) ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' : 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200'}`}>
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 group">
                      {isEditingName ? (
                        <input
                          autoFocus
                          type="text"
                          value={editNameValue}
                          disabled={isUpdatingName}
                          onChange={e => setEditNameValue(e.target.value)}
                          onBlur={handleUpdateName}
                          onKeyDown={e => e.key === 'Enter' && handleUpdateName()}
                          className="text-xl font-bold text-zinc-900 tracking-tight bg-zinc-50 border border-zinc-200 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      ) : (
                        <h2 
                          onClick={() => { setEditNameValue(selectedLead.name); setIsEditingName(true); }}
                          className="text-xl font-bold text-zinc-900 tracking-tight cursor-pointer hover:bg-zinc-50 rounded px-1 -ml-1 transition-colors border border-transparent hover:border-zinc-200"
                          title={t('clickToEdit')}
                        >
                          {selectedLead.name}
                        </h2>
                      )}
                      {isVIP(selectedLead.email) && <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black uppercase rounded tracking-widest shadow-sm">{tLeads('vipClient')}</span>}
                    </div>
                    {nameError && (
                      <div className="mt-1 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center justify-between" role="alert">
                        <span>{nameError}</span>
                        <button onClick={() => setNameError(null)} className="text-red-400 hover:text-red-600 ml-2">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    
                    {/* Quick Actions Bar */}
                    <div className="flex items-center gap-3 mt-2">
                      <a href={`mailto:${selectedLead.email}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 border border-blue-100">
                        <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                      </a>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(selectedLead.email); }}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1 rounded-md transition-colors border border-zinc-200"
                      >
                        {tLeads('copyEmail')}
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600 shadow-sm shrink-0 ml-4">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto bg-zinc-50/30">
                
                {/* Pipeline State Control */}
                <div className="p-6 border-b border-zinc-100 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('pipelineStage') || 'Pipeline Stage'}</span>
                    <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(selectedLead.created_at), { locale: dateLocale, addSuffix: true })}</span>
                  </div>
                  <div className="relative">
                    <select 
                      value={selectedLead.status}
                      disabled={updatingStatusId === selectedLead.id}
                      onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                      className={`w-full appearance-none px-4 py-3 text-sm font-bold border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-wider shadow-sm
                        ${COLUMNS.find(c => c.id === selectedLead.status)?.color || 'bg-zinc-50 text-zinc-700 border-zinc-200'}
                        ${updatingStatusId === selectedLead.id ? 'opacity-60 cursor-wait' : ''}
                      `}
                    >
                      {COLUMNS.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-current opacity-50">
                      {updatingStatusId === selectedLead.id ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Initial Request Message */}
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlignLeft className="w-4 h-4" /> {t('initialRequest') || 'Initial Request'}
                    </h3>
                    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-sm font-bold text-zinc-900 mb-3 pb-3 border-b border-zinc-100">{selectedLead.subject}</p>
                      <p className="text-sm text-zinc-700 font-medium leading-relaxed whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  </div>

                  {/* Telemetry & Analytics Grid */}
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BarChart className="w-4 h-4" /> {t('smartTelemetry') || 'Smart Telemetry'}
                    </h3>
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
                        
                        {/* Traffic Source */}
                        <div className="p-4 flex items-start gap-3 hover:bg-zinc-50/50 transition-colors">
                          <div className="mt-0.5 p-2 bg-amber-50 text-amber-600 rounded-lg ring-1 ring-amber-100"><Compass className="w-4 h-4" /></div>
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('trafficSource')}</p>
                            <p className="text-sm font-bold text-zinc-900">
                              {selectedLead.utm_source ? `${selectedLead.utm_source}` : t('directOrganic')}
                            </p>
                            <p className="text-xs font-semibold text-zinc-500 mt-1 truncate max-w-[150px]" title={selectedLead.referrer}>
                              {selectedLead.referrer || t('unknown')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Device Info */}
                        <div className="p-4 flex items-start gap-3 hover:bg-zinc-50/50 transition-colors">
                          <div className="mt-0.5 p-2 bg-emerald-50 text-emerald-600 rounded-lg ring-1 ring-emerald-100">
                            {selectedLead.device_type === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('deviceOS')}</p>
                            <p className="text-sm font-bold text-zinc-900">
                              {selectedLead.device_type === 'Mobile' ? t('mobile') : (selectedLead.device_type === 'Desktop' ? t('desktop') : (selectedLead.device_type || t('unknown')))} - {selectedLead.os || t('unknownOS')}
                            </p>
                            <p className="text-xs font-semibold text-zinc-500 mt-1">
                              {selectedLead.browser || t('unknownBrowser')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Location Row */}
                      <div className="p-4 border-t border-zinc-100 flex items-start gap-3 hover:bg-zinc-50/50 transition-colors bg-zinc-50/30">
                        <div className="mt-0.5 p-2 bg-blue-50 text-blue-600 rounded-lg ring-1 ring-blue-100"><Globe className="w-4 h-4" /></div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('locationData')}</p>
                          <p className="text-sm font-bold text-zinc-900">
                            {selectedLead.city !== 'Unknown' && selectedLead.city ? `${selectedLead.city}, ` : ''}{selectedLead.country || t('unknownLocation')}
                          </p>
                          <p className="text-xs font-semibold text-zinc-500 mt-1 font-mono">
                            {t('ip')}: {selectedLead.ip_address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline (Notes) */}
                  <div className="pb-8">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlignLeft className="w-4 h-4" /> {t('activityAndNotes')}
                    </h3>
                    
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="flex-1 p-5 max-h-[300px] overflow-y-auto space-y-4 bg-zinc-50/30">
                        {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                          <div className="text-center py-6 text-sm font-medium text-zinc-400">
                            {t('noNotesYet')}
                          </div>
                        ) : (
                          selectedLead.notes.map((note) => (
                            <div key={note.id} className="bg-white p-3.5 rounded-lg border border-zinc-100 shadow-sm">
                              <p className="text-sm text-zinc-700 font-medium whitespace-pre-wrap">{note.text}</p>
                              <div className="mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {formatDistanceToNow(new Date(note.created_at), { locale: dateLocale, addSuffix: true })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Note Input */}
                      <div className="p-3 border-t border-zinc-100 bg-white">
                        {noteError && (
                          <div className="mb-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg flex items-center justify-between" role="alert">
                            <span>{noteError}</span>
                            <button onClick={() => setNoteError(null)} className="text-red-400 hover:text-red-600">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          disabled={isSubmittingNote}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddNote();
                            }
                          }}
                          placeholder={t('typeNotePlaceholder')}
                          className="w-full text-sm font-medium text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[60px]"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-medium text-zinc-400 px-1">{t('markdownSupported')}</span>
                          <button 
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || isSubmittingNote}
                            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5"
                          >
                            {isSubmittingNote ? (
                              <>
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{t('savingNote')}</span>
                              </>
                            ) : (
                              <span>{t('saveNote')}</span>
                            )}
                          </button>
                        </div>
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
