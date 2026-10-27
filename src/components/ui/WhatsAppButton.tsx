'use client';

import React, { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '918886303030';
const DEFAULT_MESSAGE = 'Hello KSports! I would like to enquire about athletic footwear and bulk institutional orders.';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Automatically show the greeting badge after 2.5s to invite interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 select-none pointer-events-auto">
      {/* Speech Bubble / Greeting Card */}
      {showTooltip && (
        <div className="relative mb-1 bg-white/95 backdrop-blur-md text-stone-900 px-4 py-3 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.14)] border border-stone-200/90 text-xs max-w-[230px] animate-in fade-in slide-in-from-bottom-2 duration-300 hidden sm:flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
              setHasInteracted(true);
            }}
            aria-label="Close message"
            className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-colors"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-stone-900 tracking-tight">KSports Support</span>
          </div>

          <p className="text-[11px] text-stone-600 leading-snug">
            Need quick details on models or bulk supply? Chat with us directly on WhatsApp!
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setHasInteracted(true)}
            className="mt-0.5 inline-flex items-center justify-center gap-1 w-full py-1.5 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-[11px] shadow-xs transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Start Chat</span>
            <span className="text-xs">→</span>
          </a>
        </div>
      )}

      {/* Main WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with KSports on WhatsApp (+91 88863 03030)"
        onMouseEnter={() => setShowTooltip(true)}
        onClick={() => setHasInteracted(true)}
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] hover:shadow-[0_14px_36px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
      >
        {/* Pulsing Ambient Wave Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none group-hover:opacity-60 duration-1000" />
        
        {/* Secondary soft glow */}
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* WhatsApp Official SVG Logo */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform duration-300 group-hover:rotate-6"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Small badge dot for mobile */}
        <span className="sm:hidden absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white"></span>
      </a>
    </div>
  );
}
