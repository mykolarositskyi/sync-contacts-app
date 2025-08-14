import { authenticatedFetcher, getAuthHeaders } from '@/lib/fetch-utils';
import { ContactsResponse, CreateContactData, UpdateContactData } from '@/types/contact';
import { AppError } from '@/types/errors';
import useSWR from 'swr';

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR<ContactsResponse>(
    '/api/contacts',
    (url) => authenticatedFetcher<ContactsResponse>(url),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );


  const createContact = async (contact: CreateContactData): Promise<boolean> => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error('Failed to create contact');
      }

      // Refresh the contacts list
      await mutate();
      // TODO: Notify integration app about new contact

      return true;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  };

  const updateContact = async (contact: UpdateContactData & { id: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      // Refresh the contacts list
      await mutate();
      // TODO: Notify integration app about updated contact

      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      // Refresh the contacts list
      await mutate();

      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  return {
    contacts: data?.contacts ?? [],
    isLoading,
    isError: error as AppError | null,
    mutate,
    createContact,
    updateContact,
    deleteContact,
  };
} 