// Common error types for the application
export interface AppError {
  message: string;
  code: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}







export interface NotFoundError extends AppError {
  code: 'NOT_FOUND';
  statusCode: 404;
  resource: string;
  resourceId: string;
}



export interface IntegrationError extends AppError {
  code: 'INTEGRATION_ERROR';
  integration: string;
  externalError?: string;
}



// Error factory functions
export const createNotFoundError = (resource: string, resourceId: string): NotFoundError => ({
  message: `${resource} not found`,
  code: 'NOT_FOUND',
  statusCode: 404,
  resource,
  resourceId
});

export const createIntegrationError = (integration: string, message: string, externalError?: string): IntegrationError => ({
  message,
  code: 'INTEGRATION_ERROR',
  statusCode: 500,
  integration,
  externalError
});
