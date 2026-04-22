"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const q = query(collection(db, "achievements"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif italic text-5xl md:text-7xl mb-4">Achievements</h1>
        <div className="h-px bg-white/20 w-1/4"></div>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center text-white/50">Loading history...</div>
      ) : achievements.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-white/50 border border-dashed border-white/20">
          No achievements yet.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {achievements.map((ach) => (
            <div key={ach.id} className="group flex flex-col md:flex-row gap-8 py-8 border-b border-white/10 hover:bg-white/5 transition-colors p-4 -mx-4 rounded-xl">
               <div className="md:w-1/4 shrink-0">
                 <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2">{ach.date}</div>
                 <h2 className="font-serif text-2xl group-hover:text-white transition-colors">{ach.title}</h2>
               </div>
               <div className="flex-1">
                 <p className="text-white/70 font-light leading-relaxed">{ach.description}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
