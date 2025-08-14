import { ContactProvider, ContactWebhookBody, WebhookProcessingResult } from '@/types/webhooks';

export const VALID_INTEGRATION_KEYS: ContactProvider[] = ['hubspot', 'pipedrive'];
export const DEFAULT_PRONOUNS = 'N/A';

/**
 * Validates if a string is a valid integration key
 * @param key - The integration key to validate
 * @returns True if the key is valid, false otherwise
 */
export const isValidIntegrationKey = (key: string): key is ContactProvider => {
  return VALID_INTEGRATION_KEYS.includes(key as ContactProvider);
};

/**
 * Validates the webhook body data for required fields and structure
 * @param body - The webhook body to validate
 * @returns Error message if validation fails, null if validation passes
 */
export const validateWebhookBody = (body: ContactWebhookBody): string | null => {
  if (!body.data) {
    return 'No data found in webhook body';
  }

  if (!body.integrationMetadata?.key || !isValidIntegrationKey(body.integrationMetadata.key)) {
    return `Invalid integration key: ${body.integrationMetadata?.key}`;
  }

  if (!body.data.fields?.primaryEmail) {
    return 'Primary email is required';
  }

  if (!body.data.fields?.fullName) {
    return 'Full name is required';
  }

  return null;
};

/**
 * Validates integration metadata specifically
 * @param body - The webhook body to validate
 * @returns Error message if validation fails, null if validation passes
 */
export const validateIntegrationMetadata = (body: ContactWebhookBody): string | null => {
  if (!body.integrationMetadata?.key || !isValidIntegrationKey(body.integrationMetadata.key)) {
    return `Invalid integration key: ${body.integrationMetadata?.key}`;
  }

  return null;
};



/**
 * Extract job title from webhook body
 */
export const extractJobTitle = (body: ContactWebhookBody): string => {
  try {
    // Try to access job title from different possible locations
    if ('data' in body && body.data?.fields) {
      // Check if it's HubSpot (has jobTitle in fields)
      if ('jobTitle' in body.data.fields && typeof body.data.fields.jobTitle === 'string') {
        return body.data.fields.jobTitle;
      }
    }

    if ('data' in body && body.data?.rawFields) {
      // Check if it's Pipedrive (has job_title in rawFields)
      if ('job_title' in body.data.rawFields && typeof body.data.rawFields.job_title === 'string') {
        return body.data.rawFields.job_title;
      }
    }

    return 'N/A';
  } catch {
    return 'N/A';
  }
};

/**
 * Extract contact data from webhook body
 * @param body - The webhook body containing contact information
 * @returns Object with standardized contact data
 */
export const extractContactData = (body: ContactWebhookBody) => ({
  name: body.data!.fields.fullName,
  email: body.data!.fields.primaryEmail,
  phone: body.data!.fields.primaryPhone || '',
  jobTitle: extractJobTitle(body),
  customerId: body.customerId,
  pronouns: DEFAULT_PRONOUNS
});

/**
 * Create integration data object for webhook processing
 * @param body - The webhook body
 * @param integrationKey - The integration platform key
 * @returns Object with integration data
 */
export const createIntegrationData = (body: ContactWebhookBody, integrationKey: ContactProvider) => ({
  internalContactId: body.internalContactId,
  externalContactId: body.externalContactId,
  integrationKey,
  createdTime: body.data?.createdTime || new Date().toISOString(),
  updatedTime: body.data?.updatedTime || new Date().toISOString()
});

/**
 * Create integration object for contact
 */
export const createIntegrationObject = (
  type: ContactProvider,
  externalId: string,
  createdTime: string,
  updatedTime: string
) => ({
  type,
  externalId,
  externalCreatedAt: new Date(createdTime),
  externalUpdatedAt: new Date(updatedTime),
  lastSyncedAt: new Date(),
});



/**
 * Utility class to build webhook processing results consistently across all webhook handlers
 */
export class WebhookResultBuilder {
  /**
   * Creates a successful webhook processing result
   * @param message - Success message
   * @param contactId - Optional contact ID for successful operations
   * @returns WebhookProcessingResult with success status
   */
  static success(message: string, contactId?: string): WebhookProcessingResult {
    return {
      success: true,
      contactId,
      message,
      processedAt: new Date()
    };
  }

  /**
   * Creates a simple error webhook processing result
   * @param message - Error message
   * @returns WebhookProcessingResult with error status
   */
  static error(message: string): WebhookProcessingResult {
    return {
      success: false,
      message,
      processedAt: new Date()
    };
  }

  /**
   * Creates an error webhook processing result with detailed error information
   * @param message - Base error message
   * @param error - Error object or unknown error
   * @returns WebhookProcessingResult with detailed error information
   */
  static errorWithDetails(message: string, error: unknown): WebhookProcessingResult {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `${message}: ${errorMessage}`,
      processedAt: new Date()
    };
  }
}
