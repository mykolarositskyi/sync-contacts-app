import connectDB from "@/lib/mongodb";
import { getAuthFromRequest } from "@/lib/server-auth";
import { ContactService } from "@/lib/contact.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Get the customer ID from auth
        const auth = getAuthFromRequest(request);
        if (!auth.customerId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get contact ID from URL
        const contactId = request.url.split('/').pop();
        if (!contactId) {
            return NextResponse.json(
                { error: 'Contact ID is required' },
                { status: 400 }
            );
        }

        // Filter contacts by customerId
        const contact = await ContactService.findContactById(
            contactId,
            auth.customerId,
            'id name email phone jobTitle pronouns integrations createdAt updatedAt'
        );

        if (!contact) {
            return NextResponse.json(
                { error: 'Contact not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ contact }, { status: 200 });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}