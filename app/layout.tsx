import type {Metadata} from 'next';
import './globals.css';
import { Inter, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({subsets:['latin'],variable:'--font-serif'});

export const metadata: Metadata = {
  title: 'MudSlide | School Music Band',
  description: 'Official website for the school music band MudSlide',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans dark", inter.variable, playfair.variable)}>
      <body className="bg-black text-white antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Navigation />
        <main className="flex-1 mt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
