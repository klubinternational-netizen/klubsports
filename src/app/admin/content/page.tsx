'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, Upload } from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'manufacturing'>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Home state
  const [homeHeadline, setHomeHeadline] = useState('');
  const [homeSubheadline, setHomeSubheadline] = useState('');
  const [homeHeroImage, setHomeHeroImage] = useState('');
  const [homeMetrics, setHomeMetrics] = useState<any[]>([]);

  // About state
  const [aboutIntroTitle, setAboutIntroTitle] = useState('');
  const [aboutIntroContent, setAboutIntroContent] = useState('');

  // Manufacturing state
  const [mfgHeroTitle, setMfgHeroTitle] = useState('');
  const [mfgHeroSubtitle, setMfgHeroSubtitle] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/pages/home').then((r) => r.json()),
      fetch('/api/admin/pages/about').then((r) => r.json()),
      fetch('/api/admin/pages/manufacturing').then((r) => r.json()),
    ])
      .then(([h, a, m]) => {
        if (h.page?.sections?.hero) {
          setHomeHeadline(h.page.sections.hero.headline || '');
          setHomeSubheadline(h.page.sections.hero.subheadline || '');
          setHomeHeroImage(h.page.sections.hero.bannerImage || '');
        }
        if (h.page?.sections?.highlights?.metrics) {
          setHomeMetrics(h.page.sections.highlights.metrics);
        }
        if (a.page?.sections?.intro) {
          setAboutIntroTitle(a.page.sections.intro.title || '');
          setAboutIntroContent(a.page.sections.intro.content || '');
        }
        if (m.page?.sections?.hero) {
          setMfgHeroTitle(m.page.sections.hero.title || '');
          setMfgHeroSubtitle(m.page.sections.hero.subtitle || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      if (activeTab === 'home') {
        const payload = {
          title: 'Home',
          sections: {
            hero: {
              headline: homeHeadline,
              subheadline: homeSubheadline,
              primaryCtaText: 'Explore Our Products',
              primaryCtaLink: '/products',
              secondaryCtaText: 'Business Enquiries',
              secondaryCtaLink: '/contact',
              bannerImage: homeHeroImage,
            },
            highlights: {
              title: 'Manufacturing & Operational Strength',
              description: 'Figures sourced from presentation deck — pending official client certification.',
              metrics: homeMetrics,
            },
          },
          isPublished: true,
        };
        const res = await fetch('/api/admin/pages/home', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update Home page content');
      } else if (activeTab === 'about') {
        const payload = {
          title: 'About Us',
          sections: {
            intro: {
              title: aboutIntroTitle,
              subtitle: 'Dedicated to athletic excellence and institutional sports footwear across India.',
              content: aboutIntroContent,
            },
          },
          isPublished: true,
        };
        const res = await fetch('/api/admin/pages/about', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update About Us content');
      } else if (activeTab === 'manufacturing') {
        const payload = {
          title: 'Manufacturing Capabilities',
          sections: {
            hero: {
              title: mfgHeroTitle,
              subtitle: mfgHeroSubtitle,
              image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
            },
          },
          isPublished: true,
        };
        const res = await fetch('/api/admin/pages/manufacturing', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update Manufacturing page content');
      }

      setFeedback({
        type: 'success',
        message: 'Content updated and published immediately to the public website!',
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving page content' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Live Publishing
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Website Content Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Edit marketing headlines, hero imagery, brand story and manufacturing copy. Changes publish immediately.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] rounded-lg transition-all shadow-md disabled:opacity-60 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </>
          )}
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            activeTab === 'home'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Homepage Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            activeTab === 'about'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          About Us Page
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manufacturing')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            activeTab === 'manufacturing'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Manufacturing Page
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400 space-y-2 bg-white rounded-xl border border-stone-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading CMS Content...</p>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
          {activeTab === 'home' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
                Homepage Hero Section
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={homeHeadline}
                  onChange={(e) => setHomeHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Hero Supporting Sub-Headline
                </label>
                <textarea
                  rows={3}
                  value={homeSubheadline}
                  onChange={(e) => setHomeSubheadline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Hero Showcase Image URL
                </label>
                <input
                  type="url"
                  value={homeHeroImage}
                  onChange={(e) => setHomeHeroImage(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                  Company Highlights (Source-deck Metrics)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {homeMetrics.map((m: any, idx: number) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                      <div className="text-[11px] font-bold text-stone-500 uppercase">{m.label}</div>
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => {
                          const updated = [...homeMetrics];
                          updated[idx].value = e.target.value;
                          setHomeMetrics(updated);
                        }}
                        className="w-full px-2.5 py-1 text-sm font-bold bg-white border border-stone-200 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
                About Us Intro Section
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={aboutIntroTitle}
                  onChange={(e) => setAboutIntroTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Company Mission & Engineering Overview
                </label>
                <textarea
                  rows={6}
                  value={aboutIntroContent}
                  onChange={(e) => setAboutIntroContent(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'manufacturing' && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
                Manufacturing Page Hero
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={mfgHeroTitle}
                  onChange={(e) => setMfgHeroTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Hero Subtitle
                </label>
                <textarea
                  rows={3}
                  value={mfgHeroSubtitle}
                  onChange={(e) => setMfgHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
