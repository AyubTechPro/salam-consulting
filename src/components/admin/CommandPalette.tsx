"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter, useParams } from "next/navigation";
import { Search, LayoutDashboard, Users, FileText, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";
  const t = useTranslations("Admin.sidebar");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-sm transition-colors border border-slate-200/50"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="font-mono text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 ml-4">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <Command className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center border-b border-slate-100 px-3" cmdk-input-wrapper="">
              <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <Command.Input 
                autoFocus 
                placeholder="Type a command or search..." 
                className="flex-1 bg-transparent border-0 py-4 outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-smooth">
              <Command.Empty className="p-4 text-center text-sm text-slate-500">No results found.</Command.Empty>
              
              <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-slate-500">
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700 aria-selected:bg-blue-50 aria-selected:text-blue-700 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin/leads`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700 aria-selected:bg-blue-50 aria-selected:text-blue-700 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Leads (CRM)
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin/content`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700 aria-selected:bg-blue-50 aria-selected:text-blue-700 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Content (CMS)
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin/settings`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700 aria-selected:bg-blue-50 aria-selected:text-blue-700 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </>
  );
}
