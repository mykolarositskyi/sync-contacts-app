import type { Contact, Integration } from '@/types/contact';
import mongoose, { Schema } from 'mongoose';

export type { Contact, Integration, PlatformType } from '@/types/contact';

const integrationSchema = new Schema<Integration>(
  {
    type: {
      type: String,
      enum: ['hubspot', 'pipedrive'],
      required: true,
      trim: true,
    },
    externalId: {
      type: String,
      required: true,
      trim: true,
    },
    accountId: {
      type: String,
      trim: true,
    },
    lastSyncedAt: Date,
    externalCreatedAt: Date,
    externalUpdatedAt: Date,
  },
  { _id: false } // don't create separate _id for each integration subdoc
);

const contactSchema = new Schema<Contact>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    pronouns: {
      type: String,
      required: true,
      trim: true,
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
    },
    integrations: [integrationSchema],
  },
  {
    timestamps: true,
  }
);

// Existing compound index
contactSchema.index({ customerId: 1, createdAt: -1 });

// Index for fast webhook/integration lookups
contactSchema.index({ 'integrations.type': 1, 'integrations.externalId': 1 });

export const ContactModel =
  mongoose.models.Contact || mongoose.model<Contact>('Contact', contactSchema);
