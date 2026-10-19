import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  brandName: string;
  tagline: string;
  logoAsset: {
    horizontal: string;
    stacked: string;
    icon: string;
    wordmark: string;
  };
  contactDetails: {
    email: string;
    phone: string;
    secondaryPhone?: string;
    address: string;
    workingHours?: string;
  };
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  footerContent: {
    copyright: string;
    description: string;
  };
  defaultSeo: {
    title: string;
    description: string;
  };
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    brandName: {
      type: String,
      default: 'KSports',
      required: true,
    },
    tagline: {
      type: String,
      default: 'Shoes For Every Sport',
    },
    logoAsset: {
      horizontal: { type: String, default: '/brand/logo-horizontal.png' },
      stacked: { type: String, default: '/brand/logo-stacked.png' },
      icon: { type: String, default: '/brand/logo-icon.png' },
      wordmark: { type: String, default: '/brand/logo-wordmark.png' },
    },
    contactDetails: {
      email: { type: String, default: 'info@ksports.co.in' },
      phone: { type: String, default: '+91 98765 43210' },
      secondaryPhone: { type: String, default: '' },
      address: { type: String, default: 'KSports Manufacturing Facilities, India' },
      workingHours: { type: String, default: 'Monday – Saturday: 9:00 AM – 6:00 PM IST' },
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    footerContent: {
      copyright: { type: String, default: '© 2026 KSports. All rights reserved.' },
      description: {
        type: String,
        default: 'Premium sports footwear manufacturer engineered for peak athletic performance and institutional procurement.',
      },
    },
    defaultSeo: {
      title: { type: String, default: 'KSports | Premium Sports Footwear Manufacturer' },
      description: {
        type: String,
        default: 'Official manufacturer and institutional partner for premium sports footwear across India.',
      },
    },
    updatedBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
