import { Logger, validateIntegrationMetadata, validateWebhookBody, WebhookResultBuilder, IntegrationActionsService } from "@/lib";
import { ContactService } from "@/lib/contact.service";
import { ContactProvider, ContactWebhookBody, ContactWebhookEventType, WebhookProcessingResult } from "@/types/webhooks";
import { createNewContactWithIntegration, processExistingContactIntegration } from "./helpers";
import { extractContactData, createIntegrationData } from "@/lib/webhook-utils";

const handleCreateContact = async (body: ContactWebhookBody): Promise<WebhookProcessingResult> => {
    const logger = new Logger('handleCreateContact');

    try {
        // Validate webhook body
        const validationError = validateWebhookBody(body);
        if (validationError) {
            logger.error(validationError);
            return WebhookResultBuilder.error(validationError);
        }

        const integrationKey = body.integrationMetadata!.key as ContactProvider;

        // Find existing contact
        const contact = await ContactService.findContactByExternalIdOrEmail(
            body.externalContactId,
            body.data!.fields.primaryEmail,
            body.customerId
        );

        if (contact) {
            logger.log('Contact already exists, processing integration');
            return await processExistingContactIntegration(contact, body, integrationKey, logger);
        } else {
            return await createNewContactWithIntegration(body, integrationKey, logger);
        }
    } catch (error) {
        logger.error('Unexpected error in handleCreateContact:', error);
        return WebhookResultBuilder.errorWithDetails('Unexpected error in handleCreateContact', error);
    }
};

const handleUpdateContact = async (body: ContactWebhookBody): Promise<WebhookProcessingResult> => {
    const logger = new Logger('handleUpdateContact');

    try {
        // Validate webhook body
        const validationError = validateWebhookBody(body);
        if (validationError) {
            logger.error(validationError);
            return WebhookResultBuilder.error(validationError);
        }

        const integrationKey = body.integrationMetadata!.key as ContactProvider;
        const externalContactId = body.externalContactId;

        // Find existing contact
        const existingContact = await ContactService.findContactByExternalIdOrEmail(
            externalContactId,
            body.data!.fields.primaryEmail,
            body.customerId
        );

        if (!existingContact) {
            const error = 'Contact not found for update';
            logger.error(error);
            return WebhookResultBuilder.error(error);
        }

        // Update contact
        const contactData = extractContactData(body);
        const updatedContact = await ContactService.updateContact(
            existingContact.id,
            body.customerId,
            contactData
        );

        if (!updatedContact) {
            const error = 'Failed to update contact';
            logger.error(error);
            return WebhookResultBuilder.error(error);
        }

        // Sync across integrations
        await IntegrationActionsService.updateContactAcrossIntegrations(
            { customerId: body.customerId, customerName: null },
            updatedContact,
            [integrationKey]
        );

        logger.log('Contact updated successfully');
        return WebhookResultBuilder.success('Contact updated successfully', updatedContact.id);
    } catch (error) {
        logger.error('Unexpected error in handleUpdateContact:', error);
        return WebhookResultBuilder.errorWithDetails('Unexpected error in handleUpdateContact', error);
    }
};

const handleDeleteContact = async (body: ContactWebhookBody): Promise<WebhookProcessingResult> => {
    const logger = new Logger('handleDeleteContact');

    try {
        // Validate integration key
        const validationError = validateIntegrationMetadata(body);
        if (validationError) {
            logger.error(validationError);
            return WebhookResultBuilder.error(validationError);
        }

        const integrationKey = body.integrationMetadata!.key as ContactProvider;

        // Find existing contact
        const contact = await ContactService.findContactByExternalIdOrEmail(
            body.externalContactId,
            body.data?.fields?.primaryEmail || '',
            body.customerId
        );

        if (!contact) {
            const error = 'Contact not found for deletion';
            logger.error(error);
            return WebhookResultBuilder.error(error);
        }

        // Delete contact
        logger.log('Deleting contact by external id', body.externalContactId);
        await ContactService.deleteContactByExternalId(body.externalContactId);
        logger.log('Contact deleted successfully');

        // Delete across integrations
        logger.log('Deleting contact across integrations', body.externalContactId);
        await IntegrationActionsService.deleteContactAcrossIntegrations(
            { customerId: body.customerId, customerName: null },
            contact,
            [integrationKey]
        );
        logger.log('Contact deleted across integrations');

        return WebhookResultBuilder.success('Contact deleted successfully');
    } catch (error) {
        logger.error('Unexpected error in handleDeleteContact:', error);
        return WebhookResultBuilder.errorWithDetails('Unexpected error in handleDeleteContact', error);
    }
};

const handleCreateContactInternal = async (body: ContactWebhookBody): Promise<WebhookProcessingResult> => {
    const logger = new Logger('handleCreateContactInternal');

    try {
        // Validate integration key
        const validationError = validateIntegrationMetadata(body);
        if (validationError) {
            logger.error(validationError);
            return WebhookResultBuilder.error(validationError);
        }

        const integrationKey = body.integrationMetadata!.key as ContactProvider;

        logger.log('Creating contact internal', body);
        const integrationData = createIntegrationData(body, integrationKey);

        await ContactService.addInternalIntegration(
            integrationData.internalContactId,
            integrationData.externalContactId,
            integrationData.integrationKey,
            integrationData.createdTime,
            integrationData.updatedTime
        );

        logger.log('Contact created internal successfully');
        return WebhookResultBuilder.success('Internal contact created successfully');
    } catch (error) {
        logger.error('Failed to create internal contact:', error);
        return WebhookResultBuilder.errorWithDetails('Failed to create internal contact', error);
    }
};

export const handleContactWebhook = async (body: ContactWebhookBody): Promise<WebhookProcessingResult> => {
    try {
        const webhookType = body.eventType;

        const handlers: Record<ContactWebhookEventType, (body: ContactWebhookBody) => Promise<WebhookProcessingResult>> = {
            'create-contact': handleCreateContact,
            'update-contact': handleUpdateContact,
            'delete-contact': handleDeleteContact,
            'create-contact-internal': handleCreateContactInternal
        };

        const handler = handlers[webhookType];
        if (!handler) {
            const error = `Handler for ${webhookType} not found`;
            return WebhookResultBuilder.error(error);
        }

        return await handler(body);
    } catch (error) {
        return WebhookResultBuilder.errorWithDetails('Unexpected error in handleContactWebhook', error);
    }
};