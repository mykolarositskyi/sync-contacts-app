import { createIntegrationError } from '@/types/errors';
import { IntegrationAppClient } from '@integration-app/sdk';
import type { AuthCustomer } from './auth';
import { generateIntegrationToken } from './integration-token';

let clientInstance: IntegrationAppClient | null = null;

export class IntegrationClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IntegrationClientError';
  }
}

export async function getIntegrationClient(auth: AuthCustomer): Promise<IntegrationAppClient> {
  try {
    const token = await generateIntegrationToken(auth);
    const client = new IntegrationAppClient({ token });

    return client;
  } catch (error) {
    console.error('Failed to initialize Integration.app client:', error);
    const integrationError = createIntegrationError(
      'integration-app',
      'Failed to initialize Integration.app client',
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw new IntegrationClientError(integrationError.message);
  }
}

/**
 * Use this when you need to ensure a single client instance is reused
 * Note: The token used will be from when the client was first initialized
 */
export async function getSharedIntegrationClient(auth: AuthCustomer): Promise<IntegrationAppClient> {
  if (!clientInstance) {
    clientInstance = await getIntegrationClient(auth);
  }
  return clientInstance;
}

/**
 * Reset the shared client instance, forcing a new one to be created next time
 */
export function resetSharedIntegrationClient(): void {
  clientInstance = null;
}

/**
 * Generic function to execute integration app operations with proper error handling
 */
export async function executeIntegrationOperation<T>(
  auth: AuthCustomer,
  operation: (client: IntegrationAppClient) => Promise<T>
): Promise<T> {
  try {
    const client = await getIntegrationClient(auth);
    return await operation(client);
  } catch (error) {
    const integrationError = createIntegrationError(
      'integration-app',
      'Integration operation failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw new IntegrationClientError(integrationError.message);
  }
} 