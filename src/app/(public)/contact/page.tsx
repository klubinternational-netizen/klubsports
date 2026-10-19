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
    phone: '+91 98765 43210',
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
      contact = {
        email: settings.contactDetails.email || contact.email,
        phone: settings.contactDetails.phone || contact.phone,
        address: settings.contactDetails.address || contact.address,
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
