import connectDB from '@/lib/mongodb';
import { getAuthFromRequest } from '@/lib/server-auth';
import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/lib/contact.service';
import { IntegrationActionsService } from '@/lib/integration-actions.service';
import { Contact } from '@/types';

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

    // Filter contacts by customerId
    const contacts = await ContactService.findContactsByCustomer(
      auth.customerId,
      {
        select: 'id name email phone jobTitle pronouns integrations createdAt updatedAt',
        sort: { createdAt: -1 }
      }
    );

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone, jobTitle, pronouns } = body;

    // Validate required fields
    if (!name || !email || !phone || !jobTitle || !pronouns) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const contact = await ContactService.createContact({
      name,
      email,
      phone,
      jobTitle,
      pronouns,
      customerId: auth.customerId,
    });

    await IntegrationActionsService.createContactAcrossIntegrations(auth, contact);

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, email, phone, jobTitle, pronouns } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update contact
    const contact = await ContactService.updateContact(
      id,
      auth.customerId,
      { name, email, phone, jobTitle, pronouns }
    );

    await IntegrationActionsService.updateContactAcrossIntegrations(auth, contact as Contact);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ contact }, { status: 200 });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const contact = await ContactService.findContactById(id, auth.customerId);
    const deleted = await ContactService.deleteContact(id, auth.customerId);

    await IntegrationActionsService.deleteContactAcrossIntegrations(auth, contact as Contact);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}