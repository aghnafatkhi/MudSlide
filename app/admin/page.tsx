/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from "firebase/firestore";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("achievements");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <div className="p-12 text-center text-white/50">Checking authentication...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h1 className="font-serif italic text-4xl mb-6">Admin Access</h1>
        <p className="text-white/50 mb-8 max-w-sm text-center">Only authorized band managers can access the backstage console.</p>
        <button onClick={handleLogin} className="px-8 py-3 bg-white text-black hover:bg-gray-200 uppercase tracking-widest text-sm font-medium">
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
       {/* Sidebar */}
       <div className="md:w-64 shrink-0">
          <div className="sticky top-24">
             <div className="mb-8">
               <h2 className="font-serif italic text-2xl mb-1">Backstage</h2>
               <div className="text-xs tracking-widest uppercase text-white/50">{user.email}</div>
             </div>
             
             <nav className="flex flex-col gap-2 font-mono text-sm tracking-widest uppercase">
               {['achievements', 'members', 'gallery', 'messages'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`text-left py-2 px-4 border-l-2 transition-colors ${activeTab === tab ? 'border-white text-white bg-white/5' : 'border-white/10 text-white/50 hover:text-white hover:border-white/50'}`}
                 >
                   {tab}
                 </button>
               ))}
             </nav>
             
             <button onClick={handleLogout} className="mt-12 text-xs uppercase tracking-widest text-[#FF4444] hover:text-[#ffaaaa]">
               Sign Out
             </button>
          </div>
       </div>
       
       {/* Content Content */}
       <div className="flex-1 bg-white/5 border border-white/10 p-6 md:p-8 rounded-lg min-h-[60vh]">
          {activeTab === 'achievements' && <AdminAchievements />}
          {activeTab === 'members' && <AdminMembers />}
          {activeTab === 'gallery' && <AdminGallery />}
          {activeTab === 'messages' && <AdminMessages />}
       </div>
    </div>
  );
}

