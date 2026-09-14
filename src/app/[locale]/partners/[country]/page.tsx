import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Globe, GraduationCap, Building2, Handshake, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define accepted countries for Programmatic SEO
// In a real app, this could be fetched from a database.
const VALID_COUNTRIES: Record<string, { name: string; region: string; focus: string }> = {
  'south-korea': { name: 'South Korea', region: 'Asia', focus: 'technology & language programs' },
  'turkey': { name: 'Türkiye', region: 'Europe/Asia', focus: 'cultural exchange & modern academia' },
  'malaysia': { name: 'Malaysia', region: 'Southeast Asia', focus: 'affordable world-class degrees' },
  'usa': { name: 'United States', region: 'North America', focus: 'ivy league & elite programs' },
  'uk': { name: 'United Kingdom', region: 'Europe', focus: 'historic universities & research' },
  'germany': { name: 'Germany', region: 'Europe', focus: 'engineering & tuition-free education' },
  'china': { name: 'China', region: 'Asia', focus: 'rapid growth & massive scholarships' },
};

export async function generateMetadata({ params }: { params: Promise<{ country: string, locale: string }> }): Promise<Metadata> {
  const { country, locale } = await params;
  const countryData = VALID_COUNTRIES[country.toLowerCase()];
  
  if (!countryData) {
    return { title: 'Partner with Salam Consulting' };
  }

  return {
    title: `University Partnerships in ${countryData.name} | Salam Consulting B2B`,
    description: `Salam Consulting connects top universities in ${countryData.name} with ambitious talent from Central Asia. Explore B2B partnership and student recruitment opportunities.`,
    keywords: `education agent ${countryData.name}, student recruitment ${countryData.name}, Salam Consulting partners, study abroad agency, university partnerships ${countryData.region}`,
    openGraph: {
      title: `Recruit Students for ${countryData.name} Universities`,
      description: `Expand your university's reach in Central Asia with Salam Consulting's premium recruitment network.`,
      type: 'website',
    },
  };
}

export default async function ProgrammaticPartnerPage({ params }: { params: Promise<{ country: string, locale: string }> }) {
  const { country, locale } = await params;
  const countryData = VALID_COUNTRIES[country.toLowerCase()];

  if (!countryData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-black selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-zinc-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold uppercase tracking-wider mb-8 border border-zinc-200">
            <Globe className="w-3.5 h-3.5" />
            Global B2B Partnership Program
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-800">{countryData.name}</span> Universities with Central Asian Talent
          </h1>
          
          <p className="text-lg text-zinc-600 mb-10 max-w-2xl mx-auto">
            Salam Consulting serves as your premium gateway to recruit highly motivated students for {countryData.focus} in {countryData.name}. We operate on Silicon Valley principles of transparency, data-driven matching, and uncompromising quality.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/${locale}/contact?utm_source=b2b_partner_${country}&utm_medium=website`} className="bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10 hover:shadow-black/20 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 w-full sm:w-auto justify-center">
              Become a Partner <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#benefits" className="bg-white text-zinc-900 px-8 py-3.5 rounded-lg font-medium border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all w-full sm:w-auto text-center">
              View Partnership Benefits
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="benefits" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight mb-4">Why Universities in {countryData.name} Trust Us</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">We filter, prepare, and deliver only the most capable students, reducing dropout rates and enhancing your institution's global prestige.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Absolute Integrity",
              desc: "Zero document forgery. We rigorously verify all academic transcripts and financial statements before submission."
            },
            {
              icon: GraduationCap,
              title: "Targeted Recruitment",
              desc: `We map student career goals directly to your ${countryData.focus}, ensuring high enrollment conversion.`
            },
            {
              icon: Handshake,
              title: "B2B Dedicated Portal",
              desc: "Partners get access to our real-time CRM pipeline to track student application progress transparently."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors text-zinc-600">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate CTA */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Building2 className="w-12 h-12 text-zinc-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to expand your reach?</h2>
          <p className="text-lg text-zinc-400 mb-10">Sign an MOU with Salam Consulting today and tap into a rapidly growing market of ambitious international students.</p>
          <Link href={`/${locale}/contact?utm_source=b2b_mou_${country}`} className="bg-white text-black px-10 py-4 rounded-lg font-bold hover:bg-zinc-200 transition-all text-lg inline-flex items-center gap-2">
            Schedule a B2B Meeting
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
