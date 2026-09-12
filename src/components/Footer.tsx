"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPin, Mail, Send } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Navbar'); 
  const pathname = usePathname();

  if (pathname.includes('/admin')) {
    return null;
  } 

  return (
    <footer className="bg-slate-50 pt-16 md:pt-24 pb-8 md:pb-12 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-1">
            <Image 
              src="/logo/salamconsulting-logo-original.svg" 
              alt="Salam Consulting Logo" 
              width={240} 
              height={60}
              className="h-10 md:h-12 w-auto mb-6 drop-shadow-sm"
            />
            <p className="text-slate-600 text-[15px] font-normal leading-relaxed">
              Empowering your academic journey worldwide with professional consulting and personalized guidance.
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-600 text-[15px] hover:text-slate-900 transition-colors">{t('home')}</Link></li>
              <li><Link href="/study-abroad" className="text-slate-600 text-[15px] hover:text-slate-900 transition-colors">{t('destinations')}</Link></li>
              <li><Link href="/contact" className="text-slate-600 text-[15px] hover:text-slate-900 transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-slate-900 font-bold text-lg mb-6">{t('contact')}</h3>
            <ul className="space-y-4">
              <li className="text-slate-600">
                <a href="https://maps.google.com/maps?q=Rudaki+Avenue+53,+Dushanbe+734001,+Tajikistan" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-blue-600 transition-colors group">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>Rudaki Avenue 53, Dushanbe 734001, Tajikistan</span>
                </a>
              </li>
              <li className="text-slate-600">
                <a href="mailto:info@salamconsultingedu.com" className="flex items-center gap-3 hover:text-blue-600 transition-colors group">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>info@salamconsultingedu.com</span>
                </a>
              </li>
              <li className="text-slate-600">
                <a href="https://wa.me/992940076006" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors group">
                  <svg className="w-5 h-5 text-[#25D366] flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span className="font-medium">WhatsApp Us</span>
                </a>
              </li>
              <li className="text-slate-600">
                <a href="https://t.me/salamconsultingsupport" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#0088cc] transition-colors group">
                  <svg className="w-5 h-5 text-[#0088cc] flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="font-medium">Telegram Support</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-[15px]">
            © {new Date().getFullYear()} Salam Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <a href="https://www.instagram.com/salamconsultingtj?igsh=MWl0ZGk4Zm94NmhpNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/salamconsulting/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://t.me/salamconsultingtj" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow">
              <Send className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
