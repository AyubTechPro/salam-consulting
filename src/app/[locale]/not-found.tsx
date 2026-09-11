import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white font-sans p-4 text-center selection:bg-blue-500/30">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      
      <div className="relative z-10 bg-white border border-slate-200 p-12 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-w-md w-full">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-500 font-medium mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm w-full"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
