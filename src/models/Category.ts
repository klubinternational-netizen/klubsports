import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  imageAlt?: string;
  sortOrder: number;
  isPublished: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    imageAlt: {
      type: String,
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
