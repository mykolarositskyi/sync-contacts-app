"use client"

import { useIntegrationApp, useIntegrations } from "@integration-app/react"
import type { Integration as IntegrationAppIntegration } from "@integration-app/sdk"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Plus, Zap, Link as LinkIcon } from "lucide-react"

export function IntegrationList() {
  const integrationApp = useIntegrationApp()
  const { integrations, refresh } = useIntegrations()

  const handleConnect = async (integration: IntegrationAppIntegration) => {
    try {
      await integrationApp.integration(integration.key).openNewConnection()
      refresh()
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  const handleDisconnect = async (integration: IntegrationAppIntegration) => {
    if (!integration.connection?.id) return
    try {
      await integrationApp.connection(integration.connection.id).archive()
      refresh()
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  if (integrations.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6">
          <Zap className="w-10 h-10 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-black dark:text-white mb-3">No integrations available</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for new integration options.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => (
        <div
          key={integration.key}
          className="group relative bg-white dark:bg-black rounded-3xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          {/* Status Indicator Bar */}
          <div className={`h-1 w-full ${
            integration.connection 
              ? 'bg-green-500' 
              : 'bg-gray-300 dark:bg-gray-700'
          }`} />
          
          <div className="p-8">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {integration.logoUri ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={integration.logoUri}
                    alt={`${integration.name} logo`}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-2xl font-black text-white dark:text-black shadow-lg">
                    {integration.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                    {integration.name}
                  </h3>
                  <Badge 
                    variant={integration.connection ? "success" : "secondary"}
                    className="text-xs font-semibold"
                  >
                    {integration.connection ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Available
                      </span>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
              {integration.connection 
                ? 'This integration is actively syncing your data across platforms.'
                : 'Connect to start automatically syncing contacts and data.'
              }
            </p>

            {/* Action Button */}
            <Button
              onClick={() =>
                integration.connection
                  ? handleDisconnect(integration)
                  : handleConnect(integration)
              }
              variant={integration.connection ? "destructive" : "default"}
              size="lg"
              className="w-full group-hover:scale-105 transition-transform duration-200"
            >
              {integration.connection ? (
                <span className="flex items-center justify-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>Disconnect</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Connect Now</span>
                </span>
              )}
            </Button>
          </div>

          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-transparent dark:from-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      ))}
    </div>
  )
}
