import { BaseWebhookEvent, ContactWebhookEventType } from "./webhooks";

export interface PipedriveContactEvent extends BaseWebhookEvent {
  eventType: ContactWebhookEventType;
  externalContactId: string;
  customerId: string;
  data?: PipedriveContactData;
}

export interface PipedriveContactData {
  id: string;
  name: string;
  uri: string;
  createdTime: string; // ISO date string
  updatedTime: string; // ISO date string
  fields: PipedriveContactFields;
  unifiedFields: PipedriveContactFields;
  rawFields: PipedriveContactRawFields;
}

export interface PipedriveContactFields {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
  companyId: number;
  ownerId: number;
  createdTime: string;
  updatedTime: string;
  lastActivityTime: string | null;
  emails: PipedriveEmailEntry[];
  phones: PipedrivePhoneEntry[];
}

export interface PipedriveEmailEntry {
  value: string;
  type?: string;
}

export interface PipedrivePhoneEntry {
  value: string;
  type?: string;
}

export interface PipedriveContactRawFields {
  id: number;
  owner_id: number;
  org_id: number;
  name: string;
  first_name: string;
  last_name: string;
  open_deals_count: number;
  related_open_deals_count: number;
  closed_deals_count: number;
  related_closed_deals_count: number;
  participant_open_deals_count: number;
  participant_closed_deals_count: number;
  email_messages_count: number;
  activities_count: number;
  done_activities_count: number;
  undone_activities_count: number;
  files_count: number;
  notes_count: number;
  followers_count: number;
  won_deals_count: number;
  related_won_deals_count: number;
  lost_deals_count: number;
  related_lost_deals_count: number;
  active_flag: boolean;
  phone: string;
  email: string;
  first_char: string;
  update_time: string;
  delete_time: string | null;
  add_time: string;
  visible_to: string;
  picture_id: number | null;
  next_activity_date: string | null;
  next_activity_time: string | null;
  next_activity_id: number | null;
  last_activity_id: number | null;
  last_activity_date: string | null;
  last_incoming_mail_time: string | null;
  last_outgoing_mail_time: string | null;
  label: number;
  label_ids: number[];
  im: { value: string; primary: boolean }[];
  postal_address: string | null;
  postal_address_lat: string | null;
  postal_address_long: string | null;
  postal_address_subpremise: string | null;
  postal_address_street_number: string | null;
  postal_address_route: string | null;
  postal_address_sublocality: string | null;
  postal_address_locality: string | null;
  postal_address_admin_area_level_1: string | null;
  postal_address_admin_area_level_2: string | null;
  postal_address_country: string | null;
  postal_address_postal_code: string | null;
  postal_address_formatted_address: string | null;
  notes: string | null;
  birthday: string | null;
  job_title: string | null;
  org_name: string;
  cc_email: string;
  primary_email: string;
  owner_name: string;
  company_id: number;
  phones: PipedrivePhoneEntry[];
  emails: PipedriveEmailEntry[];
}

// Pipedrive specific webhook metadata
export interface PipedriveWebhookMetadata {
  subscriptionId: number;
  eventType: string;
  occurredAt: number;
  objectId: number;
  objectType: string;
  changeSource: string;
  changeFlag: string;
}
