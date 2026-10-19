'use client';

import React, { useEffect, useState } from 'react';

export default function FlowingTitle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const words = [
    { text: 'BUSINESS', isOrange: false },
    { text: '&', isOrange: false },
    { text: 'BULK', isOrange: false },
    { text: 'ENQUIRIES', isOrange: true },
  ];

  return (
    <h1 className="font-inter text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight mt-1.5 leading-[1.08] flex flex-wrap gap-x-[0.25em]">
      {words.map((w, idx) => (
        <span
          key={idx}
          className={`inline-block will-change-transform will-change-filter transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            w.isOrange ? 'text-brand-orange' : 'text-stone-950'
          }`}
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? 'blur(0px)' : 'blur(16px)',
            transform: mounted ? 'translateX(0px)' : 'translateX(45px)',
            transitionDelay: `${idx * 120}ms`,
          }}
        >
          {w.text}
        </span>
      ))}
    </h1>
  );
}
