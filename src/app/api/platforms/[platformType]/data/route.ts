import { getAuthFromRequest } from '@/lib/server-auth';
import { getIntegrationClient } from '@/lib/integration-app-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platformType: string }> }
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

        // Get the platform type from the URL params
        const { platformType } = await params;

        const integrationClient = await getIntegrationClient(auth);

        // Get the integration ID from query parameters
        const { searchParams } = new URL(request.url);
        const integrationId = searchParams.get('id');

        if (!integrationId || integrationId.trim() === '') {
            return NextResponse.json(
                { error: 'Integration ID is required and cannot be empty' },
                { status: 400 }
            );
        }

        const platformData = await integrationClient
            .connection(platformType.toLowerCase())
            .action('find-by-id-contacts')
            .run({ id: integrationId });

        return NextResponse.json({
            metadata: {
                platformType: platformType,
                lastSyncStatus: 'success',
                data: platformData.output.fields
            },
            lastSync: new Date().toISOString(),
            url: null, // Will be set based on your platform logic
        });

    } catch (error) {
        console.error('Error fetching platform data:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
