import { ContactProvider, ContactWebhookBody, WebhookProcessingResult } from "@/types/webhooks";
import { IntegrationActionsService } from "@/lib";
import { ContactService } from "@/lib/contact.service";
import { Logger } from "@/lib/logger";
import { WebhookResultBuilder, createIntegrationData, extractContactData } from "@/lib/webhook-utils";
import { Contact } from "@/types";

/**
 * Helper function to handle integration processing for existing contact
 */
export const processExistingContactIntegration = async (
    contact: Contact,
    body: ContactWebhookBody,
    integrationKey: ContactProvider,
    logger: Logger
): Promise<WebhookProcessingResult> => {
    try {
        const integration = contact.integrations.find(i => i.type === integrationKey);
        const contactData = extractContactData(body);

        if (integration) {
            logger.log('Integration already exists, updating timestamps');
            await ContactService.updateContactIntegrationTimestamps(
                body.externalContactId,
                contactData
            );
            logger.log('Contact integration timestamps updated');
        } else {
            logger.log('Adding new integration to existing contact');
            const integrationData = createIntegrationData(body, integrationKey);
            await ContactService.addInternalIntegration(
                integrationData.internalContactId,
                integrationData.externalContactId,
                integrationData.integrationKey,
                integrationData.createdTime,
                integrationData.updatedTime
            );
            logger.log('Integration added to existing contact');
        }

        logger.log('Updating contact across integrations');
        await IntegrationActionsService.updateContactAcrossIntegrations(
            { customerId: body.customerId, customerName: null },
            { ...contact, ...contactData } as Contact,
            [integrationKey]
        );
        logger.log('Contact updated across integrations');

        return WebhookResultBuilder.success('Existing contact updated successfully', contact.id);
    } catch (error) {
        logger.error('Failed to process existing contact integration:', error);
        return WebhookResultBuilder.errorWithDetails('Failed to process existing contact integration', error);
    }
};

/**
 * Helper function to create new contact with integration
 */
export const createNewContactWithIntegration = async (
    body: ContactWebhookBody,
    integrationKey: ContactProvider,
    logger: Logger
): Promise<WebhookProcessingResult> => {
    try {
        logger.log('Creating new contact');
        const contactData = extractContactData(body);

        const createdContact = await ContactService.createContact(contactData);

        const integrationData = createIntegrationData(body, integrationKey);
        await ContactService.addInternalIntegration(
            integrationData.internalContactId,
            integrationData.externalContactId,
            integrationData.integrationKey,
            integrationData.createdTime,
            integrationData.updatedTime
        );

        await IntegrationActionsService.updateContactAcrossIntegrations(
            { customerId: body.customerId, customerName: null },
            createdContact,
            [integrationKey]
        );

        logger.log('New contact created and synced across integrations');
        return WebhookResultBuilder.success('New contact created successfully', createdContact.id);
    } catch (error) {
        logger.error('Failed to create new contact:', error);
        return WebhookResultBuilder.errorWithDetails('Failed to create new contact', error);
    }
};
