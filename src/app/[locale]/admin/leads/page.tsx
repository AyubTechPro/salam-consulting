"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { Search, ChevronDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    
    // API Call
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">CRM Leads</h1>
          <p className="text-slate-500 font-medium text-sm">Manage and track your incoming inquiries.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <span className="w-8 h-8 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="group">
                <div 
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">{lead.name}</h3>
                      {lead.status === 'new' && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{lead.subject}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                    <div className="text-xs font-bold text-slate-400 text-right">
                      <div>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</div>
                      <div className="font-medium">{format(new Date(lead.created_at), 'MMM d, h:mm a')}</div>
                    </div>
                    
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`appearance-none font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full outline-none cursor-pointer transition-colors border-2
                          ${lead.status === 'new' ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' : 
                            lead.status === 'contacted' ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' : 
                            lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : 
                            lead.status === 'won' ? 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100' : 
                            'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}
                        `}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="won">Won (Enrolled)</option>
                        <option value="lost">Lost</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === lead.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50 border-t border-slate-100"
                    >
                      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message</p>
                            <p className="text-slate-700 bg-white p-4 rounded-xl border border-slate-200 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                              {lead.message}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Details</p>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                              <p className="text-sm"><span className="font-medium text-slate-500">Email:</span> <a href={`mailto:${lead.email}`} className="font-bold text-blue-600 hover:underline">{lead.email}</a></p>
                              <p className="text-sm"><span className="font-medium text-slate-500">IP Addr:</span> <span className="font-medium">{lead.ip_address || 'Unknown'}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            {filteredLeads.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No leads found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
