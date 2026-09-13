"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Admin.leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                          l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">{t('subtitle')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-64 group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('search')} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm"
            />
          </div>

          <div className="relative w-full sm:w-48 group">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm appearance-none cursor-pointer"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="new">{t('status.new')}</option>
              <option value="contacted">{t('status.contacted')}</option>
              <option value="enrolled">{t('status.enrolled')}</option>
              <option value="rejected">{t('status.rejected')}</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <span className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="group">
                <div 
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                  className="p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 w-full lg:w-auto">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-base font-bold text-slate-900 truncate">{lead.name}</h3>
                      {lead.status === 'new' && (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate font-medium">{lead.subject || lead.message}</p>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
                    <div className="text-xs font-bold text-slate-400 lg:text-right">
                      <div className="text-slate-500 mb-0.5">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</div>
                      <div className="font-medium text-[10px] uppercase tracking-wider">{format(new Date(lead.created_at), 'MMM d, yyyy')}</div>
                    </div>
                    
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`appearance-none font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full outline-none cursor-pointer transition-all border
                          ${lead.status === 'new' ? 'bg-amber-50 text-amber-600 border-amber-200/50 hover:bg-amber-100' : 
                            lead.status === 'contacted' ? 'bg-blue-50 text-blue-600 border-blue-200/50 hover:bg-blue-100' : 
                            lead.status === 'enrolled' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50 hover:bg-emerald-100' : 
                            lead.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200/50 hover:bg-red-100' : 
                            'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}
                        `}
                      >
                        <option value="new">{t('status.new')}</option>
                        <option value="contacted">{t('status.contacted')}</option>
                        <option value="enrolled">{t('status.enrolled')}</option>
                        <option value="rejected">{t('status.rejected')}</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === lead.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-[#fafafa] border-t border-slate-100/80 shadow-inner"
                    >
                      <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('table.service')}</p>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 text-sm whitespace-pre-wrap leading-relaxed shadow-sm font-medium text-slate-700">
                              {lead.message}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('table.client')}</p>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 space-y-3 shadow-sm">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                <a href={`mailto:${lead.email}`} className="text-sm font-bold text-blue-600 hover:underline">{lead.email}</a>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IP Address</p>
                                <p className="text-sm font-medium text-slate-600">{lead.ip_address || 'Unknown'}</p>
                              </div>
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
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('empty')}</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
