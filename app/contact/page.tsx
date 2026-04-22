"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        read: false,
        createdAt: Date.now()
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (e) {
      console.error(e);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-serif italic text-5xl md:text-7xl mb-4">Contact</h1>
        <div className="h-px bg-white/20 w-1/4 mb-6"></div>
        <p className="text-white/60 font-light max-w-lg">
          Interested in booking MudSlide for your brand event, school gig, or festival? Drop us a message below.
        </p>
      </div>

      <div className="bg-white/5 p-8 border border-white/10 rounded-2xl">
        {success ? (
          <div className="text-center py-12">
            <h3 className="font-serif italic text-3xl mb-4">Message Sent</h3>
            <p className="text-white/60">We will get back to you as soon as the feedback dissipates.</p>
            <button onClick={() => setSuccess(false)} className="mt-8 border-b border-white/30 text-sm uppercase tracking-widest pb-1 hover:text-white">
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50">Your Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="john@brand.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50">Message</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white focus:outline-none focus:border-white transition-colors resize-none"
                placeholder="Tell us about the gig..."
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Transmission"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
