import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { SiteSettings } from '@/models/SiteSettings';
import EnquiryForm from '@/components/forms/EnquiryForm';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Contact & Business Enquiries | Klub Sports',
  description:
    'Contact the Klub Sports corporate desk for bulk institutional procurement, athletic footwear supply tenders, wholesale distribution, and custom batch scheduling.',
};

interface Props {
  searchParams: {
    category?: string;
    product?: string;
  };
}

export default async function ContactPage({ searchParams }: Props) {
  await connectToDatabase();
  const [categories, settings] = await Promise.all([
    Category.find({ isPublished: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    SiteSettings.findOne().lean(),
  ]);

  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const contact = settings?.contactDetails || {
    email: 'info@klubsports.com',
    phone: '+91 98765 43210',
    address: 'Klub Sports Manufacturing Facilities, Industrial Footwear Hub, India',
    workingHours: 'Monday – Saturday: 9:00 AM – 6:00 PM IST',
  };

  return (
    <div className="bg-stone-50 min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Corporate Desk Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                Institutional Desk
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-stone-950 uppercase tracking-tight mt-1.5">
                Business & Bulk Enquiries
              </h1>
              <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                Connect with our commercial partnerships team for institutional supplies, academy team programs, sports tenders, and regional distribution channels.
              </p>
            </div>

            {/* Verified Contact Details Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Corporate Email
                  </h4>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-base font-bold text-stone-900 hover:text-brand-orange transition-colors"
                  >
                    {contact.email}
                  </a>
                  <p className="text-xs text-stone-500 mt-0.5">Enquiry response within 24–48 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Direct Telephone
                  </h4>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-base font-bold text-stone-900 hover:text-brand-orange transition-colors"
                  >
                    {contact.phone}
                  </a>
                  <p className="text-xs text-stone-500 mt-0.5">Direct institutional desk line</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Manufacturing Operations
                  </h4>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Operating Hours
                  </h4>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{contact.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Quality Commitment Notice */}
            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>Confidential Business Review</span>
              </div>
              <p>
                All specifications, technical tender documents, and commercial supply matrices shared with Klub Sports remain strictly confidential.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-premium p-6 sm:p-10">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-stone-900">Send Requirement Details</h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Complete the fields below to submit your institutional requirement directly to our corporate desk.
                </p>
              </div>

              <EnquiryForm
                categories={serializedCategories}
                initialCategory={searchParams.category}
                initialProduct={searchParams.product}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
