import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPage extends Document {
  key: string;
  title: string;
  sections: Record<string, any>;
  seo?: {
    title?: string;
    description?: string;
  };
  isPublished: boolean;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sections: {
      type: Schema.Types.Mixed,
      default: {},
    },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    isPublished: {
      type: Boolean,
      default: true,
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

export const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
