"use client";

import { useState, useTransition } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Calendar, Clock, MapPin, Mail, AlignLeft, CheckSquare, X } from 'lucide-react';
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
};

const COLUMNS = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'contacted', title: 'Contacted', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'document_prep', title: 'Doc Prep', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'applied', title: 'Applied', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'enrolled', title: 'Enrolled', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'rejected', title: 'Lost', color: 'bg-slate-100 text-slate-700 border-slate-200' }
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
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72 group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search leads (Cmd+K)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/50 snap-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="p-3 border-b border-slate-200/50 flex items-center justify-between">
              <div className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border ${col.color}`}>
                {col.title}
              </div>
              <span className="text-xs font-bold text-slate-400">
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
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 cursor-grab active:cursor-grabbing transition-all"
                >
                  <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">{lead.subject || lead.message}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(lead.created_at))} ago
                    </span>
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center text-[8px] font-black text-slate-600">
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
              className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-white shadow-2xl z-[101] flex flex-col border-l border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedLead.name}</h2>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {selectedLead.email}
                  </a>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                {/* Status Switcher inside Drawer */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pipeline Stage</span>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedLead({...selectedLead, status: newStatus});
                      updateLeadStatus(selectedLead.id, newStatus);
                    }}
                    className="bg-slate-100 border-none font-bold text-sm px-4 py-2 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
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
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> IP: {selectedLead.ip_address}</span>
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
