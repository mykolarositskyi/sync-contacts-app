import { BaseWebhookEvent, ContactWebhookEventType } from "./webhooks";

export interface HubspotContactEvent extends BaseWebhookEvent {
  eventType: ContactWebhookEventType;
  externalContactId: string;
  customerId: string;
  data?: HubspotContactData;
}

export interface HubspotContactData {
  id: string;
  name: string;
  createdTime: string; // ISO date
  updatedTime: string; // ISO date
  uri: string;
  fields: HubspotContactFields;
  unifiedFields: HubspotContactFields;
  rawFields: Record<string, string | null>;
}

export interface HubspotContactFields {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
  primaryAddress: HubspotAddress | null;
  stage: string;
  companyName: string | null;
  ownerId: string;
  jobTitle: string;
  source: string;
  createdTime: string; // ISO date
  createdBy: string;
  updatedTime: string; // ISO date
  updatedBy: string;
  emails: HubspotEmail[];
  phones: HubspotPhone[];
  addresses: HubspotAddress[];
}

export interface HubspotEmail {
  type?: string;
  value: string;
}

export interface HubspotPhone {
  type?: string;
  value: string;
}

export interface HubspotAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// HubSpot specific webhook metadata
export interface HubspotWebhookMetadata {
  subscriptionType: string;
  subscriptionId: number;
  portalId: number;
  appId: number;
  occurredAt: number;
  objectId: number;
  changeSource: string;
  changeFlag: string;
}
