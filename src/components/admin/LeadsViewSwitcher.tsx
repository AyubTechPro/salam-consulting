"use client";

import { useSyncExternalStore } from 'react';
import { List, Kanban } from 'lucide-react';
import CrmPipeline from '@/components/admin/CrmPipeline';
import KanbanBoard, { type Lead } from '@/components/admin/KanbanBoard';

interface LeadsViewSwitcherProps {
  initialLeads: Lead[];
  title: string;
  subtitle: string;
}

const STORAGE_KEY = 'salam_leads_view';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('salam_leads_view_change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('salam_leads_view_change', callback);
  };
}

function getSnapshot(): 'pipeline' | 'kanban' {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === 'kanban' ? 'kanban' : 'pipeline';
  } catch {
    return 'pipeline';
  }
}

function getServerSnapshot(): 'pipeline' | 'kanban' {
  return 'pipeline';
}

export default function LeadsViewSwitcher({ initialLeads, title, subtitle }: LeadsViewSwitcherProps) {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleViewChange = (newView: 'pipeline' | 'kanban') => {
    try {
      localStorage.setItem(STORAGE_KEY, newView);
      window.dispatchEvent(new Event('salam_leads_view_change'));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and View Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">{subtitle}</p>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center self-start sm:self-auto p-1 bg-zinc-100 rounded-lg border border-zinc-200 shadow-2xs">
          <button
            type="button"
            onClick={() => handleViewChange('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              view === 'pipeline'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
            aria-label="Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('kanban')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              view === 'kanban'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
            aria-label="Kanban Board"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {view === 'pipeline' ? (
        <CrmPipeline initialLeads={initialLeads} />
      ) : (
        <KanbanBoard initialLeads={initialLeads} />
      )}
    </div>
  );
}
