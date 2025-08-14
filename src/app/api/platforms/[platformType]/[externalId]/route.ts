import { getAuthFromRequest } from '@/lib/server-auth';
import { getIntegrationClient } from '@/lib/integration-app-client';
import { NextRequest, NextResponse } from 'next/server';
import { ContactProvider } from '@/types/webhooks';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ platformType: string; externalId: string }> }
) {
    try {
        // Get the customer ID from auth
        const auth = getAuthFromRequest(request);
        if (!auth.customerId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the platform type and external ID from the URL params
        const { platformType, externalId } = await params;

        // Validate platform type
        const validPlatforms: ContactProvider[] = ['hubspot', 'pipedrive'];
        if (!validPlatforms.includes(platformType as ContactProvider)) {
            return NextResponse.json(
                { error: 'Invalid platform type' },
                { status: 400 }
            );
        }

        // Validate external ID
        if (!externalId || externalId.trim() === '') {
            return NextResponse.json(
                { error: 'External ID is required and cannot be empty' },
                { status: 400 }
            );
        }

        const integrationClient = await getIntegrationClient(auth);
        const result = await integrationClient
            .connection(platformType.toLowerCase())
            .action('delete-contacts')
            .run({ id: externalId });

        return NextResponse.json({
            success: true,
            message: `Contact deleted successfully from ${platformType}`,
            platformType,
            externalId,
            result: result.output
        });

    } catch (error) {
        console.error('Error deleting platform contact:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
