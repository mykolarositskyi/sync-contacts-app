// Core contact types
export type PlatformType = 'hubspot' | 'pipedrive';

export interface Integration {
  type: PlatformType;
  externalId: string;
  accountId?: string;
  externalCreatedAt: Date;
  externalUpdatedAt: Date;
  lastSyncedAt?: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  pronouns: string;
  customerId: string;
  integrations: Integration[];
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface ContactsResponse {
  contacts: Contact[];
}

export interface ContactResponse {
  contact: Contact;
}

// Form types for creating/updating contacts
export type CreateContactData = Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'customerId' | 'integrations'>;
export type UpdateContactData = Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>>;

// Contact list item type (for table display)
export interface ContactListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  pronouns: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contact search and filter types
export interface ContactFilters {
  search?: string;
  platform?: PlatformType;
  hasIntegration?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface ContactSortOptions {
  field: keyof Contact;
  direction: 'asc' | 'desc';
}