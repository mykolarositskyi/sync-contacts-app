'use client'

import { authenticatedFetcher, getAuthHeaders } from "@/lib/fetch-utils";
import { ContactResponse } from "@/types/contact";
import useSWR from "swr";
import { User, Mail, Phone, Briefcase, Zap, MessageCircle, Trash2, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoCard } from "./components/info-card";
import { SectionHeader } from "./components/section-header";
import { MetadataCard } from "./components/metadata-card";
import { PlatformModal } from "./components/platform-modal";
import { ContactForm } from "../components/contact-form";
import { SendMessageModal } from "./components/send-message-modal";
import { useState } from "react";
import { Contact } from "@/models/contact";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContactDetailsProps {
    contactId: string;
}

export function ContactDetails({ contactId }: ContactDetailsProps) {
    const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<{ type: string; externalId: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
    const router = useRouter();

    const { data, error, isLoading, mutate } = useSWR<ContactResponse>(
        `/api/contacts/${contactId}`,
        (url) => authenticatedFetcher<ContactResponse>(url),
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    );

    const { data: platformData, error: platformError } = useSWR(
        selectedPlatform ? `/api/platforms/${selectedPlatform.type}/data?id=${selectedPlatform.externalId}` : null,
        (url) => authenticatedFetcher(url),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const handlePlatformClick = (integration: { type: string; externalId: string }) => {
        setSelectedPlatform(integration);
        setIsPlatformModalOpen(true);
    };

    const closePlatformModal = () => {
        setIsPlatformModalOpen(false);
        setSelectedPlatform(null);
    };

    const handleUpdate = async (contact: Contact) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/contacts', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(contact),
            });

            if (!response.ok) {
                throw new Error('Failed to update contact');
            }

            // Refresh the contact data
            await mutate();
            toast.success("Contact updated successfully");
        } catch (error) {
            console.error("Failed to update contact:", error);
            toast.error("Failed to update contact");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/contacts?id=${contactId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete contact');
            }

            toast.success("Contact deleted successfully");
            // Navigate back to contacts list
            router.push('/contacts');
        } catch (error) {
            console.error("Failed to delete contact:", error);
            toast.error("Failed to delete contact");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mb-6">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">Loading contact...</p>
            </div>
        </div>
    );
    
    if (!data || !data.contact || error) return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6">
                    <User className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-3">Contact Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    {error ? 'There was an error loading the contact.' : 'The contact you\'re looking for doesn\'t exist or has been removed.'}
                </p>
                <div className="space-y-4">
                    <Button
                        onClick={() => window.history.back()}
                        className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/contacts'}
                        className="w-full border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Users className="w-4 h-4 mr-2" />
                        View All Contacts
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Hero Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white mb-4 leading-none">
                                Contact Profile
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                View and manage contact information
                            </p>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white dark:bg-black rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-black dark:bg-white px-8 py-12 text-white dark:text-black">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
                                    <div className="w-24 h-24 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-3xl font-black text-black dark:text-white">
                                            {data?.contact.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black mb-3">
                                            {data?.contact.name || 'Unknown Name'}
                                        </h2>
                                        <p className="text-gray-300 dark:text-gray-600 text-lg font-medium mb-4">
                                            {data?.contact.jobTitle || 'No job title'}
                                        </p>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 dark:bg-black/20 text-white dark:text-black border border-white/30 dark:border-black/30">
                                                {data?.contact.pronouns || 'N/A'}
                                            </span>
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 dark:bg-black/20 text-white dark:text-black border border-white/30 dark:border-black/30">
                                                ID: {contactId}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="px-8 py-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <SectionHeader icon={User} title="Personal Information" />
                                        <div className="space-y-4">
                                            <InfoCard
                                                icon={Mail}
                                                label="Email"
                                                value={data?.contact.email || 'No email'}
                                            />
                                            <InfoCard
                                                icon={Phone}
                                                label="Phone"
                                                value={data?.contact.phone || 'No phone'}
                                            />
                                            <InfoCard
                                                icon={Briefcase}
                                                label="Job Title"
                                                value={data?.contact.jobTitle || 'No job title'}
                                            />
                                        </div>
                                    </div>

                                    {/* Integrations & Metadata */}
                                    <div className="space-y-4">
                                        <SectionHeader icon={Zap} title="Integrations & Metadata" iconColor="text-gray-600 dark:text-gray-400" />
                                        <div className="space-y-4">
                                            <MetadataCard
                                                label="Connected Platforms"
                                                value={
                                                    data?.contact.integrations && data.contact.integrations.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {data.contact.integrations.map((integration, index) => (
                                                                <Button
                                                                    key={index}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handlePlatformClick(integration)}
                                                                    className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all duration-200 cursor-pointer border border-blue-200 dark:border-blue-700"
                                                                >
                                                                    {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-500 text-sm">No integrations</span>
                                                    )
                                                }
                                            />
                                            <MetadataCard
                                                label="Created"
                                                value={
                                                    data?.contact.createdAt ? new Date(data.contact.createdAt).toLocaleDateString() : 'Unknown'
                                                }
                                            />
                                            <MetadataCard
                                                label="Last Updated"
                                                value={
                                                    data?.contact.updatedAt ? new Date(data.contact.updatedAt).toLocaleDateString() : 'Unknown'
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-800">
                                    <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                                        <ContactForm
                                            contact={data?.contact}
                                            onSubmit={async (contactData) => {
                                                if ('id' in contactData) {
                                                    await handleUpdate(contactData as Contact);
                                                }
                                            }}
                                            isSubmitting={isSubmitting}
                                            buttonText="Edit Contact"
                                        />
                                        <Button
                                            onClick={() => setIsSendMessageModalOpen(true)}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Send Message
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="px-6 py-3 text-red-600 dark:text-red-400 bg-white dark:bg-black border-2 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Contact
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-bold text-black dark:text-white">Delete Contact</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                                        Are you sure you want to delete <strong className="text-black dark:text-white">{data?.contact.name}</strong>? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="px-6 py-3 font-medium border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleDelete}
                                                        disabled={isSubmitting}
                                                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 hover:border-red-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                                                    >
                                                        {isSubmitting ? 'Deleting...' : 'Delete Contact'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Modal */}
            <PlatformModal
                isOpen={isPlatformModalOpen}
                onClose={closePlatformModal}
                platformData={selectedPlatform}
                platformDataFromAPI={platformData as Record<string, unknown>}
                isLoading={!platformData && selectedPlatform !== null}
                error={platformError}
                contact={data?.contact}
            />

            {/* Send Message Modal */}
            <SendMessageModal
                isOpen={isSendMessageModalOpen}
                onClose={() => setIsSendMessageModalOpen(false)}
                contactName={data?.contact.name || 'Unknown'}
            />
        </div>
    );
}
