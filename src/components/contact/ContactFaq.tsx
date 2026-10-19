'use client';

import React, { useState } from 'react';
import { ChevronDown, Package, Ruler, Users, RefreshCw, Truck, ShieldCheck } from 'lucide-react';

interface FaqItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'ship',
    icon: <Truck className="w-5 h-5 text-red-500" />,
    question: 'Do you ship internationally?',
    answer:
      'Yep — we ship worldwide. Delivery times and shipping costs are calculated at checkout based on your location and institutional logistics requirements.',
  },
  {
    id: 'size',
    icon: <Ruler className="w-5 h-5 text-stone-700" />,
    question: 'How do I find the right size?',
    answer:
      'Our athletic silhouettes fit true to size. If you are between sizes or need extra forefoot clearance for intensive athletic training, we recommend sizing up a half size.',
  },
  {
    id: 'unisex',
    icon: <Users className="w-5 h-5 text-stone-700" />,
    question: 'Are your sneakers unisex?',
    answer:
      'Yes, all Klub Sports athletic footwear models are engineered with anatomical unisex biomechanics to support all male and female competitive athletes.',
  },
  {
    id: 'returns',
    icon: <RefreshCw className="w-5 h-5 text-stone-700" />,
    question: 'Can I return or exchange my order?',
    answer:
      'Yes, we offer hassle-free 14-day institutional inspection returns and exchanges on unworn pairs in original packaging.',
  },
  {
    id: 'track',
    icon: <Package className="w-5 h-5 text-stone-700" />,
    question: 'How can I track my order?',
    answer:
      'Once your consignment or evaluation sample pair dispatches from our manufacturing facility, you will receive instant real-time tracking credentials via email and WhatsApp.',
  },
  {
    id: 'authentic',
    icon: <ShieldCheck className="w-5 h-5 text-stone-700" />,
    question: 'Are the sneakers authentic?',
    answer:
      '100% authentic and engineered directly in our specialized sports footwear manufacturing facilities using certified high-grade polymers, carbon plates, and breathable uppers.',
  },
];

export default function ContactFaq() {
  const [openId, setOpenId] = useState<string | null>('ship');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto font-inter">
      <div className="text-center mb-10 sm:mb-12">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest block mb-2">
          Ask us
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight">
          Clear the confusions.
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-[#f5f5f5] hover:bg-[#ededed] transition-colors duration-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-2 rounded-xl bg-white shadow-xs">
                    {faq.icon}
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-stone-900 tracking-tight">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 transition-transform duration-300 shadow-xs ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4 text-stone-600" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed pl-16 sm:pl-20 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
