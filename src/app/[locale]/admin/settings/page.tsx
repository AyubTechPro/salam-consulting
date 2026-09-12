"use client";

import { motion } from 'framer-motion';
import { Settings, Key, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">System Settings</h1>
        <p className="text-slate-500 font-medium text-sm">Manage your platform configuration.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
            <Key className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Authentication</h3>
            <p className="text-sm text-slate-500">Your admin credentials are managed securely in environment variables.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-700 text-sm">Admin Password</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Configured via ADMIN_PASSWORD in .env.local</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full uppercase tracking-wide">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-700 text-sm">JWT Encryption</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Configured via JWT_SECRET</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full uppercase tracking-wide">Secured</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Platform Integrations</h3>
            <p className="text-sm text-slate-500">External Silicon Valley services powering your site.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-1">Supabase CRM</h4>
              <p className="text-xs text-slate-500 mb-3">Database for storing leads and inquiries.</p>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] rounded uppercase tracking-wider">Connected</span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-1">Resend Emails</h4>
              <p className="text-xs text-slate-500 mb-3">Automated transactional email delivery.</p>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] rounded uppercase tracking-wider">Connected</span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-1">PostHog Analytics</h4>
              <p className="text-xs text-slate-500 mb-3">User behavior and geographical tracking.</p>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] rounded uppercase tracking-wider">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
