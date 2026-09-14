"use client";

import { useState, useTransition } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Calendar, Clock, MapPin, Mail, AlignLeft, CheckSquare, X, Globe, Smartphone, Monitor, Compass, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-50 text-blue-700 border-blue-200/50' },
  { id: 'contacted', title: 'Contacted', color: 'bg-amber-50 text-amber-700 border-amber-200/50' },
  { id: 'document_prep', title: 'Doc Prep', color: 'bg-purple-50 text-purple-700 border-purple-200/50' },
  { id: 'applied', title: 'Applied', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50' },
  { id: 'enrolled', title: 'Enrolled', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' },
  { id: 'rejected', title: 'Lost', color: 'bg-zinc-50 text-zinc-700 border-zinc-200/50' }
];

export default function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPending, startTransition] = useTransition();

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
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      
      // Background save
      await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search leads (Cmd+K)" 
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
              {filteredLeads.filter(l => l.status === col.id).map(lead => (
                <div 
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onClick={() => setSelectedLead(lead)}
                  className="bg-white p-3 rounded-md border border-zinc-200 shadow-sm hover:border-zinc-300 cursor-grab active:cursor-grabbing transition-all group"
                >
                  <h4 className="font-semibold text-zinc-900 text-sm">{lead.name}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{lead.subject || lead.message}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(lead.created_at))}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[9px] font-semibold text-zinc-600">
                      {lead.name.charAt(0)}
                    </div>
                  </div>
                </div>
              ))}
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
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
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
                  <span className="text-xs font-semibold text-zinc-500">Pipeline Stage</span>
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
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" /> Initial Request
                  </h3>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-bold text-slate-800 mb-2">{selectedLead.subject}</p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedLead.message}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(selectedLead.created_at), 'PPP at p')}</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry & Analytics */}
                <div>
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> Smart Telemetry (Silicon Valley Analytics)
                  </h3>
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-blue-100 text-blue-600 rounded-lg"><Compass className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs font-bold text-blue-800/60 uppercase">Traffic Source</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {selectedLead.utm_source ? `Campaign: ${selectedLead.utm_source}` : 'Direct / Organic'}
                        </p>
                        <p className="text-xs font-medium text-slate-500 truncate max-w-[150px]" title={selectedLead.referrer}>
                          Ref: {selectedLead.referrer || 'None'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-purple-100 text-purple-600 rounded-lg">
                        {selectedLead.device_type === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-800/60 uppercase">Device & OS</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {selectedLead.device_type || 'Unknown'} - {selectedLead.os || 'Unknown OS'}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {selectedLead.browser || 'Unknown Browser'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2 border-t border-blue-100/50 pt-4 mt-2">
                      <div className="mt-0.5 p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Globe className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800/60 uppercase">Location Data</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {selectedLead.city !== 'Unknown' ? `${selectedLead.city}, ` : ''}{selectedLead.country || 'Unknown Location'}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          IP: {selectedLead.ip_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Tasks Placeholder (To be wired with Supabase) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlignLeft className="w-4 h-4" /> Internal Notes
                    </h3>
                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-sm text-sm font-medium text-yellow-800 text-center h-32 flex flex-col items-center justify-center">
                      <p>Run SQL Schema to enable</p>
                      <button className="mt-2 text-xs font-bold bg-yellow-200 px-3 py-1 rounded-full hover:bg-yellow-300">Add Note</button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4" /> Tasks
                    </h3>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-sm font-medium text-slate-500 text-center h-32 flex flex-col items-center justify-center">
                      <p>No pending tasks</p>
                      <button className="mt-2 text-xs font-bold bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 text-slate-700">Add Task</button>
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
