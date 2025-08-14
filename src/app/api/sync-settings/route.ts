import { getAuthFromRequest } from '@/lib/server-auth'
import { SyncSettingsModel } from '@/models/sync-settings'
import { SyncSettings, defaultSyncSettings } from '@/types/sync-settings'
import { safeConnectDB, safeFindOne, safeFindAndUpdate } from '@/lib/db-utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth) {
      console.log('No auth found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!auth.customerId) {
      console.log('No customer ID found')
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 })
    }

    await safeConnectDB(process.env.MONGODB_URI!)

    // Try to find existing settings for this customer
    let settings;
    try {
      settings = await safeFindOne(SyncSettingsModel, { customerId: auth.customerId });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'NOT_FOUND') {
        console.log('Creating default settings for customer:', auth.customerId)
        // Create default settings if none exist
        settings = await SyncSettingsModel.create({
          customerId: auth.customerId,
          ...defaultSyncSettings
        })
        console.log('Created default settings:', settings)
      } else {
        throw error;
      }
    }

    // Convert to the expected format
    const response: SyncSettings = {
      id: settings.id,
      customerId: settings.customerId,
      autoSync: settings.autoSync,
      syncFrequency: settings.syncFrequency,
      conflictResolution: settings.conflictResolution,
      syncDirection: settings.syncDirection,
      webhookNotifications: settings.webhookNotifications,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to fetch sync settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sync settings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/sync-settings called')

    const auth = getAuthFromRequest(request)

    if (!auth) {
      console.log('No auth found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!auth.customerId) {
      console.log('No customer ID found')
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 })
    }

    const body = await request.json()

    const settings: Partial<SyncSettings> = body

    // Validate settings
    const validations = [
      { field: 'autoSync', validation: { isValid: typeof settings.autoSync === 'boolean', error: 'autoSync must be a boolean' } },
      { field: 'syncFrequency', validation: { isValid: ['realtime', '5min', '1hour', 'daily'].includes(settings.syncFrequency || ''), error: 'Invalid sync frequency' } },
      { field: 'conflictResolution', validation: { isValid: ['last-write-wins', 'manual', 'keep-local'].includes(settings.conflictResolution || ''), error: 'Invalid conflict resolution' } },
      { field: 'syncDirection', validation: { isValid: ['bidirectional', 'inbound-only', 'outbound-only'].includes(settings.syncDirection || ''), error: 'Invalid sync direction' } },
      { field: 'webhookNotifications', validation: { isValid: typeof settings.webhookNotifications === 'boolean', error: 'webhookNotifications must be a boolean' } }
    ];

    // Check if any validation failed
    const failedValidations = validations.filter(v => !v.validation.isValid);
    if (failedValidations.length > 0) {
      const fieldErrors: Record<string, string[]> = {};
      failedValidations.forEach(v => {
        fieldErrors[v.field] = [v.validation.error || 'Invalid value'];
      });

      console.log('Validation failed:', fieldErrors)
      return NextResponse.json(
        { error: 'Invalid sync settings', details: fieldErrors },
        { status: 400 }
      )
    }

    await safeConnectDB(process.env.MONGODB_URI!)

    // Upsert settings for this customer
    const result = await safeFindAndUpdate(
      SyncSettingsModel,
      { customerId: auth.customerId },
      {
        customerId: auth.customerId,
        autoSync: settings.autoSync,
        syncFrequency: settings.syncFrequency,
        conflictResolution: settings.conflictResolution,
        syncDirection: settings.syncDirection,
        webhookNotifications: settings.webhookNotifications
      },
      { upsert: true }
    )

    if (!result) {
      throw new Error('Failed to save sync settings');
    }

    return NextResponse.json({
      message: 'Sync settings saved successfully',
      settings: {
        id: result.id,
        customerId: result.customerId,
        autoSync: result.autoSync,
        syncFrequency: result.syncFrequency,
        conflictResolution: result.conflictResolution,
        syncDirection: result.syncDirection,
        webhookNotifications: result.webhookNotifications,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      }
    })
  } catch (error) {
    console.error('Failed to save sync settings:', error)
    return NextResponse.json(
      { error: 'Failed to save sync settings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
