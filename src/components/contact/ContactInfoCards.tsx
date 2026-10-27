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

      {/* WhatsApp Direct Chat Card */}
      <div className="group relative p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-emerald-200/80 shadow-sm hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  WhatsApp Support
                </h4>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wide">
                  Instant
                </span>
              </div>
              <a
                href="https://wa.me/918886303030?text=Hello%20KSports!%20I%20would%20like%20to%20enquire%20about%20athletic%20footwear%20and%20bulk%20institutional%20orders."
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-stone-900 group-hover:text-emerald-600 transition-colors inline-flex items-center gap-1 mt-0.5"
              >
                <span>+91 88863 03030</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </a>
              <p className="text-xs text-stone-500 mt-0.5">Direct chat for specs &amp; bulk supply</p>
            </div>
          </div>

          <a
            href="https://wa.me/918886303030?text=Hello%20KSports!%20I%20would%20like%20to%20enquire%20about%20athletic%20footwear%20and%20bulk%20institutional%20orders."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#25D366] text-emerald-700 hover:text-white font-bold text-xs transition-all shrink-0 active:scale-95 shadow-2xs border border-emerald-200 hover:border-[#25D366]"
          >
            Chat Now
          </a>
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
          All specifications, technical tender documents, and commercial supply matrices shared with KSports remain strictly confidential under standard non-disclosure terms.
        </p>
      </div>
    </div>
  );
}
