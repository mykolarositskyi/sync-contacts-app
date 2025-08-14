import { ContactDetails } from "./contact-details";

interface ContactPageProps {
    params: Promise<{
        contactId: string;
    }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { contactId } = await params;

    return <ContactDetails contactId={contactId} />;
}