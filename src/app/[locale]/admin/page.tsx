import { supabase } from '@/lib/supabase';
import { Users, TrendingUp, Inbox, Sparkles, ArrowUpRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import LeadsChart from '@/components/admin/LeadsChart';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

const getLocaleObj = (localeCode: string) => {
  if (localeCode === 'ru' || localeCode === 'tg') return ru;
  return enUS;
};

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin.dashboard' });
  const tLeads = await getTranslations({ locale, namespace: 'Admin.leads' });
  const dateLocale = getLocaleObj(locale);
  
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-200">Error loading data.</div>;
  }

  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(l => l.status === 'new').length || 0;
  const contacted = leads?.filter(l => l.status !== 'new').length || 0;
  const recentLeads = leads?.slice(0, 5) || [];
  
  const conversionRate = totalLeads > 0 ? Math.round((contacted / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Vercel Style Header Intro */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{t('greeting')}</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {t('insightsText', { unread: newLeads })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/admin/leads`} className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium bg-black text-white rounded-md hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2">
            View CRM Pipeline
          </Link>
        </div>
      </div>

      {/* Metrics Row (High Density, Minimalist) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-500">{t('totalLeads')}</p>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight">{totalLeads}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {newLeads > 0 && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-zinc-900">{t('newLeads')}</p>
              {newLeads > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
            </div>
            <Inbox className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight">{newLeads}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-500">{t('conversion')}</p>
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight">{conversionRate}%</h3>
            <span className="text-xs text-emerald-600 flex items-center font-medium"><ArrowUpRight className="w-3 h-3" /> +2.4%</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-900">{t('chartTitle')}</h3>
            <p className="text-xs text-zinc-500 mt-1">{t('chartSubtitle')}</p>
          </div>
          <div className="h-[300px] w-full">
            <LeadsChart leads={leads || []} />
          </div>
        </div>

        {/* Recent Leads (Tabular / List Density) */}
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50 rounded-t-lg">
            <h3 className="text-sm font-semibold text-zinc-900">{t('recentLeads')}</h3>
            <Link href={`/${locale}/admin/leads`} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              {t('viewAll')} &rarr;
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-zinc-100">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="p-4 hover:bg-zinc-50/50 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-zinc-900 text-sm truncate pr-2">{lead.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(lead.created_at), { locale: dateLocale, addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500 truncate max-w-[180px]">{lead.subject || lead.message}</p>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border
                      ${lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200/50' : 
                        lead.status === 'enrolled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                        'bg-zinc-50 text-zinc-600 border-zinc-200/50'}`}
                    >
                      {tLeads(`status.${lead.status}`)}
                    </span>
                  </div>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm">
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
