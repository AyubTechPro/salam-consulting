import { supabase } from '@/lib/supabase';
import KanbanBoard from '@/components/admin/KanbanBoard';
import CrmPipeline from '@/components/admin/CrmPipeline';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function LeadsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin.leads' });

  // Fetch initial leads on the server
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium">Error loading CRM data.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')} (Kanban)</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">{t('subtitle')}</p>
      </div>

      <CrmPipeline initialLeads={leads || []} />
    </div>
  );
}
