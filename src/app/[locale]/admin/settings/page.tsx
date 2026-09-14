import { Save, Bell, Smartphone, Server } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin.settings' });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{t('title')}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex items-center gap-3 bg-zinc-50/50">
          <Bell className="w-4 h-4 text-zinc-500" />
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{t('general')}</h2>
            <p className="text-xs text-zinc-500">Configure global platform notifications</p>
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-all">
            <div>
              <h3 className="font-semibold text-zinc-900 text-sm">{t('emailNotifications')}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{t('emailNotificationsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-900 text-sm">{t('telegramAlerts')}</h3>
                <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-semibold uppercase tracking-wider rounded">Pro</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{t('telegramAlertsDesc')}</p>
            </div>
            <button className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-md transition-colors text-xs shrink-0 border border-zinc-200 shadow-sm">
              Connect Bot
            </button>
          </div>

        </div>

        <div className="p-4 bg-zinc-50/80 border-t border-zinc-200 flex justify-end">
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-800 transition-all focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1">
            <Save className="w-4 h-4" />
            {t('save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex items-center gap-3 bg-zinc-50/50">
          <Server className="w-4 h-4 text-zinc-500" />
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Platform Integrations</h2>
            <p className="text-xs text-zinc-500">External services powering your site.</p>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-zinc-200 rounded-lg shadow-sm">
              <h4 className="font-semibold text-zinc-900 mb-0.5 text-sm">Supabase CRM</h4>
              <p className="text-xs text-zinc-500 mb-3">Database for storing leads.</p>
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-medium text-[10px] rounded border border-zinc-200">Connected</span>
            </div>
            <div className="p-4 border border-zinc-200 rounded-lg shadow-sm">
              <h4 className="font-semibold text-zinc-900 mb-0.5 text-sm">Resend Emails</h4>
              <p className="text-xs text-zinc-500 mb-3">Transactional email delivery.</p>
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-medium text-[10px] rounded border border-zinc-200">Connected</span>
            </div>
            <div className="p-4 border border-zinc-200 rounded-lg shadow-sm">
              <h4 className="font-semibold text-zinc-900 mb-0.5 text-sm">PostHog</h4>
              <p className="text-xs text-zinc-500 mb-3">User behavior tracking.</p>
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-medium text-[10px] rounded border border-zinc-200">Connected</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
