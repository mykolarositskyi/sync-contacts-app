import type { Contact } from '@/types/contact';
import type { AuthCustomer } from './auth';
import { ContactService } from './contact.service';
import { getIntegrationClient } from './integration-app-client';
import { Logger } from './logger';

export interface IntegrationActionPayload {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
}

export interface IntegrationActionResult {
  success: boolean;
  externalContactId?: string;
  integrationKey: string;
  error?: string;
}

export class IntegrationActionsService {

  private static logger = new Logger(IntegrationActionsService.name);
  /**
   * Creates a contact across all active integrations
   */
  static async createContactAcrossIntegrations(
    auth: AuthCustomer,
    contact: Contact,
    excludeIntegrations?: string[]
  ): Promise<IntegrationActionResult[]> {
    try {
      const integrationClient = await getIntegrationClient(auth);
      const connections = await integrationClient.connections.find();
      const results: IntegrationActionResult[] = [];

      for (const connection of connections.items) {
        const integrationKey = connection.integration?.key;

        if (!connection.disconnected &&
          !connection.integration?.isDeactivated &&
          integrationKey &&
          !excludeIntegrations?.includes(integrationKey)) {

          try {
            this.logger.log(`Creating contact in ${integrationKey}`, contact.id);
            const response = await integrationClient
              .connection(integrationKey)
              .action('create-contacts')
              .run({
                id: contact.id,
                fullName: contact.name,
                firstName: contact.name,
                lastName: contact.name,
                primaryEmail: contact.email,
                primaryPhone: contact.phone,
              });

            const externalContactId = response.output.id;
            this.logger.log(`Contact created in ${integrationKey}`, 'externalContactId', externalContactId, 'contactId', contact.id);

            // Add the integration record to our database
            await ContactService.addContactIntegration(
              contact.id,
              contact.email,
              externalContactId,
              integrationKey,
              new Date().toISOString(),
              new Date().toISOString(),
            );

            results.push({
              success: true,
              externalContactId,
              integrationKey,
            });
          } catch (error) {
            console.error(`Failed to create contact in ${integrationKey}:`, error);
            results.push({
              success: false,
              integrationKey,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to create contact across integrations:', error);
      throw new Error(`Integration action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates a contact across all active integrations
   */
  static async updateContactAcrossIntegrations(
    auth: AuthCustomer,
    contact: Contact,
    excludeIntegrations?: string[]
  ): Promise<IntegrationActionResult[]> {
    try {
      const integrationClient = await getIntegrationClient(auth);
      const connections = await integrationClient.connections.find();
      const results: IntegrationActionResult[] = [];

      for (const connection of connections.items) {
        const integrationKey = connection.integration?.key;

        if (!connection.disconnected &&
          !connection.integration?.isDeactivated &&
          integrationKey &&
          !excludeIntegrations?.includes(integrationKey)) {

          try {
            // Find the existing integration record to get the external ID
            const integration = contact.integrations.find(i =>
              i.type === integrationKey
            );

            if (integration?.externalId) {
              this.logger.log(`Updating contact in ${integrationKey}`, integration.externalId);
              await integrationClient
                .connection(integrationKey)
                .action('update-contacts')
                .run({
                  id: integration.externalId,
                  fullName: contact.name,
                  firstName: contact.name,
                  lastName: contact.name,
                  primaryEmail: contact.email,
                  primaryPhone: contact.phone,
                });
              this.logger.log(`Contact updated in ${integrationKey}`, integration.externalId);

              results.push({
                success: true,
                externalContactId: integration.externalId,
                integrationKey,
              });
            } else {
              results.push({
                success: false,
                integrationKey,
                error: 'No existing integration found for this contact',
              });
            }
          } catch (error) {
            console.error(`Failed to update contact in ${integrationKey}:`, error);
            results.push({
              success: false,
              integrationKey,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to update contact across integrations:', error);
      throw new Error(`Integration action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes a contact across all active integrations
   */
  static async deleteContactAcrossIntegrations(
    auth: AuthCustomer,
    contact: Contact,
    excludeIntegrations?: string[]
  ): Promise<IntegrationActionResult[]> {
    try {
      const integrationClient = await getIntegrationClient(auth);
      const connections = await integrationClient.connections.find();
      const results: IntegrationActionResult[] = [];

      for (const connection of connections.items) {
        const integrationKey = connection.integration?.key;

        if (!connection.disconnected &&
          !connection.integration?.isDeactivated &&
          integrationKey &&
          !excludeIntegrations?.includes(integrationKey)) {

          try {
            // Find the existing integration record to get the external ID
            const integration = contact.integrations.find(i =>
              i.type === integrationKey
            );

            if (integration?.externalId) {
              this.logger.log(`Deleting contact in ${integrationKey}`, integration.externalId);
              await integrationClient
                .connection(integrationKey)
                .action('delete-contacts')
                .run({
                  id: integration.externalId,
                });
              this.logger.log(`Contact deleted in ${integrationKey}`, integration.externalId);

              results.push({
                success: true,
                externalContactId: integration.externalId,
                integrationKey,
              });
            } else {
              results.push({
                success: false,
                integrationKey,
                error: 'No existing integration found for this contact',
              });
            }
          } catch (error) {
            console.error(`Failed to delete contact in ${integrationKey}:`, error);
            results.push({
              success: false,
              integrationKey,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to delete contact across integrations:', error);
      throw new Error(`Integration action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generic method to execute any integration action
   */
  static async executeIntegrationAction(
    auth: AuthCustomer,
    actionName: string,
    payload: Record<string, unknown>,
    integrationKey?: string
  ): Promise<unknown> {
    try {
      const integrationClient = await getIntegrationClient(auth);

      if (integrationKey) {
        // Execute action for specific integration
        return await integrationClient
          .connection(integrationKey)
          .action(actionName)
          .run(payload);
      } else {
        // Execute action for all active integrations
        const connections = await integrationClient.connections.find();
        const results = [];

        for (const connection of connections.items) {
          const key = connection.integration?.key;

          if (!connection.disconnected &&
            !connection.integration?.isDeactivated &&
            key) {

            try {
              const result = await integrationClient
                .connection(key)
                .action(actionName)
                .run(payload);

              results.push({
                integrationKey: key,
                success: true,
                result,
              });
            } catch (error) {
              results.push({
                integrationKey: key,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          }
        }

        return results;
      }
    } catch (error) {
      console.error(`Failed to execute integration action ${actionName}:`, error);
      throw new Error(`Integration action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all active integration connections for a customer
   */
  static async getActiveIntegrations(auth: AuthCustomer): Promise<string[]> {
    try {
      const integrationClient = await getIntegrationClient(auth);
      const connections = await integrationClient.connections.find();

      return connections.items
        .filter(connection =>
          !connection.disconnected &&
          !connection.integration?.isDeactivated &&
          connection.integration?.key
        )
        .map(connection => connection.integration!.key);
    } catch (error) {
      console.error('Failed to get active integrations:', error);
      throw new Error(`Failed to get active integrations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a specific integration is active
   */
  static async isIntegrationActive(auth: AuthCustomer, integrationKey: string): Promise<boolean> {
    try {
      const activeIntegrations = await this.getActiveIntegrations(auth);
      return activeIntegrations.includes(integrationKey);
    } catch (error) {
      console.error(`Failed to check if integration ${integrationKey} is active:`, error);
      return false;
    }
  }

  /**
   * Execute a custom action with retry logic
   */
  static async executeWithRetry<T>(
    auth: AuthCustomer,
    actionName: string,
    payload: Record<string, unknown>,
    integrationKey: string,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const integrationClient = await getIntegrationClient(auth);
        const result = await integrationClient
          .connection(integrationKey)
          .action(actionName)
          .run(payload);
        return result as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt === maxRetries) {
          throw lastError;
        }

        console.warn(`Attempt ${attempt} failed for ${actionName} in ${integrationKey}, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));

        // Exponential backoff
        delayMs *= 2;
      }
    }

    throw lastError!;
  }
}
