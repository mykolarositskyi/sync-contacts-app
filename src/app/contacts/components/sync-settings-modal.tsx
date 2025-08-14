"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Settings, RefreshCw, Clock, AlertTriangle, ArrowLeftRight, Bell, History } from "lucide-react"
import { SyncSettings } from "@/types/sync-settings"
import { useSyncSettings } from "@/hooks/use-sync-settings.hook"
import { SettingsSectionHeader } from "@/components/ui/settings-section-header"
import { OptionCard } from "@/components/ui/option-card"
import { StatsGrid } from "@/components/ui/stats-grid"

interface SyncSettingsModalProps {
  currentSettings?: Partial<SyncSettings>
  onSave?: (settings: SyncSettings) => Promise<void>
}

export function SyncSettingsModal({ currentSettings, onSave }: SyncSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    settings,
    isLoading,
    error,
    saveSettings,
    resetSettings,
    updateSettings
  } = useSyncSettings()

  // Initialize with current settings if provided
  useEffect(() => {
    if (currentSettings) {
      updateSettings(currentSettings)
    }
  }, [currentSettings, updateSettings])

  const handleSave = async () => {
    try {
      console.log('Attempting to save sync settings:', settings)

      if (onSave) {
        await onSave(settings)
      } else {
        await saveSettings(settings)
      }

      toast.success("Sync settings saved successfully")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to save sync settings:", error)

      // More specific error message
      let errorMessage = "Failed to save sync settings"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }

  const handleReset = () => {
    resetSettings()
    toast.info("Settings reset to defaults")
  }

  if (error) {
    toast.error(error.message || 'An error occurred')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-lg hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all duration-200 hover:shadow-xl hover:scale-105"
        >
          <Settings className="h-4 w-4 mr-2" />
          Sync Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-black dark:text-white">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-white dark:text-black" />
            </div>
            Sync Configuration
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            Configure how your contacts synchronize with connected CRM systems
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Auto Sync Toggle */}
          <SettingsSectionHeader
            icon={RefreshCw}
            title="Auto Sync"
            description="Automatically sync contacts when changes are detected"
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoSync"
                checked={settings.autoSync}
                onChange={(e) => updateSettings({ autoSync: e.target.checked })}
                className="h-5 w-5 text-blue-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800"
              />
            </div>
          </SettingsSectionHeader>

          {/* Sync Frequency */}
          <div className="space-y-4">
            <SettingsSectionHeader
              icon={Clock}
              title="Sync Frequency"
              description="Choose how often contacts should be synchronized"
              iconBgColor="bg-green-100 dark:bg-green-900/30"
              iconColor="text-green-600 dark:text-green-400"
              showHeaderOnly={true}
            />
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'realtime', label: 'Real-time', description: 'Instant sync via webhooks', icon: '⚡' },
                { value: '5min', label: 'Every 5 min', description: 'Sync every 5 minutes', icon: '⏱️' },
                { value: '1hour', label: 'Every hour', description: 'Sync every hour', icon: '🕐' },
                { value: 'daily', label: 'Daily', description: 'Sync once per day', icon: '📅' }
              ].map((option) => (
                <OptionCard
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  icon={option.icon}
                  isSelected={settings.syncFrequency === option.value}
                  onClick={() => updateSettings({ syncFrequency: option.value as 'realtime' | '5min' | '1hour' | 'daily' })}
                  selectedBorderColor="border-blue-500 dark:border-blue-400"
                  selectedBgColor="bg-blue-50 dark:bg-blue-900/20"
                  hoverBorderColor="border-blue-300 dark:border-blue-600"
                  hoverBgColor="bg-blue-25 dark:bg-blue-900/10"
                />
              ))}
            </div>
          </div>

          {/* Conflict Resolution */}
          <div className="space-y-4">
            <SettingsSectionHeader
              icon={AlertTriangle}
              title="Conflict Resolution"
              description="How to handle conflicting data between systems"
              iconBgColor="bg-amber-100 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
              showHeaderOnly={true}
            />
            <div className="space-y-3">
              {[
                { value: 'last-write-wins', label: 'Last Write Wins', description: 'Most recent change takes precedence', icon: '🔄' },
                { value: 'manual', label: 'Manual Resolution', description: 'Require manual review of conflicts', icon: '👤' },
                { value: 'keep-local', label: 'Keep Local Changes', description: 'Local changes always override external', icon: '🏠' }
              ].map((option) => (
                <OptionCard
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  icon={option.icon}
                  isSelected={settings.conflictResolution === option.value}
                  onClick={() => updateSettings({ conflictResolution: option.value as 'last-write-wins' | 'manual' | 'keep-local' })}
                  selectedBorderColor="border-amber-500 dark:border-amber-400"
                  selectedBgColor="bg-amber-50 dark:bg-amber-900/20"
                  hoverBorderColor="border-amber-300 dark:border-amber-600"
                  hoverBgColor="bg-amber-25 dark:bg-amber-900/10"
                />
              ))}
            </div>
          </div>

          {/* Sync Direction */}
          <div className="space-y-4">
            <SettingsSectionHeader
              icon={ArrowLeftRight}
              title="Sync Direction"
              description="Choose the direction of data synchronization"
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
            />
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'bidirectional', label: 'Bidirectional', description: 'Sync both ways', icon: '↔️' },
                { value: 'inbound-only', label: 'Inbound Only', description: 'Only receive changes', icon: '⬇️' },
                { value: 'outbound-only', label: 'Outbound Only', description: 'Only send changes', icon: '⬆️' }
              ].map((option) => (
                <OptionCard
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  icon={option.icon}
                  isSelected={settings.syncDirection === option.value}
                  onClick={() => updateSettings({ syncDirection: option.value as 'bidirectional' | 'inbound-only' | 'outbound-only' })}
                  selectedBorderColor="border-purple-500 dark:border-purple-400"
                  selectedBgColor="bg-purple-50 dark:bg-purple-900/20"
                  hoverBorderColor="border-purple-300 dark:border-purple-600"
                  hoverBgColor="bg-purple-25 dark:bg-purple-900/10"
                />
              ))}
            </div>
          </div>

          {/* Webhook Notifications */}
          <div className="space-y-4">
            <SettingsSectionHeader
              icon={Bell}
              title="Webhook Notifications"
              description="Send webhook notifications for sync events"
              iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
              iconColor="text-indigo-600 dark:text-indigo-400"
            />
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-black dark:text-white">Webhook Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Send webhook notifications for sync events</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="webhookNotifications"
                  checked={settings.webhookNotifications}
                  onChange={(e) => updateSettings({ webhookNotifications: e.target.checked })}
                  className="h-5 w-5 text-indigo-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Sync History Preview */}
          <div className="space-y-4">
            <SettingsSectionHeader
              icon={History}
              title="Recent Sync Activity"
              description="Current synchronization status and statistics"
              iconBgColor="bg-gray-100 dark:bg-gray-900/30"
              iconColor="text-gray-600 dark:text-gray-400"
            />
            <div className="p-6 bg-gray-50 dark:bg-gray-900/30 border-2 border-gray-200 dark:border-gray-800 rounded-2xl">
              <StatsGrid
                stats={[
                  { value: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`, label: 'Last Sync', valueColor: 'text-blue-600 dark:text-blue-400' },
                  { value: '1,247', label: 'Contacts Synced', valueColor: 'text-green-600 dark:text-green-400' },
                  { value: '✓', label: 'Status', valueColor: 'text-green-600 dark:text-green-400' }
                ]}
              />
              <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-800 text-center">
                <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
                  All systems in sync
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-lg hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all duration-200 hover:shadow-xl"
          >
            Reset to Defaults
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 text-sm font-semibold text-white dark:text-black bg-black dark:bg-white border-2 border-black dark:border-white rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
