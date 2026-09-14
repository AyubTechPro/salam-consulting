"use client";

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [telemetry, setTelemetry] = useState<any>({});

  useEffect(() => {
    // Gather Telemetry Data on mount
    const searchParams = new URLSearchParams(window.location.search);
    const ua = navigator.userAgent;
    
    // Basic device detection
    let device_type = 'Desktop';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      device_type = 'Mobile';
    } else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      device_type = 'Tablet';
    }

    // Basic OS detection
    let os = 'Unknown';
    if (ua.indexOf('Win') !== -1) os = 'Windows';
    if (ua.indexOf('Mac') !== -1) os = 'MacOS';
    if (ua.indexOf('X11') !== -1) os = 'UNIX';
    if (ua.indexOf('Linux') !== -1) os = 'Linux';
    if (/Android/.test(ua)) os = 'Android';
    if (/like Mac OS X/.test(ua)) os = 'iOS';

    // Basic Browser detection
    let browser = 'Unknown';
    if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') !== -1) browser = 'Safari';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (ua.indexOf('MSIE') !== -1 || !!document.documentMode === true) browser = 'IE';
    else if (ua.indexOf('Edge') !== -1) browser = 'Edge';

    setTelemetry({
      utm_source: searchParams.get('utm_source') || null,
      utm_medium: searchParams.get('utm_medium') || null,
      utm_campaign: searchParams.get('utm_campaign') || null,
      device_type,
      browser,
      os,
      referrer: document.referrer || null,
    });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } as const
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      locale: locale,
      telemetry: telemetry
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-slate-50">

      <div className="max-w-3xl mb-24 text-center mx-auto">
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 drop-shadow-sm"
        >
          {t('title')}
        </motion.h1>
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-500 font-medium tracking-wide max-w-2xl mx-auto"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        
        {/* Contact Form (Takes up 3 columns) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 relative"
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <AnimatePresence>
              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20 p-8 text-center rounded-3xl"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                    className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-[0_8px_30px_rgba(34,197,94,0.2)] border border-green-100"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-slate-900 mb-3 tracking-tight"
                  >
                    Message Sent!
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-500 max-w-sm font-medium mb-8"
                  >
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </motion.p>
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm font-bold text-blue-600 hover:text-white hover:bg-blue-600 transition-colors flex items-center gap-2 bg-blue-50 px-8 py-3.5 rounded-full shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Send another message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{t('form.name')}</label>
                  <input name="name" required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{t('form.email')}</label>
                  <input name="email" required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{t('form.subject')}</label>
                <input name="subject" required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{t('form.message')}</label>
                <textarea name="message" required rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium resize-none" placeholder="Write your message here..."></textarea>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-10 py-4 font-bold transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
                {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                {t('form.submit')}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Contact Details & Map (Takes up 2 columns) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 flex flex-col gap-8"
        >
          {/* Contact Info Cards */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Headquarters</h3>
                <p className="font-bold text-slate-900 leading-snug">Rudaki Avenue 53<br/>Dushanbe 734001, Tajikistan</p>
              </div>
            </div>

            <div className="bg-white border border-blue-600/20 p-6 rounded-2xl flex items-start gap-4 shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.2)] transition-shadow">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</h3>
                <a href="mailto:info@salamconsultingedu.com" className="inline-block font-bold text-slate-900 hover:text-blue-600 transition-colors mb-2">info@salamconsultingedu.com</a>
                <a href="mailto:info@salamconsultingedu.com" className="block text-center w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
                  Send Email
                </a>
              </div>
            </div>

            <div className="bg-white border border-[#25D366]/20 p-6 rounded-2xl flex items-start gap-4 shadow-[0_8px_30px_rgba(37,211,102,0.1)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.2)] transition-shadow">
              <div className="w-12 h-12 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Fastest Response</h3>
                <a href="https://wa.me/992940076006" target="_blank" rel="noopener noreferrer" className="inline-block font-bold text-slate-900 mb-2">Message us on WhatsApp</a>
                <a href="https://wa.me/992940076006" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-[#25D366] text-white py-2 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-sm">
                  Start Chat
                </a>
              </div>
            </div>

            <div className="bg-white border border-[#0088cc]/20 p-6 rounded-2xl flex items-start gap-4 shadow-[0_8px_30px_rgba(0,136,204,0.1)] hover:shadow-[0_8px_30px_rgba(0,136,204,0.2)] transition-shadow">
              <div className="w-12 h-12 bg-[#0088cc]/10 border border-[#0088cc]/20 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Telegram Support</h3>
                <a href="https://t.me/salamconsultingsupport" target="_blank" rel="noopener noreferrer" className="inline-block font-bold text-slate-900 mb-2">Message us on Telegram</a>
                <a href="https://t.me/salamconsultingsupport" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-[#0088cc] text-white py-2 rounded-xl font-bold hover:bg-[#0077b3] transition-colors shadow-sm">
                  Open Telegram
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-grow min-h-[300px] w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative group">
            <iframe 
              src="https://maps.google.com/maps?q=Rudaki+Avenue+53,+Dushanbe+734001,+Tajikistan&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
