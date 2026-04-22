export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-auto py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-serif italic text-3xl mb-4">MudSlide.</h2>
        <p className="text-white/50 text-sm tracking-widest uppercase mb-8">Raw energy. Pure sound.</p>
        <div className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} MudSlide Band. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
