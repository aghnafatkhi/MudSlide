"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif italic text-5xl md:text-7xl mb-4">Gallery</h1>
        <div className="h-px bg-white/20 w-1/4"></div>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center text-white/50">Loading gallery...</div>
      ) : images.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-white/50 border border-dashed border-white/20">
          No performances captured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square group overflow-hidden">
               <Image 
                 src={img.imageUrl} 
                 alt={img.caption || "Performance"} 
                 fill 
                 className="object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                 referrerPolicy="no-referrer"
               />
               {img.caption && (
                 <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                   <p className="text-sm font-light text-white">{img.caption}</p>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
