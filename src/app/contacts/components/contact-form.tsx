import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormField } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Contact } from "@/models/contact"
import { faker } from "@faker-js/faker"
import { Pencil, Plus, Wand2 } from "lucide-react"
import { useEffect, useState } from "react"

interface ContactFormProps {
  contact?: Contact
  onSubmit: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'customerId' | 'integrations'> | Contact) => Promise<void>
  isSubmitting?: boolean
  buttonText?: string
}

export function ContactForm({ contact, onSubmit, isSubmitting = false, buttonText }: ContactFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: contact?.name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    jobTitle: contact?.jobTitle ?? '',
    pronouns: contact?.pronouns ?? '',
  })

  // Update form data when contact changes
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        jobTitle: contact.jobTitle,
        pronouns: contact.pronouns,
      })
    }
  }, [contact])

  const generateRandomData = () => {
    const pronouns = ['he/him', 'she/her', 'they/them', 'he/they', 'she/they']
    setFormData({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      jobTitle: faker.person.jobTitle(),
      pronouns: faker.helpers.arrayElement(pronouns),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (contact) {
        // If we have a contact, include the ID for updates
        await onSubmit({
          ...formData,
          id: contact.id,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        })
      } else {
        // For new contacts, don't include ID
        await onSubmit(formData)
      }
      setOpen(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        pronouns: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out border-2 border-transparent rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            contact
              ? "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 hover:shadow-xl hover:scale-105"
              : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-black dark:focus:ring-white hover:shadow-xl hover:scale-105"
          }`}
        >
          {contact ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black dark:text-white">
            {contact ? 'Edit Contact' : 'Add Contact'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Name" htmlFor="name">
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter full name"
            />
          </FormField>
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter email address"
            />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="Enter phone number"
            />
          </FormField>
          <FormField label="Job Title" htmlFor="jobTitle">
            <Input
              id="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              required
              placeholder="Enter job title"
            />
          </FormField>
          <FormField label="Pronouns" htmlFor="pronouns">
            <Input
              id="pronouns"
              type="text"
              value={formData.pronouns}
              onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
              required
              placeholder="e.g., he/him, she/her, they/them"
            />
          </FormField>
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-white hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Saving...' : contact ? 'Update Contact' : 'Add Contact'}
            </Button>
            {!contact && (
              <Button
                type="button"
                variant="outline"
                onClick={generateRandomData}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 