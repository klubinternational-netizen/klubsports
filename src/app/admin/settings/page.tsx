'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [brandName, setBrandName] = useState('Klub Sports');
  const [tagline, setTagline] = useState('Shoes For Every Sport');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [copyright, setCopyright] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          setBrandName(s.brandName || 'Klub Sports');
          setTagline(s.tagline || 'Shoes For Every Sport');
          setEmail(s.contactDetails?.email || '');
          setPhone(s.contactDetails?.phone || '');
          setAddress(s.contactDetails?.address || '');
          setWorkingHours(s.contactDetails?.workingHours || '');
          setCopyright(s.footerContent?.copyright || '');
          setSeoTitle(s.defaultSeo?.title || '');
          setSeoDescription(s.defaultSeo?.description || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        brandName,
        tagline,
        contactDetails: {
          email,
          phone,
          address,
          workingHours,
        },
        footerContent: {
          copyright,
          description: 'Premium corporate sports footwear manufacturer engineered for peak athletic performance.',
        },
        defaultSeo: {
          title: seoTitle,
          description: seoDescription,
        },
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save settings');

      setFeedback({ type: 'success', message: 'Corporate settings updated and published live!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordUpdating(true);
    setPasswordFeedback(null);

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update password');

      setPasswordFeedback({ type: 'success', message: 'Administrator password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordFeedback({ type: 'error', message: err.message });
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          System Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
          Corporate & System Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure official brand identity, verified institutional contact details, SEO presets, and administrator credentials.
        </p>
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

      {loading ? (
        <div className="p-12 text-center text-stone-400 space-y-2 bg-white rounded-xl border border-stone-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading Configuration...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Corporate Settings Form */}
          <form onSubmit={handleSaveSettings} className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
                Official Brand Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Official Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Confirmed brand name is Klub Sports.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
                Institutional Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Manufacturing Facility Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Institutional Desk Working Hours
                </label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
                Default Site SEO & Footer Presets
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Default Browser Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Default Meta Description
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Footer Copyright Line
                </label>
                <input
                  type="text"
                  value={copyright}
                  onChange={(e) => setCopyright(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-colors shadow-md disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Live Settings</span>
            </button>
          </form>

          {/* Right Column: Password Management & Security */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <KeyRound className="w-4 h-4 text-brand-orange" />
                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Change Admin Password
                </h2>
              </div>

              {passwordFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    passwordFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {passwordFeedback.message}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-60"
                >
                  {passwordUpdating ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>Single-Admin Architecture</span>
              </div>
              <p>
                In accordance with specification guidelines, only one super-administrator account exists. No public registration or customer accounts are enabled.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
