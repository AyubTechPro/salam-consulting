import Destinations from '@/components/Destinations';
import Services from '@/components/Services';
import { supabase } from '@/lib/supabase';

export default async function StudyAbroadPage() {
  // Fetch dynamic destinations from CMS
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="flex min-h-screen flex-col bg-white font-sans selection:bg-blue-500/30 pt-20">
      <div className="relative z-10 bg-white min-h-[80vh]">
        <Destinations destinations={destinations || []} />
        <Services />
      </div>
    </main>
  );
}
