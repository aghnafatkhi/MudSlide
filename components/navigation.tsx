import Link from 'next/link';

export function Navigation() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
        <Link href="/" className="font-serif italic text-2xl tracking-tighter text-white">
          MudSlide.
        </Link>
        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium text-white/70">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/achievements" className="hover:text-white transition-colors">Achievements</Link>
          <Link href="/members" className="hover:text-white transition-colors">Members</Link>
          <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/admin" className="hover:text-white transition-colors ml-4 pl-4 border-l border-white/20">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
