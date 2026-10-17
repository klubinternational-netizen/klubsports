import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminActivityLog extends Document {
  adminId?: mongoose.Types.ObjectId;
  adminEmail: string;
  action: string;
  resourceType: 'PRODUCT' | 'CATEGORY' | 'PAGE' | 'SETTINGS' | 'ENQUIRY' | 'AUTH' | 'MEDIA';
  resourceId?: string;
  summary: string;
  timestamp: Date;
}

const AdminActivityLogSchema = new Schema<IAdminActivityLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ['PRODUCT', 'CATEGORY', 'PAGE', 'SETTINGS', 'ENQUIRY', 'AUTH', 'MEDIA'],
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

export const AdminActivityLog: Model<IAdminActivityLog> =
  mongoose.models.AdminActivityLog ||
  mongoose.model<IAdminActivityLog>('AdminActivityLog', AdminActivityLogSchema);
