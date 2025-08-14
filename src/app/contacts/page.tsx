"use client"

import { useContacts } from "@/hooks/use-contacts.hook"
import { useState } from "react"
import { toast } from "sonner"
import { ContactForm } from "./components/contact-form"
import { ContactsTable } from "./components/contacts-table"
import { SyncSettingsModal } from "./components/sync-settings-modal"
import { CreateContactData } from "@/types/contact"
import { Users } from "lucide-react"

export default function ContactsPage() {
  const { contacts, isLoading, isError, createContact } = useContacts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (contact: CreateContactData) => {
    try {
      setIsSubmitting(true)
      await createContact(contact)
      toast.success("Contact created successfully")
    } catch (error) {
      console.error("Failed to create contact:", error)
      toast.error("Failed to create contact")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black dark:text-white mb-6 leading-none">
              Contacts
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Manage your contacts and keep track of important relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Contact Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contacts?.length || 0} contacts in your address book
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <SyncSettingsModal />
              <ContactForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
            </div>
          </div>

          {/* Contacts Table */}
          <ContactsTable
            contacts={contacts}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </section>
    </div>
  )
} 