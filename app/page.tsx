import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        {/* We can use motion for slam-in if requested, but simple CSS or framer is fine too. */}
        <div className="z-10 relative text-center flex flex-col items-center px-4 w-full">
          <div className="pointer-events-none mb-6">
             {/* Logo text instead of missing image, or we can use generic image */}
             <div className="text-sm font-bold tracking-[0.2em] text-white/50 uppercase mb-4">Official School Band</div>
             <h1 className="font-serif italic font-black text-7xl md:text-9xl lg:text-[12vw] leading-[0.8] tracking-tighter mix-blend-difference z-20">
               MudSlide
             </h1>
          </div>
          
          <div className="max-w-xl mx-auto mt-12 text-white/70 font-light leading-relaxed">
            <p>
              We are a collective of students dedicated to bringing pure, unfiltered rock to the stage.
              Born in the practice rooms, bred for the crowd.
            </p>
          </div>
          
          <div className="mt-12 flex gap-4">
             <Link href="/gallery" className="px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-black transition-all">
               View Performances
             </Link>
             <Link href="/contact" className="px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all font-medium">
               Book Us
             </Link>
          </div>
        </div>
      </section>

      {/* Featured Members Snippet */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex justify-between items-baseline mb-12">
             <h2 className="font-serif italic text-4xl">Meet the Band</h2>
             <Link href="/members" className="uppercase text-xs tracking-widest text-white/50 hover:text-white pb-1 border-b border-white/20">
                View All
             </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Alex", role: "Lead Vocals", img: "https://picsum.photos/seed/vocals/400/500" },
                { name: "Jordan", role: "Lead Guitar", img: "https://picsum.photos/seed/guitar/400/500" },
                { name: "Sam", role: "Drums", img: "https://picsum.photos/seed/drums/400/500" }
              ].map((m, i) => (
                 <div key={i} className="group relative overflow-hidden transition-all aspect-[3/4] grayscale hover:grayscale-0">
                    <Image src={m.img} alt={m.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="uppercase tracking-widest text-xs text-white/60 mb-1">{m.role}</div>
                      <div className="font-serif italic text-2xl text-white">{m.name}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
