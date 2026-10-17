import mongoose, { Schema, Document, Model } from 'mongoose';

export type EnquiryStatus = 'New' | 'In Progress' | 'Closed';

export interface IEnquiry extends Document {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  categoryId?: mongoose.Types.ObjectId;
  categoryName?: string;
  message: string;
  status: EnquiryStatus;
  internalNotes?: string;
  sourcePage?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    categoryName: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Closed'],
      default: 'New',
      index: true,
    },
    internalNotes: {
      type: String,
      default: '',
    },
    sourcePage: {
      type: String,
      default: '/contact',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
