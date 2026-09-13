import { Save, Bell, Shield, Smartphone, Server } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin.settings' });

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{t('general')}</h2>
            <p className="text-sm text-slate-500 font-medium">Configure global platform notifications</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-slate-200/60 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all group">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{t('emailNotifications')}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{t('emailNotificationsDesc')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-slate-200/60 rounded-2xl hover:border-purple-200 hover:shadow-sm transition-all group">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{t('telegramAlerts')}</h3>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-sm">Pro</span>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-1">{t('telegramAlertsDesc')}</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm shrink-0">
              Connect Bot
            </button>
          </div>

        </div>

        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5">
            <Save className="w-4 h-4" />
            {t('save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Platform Integrations</h2>
            <p className="text-sm text-slate-500 font-medium">External Silicon Valley services powering your site.</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-slate-200/60 rounded-2xl shadow-sm bg-slate-50/30">
              <h4 className="font-bold text-slate-900 mb-1">Supabase CRM</h4>
              <p className="text-xs text-slate-500 font-medium mb-4">Database for storing leads and inquiries.</p>
              <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 font-bold text-[10px] rounded-md uppercase tracking-wider border border-emerald-200">Connected</span>
            </div>
            <div className="p-6 border border-slate-200/60 rounded-2xl shadow-sm bg-slate-50/30">
              <h4 className="font-bold text-slate-900 mb-1">Resend Emails</h4>
              <p className="text-xs text-slate-500 font-medium mb-4">Automated transactional email delivery.</p>
              <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 font-bold text-[10px] rounded-md uppercase tracking-wider border border-emerald-200">Connected</span>
            </div>
            <div className="p-6 border border-slate-200/60 rounded-2xl shadow-sm bg-slate-50/30">
              <h4 className="font-bold text-slate-900 mb-1">PostHog Analytics</h4>
              <p className="text-xs text-slate-500 font-medium mb-4">User behavior and geographical tracking.</p>
              <span className="px-3 py-1 bg-emerald-100/50 text-emerald-700 font-bold text-[10px] rounded-md uppercase tracking-wider border border-emerald-200">Connected</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
