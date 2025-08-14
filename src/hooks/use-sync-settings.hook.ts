import { useState, useEffect } from 'react';
import { 
  SyncSettings, 
  defaultSyncSettings, 
  CreateSyncSettingsData,
  UpdateSyncSettingsData 
} from '@/types/sync-settings';
import { AppError } from '@/types/errors';
import { authenticatedFetcher, getAuthHeaders } from '@/lib/fetch-utils';

// Create a complete default settings object with required fields
const createDefaultSettings = (customerId: string): SyncSettings => ({
  id: `default-${customerId}`,
  customerId,
  ...defaultSyncSettings,
  createdAt: new Date(),
  updatedAt: new Date()
});

export function useSyncSettings() {
  const [settings, setSettings] = useState<SyncSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await authenticatedFetcher<SyncSettings>('/api/sync-settings');
        setSettings(response);
      } catch (err) {
        console.error('Failed to load sync settings:', err);
        const appError: AppError = {
          message: 'Failed to load sync settings',
          code: 'SYNC_SETTINGS_LOAD_ERROR',
          statusCode: 500
        };
        setError(appError);
        
        // Fallback to localStorage if API fails
        try {
          const saved = localStorage.getItem('sync-settings');
          if (saved) {
            const parsed = JSON.parse(saved);
            // Create a complete settings object from parsed data
            const fallbackSettings: SyncSettings = {
              id: parsed.id || `fallback-${Date.now()}`,
              customerId: parsed.customerId || 'unknown',
              ...defaultSyncSettings,
              ...parsed,
              createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
              updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date()
            };
            setSettings(fallbackSettings);
          }
        } catch (localErr) {
          console.error('Failed to load from localStorage:', localErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (newSettings: CreateSyncSettingsData | UpdateSyncSettingsData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Saving settings to API:', newSettings);
      console.log('Auth headers:', getAuthHeaders());
      
      const response = await fetch('/api/sync-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newSettings)
      });
      
      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        // Fallback to localStorage if API fails
        console.log('API failed, falling back to localStorage');
        localStorage.setItem('sync-settings', JSON.stringify(newSettings));
        
        if (settings) {
          // Create a complete settings object by merging with existing settings
          const updatedSettings: SyncSettings = {
            ...settings,
            ...newSettings,
            // Ensure required fields are present
            id: settings.id,
            customerId: settings.customerId,
            createdAt: settings.createdAt,
            updatedAt: new Date()
          };
          setSettings(updatedSettings);
        }
        
        throw new Error(`API save failed: ${response.status} ${response.statusText}. Settings saved locally instead.`);
      }
      
      const result = await response.json();
      console.log('API success response:', result);
      
      // Save to localStorage as backup
      localStorage.setItem('sync-settings', JSON.stringify(newSettings));
      
      if (settings) {
        // Create a complete settings object by merging with existing settings
        const updatedSettings: SyncSettings = {
          ...settings,
          ...newSettings,
          // Ensure required fields are present
          id: settings.id,
          customerId: settings.customerId,
          createdAt: settings.createdAt,
          updatedAt: new Date()
        };
        setSettings(updatedSettings);
      }
    } catch (err) {
      console.error('Failed to save sync settings:', err);
      const appError: AppError = {
        message: 'Failed to save sync settings',
        code: 'SYNC_SETTINGS_SAVE_ERROR',
        statusCode: 500
      };
      setError(appError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    // Get customer ID from current settings or use a default
    const customerId = settings?.customerId || 'default';
    const resetSettings = createDefaultSettings(customerId);
    setSettings(resetSettings);
    localStorage.removeItem('sync-settings');
    setError(null);
  };

  const updateSettings = (updates: Partial<SyncSettings>) => {
    if (settings) {
      const updatedSettings: SyncSettings = {
        ...settings,
        ...updates,
        updatedAt: new Date()
      };
      setSettings(updatedSettings);
    }
  };

  // Get current settings or create default if not loaded
  const currentSettings = settings || createDefaultSettings('default');

  return {
    settings: currentSettings,
    isLoading,
    error,
    saveSettings,
    resetSettings,
    updateSettings
  };
}
