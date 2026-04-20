import mongoose, { Document, Schema } from 'mongoose';
import { LeadStatus, LeadSource, PropertyType } from '@crm/shared';

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  budget: number;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  statusUpdatedAt?: Date;
  lastContactedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, default: undefined },
    budget: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      required: true,
      enum: Object.values(PropertyType),
    },
    source: {
      type: String,
      required: true,
      enum: Object.values(LeadSource),
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(LeadStatus),
      default: LeadStatus.New,
    },
    statusUpdatedAt: { type: Date },
    lastContactedAt: { type: Date },
  },
  { timestamps: true }
);

LeadSchema.index({ name: 'text', phone: 'text' });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
