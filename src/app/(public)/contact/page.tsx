import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/models/Category';
import { SiteSettings } from '@/models/SiteSettings';
import EnquiryForm from '@/components/forms/EnquiryForm';
import ContactFaq from '@/components/contact/ContactFaq';
import FlowingTitle from '@/components/contact/FlowingTitle';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Contact & Business Enquiries | KSports',
  description:
    'Contact the KSports corporate desk for bulk institutional procurement, athletic footwear supply tenders, wholesale distribution, and custom batch scheduling.',
};

interface Props {
  searchParams: {
    category?: string;
    product?: string;
  };
}

export default async function ContactPage({ searchParams }: Props) {
  let serializedCategories: any[] = [];
  let contact = {
    email: 'info@ksports.co.in',
    phone: '+91 88863 03030',
    address: 'KSports Manufacturing Facilities, Industrial Footwear Hub, India',
    workingHours: 'Monday – Saturday: 9:00 AM – 6:00 PM IST',
  };

  try {
    await connectToDatabase();
    const [categories, settings] = await Promise.all([
      Category.find({ isPublished: true }).sort({ sortOrder: 1, name: 1 }).lean(),
      SiteSettings.findOne().lean(),
    ]);
    serializedCategories = JSON.parse(JSON.stringify(categories));
    if (settings?.contactDetails) {
      let email = settings.contactDetails.email || contact.email;
      let phone = settings.contactDetails.phone || contact.phone;
      let address = settings.contactDetails.address || contact.address;

      // Sanitize any legacy strings
      if (email.includes('klubsports.com')) email = 'info@ksports.co.in';
      if (phone.includes('98765')) phone = '+91 88863 03030';
      if (address.includes('Klub Sports')) address = address.replace(/Klub Sports/g, 'KSports');

      contact = {
        email,
        phone,
        address,
        workingHours: settings.contactDetails.workingHours || contact.workingHours,
      };
    }
  } catch (error) {
    console.warn('Database connection unavailable for contact page, using fallback defaults:', error);
    serializedCategories = [
      { _id: 'cat-1', name: 'Running Shoes', slug: 'running-shoes' },
      { _id: 'cat-2', name: 'Marathon Shoes', slug: 'marathon-shoes' },
      { _id: 'cat-3', name: 'Training & Gym', slug: 'training-gym' },
      { _id: 'cat-4', name: 'Cricket Spikes', slug: 'cricket-shoes' },
      { _id: 'cat-5', name: 'School Sports Shoes', slug: 'school-sports' },
      { _id: 'cat-6', name: 'Badminton & Indoor Court', slug: 'badminton-indoor' },
      { _id: 'cat-7', name: 'Commercial & Institutional Bulk', slug: 'bulk-institutional' },
    ];
  }

  return (
    <div className="bg-white min-h-screen font-inter">
      {/* Main 2-Column Section */}
      <section className="pt-28 sm:pt-36 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Institutional Desk with Flowing Words Animation */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange block">
                INSTITUTIONAL DESK
              </span>

              {/* Our Actual Heading with Flowing Words Blur/Slide Animation */}
              <FlowingTitle />

              <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                Connect with our commercial partnerships team for institutional supplies, academy team programs, sports tenders, and regional distribution channels.
              </p>
            </div>

            {/* Verified Contact Details Cards in Clean Rounded Style */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f5f5f5] hover:bg-[#ededed] transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    CORPORATE EMAIL
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

              {/* Direct WhatsApp Chat Card */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-50 transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.16c-.24.68-1.2 1.25-1.66 1.28-.43.03-.98.15-3.19-.77-2.27-.94-3.71-3.26-3.83-3.41-.11-.15-.91-1.21-.91-2.31 0-1.1.58-1.64.78-1.87.2-.23.44-.29.59-.29.15 0 .3 0 .43.01.14.01.32-.05.5.38.19.45.64 1.57.7 1.69.06.12.1.26.02.42-.08.15-.12.25-.24.39-.12.14-.25.31-.36.42-.12.12-.24.25-.1.5.14.24.63 1.04 1.35 1.68.93.83 1.71 1.08 1.96 1.2.24.12.39.1.53-.06.15-.17.63-.73.8-.98.17-.25.35-.21.58-.12.24.08 1.52.72 1.78.85.26.13.43.2.5.31.06.12.06.69-.18 1.37z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      WHATSAPP DIRECT CHAT
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Instant
                    </span>
                  </div>
                  <a
                    href="https://wa.me/918886303030?text=Hello%20KSports!%20I%20would%20like%20to%20enquire%20about%20athletic%20footwear%20and%20bulk%20institutional%20orders."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-stone-900 hover:text-emerald-700 transition-colors inline-block mt-0.5"
                  >
                    +91 88863 03030
                  </a>
                  <p className="text-xs text-stone-500 mt-0.5">Direct 24/7 institutional WhatsApp line</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f5f5f5] hover:bg-[#ededed] transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    DIRECT TELEPHONE
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

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f5f5f5] hover:bg-[#ededed] transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    MANUFACTURING OPERATIONS
                  </h4>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5 leading-relaxed">{contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f5f5f5] hover:bg-[#ededed] transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    OPERATING HOURS
                  </h4>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{contact.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Quality Commitment Notice */}
            <div className="p-5 rounded-2xl bg-[#f5f5f5] space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>Confidential Business Review</span>
              </div>
              <p className="leading-relaxed">
                All specifications, technical tender documents, and commercial supply matrices shared with KSports remain strictly confidential.
              </p>
            </div>
          </div>

          {/* Right Column: Send Requirement Details Card with Sneako Pill Inputs */}
          <div className="lg:col-span-7">
            <div className="rounded-[32px] sm:rounded-[36px] bg-white border border-stone-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-7 sm:p-10">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-[28px] font-bold text-stone-950 tracking-tight">
                  Send Requirement Details
                </h3>
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
      </section>

      {/* FAQ Section: Clear the confusions. */}
      <section className="border-t border-stone-100 bg-[#fafafa]">
        <ContactFaq />
      </section>
    </div>
  );
}
