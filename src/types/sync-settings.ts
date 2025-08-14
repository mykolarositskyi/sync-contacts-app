// Core sync settings types
export interface SyncSettings {
  id: string;
  customerId: string;
  autoSync: boolean;
  syncFrequency: 'realtime' | '5min' | '1hour' | 'daily';
  conflictResolution: 'last-write-wins' | 'manual' | 'keep-local';
  syncDirection: 'bidirectional' | 'inbound-only' | 'outbound-only';
  webhookNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Form types for creating/updating sync settings
export type CreateSyncSettingsData = Omit<SyncSettings, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSyncSettingsData = Partial<Omit<SyncSettings, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>>;

// Default values
export const defaultSyncSettings: Omit<SyncSettings, 'id' | 'customerId' | 'createdAt' | 'updatedAt'> = {
  autoSync: true,
  syncFrequency: 'realtime',
  conflictResolution: 'last-write-wins',
  syncDirection: 'bidirectional',
  webhookNotifications: true
};

// Sync activity tracking
export interface SyncActivity {
  id: string;
  timestamp: Date;
  type: 'create' | 'update' | 'delete' | 'sync';
  status: 'success' | 'error' | 'pending';
  integration: string;
  contactId?: string;
  details: string;
  errorMessage?: string;
}

// Sync statistics
export interface SyncStats {
  totalContacts: number;
  lastSyncAt: Date;
  syncStatus: 'in-sync' | 'out-of-sync' | 'error';
  pendingChanges: number;
  failedSyncs: number;
  integrations: {
    hubspot: { status: 'connected' | 'disconnected' | 'error'; lastSync: Date };
    pipedrive: { status: 'connected' | 'disconnected' | 'error'; lastSync: Date };
  };
}

// API response types
export interface SyncSettingsResponse {
  syncSettings: SyncSettings;
}

export interface SyncStatsResponse {
  syncStats: SyncStats;
}

export interface SyncActivityResponse {
  activities: SyncActivity[];
}
