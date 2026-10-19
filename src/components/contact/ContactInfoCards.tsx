'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Copy, Check, ArrowUpRight, Sparkles } from 'lucide-react';

interface ContactDetails {
  email: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  workingHours?: string;
}

interface Props {
  contact: ContactDetails;
}

export default function ContactInfoCards({ contact }: Props) {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const copyToClipboard = (text: string, field: 'email' | 'phone') => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2200);
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Availability Badge */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Corporate Desk Active · Avg. Response &lt; 24h</span>
      </div>

      {/* Corporate Email Card */}
      <div className="group relative p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/90 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 text-brand-orange group-hover:bg-brand-orange group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
              <Mail className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Corporate Email
              </h4>
              <a
                href={`mailto:${contact.email}`}
                className="text-base font-bold text-stone-900 group-hover:text-brand-orange transition-colors inline-block mt-0.5"
              >
                {contact.email}
              </a>
              <p className="text-xs text-stone-500 mt-0.5">Enquiry response within 24–48 hours</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(contact.email, 'email')}
            title="Copy email address"
            className="p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-all shrink-0 active:scale-95"
          >
            {copiedField === 'email' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Direct Telephone Card */}
      <div className="group relative p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/90 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 text-brand-orange group-hover:bg-brand-orange group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
              <Phone className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Direct Telephone
              </h4>
              <a
                href={`tel:${contact.phone}`}
                className="text-base font-bold text-stone-900 group-hover:text-brand-orange transition-colors inline-block mt-0.5"
              >
                {contact.phone}
              </a>
              <p className="text-xs text-stone-500 mt-0.5">Direct institutional desk line</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(contact.phone, 'phone')}
            title="Copy phone number"
            className="p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-all shrink-0 active:scale-95"
          >
            {copiedField === 'phone' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Manufacturing Operations Card */}
      <div className="group relative p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/90 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 text-brand-orange group-hover:bg-brand-orange group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
            <MapPin className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Manufacturing Operations
            </h4>
            <p className="text-sm font-semibold text-stone-900 mt-0.5 leading-relaxed">{contact.address}</p>
          </div>
        </div>
      </div>

      {/* Operating Hours Card */}
      <div className="group relative p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/90 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 text-brand-orange group-hover:bg-brand-orange group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
            <Clock className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Operating Hours
            </h4>
            <p className="text-sm font-semibold text-stone-900 mt-0.5">{contact.workingHours}</p>
          </div>
        </div>
      </div>

      {/* Quality Commitment & NDA Notice */}
      <div className="relative p-5 rounded-2xl bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 border border-stone-200 shadow-sm space-y-2 text-xs text-stone-600 overflow-hidden">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <div className="w-5 h-5 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="uppercase tracking-wider text-[11px]">Strict NDA & Confidentiality Guaranteed</span>
        </div>
        <p className="leading-relaxed text-stone-600 pl-7">
          All specifications, technical tender documents, and commercial supply matrices shared with Klub Sports remain strictly confidential under standard non-disclosure terms.
        </p>
      </div>
    </div>
  );
}
