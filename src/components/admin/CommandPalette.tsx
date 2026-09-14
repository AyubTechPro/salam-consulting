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
  const t = useTranslations("Admin.command");

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
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100/50 hover:bg-zinc-100 text-zinc-500 rounded-md text-sm transition-colors border border-zinc-200"
      >
        <Search className="w-4 h-4" strokeWidth={1.5} />
        <span>{t('search')}</span>
        <kbd className="font-sans text-[10px] font-semibold bg-white text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 ml-6 shadow-sm">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <Command className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-zinc-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center border-b border-zinc-100 px-3" cmdk-input-wrapper="">
              <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" strokeWidth={1.5} />
              <Command.Input 
                autoFocus 
                placeholder={t('typeCommand')} 
                className="flex-1 bg-transparent border-0 py-3 outline-none text-zinc-900 placeholder:text-zinc-400 text-sm font-medium"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-smooth">
              <Command.Empty className="p-4 text-center text-sm text-zinc-500">{t('noResults')}</Command.Empty>
              
              <Command.Group heading={t('navigation')} className="px-2 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 font-medium rounded-md cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 aria-selected:bg-zinc-100 aria-selected:text-zinc-900 data-[selected=true]:bg-zinc-100 data-[selected=true]:text-zinc-900 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                  {t('dashboard')}
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin/leads`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 font-medium rounded-md cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 aria-selected:bg-zinc-100 aria-selected:text-zinc-900 data-[selected=true]:bg-zinc-100 data-[selected=true]:text-zinc-900 transition-colors"
                >
                  <Users className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                  {t('leads')}
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin/content`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 font-medium rounded-md cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 aria-selected:bg-zinc-100 aria-selected:text-zinc-900 data-[selected=true]:bg-zinc-100 data-[selected=true]:text-zinc-900 transition-colors"
                >
                  <FileText className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                  {t('content')}
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push(`/${locale}/admin/settings`))}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 font-medium rounded-md cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 aria-selected:bg-zinc-100 aria-selected:text-zinc-900 data-[selected=true]:bg-zinc-100 data-[selected=true]:text-zinc-900 transition-colors"
                >
                  <Settings className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                  {t('settings')}
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </>
  );
}
