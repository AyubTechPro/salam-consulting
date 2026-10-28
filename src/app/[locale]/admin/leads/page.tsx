import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import LeadsViewSwitcher from '@/components/admin/LeadsViewSwitcher';

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
    <LeadsViewSwitcher
      initialLeads={leads || []}
      title={t('title')}
      subtitle={t('subtitle')}
    />
  );
}
