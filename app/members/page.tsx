"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "members"), orderBy("sortOrder", "asc"));
        const snapshot = await getDocs(q);
        setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif italic text-5xl md:text-7xl mb-4">Members</h1>
        <div className="h-px bg-white/20 w-1/4"></div>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center text-white/50">Loading band profile...</div>
      ) : members.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-white/50 border border-dashed border-white/20">
          No members displayed.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {members.map((member) => (
            <div key={member.id} className="group">
               <div className="relative aspect-[3/4] mb-6 overflow-hidden">
                 <Image 
                   src={member.imageUrl || "https://picsum.photos/seed/mudslide/400/500"} 
                   alt={member.name} 
                   fill 
                   className="object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                   referrerPolicy="no-referrer"
                 />
               </div>
               <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">{member.role}</div>
               <h2 className="font-serif italic text-3xl mb-3">{member.name}</h2>
               {member.bio && (
                 <p className="text-sm font-light text-white/70 leading-relaxed">{member.bio}</p>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
