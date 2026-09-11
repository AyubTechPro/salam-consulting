import Hero from '@/components/Hero';
import HomeAbout from '@/components/HomeAbout';
import PartnerLogos from '@/components/PartnerLogos';
import Gallery from '@/components/Gallery';
import Cta from '@/components/Cta';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white font-sans selection:bg-blue-500/30">
      <Hero />
      <div className="relative z-10 bg-white flex flex-col">
        <HomeAbout />
        <PartnerLogos />
        <Gallery />
        <Cta />
      </div>
    </main>
  );
}
