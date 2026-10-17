import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/connection';
import { Page } from '@/models/Page';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Privacy Policy | Klub Sports',
  description: 'Official privacy policy and client data protection statement for Klub Sports.',
};

export default async function PrivacyPolicyPage() {
  await connectToDatabase();
  const page = await Page.findOne({ key: 'privacy', isPublished: true }).lean();
  const content = page?.sections?.content;

  return (
    <div className="bg-stone-50 min-h-screen py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-brand-orange transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 sm:p-12">
          <div className="flex items-center gap-3 text-brand-orange mb-4">
            <Shield className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Corporate Governance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-stone-700">
            <p>
              <strong>Klub Sports</strong> is committed to preserving the privacy and data integrity of all corporate clients, institutional buyers, and business partners.
            </p>

            <h3 className="text-lg font-bold text-stone-900 mt-6">1. Information Collection</h3>
            <p>
              When you submit a business enquiry or contact our institutional desk, we collect essential operational details including your name, company/academy name, email address, telephone contact, product categories of interest, and specific message requirements.
            </p>

            <h3 className="text-lg font-bold text-stone-900 mt-6">2. Utilization of Data</h3>
            <p>
              Information supplied is used strictly for communicating about bulk procurement, manufacturing feasibility, specifications, quotes, and delivery timelines. We do not engage in unauthorized third-party marketing, retail email marketing lists, or data reselling.
            </p>

            <h3 className="text-lg font-bold text-stone-900 mt-6">3. Security Standards</h3>
            <p>
              Our database infrastructure is hosted with modern cloud encryption standards. Administrative access is restricted to verified personnel via multi-layer authentication and activity auditing.
            </p>

            <h3 className="text-lg font-bold text-stone-900 mt-6">4. Contacting Our Data Officer</h3>
            <p>
              For questions regarding our privacy practices or to request data modification, contact us at <a href="mailto:info@klubsports.com" className="text-brand-orange font-semibold hover:underline">info@klubsports.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
