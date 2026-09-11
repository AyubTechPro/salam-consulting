import Destinations from '@/components/Destinations';
import Services from '@/components/Services';

export default function StudyAbroadPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white font-sans selection:bg-blue-500/30 pt-20">
      <div className="relative z-10 bg-white min-h-[80vh]">
        <Destinations />
        <Services />
      </div>
    </main>
  );
}
