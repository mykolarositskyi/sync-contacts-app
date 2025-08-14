import mongoose, { Schema } from 'mongoose';
import type { SyncSettings } from '@/types/sync-settings';

// Re-export types for backward compatibility
export type { SyncSettings } from '@/types/sync-settings';

const syncSettingsSchema = new Schema<SyncSettings>({
  customerId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  autoSync: {
    type: Boolean,
    default: true
  },
  syncFrequency: {
    type: String,
    enum: ['realtime', '5min', '1hour', 'daily'],
    default: 'realtime'
  },
  conflictResolution: {
    type: String,
    enum: ['last-write-wins', 'manual', 'keep-local'],
    default: 'last-write-wins'
  },
  syncDirection: {
    type: String,
    enum: ['bidirectional', 'inbound-only', 'outbound-only'],
    default: 'bidirectional'
  },
  webhookNotifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const SyncSettingsModel = 
  mongoose.models.SyncSettings || mongoose.model<SyncSettings>('SyncSettings', syncSettingsSchema);
