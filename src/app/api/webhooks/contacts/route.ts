import { Logger } from '@/lib/logger';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { handleContactWebhook } from './handler';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    if (
        !request.headers.get('x-webhook-token') ||
        // The crypto.timingSafeEqual() function is used to determine whether two variables are equal without exposing timing information
        // that may allow an attacker to guess one of the values. A constant-time algorithm underpins it.
        !crypto.timingSafeEqual(
            Buffer.from(request.headers.get('x-webhook-token') || ''),
            Buffer.from(process.env.INTEGRATION_APP_WEBHOOK_API_KEY || '')
        )
    ) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 500 }
        )
    }

    const logger = new Logger('webhooks/contacts');
    const body = await request.json();

    logger.log(JSON.stringify(body))
    // TODO: Handle idempotency with hashing eventType, externalContactId, customerId and data.createdTime before calling the handler

    await handleContactWebhook(body);

    return NextResponse.json({ message: 'App received webhook' });
}
