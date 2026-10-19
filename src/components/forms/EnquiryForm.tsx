'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { publicEnquirySchema, PublicEnquiryInput } from '@/lib/validations/enquiry';

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: CategoryOption[];
  initialCategory?: string;
  initialProduct?: string;
}

export default function EnquiryForm({
  categories,
  initialCategory = '',
  initialProduct = '',
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const defaultCategoryObj = categories.find((c) => c.slug === initialCategory);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublicEnquiryInput>({
    resolver: zodResolver(publicEnquirySchema),
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      categoryId: defaultCategoryObj?._id || '',
      categoryName: defaultCategoryObj?.name || '',
      message: initialProduct
        ? `We are interested in discussing institutional supply for: ${initialProduct}.\n\nRequired Estimated Quantity:\nTarget Timeline:\nDelivery State / Location:`
        : '',
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/contact',
      honeypot: '',
    },
  });

  const onSubmit = async (data: PublicEnquiryInput) => {
    setServerError(null);
    try {
      const cat = categories.find((c) => c._id === data.categoryId);
      const payload = {
        ...data,
        categoryName: cat?.name || '',
      };

      const res = await fetch('/api/public/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit enquiry.');
      }

      setIsSuccess(true);
      setSuccessMessage(json.message || 'Your business enquiry has been successfully submitted.');
      reset();
    } catch (err: any) {
      setServerError(err.message || 'An error occurred while submitting your message.');
    }
  };

  if (isSuccess) {
    return (
      <div className="font-inter bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-bold text-emerald-950">Business Enquiry Received</h3>
        <p className="text-sm text-emerald-800 mt-2 max-w-md mx-auto leading-relaxed">
          {successMessage}
        </p>
        <p className="text-xs text-emerald-700 mt-3">
          Our corporate accounts team typically responds within 24 to 48 business hours.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#005eff] hover:bg-[#004cdb] transition-all shadow-md"
          >
            Submit Another Requirement
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-inter space-y-5">
      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Submission Failed</p>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Hidden Honeypot Field */}
      <div className="hidden" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
            Full Name <span className="text-[#005eff]">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Rajesh Sharma"
            {...register('name')}
            className={`w-full px-4 py-3.5 text-sm bg-[#f5f5f5] rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#005eff] focus:bg-white transition-all ${
              errors.name ? 'ring-2 ring-red-400 bg-red-50/20' : ''
            }`}
          />
          {errors.name && <p className="text-[11px] text-red-500 mt-1 pl-1">{errors.name.message}</p>}
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
            Company / Academy / Institution
          </label>
          <input
            id="companyName"
            type="text"
            placeholder="e.g. Apex Sports Academy"
            {...register('companyName')}
            className="w-full px-4 py-3.5 text-sm bg-[#f5f5f5] rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#005eff] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Official Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
            Official Email <span className="text-[#005eff]">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="rajesh@company.com"
            {...register('email')}
            className={`w-full px-4 py-3.5 text-sm bg-[#f5f5f5] rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#005eff] focus:bg-white transition-all ${
              errors.email ? 'ring-2 ring-red-400 bg-red-50/20' : ''
            }`}
          />
          {errors.email && <p className="text-[11px] text-red-500 mt-1 pl-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
            Phone / Mobile Number <span className="text-[#005eff]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register('phone')}
            className={`w-full px-4 py-3.5 text-sm bg-[#f5f5f5] rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#005eff] focus:bg-white transition-all ${
              errors.phone ? 'ring-2 ring-red-400 bg-red-50/20' : ''
            }`}
          />
          {errors.phone && <p className="text-[11px] text-red-500 mt-1 pl-1">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Category selection */}
      <div>
        <label htmlFor="categoryId" className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
          Interested Footwear Discipline / Category
        </label>
        <select
          id="categoryId"
          {...register('categoryId')}
          className="w-full px-4 py-3.5 text-sm bg-[#f5f5f5] rounded-2xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#005eff] focus:bg-white transition-all"
        >
          <option value="">Select Category (or General Corporate Enquiry)</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wider">
          Requirement Details & Estimated Volume <span className="text-[#005eff]">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Please describe your requirements, approximate quantities, target delivery timelines, or specific technical criteria..."
          {...register('message')}
          className={`w-full px-4 py-3.5 text-sm bg-[#f5f5f5] rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#005eff] focus:bg-white transition-all leading-relaxed ${
            errors.message ? 'ring-2 ring-red-400 bg-red-50/20' : ''
          }`}
        />
        {errors.message && <p className="text-[11px] text-red-500 mt-1 pl-1">{errors.message.message}</p>}
      </div>

      {/* Privacy Notice */}
      <div className="text-[11px] text-stone-500 leading-normal pl-1">
        By submitting this form, you acknowledge that your contact details will be used exclusively by KSports corporate representatives to address your enquiry. We respect your confidentiality.
      </div>

      {/* Submit Button: Exact Sneako Pill with Our Text */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 text-sm font-semibold text-white bg-[#005eff] hover:bg-[#004cdb] active:scale-[0.98] rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Submit Business Enquiry</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
