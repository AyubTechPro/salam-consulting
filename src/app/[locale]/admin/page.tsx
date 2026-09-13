import { supabase } from '@/lib/supabase';
import { Users, TrendingUp, Inbox, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import LeadsChart from '@/components/admin/LeadsChart';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin.dashboard' });
  const tLeads = await getTranslations({ locale, namespace: 'Admin.leads' });
  
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium">Error loading data.</div>;
  }

  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(l => l.status === 'new').length || 0;
  const contacted = leads?.filter(l => l.status !== 'new').length || 0;
  const recentLeads = leads?.slice(0, 5) || [];
  
  const conversionRate = totalLeads > 0 ? Math.round((contacted / totalLeads) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Smart Insights */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-[0_10px_40px_rgba(37,99,235,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" />
            {t('smartInsights')}
          </div>
          <h1 className="text-3xl font-black mb-2">{t('greeting')}!</h1>
          <p className="text-blue-100 text-lg font-medium leading-relaxed">
            {t('insightsText', { unread: newLeads })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{t('overview')}</h2>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('totalLeads')}</p>
          <h3 className="text-4xl font-black text-slate-900 mt-1">{totalLeads}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-[0_4px_20px_rgba(37,99,235,0.05)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-6 h-6" />
            </div>
            {newLeads > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-blue-400/80 uppercase tracking-wider">{t('newLeads')}</p>
          <h3 className="text-4xl font-black text-blue-600 mt-1">{newLeads}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.05)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-emerald-400/80 uppercase tracking-wider">{t('conversion')}</p>
          <h3 className="text-4xl font-black text-emerald-600 mt-1">{conversionRate}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-1">{t('chartTitle')}</h3>
          <p className="text-sm text-slate-500 font-medium mb-6">{t('chartSubtitle')}</p>
          <LeadsChart leads={leads || []} />
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">{t('recentLeads')}</h3>
            <Link href={`/${locale}/admin/leads`} className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
              {t('viewAll')}
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                      ${lead.status === 'new' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20' : 
                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20' : 
                        lead.status === 'enrolled' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20' :
                        'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20'}`}
                    >
                      {tLeads(`status.${lead.status}`)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 truncate">{lead.subject || lead.message}</p>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-medium text-sm">
                  {tLeads('empty')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
