import { PlatformType } from "@/types/contact";
import { HubspotContactEvent } from "./hubspot";
import { PipedriveContactEvent } from "./pipedrive";

export type ContactWebhookEventType = 'create-contact' | 'update-contact' | 'delete-contact' | 'create-contact-internal';

export type ContactWebhookBody = HubspotContactEvent | PipedriveContactEvent

export type ContactProvider = PlatformType;

// Common webhook event interface
export interface BaseWebhookEvent {
  eventType: ContactWebhookEventType;
  externalContactId: string;
  customerId: string;
  timestamp: Date;
  platform: ContactProvider;
  integrationMetadata: {
    id: string
    name: string
    key: string
  }
  internalContactId: string,
}

// Webhook processing result
export interface WebhookProcessingResult {
  success: boolean;
  contactId?: string;
  message: string;
  error?: string;
  processedAt: Date;
}

// Webhook validation result
export interface WebhookValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}