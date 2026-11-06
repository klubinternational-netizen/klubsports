'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [brandName, setBrandName] = useState('KSports');
  const [tagline, setTagline] = useState('Shoes For Every Sport');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [copyright, setCopyright] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Password & OTP Verification State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer effect for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          setBrandName(s.brandName || 'KSports');
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

  const handleSendPasswordOtp = async () => {
    setPasswordFeedback(null);

    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', message: 'Please enter your current password.' });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    if (!confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Please confirm your new password.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordFeedback({ type: 'error', message: 'New password cannot be identical to your current password.' });
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/admin/auth/change-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to dispatch verification OTP');

      setOtpSent(true);
      setResendCooldown(60);
      setPasswordFeedback({
        type: 'success',
        message: `Verification code sent to ${json.email || 'klubinternational@gmail.com'}. Please enter the 6-digit OTP below to authorize this change.`,
      });
    } catch (err: any) {
      setPasswordFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      await handleSendPasswordOtp();
      return;
    }

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setPasswordFeedback({ type: 'error', message: 'Please enter the complete 6-digit verification code.' });
      return;
    }

    setPasswordUpdating(true);
    setPasswordFeedback(null);

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          otp: cleanOtp,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update password');

      setPasswordFeedback({
        type: 'success',
        message: 'Administrator password updated successfully! Your new password is now active.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setOtpSent(false);
      setResendCooldown(0);
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
                    Confirmed brand name is KSports.
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
                  Official Store &amp; Headquarters Address
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
                {/* Current Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={otpSent}
                      className="w-full pl-3 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      disabled={otpSent}
                      className="w-full pl-3 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    disabled={otpSent}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:opacity-60"
                  />
                </div>

                {/* OTP Verification Section (Revealed once OTP is dispatched) */}
                {otpSent ? (
                  <div className="p-3.5 bg-orange-50/80 border border-orange-200 rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label htmlFor="settings_otp" className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                        Enter 6-Digit OTP
                      </label>
                      <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-orange-200">
                        Check Email
                      </span>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-brand-orange absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="settings_otp"
                        type="text"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        autoFocus
                        className="w-full pl-9 pr-3 py-2 text-center text-lg font-mono tracking-[0.4em] font-bold bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-orange shadow-inner"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        type="button"
                        disabled={resendCooldown > 0 || isSendingOtp}
                        onClick={handleSendPasswordOtp}
                        className="text-brand-orange hover:text-brand-orange-dark font-semibold disabled:text-stone-400 focus:outline-none flex items-center gap-1 cursor-pointer"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        className="text-stone-500 hover:text-stone-800 font-semibold focus:outline-none cursor-pointer"
                      >
                        Edit Details
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={passwordUpdating || otp.trim().length !== 6}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {passwordUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying & Saving...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify OTP & Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
                      <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>
                        An OTP verification code will be dispatched to <strong>klubinternational@gmail.com</strong> to authorize password changes.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendPasswordOtp}
                      disabled={isSendingOtp || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending OTP to Admin Email...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Verification OTP</span>
                        </>
                      )}
                    </button>
                  </>
                )}
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
