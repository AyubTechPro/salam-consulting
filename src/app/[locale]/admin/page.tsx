import { supabase } from '@/lib/supabase';
import { Users, TrendingUp, Inbox } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import LeadsChart from '@/components/admin/LeadsChart';

export const revalidate = 0; // Disable caching for the admin dashboard

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Fetch some metrics
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl">Error loading data.</div>;
  }

  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(l => l.status === 'new').length || 0;
  const recentLeads = leads?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
            <h3 className="text-3xl font-black text-slate-900">{totalLeads}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">New (Unread)</p>
            <h3 className="text-3xl font-black text-slate-900">{newLeads}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Conversion</p>
            <h3 className="text-3xl font-black text-slate-900">
              {totalLeads > 0 ? Math.round(((totalLeads - newLeads) / totalLeads) * 100) : 0}%
            </h3>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Lead Generation Overview</h3>
        <p className="text-sm text-slate-500 font-medium">New inquiries over the last 7 days</p>
        <LeadsChart leads={leads || []} />
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent Inquiries</h3>
          <Link href={`/${locale}/admin/leads`} className="text-sm font-bold text-blue-600 hover:text-blue-700">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{lead.name}</div>
                    <div className="text-sm text-slate-500">{lead.email}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                    {lead.subject || 'No Subject'}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${lead.status === 'new' ? 'bg-amber-100 text-amber-700' : 
                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-100 text-slate-700'}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
