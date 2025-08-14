import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { EyeIcon, Mail, Phone, Briefcase, User, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { Contact } from "@/types/contact"
import { AppError } from "@/types/errors"
import { generateInitials, formatContactName } from "@/lib/contact-utils"
import { formatDate } from "@/lib/date-utils"

interface ContactsTableProps {
  contacts: Contact[]
  isLoading?: boolean
  isError?: AppError | null
}

export function ContactsTable({
  contacts,
  isLoading = false,
  isError = null,
}: ContactsTableProps) {
  if (isError) {
    return (
      <div className="rounded-2xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-bold text-red-900 dark:text-red-100">Error Loading Contacts</h3>
          <p className="text-red-700 dark:text-red-300 text-lg">
            {isError.message || 'There was a problem loading your contacts. Please try again later.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
            <TableHead className="h-16 px-8 text-left font-bold text-black dark:text-white">Contact</TableHead>
            <TableHead className="h-16 px-8 text-left font-bold text-black dark:text-white">Contact Info</TableHead>
            <TableHead className="h-16 px-8 text-left font-bold text-black dark:text-white">Job Details</TableHead>
            <TableHead className="h-16 px-8 text-left font-bold text-black dark:text-white">Timeline</TableHead>
            <TableHead className="h-16 px-8 text-center font-bold text-black dark:text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="border-gray-100 dark:border-gray-900">
                <TableCell className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-[140px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[130px]" />
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex justify-center space-x-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : contacts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-8 py-16 text-center"
              >
                <div className="mx-auto max-w-md">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-900/30">
                    <User className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-black dark:text-white">No Contacts Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Get started by adding your first contact to your address book.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id} className="border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all duration-200">
                {/* Contact Column */}
                <TableCell className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg">
                      {generateInitials(contact.name)}
                    </div>
                    <div>
                      <div className="font-bold text-black dark:text-white text-lg">{formatContactName(contact.name)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{contact.pronouns}</div>
                    </div>
                  </div>
                </TableCell>
                
                {/* Contact Info Column */}
                <TableCell className="px-8 py-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{contact.phone}</span>
                    </div>
                  </div>
                </TableCell>
                
                {/* Job Details Column */}
                <TableCell className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{contact.jobTitle}</span>
                  </div>
                </TableCell>
                
                {/* Timeline Column */}
                <TableCell className="px-8 py-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Created {formatDate(contact.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Updated {formatDate(contact.updatedAt)}</span>
                    </div>
                  </div>
                </TableCell>
                
                {/* Actions Column */}
                <TableCell className="px-8 py-6">
                  <div className="flex items-center justify-center">
                    <Link href={`/contacts/${contact.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="inline-flex items-center justify-center h-10 w-10 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all duration-200"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 