function AdminAchievements() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", date: "", description: "" });
  
  const load = async () => {
    const q = query(collection(db, "achievements"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q).catch((e) => {
       console.error(e); alert("Permission Denied."); return null;
    });
    if(snapshot) setItems(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
  };
  
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "achievements"), { ...form, createdAt: Date.now() });
    setForm({ title: "", date: "", description: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete this achievement?")) {
      await deleteDoc(doc(db, "achievements", id));
      load();
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="font-serif italic text-2xl">Manage Achievements</h3>
      
      <form onSubmit={handleAdd} className="space-y-4 bg-black/40 p-6 border border-white/10">
         <div className="text-xs uppercase tracking-widest text-white/50 mb-4">Add New</div>
         <div className="grid grid-cols-2 gap-4">
           <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="bg-transparent border border-white/20 p-2 text-sm text-white" />
           <input required placeholder="Date (e.g. 2024)" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="bg-transparent border border-white/20 p-2 text-sm text-white" />
         </div>
         <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full bg-transparent border border-white/20 p-2 text-sm text-white resize-none" rows={3}></textarea>
         <button type="submit" className="bg-white text-black px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-gray-200">Add Achievement</button>
      </form>
      
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-4 border border-white/10 bg-black/20 hover:bg-black/40">
            <div>
              <div className="text-white font-medium">{item.title}</div>
              <div className="text-white/50 text-xs">{item.date}</div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-xs uppercase text-red-500 hover:text-red-400">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminMembers() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", role: "", bio: "", imageUrl: "", sortOrder: 0 });
  
  const load = async () => {
    const q = query(collection(db, "members"), orderBy("sortOrder", "asc"));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
  };
  
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "members"), { 
      ...form, 
      sortOrder: Number(form.sortOrder),
      createdAt: Date.now() 
    });
    setForm({ name: "", role: "", bio: "", imageUrl: "", sortOrder: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete this member?")) {
      await deleteDoc(doc(db, "members", id));
      load();
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="font-serif italic text-2xl">Manage Members</h3>
      
      <form onSubmit={handleAdd} className="space-y-4 bg-black/40 p-6 border border-white/10">
         <div className="text-xs uppercase tracking-widest text-white/50 mb-4">Add New</div>
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
           <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="bg-transparent border border-white/20 p-2 text-sm text-white" />
           <input required placeholder="Role (e.g. Guitar)" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="bg-transparent border border-white/20 p-2 text-sm text-white" />
           <input required type="number" placeholder="Sort Order" value={form.sortOrder} onChange={e=>setForm({...form, sortOrder: Number(e.target.value)})} className="bg-transparent border border-white/20 p-2 text-sm text-white" />
         </div>
         <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl: e.target.value})} className="w-full bg-transparent border border-white/20 p-2 text-sm text-white" />
         <textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} className="w-full bg-transparent border border-white/20 p-2 text-sm text-white resize-none" rows={3}></textarea>
         <button type="submit" className="bg-white text-black px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-gray-200">Add Member</button>
      </form>
      
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-4 border border-white/10 bg-black/20 hover:bg-black/40">
            <div>
              <div className="text-white font-medium">{item.name} <span className="text-xs text-white/50">({item.role})</span></div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-xs uppercase text-red-500 hover:text-red-400">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ imageUrl: "", caption: "" });
  
  const load = async () => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
  };
  
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "gallery"), { ...form, createdAt: Date.now() });
    setForm({ imageUrl: "", caption: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Delete this image?")) {
      await deleteDoc(doc(db, "gallery", id));
      load();
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="font-serif italic text-2xl">Manage Gallery</h3>
      
      <form onSubmit={handleAdd} className="space-y-4 bg-black/40 p-6 border border-white/10">
         <div className="text-xs uppercase tracking-widest text-white/50 mb-4">Add New Image</div>
         <input required placeholder="Image URL (direct link like https://...)" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl: e.target.value})} className="w-full bg-transparent border border-white/20 p-2 text-sm text-white" />
         <input placeholder="Caption (optional)" value={form.caption} onChange={e=>setForm({...form, caption: e.target.value})} className="w-full bg-transparent border border-white/20 p-2 text-sm text-white" />
         <button type="submit" className="bg-white text-black px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-gray-200">Add to Gallery</button>
      </form>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="relative aspect-square group bg-black border border-white/10 flex flex-col justify-end overflow-hidden p-2">
            {/* Using standard img to avoid next/image remote config issues in admin panel arbitrarily */}
            <img src={item.imageUrl} alt="gallery thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" />
            <div className="relative z-10 bg-black/80 w-full p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis mb-8">
               {item.caption || "No caption"}
            </div>
            <button onClick={() => handleDelete(item.id)} className="absolute bottom-2 right-2 z-20 text-[10px] uppercase bg-red-500/80 px-2 py-1 hover:bg-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminMessages() {
  const [items, setItems] = useState<any[]>([]);
  
  const load = async () => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
  };
  
  useEffect(() => { load(); }, []);

  const markRead = async (id: string, currentlyRead: boolean) => {
      await updateDoc(doc(db, "messages", id), { read: !currentlyRead });
      load();
  };

  return (
    <div className="space-y-8">
      <h3 className="font-serif italic text-2xl">Contact Messages</h3>
      
      <div className="space-y-4">
        {items.length === 0 ? (
           <div className="text-white/50 text-sm">No messages yet.</div>
        ) : items.map(item => (
          <div key={item.id} className={`p-4 border ${item.read ? 'border-white/10 bg-black/40' : 'border-white/40 bg-white/5'} transition-colors`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-white font-medium">{item.name}</div>
                <div className="text-white/50 text-xs font-mono">{item.email}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="text-[10px] uppercase tracking-widest text-white/30">{new Date(item.createdAt).toLocaleDateString()}</div>
                 <button onClick={() => markRead(item.id, item.read)} className="text-[10px] uppercase border border-white/20 px-2 py-1 hover:bg-white hover:text-black">
                   {item.read ? 'Mark Unread' : 'Mark Read'}
                 </button>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed bg-black/20 p-3 rounded-sm">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
