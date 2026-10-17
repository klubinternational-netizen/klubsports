import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  categoryId: Types.ObjectId;
  shortDescription: string;
  description: string;
  features: string[];
  images: IProductImage[];
  isPublished: boolean;
  sortOrder: number;
  seo?: {
    title?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
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

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
