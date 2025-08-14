import { Contact, ContactModel } from '@/models/contact';
import { Logger } from './logger';

export interface CreateContactData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  pronouns: string;
  customerId: string;
}

export interface UpdateContactData {
  name?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  pronouns?: string;
}

export interface ContactSearchCriteria {
  customerId: string;
  id?: string;
  email?: string;
  externalContactId?: string;
}

export class ContactService {
  private static readonly logger = new Logger('ContactService');

  /**
   * Find contacts by customer ID with optional sorting and field selection
   */
  static async findContactsByCustomer(
    customerId: string,
    options: {
      sort?: { [key: string]: 1 | -1 };
      select?: string;
      limit?: number;
    } = {}
  ): Promise<Contact[]> {
    try {
      const { sort = { createdAt: -1 }, select, limit } = options;

      let query = ContactModel.find({ customerId }).sort(sort);

      if (select) {
        query = query.select(select);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const contacts = await query.exec();
      this.logger.log(`Found ${contacts.length} contacts for customer ${customerId}`);

      return contacts;
    } catch (error) {
      this.logger.error(`Failed to find contacts for customer ${customerId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to fetch contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find a single contact by ID and customer ID
   */
  static async findContactById(
    id: string,
    customerId: string,
    select?: string
  ): Promise<Contact | null> {
    try {
      let query = ContactModel.findOne({ id, customerId });

      if (select) {
        query = query.select(select);
      }

      const contact = await query.exec();

      if (!contact) {
        this.logger.log(`Contact not found: ${id} for customer ${customerId}`);
        return null;
      }

      this.logger.log(`Found contact: ${id} for customer ${customerId}`);
      return contact;
    } catch (error) {
      this.logger.error(`Failed to find contact ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to fetch contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find a contact by email and customer ID
   */
  static async findContactByEmail(
    email: string,
    customerId: string
  ): Promise<Contact | null> {
    try {
      const contact = await ContactModel.findOne({
        email: email.toLowerCase(),
        customerId
      }).exec();

      if (contact) {
        this.logger.log(`Found contact by email: ${email} for customer ${customerId}`);
      } else {
        this.logger.log(`No contact found by email: ${email} for customer ${customerId}`);
      }

      return contact;
    } catch (error) {
      this.logger.error(`Failed to find contact by email ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to fetch contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find a contact by external integration ID
   */
  static async findContactByExternalId(
    externalContactId: string
  ): Promise<Contact | null> {
    try {
      const contact = await ContactModel.findOne({
        'integrations.externalId': externalContactId
      }).exec();

      if (contact) {
        this.logger.log(`Found contact by external ID: ${externalContactId}`);
      } else {
        this.logger.log(`No contact found by external ID: ${externalContactId}`);
      }

      return contact;
    } catch (error) {
      this.logger.error(`Failed to find contact by external ID ${externalContactId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to fetch contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find a contact by external ID or email (for webhook handlers)
   * First tries to find by external ID, then falls back to email + customer ID
   */
  static async findContactByExternalIdOrEmail(
    externalContactId: string,
    email: string,
    customerId: string
  ): Promise<Contact | null> {
    try {
      // First try to find by external ID
      let contact = await this.findContactByExternalId(externalContactId);
      
      // If not found, try to find by email and customer ID
      if (!contact && email) {
        contact = await this.findContactByEmail(email, customerId);
      }
      
      if (contact) {
        this.logger.log(`Found contact by external ID or email: ${externalContactId} / ${email}`);
      } else {
        this.logger.log(`No contact found by external ID or email: ${externalContactId} / ${email}`);
      }
      
      return contact;
    } catch (error) {
      this.logger.error(`Failed to find contact by external ID or email ${externalContactId} / ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to fetch contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new contact
   */
  static async createContact(data: CreateContactData): Promise<Contact> {
    try {
      const id = crypto.randomUUID();

      const contact = await ContactModel.create({
        id,
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        jobTitle: data.jobTitle,
        pronouns: data.pronouns,
        customerId: data.customerId,
        integrations: [],
      });

      this.logger.log(`Created contact: ${id} for customer ${data.customerId}`);

      return contact;
    } catch (error) {
      this.logger.error(`Failed to create contact for customer ${data.customerId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to create contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing contact
   */
  static async updateContact(
    id: string,
    customerId: string,
    data: UpdateContactData
  ): Promise<Contact | null> {
    try {
      const updateData: Partial<UpdateContactData> = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email.toLowerCase();
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
      if (data.pronouns !== undefined) updateData.pronouns = data.pronouns;

      const contact = await ContactModel.findOneAndUpdate(
        { id, customerId },
        updateData,
        { new: true }
      ).exec();

      if (!contact) {
        this.logger.log(`Contact not found for update: ${id} for customer ${customerId}`);
        return null;
      }

      this.logger.log(`Updated contact: ${id} for customer ${customerId}`);

      return contact;
    } catch (error) {
      this.logger.error(`Failed to update contact ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to update contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a contact
   */
  static async deleteContact(id: string, customerId: string): Promise<boolean> {
    try {

      const contact = await ContactModel.findOne({
        id,
        customerId,
      }).exec();

      if (!contact) {
        this.logger.log(`Contact not found for deletion: ${id} for customer ${customerId}`);
        return false;
      }

      const result = await ContactModel.findOneAndDelete({
        id,
        customerId,
      }).exec();

      if (result) {
        this.logger.log(`Deleted contact: ${id} for customer ${customerId}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Failed to delete contact ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to delete contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update contact integration (for webhook handlers)
   */
  static async updateContactIntegration(
    email: string,
    externalContactId: string,
    type: string,
    createdTime: string,
    updatedTime: string
  ): Promise<boolean> {
    try {
      const result = await ContactModel.updateOne(
        { email, "integrations.externalId": externalContactId },
        {
          $set: {
            "integrations.$[elem].type": type,
            "integrations.$[elem].externalCreatedAt": createdTime,
            "integrations.$[elem].externalUpdatedAt": updatedTime,
            "integrations.$[elem].lastSyncedAt": null
          }
        },
        { arrayFilters: [{ "elem.externalId": externalContactId }] }
      ).exec();

      if (result.matchedCount > 0) {
        this.logger.log(`Updated existing integration for contact: ${email}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Failed to update contact integration for ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to update contact integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add new integration to existing contact
   */
  static async addContactIntegration(
    internalId: string,
    email: string,
    externalContactId: string,
    type: string,
    createdTime: string,
    updatedTime: string,
  ): Promise<void> {
    try {
      await ContactModel.updateOne(
        { id: internalId, },
        {
          $push: {
            integrations: {
              type,
              externalId: externalContactId,
              externalCreatedAt: createdTime,
              externalUpdatedAt: updatedTime,
              lastSyncedAt: null
            }
          }
        }
      ).exec()

      this.logger.log(`Added new integration ${type} to contact: ${email}`);
    } catch (error) {
      this.logger.error(`Failed to add integration to contact ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to add contact integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update contact integration timestamps
   */
  static async updateContactIntegrationTimestamps(
    externalContactId: string,
    contactData: {
      name: string;
      email: string;
      phone: string;
      jobTitle: string;
    }
  ): Promise<void> {
    try {
      await ContactModel.updateOne(
        { 'integrations.externalId': externalContactId },
        {
          $set: {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            jobTitle: contactData.jobTitle,
            'integrations.$[i].externalUpdatedAt': new Date(),
            'integrations.$[i].lastSyncedAt': new Date(),
          },
        },
        { arrayFilters: [{ 'i.externalId': externalContactId }] }
      ).exec();

      this.logger.log(`Updated contact integration timestamps: ${externalContactId}`);
    } catch (error) {
      this.logger.error(`Failed to update contact integration timestamps for ${externalContactId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to update contact integration timestamps: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add internal integration to contact
   */
  static async addInternalIntegration(
    internalContactId: string,
    externalContactId: string,
    type: string,
    createdTime: string,
    updatedTime: string
  ): Promise<void> {
    try {
      await ContactModel.updateOne(
        { id: internalContactId },
        {
          $push: {
            integrations: {
              type,
              externalId: externalContactId,
              externalCreatedAt: createdTime,
              externalUpdatedAt: updatedTime,
              lastSyncedAt: null
            }
          }
        }
      ).exec();

      this.logger.log(`Added internal integration to contact: ${internalContactId}`);
    } catch (error) {
      this.logger.error(`Failed to add internal integration to contact ${internalContactId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to add internal integration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new contact with integrations (for webhook handlers)
   */
  static async createContactWithIntegrations(
    contactData: {
      name: string;
      email: string;
      phone: string;
      jobTitle: string;
      pronouns: string;
      customerId: string;
    },
    integrations: Array<{
      type: string;
      externalId: string;
      createdTime: string;
      updatedTime: string;
    }>
  ): Promise<Contact> {
    try {
      const id = crypto.randomUUID();

      const contact = await ContactModel.create({
        id,
        name: contactData.name || 'N/A',
        email: contactData.email || 'N/A',
        phone: contactData.phone || 'N/A',
        jobTitle: contactData.jobTitle,
        pronouns: contactData.pronouns || 'N/A',
        customerId: contactData.customerId,
        integrations: integrations.map(integration => ({
          type: integration.type,
          externalId: integration.externalId,
          externalCreatedAt: integration.createdTime,
          externalUpdatedAt: integration.updatedTime,
          lastSyncedAt: null
        }))
      });

      this.logger.log(`Created contact with integrations: ${id} for customer ${contactData.customerId}`);

      return contact;
    } catch (error) {
      this.logger.error(`Failed to create contact with integrations for customer ${contactData.customerId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to create contact with integrations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete contact by external integration ID
   */
  static async deleteContactByExternalId(externalContactId: string): Promise<boolean> {
    try {
      const result = await ContactModel.deleteOne({ 'integrations.externalId': externalContactId }).exec();

      if (result.deletedCount > 0) {
        this.logger.log(`Deleted contact by external ID: ${externalContactId}`);
        return true;
      }

      this.logger.log(`No contact found to delete for external ID: ${externalContactId}`);
      return false;
    } catch (error) {
      this.logger.error(`Failed to delete contact by external ID ${externalContactId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to delete contact by external ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
