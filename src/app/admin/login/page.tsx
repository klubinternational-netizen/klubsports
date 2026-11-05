'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

type AuthViewMode = 'login' | 'forgot-request' | 'forgot-verify' | 'forgot-success';

export default function AdminLoginPage() {
  const router = useRouter();

  // Mode: login, forgot-request, forgot-verify, forgot-success
  const [mode, setMode] = useState<AuthViewMode>('login');

  // Login form state - official admin email and default credentials pre-set
  const [email, setEmail] = useState('klubinternational@gmail.com');
  const [password, setPassword] = useState('KSportsAdmin2026!Secure');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Guard against browser autofilling stale/cached credentials like admin@ksports.co.in
  React.useEffect(() => {
    if (!email || email.includes('admin@ksports.co.in') || email.includes('admin@ksports.com')) {
      setEmail('klubinternational@gmail.com');
    }
    if (!password) {
      setPassword('KSportsAdmin2026!Secure');
    }
  }, []);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('klubinternational@gmail.com');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');

  // 1. Handle standard admin login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Successful login
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 2. Step 1: Send OTP to admin email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setForgotError(null);
    setIsSendingOtp(true);

    const emailToSend = (forgotEmail || 'klubinternational@gmail.com').trim().toLowerCase();

    try {
      const res = await fetch('/api/admin/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code');
      }

      setMaskedEmail(data.maskedEmail || emailToSend);
      setForgotSuccessMessage(`A 6-digit verification code has been dispatched to ${data.email || emailToSend}.`);
      setMode('forgot-verify');
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 3. Step 2: Verify OTP and set new password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setForgotError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('New passwords do not match. Please re-enter carefully.');
      return;
    }

    setIsResettingPassword(true);

    try {
      const res = await fetch('/api/admin/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          otp: cleanOtp,
          newPassword: newPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update administrator password');
      }

      setMode('forgot-success');
    } catch (err: any) {
      setForgotError(err.message || 'Verification failed. Please check the OTP code.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Ambient architectural lighting */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#ee7700]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-stone-800/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        {/* Brand Logo Container */}
        <div className="bg-white p-3.5 rounded-xl inline-block shadow-lg mx-auto">
          <div className="relative h-12 w-48">
            <Image
              src="/brand/logo-horizontal.png"
              alt="KSports Administrator Portal"
              fill
              priority
              className="object-contain"
              sizes="200px"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Administrator Portal
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Secure CMS for catalogue, content & corporate enquiries
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-stone-200">

          {/* ======================================================== */}
          {/* VIEW 1: STANDARD ADMIN LOGIN FORM                        */}
          {/* ======================================================== */}
          {mode === 'login' && (
            <>
              {loginError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs leading-relaxed animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Access Denied</p>
                    <p>{loginError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5" autoComplete="off">
                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="admin_official_email" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Admin Email
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('klubinternational@gmail.com');
                        setPassword('KSportsAdmin2026!Secure');
                      }}
                      className="text-[11px] text-[#ee7700] hover:text-[#d46500] font-semibold transition-colors focus:outline-none"
                    >
                      Fill Default
                    </button>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin_official_email"
                      name="admin_official_email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="klubinternational@gmail.com"
                      autoComplete="off"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ee7700] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="admin_official_key" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email || 'klubinternational@gmail.com');
                        setForgotError(null);
                        setMode('forgot-request');
                      }}
                      className="text-[11px] text-[#ee7700] hover:text-[#d46500] font-semibold transition-colors hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin_official_key"
                      name="admin_official_key"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#ee7700] focus:bg-white transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Security info */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ee7700] shrink-0" />
                  <span>Login rate-limiting and activity auditing are active.</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 px-4 rounded-lg bg-[#ee7700] hover:bg-[#d46500] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <span>Sign In to Dashboard</span>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: FORGOT PASSWORD - REQUEST OTP                    */}
          {/* ======================================================== */}
          {mode === 'forgot-request' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setForgotError(null);
                    setMode('login');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-3"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>

                <h3 className="text-lg font-bold text-stone-900">
                  Reset Administrator Password
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Enter your verified administrator email. We will send a 6-digit one-time verification code (OTP) to authorize changing your password.
                </p>
              </div>

              {forgotError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="forgotEmail" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Administrator Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="forgotEmail"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="klubinternational@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ee7700] focus:bg-white transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Official recovery inbox: <strong className="text-stone-600">klubinternational@gmail.com</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 px-4 rounded-lg bg-[#ee7700] hover:bg-[#d46500] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP Verification Code...</span>
                    </>
                  ) : (
                    <span>Send OTP Verification Code</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: FORGOT PASSWORD - VERIFY OTP & ENTER NEW PASSWORD*/}
          {/* ======================================================== */}
          {mode === 'forgot-verify' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setForgotError(null);
                    setMode('forgot-request');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-3"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <h3 className="text-lg font-bold text-stone-900">
                  Verify OTP &amp; Set New Password
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  We sent a 6-digit verification code to{' '}
                  <strong className="text-stone-800">{forgotEmail}</strong>. Please enter the OTP code and your new password below:
                </p>
              </div>

              {forgotError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs leading-snug">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{forgotSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                {/* OTP Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      6-Digit OTP Verification Code <span className="text-[#ee7700]">*</span>
                    </label>
                    <button
                      type="button"
                      disabled={isSendingOtp}
                      onClick={() => handleSendOtp()}
                      className="text-[11px] font-semibold text-[#ee7700] hover:text-[#d46500] hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                      <span>Resend OTP</span>
                    </button>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="1 2 3 4 5 6"
                    className="w-full text-center tracking-[0.45em] font-mono text-xl sm:text-2xl font-black py-2.5 bg-orange-50/50 border border-orange-300 rounded-lg text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#ee7700] focus:bg-white transition-all"
                  />
                  <p className="text-[10px] text-stone-400 mt-1 text-center">
                    Check your spam or junk folder if not visible within 60 seconds.
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPass" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    New Administrator Password <span className="text-[#ee7700]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="newPass"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ee7700] focus:bg-white transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmPass" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Confirm New Password <span className="text-[#ee7700]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="confirmPass"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#ee7700] focus:bg-white transition-all font-sans"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="w-full py-3 px-4 rounded-lg bg-[#ee7700] hover:bg-[#d46500] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Administrator Password...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Set New Password</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: FORGOT PASSWORD - SUCCESS CONFIRMATION           */}
          {/* ======================================================== */}
          {mode === 'forgot-success' && (
            <div className="text-center space-y-4 py-3 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Password Reset Successful!
                </h3>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Your administrator password has been updated securely. You can now sign in to the administration portal using your new password.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(forgotEmail);
                    setPassword('');
                    setMode('login');
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-[#ee7700] hover:bg-[#d46500] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Sign In</span>
                </button>
              </div>
            </div>
          )}

        </div>

        <p className="text-center text-xs text-stone-500 mt-6">
          KSports Internal Administration System © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
