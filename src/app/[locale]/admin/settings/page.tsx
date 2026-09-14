"use client";

import { useState } from 'react';
import { Save, Bell, Server, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const t = useTranslations('Admin.settings');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [isBotModalOpen, setIsBotModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{t('title')}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex items-center gap-3 bg-zinc-50/50">
          <Bell className="w-4 h-4 text-zinc-500" />
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{t('general')}</h2>
            <p className="text-xs text-zinc-500">{t('generalDesc')}</p>
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-all">
            <div>
              <h3 className="font-semibold text-zinc-900 text-sm">{t('emailNotifications')}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{t('emailNotificationsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} />
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
            <button 
              onClick={() => setIsBotModalOpen(true)}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-md transition-colors text-xs shrink-0 border border-zinc-200 shadow-sm"
            >
              {t('connectBot')}
            </button>
          </div>
        </div>

        <div className="p-4 bg-zinc-50/80 border-t border-zinc-200 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-800 transition-all focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : t('save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex items-center gap-3 bg-zinc-50/50">
          <Server className="w-4 h-4 text-zinc-500" />
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{t('platformIntegrations')}</h2>
            <p className="text-xs text-zinc-500">{t('platformIntegrationsDesc')}</p>
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-zinc-200 rounded-lg shadow-sm bg-white">
              <h4 className="font-semibold text-zinc-900 mb-0.5 text-sm">{t('supabaseCRM')}</h4>
              <p className="text-xs text-zinc-500 mb-3">{t('supabaseCRMDesc')}</p>
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-medium text-[10px] rounded border border-zinc-200">{t('connected')}</span>
            </div>
            <div className="p-4 border border-zinc-200 rounded-lg shadow-sm bg-white">
              <h4 className="font-semibold text-zinc-900 mb-0.5 text-sm">{t('resendEmails')}</h4>
              <p className="text-xs text-zinc-500 mb-3">{t('resendEmailsDesc')}</p>
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-medium text-[10px] rounded border border-zinc-200">{t('connected')}</span>
            </div>
            <div className="p-4 border border-zinc-200 rounded-lg shadow-sm bg-white">
              <h4 className="font-semibold text-zinc-900 mb-0.5 text-sm">{t('posthog')}</h4>
              <p className="text-xs text-zinc-500 mb-3">{t('posthogDesc')}</p>
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-medium text-[10px] rounded border border-zinc-200">{t('connected')}</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isBotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsBotModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 border border-zinc-200 overflow-hidden">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-semibold text-zinc-900">{t('telegramAlerts')}</h3>
                <button onClick={() => setIsBotModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6">
                <p className="text-sm text-zinc-600 mb-4 font-medium">To connect the Telegram bot, please run the setup script provided in the documentation.</p>
                <div className="bg-zinc-900 text-zinc-300 p-3 rounded-md text-xs font-mono overflow-x-auto mb-6 shadow-inner">
                  npx @salam/cli init telegram
                </div>
                <button onClick={() => setIsBotModalOpen(false)} className="w-full py-2 bg-black hover:bg-zinc-800 text-white font-medium rounded-md text-sm transition-colors">Done</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
