import { supabase } from '@/lib/supabase';
import { Users, TrendingUp, Inbox, ArrowUpRight, Clock, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';
import LeadsChart from '@/components/admin/LeadsChart';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

// Custom relative time formatter to avoid Russian fallback issues
function getRelativeTime(dateString: string, localeCode: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const rtfEn = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const rtfTg = new Intl.RelativeTimeFormat('tg', { numeric: 'auto' });
  
  // Custom fallback for Tajik if Intl doesn't support 'tg' fully in the browser/node
  const formatTg = (val: number, unit: Intl.RelativeTimeFormatUnit) => {
    try {
      return rtfTg.format(val, unit);
    } catch {
      // Manual fallback mapping
      if (unit === 'second') return `${Math.abs(val)} сония пеш`;
      if (unit === 'minute') return `${Math.abs(val)} дақиқа пеш`;
      if (unit === 'hour') return `${Math.abs(val)} соат пеш`;
      if (unit === 'day') return val === -1 ? 'дирӯз' : val === 0 ? 'имрӯз' : `${Math.abs(val)} рӯз пеш`;
      if (unit === 'month') return `${Math.abs(val)} моҳ пеш`;
      if (unit === 'year') return `${Math.abs(val)} сол пеш`;
      return `${Math.abs(val)} ${unit} пеш`;
    }
  };

  const format = (val: number, unit: Intl.RelativeTimeFormatUnit) => {
    if (localeCode === 'tg') return formatTg(val, unit);
    return rtfEn.format(val, unit);
  };

  if (diffInSeconds < 60) return format(-diffInSeconds, 'second');
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return format(-diffInMinutes, 'minute');
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return format(-diffInHours, 'hour');
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return format(-diffInDays, 'day');
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return format(-diffInMonths, 'month');
  const diffInYears = Math.floor(diffInMonths / 12);
  return format(-diffInYears, 'year');
}

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin.dashboard' });
  const tLeads = await getTranslations({ locale, namespace: 'Admin.leads' });
  
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
  const recentLeads = leads?.slice(0, 6) || [];
  
  // VIP Logic: Identify corporate emails
  const isVIP = (email: string) => {
    const e = email.toLowerCase();
    return e.endsWith('.edu') || e.includes('corporate') || e.includes('admin') || e.includes('ceo') || e.includes('university') || e.includes('harvard') || e.includes('stanford');
  };
  
  const vipLeads = leads?.filter(l => isVIP(l.email)) || [];
  const newVipLeads = vipLeads.filter(l => l.status === 'new').length;
  
  const conversionRate = totalLeads > 0 ? Math.round((contacted / totalLeads) * 100) : 0;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Premium Header Intro (Linear Style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{t('greeting')}</h1>
          <p className="text-sm text-zinc-500 font-medium">
            {newLeads > 0 ? `You have ${newLeads} new leads waiting for response.` : 'All caught up! No new leads.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {newVipLeads > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              {newVipLeads} VIP Action Required
            </div>
          )}
          <Link href={`/${locale}/admin/leads`} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-all shadow-md shadow-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2">
            View CRM Pipeline
          </Link>
        </div>
      </div>

      {/* Metrics Row (Stripe/Linear Aesthetics - Glassmorphism & Micro-animations) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{t('totalLeads')}</p>
            <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-zinc-100 transition-colors">
              <Users className="w-4 h-4 text-zinc-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-zinc-900 tracking-tight">{totalLeads}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-50/50 to-white p-6 rounded-xl border border-blue-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgba(6,81,237,0.1)] transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-blue-900 uppercase tracking-wider">{t('newLeads')}</p>
              {newLeads > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
              )}
            </div>
            <div className="p-2 bg-blue-100/50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Inbox className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-blue-900 tracking-tight">{newLeads}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{t('conversion')}</p>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-bold text-zinc-900 tracking-tight">{conversionRate}%</h3>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs flex items-center font-bold tracking-wide"><ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.4%</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">{t('chartTitle')}</h3>
              <p className="text-sm text-zinc-500 mt-1">{t('chartSubtitle')}</p>
            </div>
          </div>
          <div className="flex-1 w-full -ml-4">
            <LeadsChart leads={leads || []} />
          </div>
        </div>

        {/* VIP & Recent Leads Pulse */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 backdrop-blur-sm">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">Activity Pulse</h3>
            <Link href={`/${locale}/admin/leads`} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded">
              View All
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-zinc-100">
              {recentLeads.map((lead: any) => {
                const leadIsVip = isVIP(lead.email);
                return (
                <div key={lead.id} className={`p-4 hover:bg-zinc-50/80 transition-colors group relative ${leadIsVip ? 'bg-amber-50/30' : ''}`}>
                  {leadIsVip && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-400"></div>}
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${leadIsVip ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-600'}`}>
                        {lead.name.charAt(0)}
                      </div>
                      <h4 className="font-semibold text-zinc-900 text-sm truncate">{lead.name}</h4>
                      {leadIsVip && <span className="shrink-0 px-1.5 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 text-[9px] font-bold uppercase rounded-sm tracking-wider">VIP</span>}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold whitespace-nowrap flex items-center gap-1 shrink-0 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {getRelativeTime(lead.created_at, locale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pl-8">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                      <p className="text-xs text-zinc-500 truncate">{lead.email}</p>
                    </div>
                    <span className={`shrink-0 inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border tracking-wide uppercase
                      ${lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        lead.status === 'enrolled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-zinc-50 text-zinc-600 border-zinc-200'}`}
                    >
                      {tLeads(`status.${lead.status}`)}
                    </span>
                  </div>
                </div>
              )})}
              {recentLeads.length === 0 && (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
                    <Inbox className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="text-zinc-500 text-sm font-medium">{tLeads('empty')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
