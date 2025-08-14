'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Contact } from '@/models/contact';
import { Building, ExternalLink, Globe, Zap, AlertCircle, CheckCircle, Clock } from "lucide-react";

// Utility function to transform any nested data structure into flat key-value pairs
function transformDataToKeyValuePairs(data: unknown, prefix: string = ''): Array<{ key: string; value: string }> {
    const result: Array<{ key: string; value: string }> = [];

    if (data === null || data === undefined) {
        return result;
    }

    if (Array.isArray(data)) {
        // Handle arrays - only process if they have meaningful content
        if (data.length === 0) {
            return result;
        }

        // For arrays, create indexed keys
        data.forEach((item, index) => {
            if (item !== null && item !== undefined) {
                const newPrefix = prefix ? `${prefix}[${index}]` : `[${index}]`;
                const nestedPairs = transformDataToKeyValuePairs(item, newPrefix);
                result.push(...nestedPairs);
            }
        });
    } else if (typeof data === 'object') {
        // Handle objects
        const keys = Object.keys(data as Record<string, unknown>);
        if (keys.length === 0) {
            return result;
        }

        keys.forEach(key => {
            const value = (data as Record<string, unknown>)[key];
            if (value !== null && value !== undefined) {
                const newPrefix = prefix ? `${prefix}.${key}` : key;

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // Recursively process nested objects
                    const nestedPairs = transformDataToKeyValuePairs(value, newPrefix);
                    if (nestedPairs.length > 0) {
                        result.push(...nestedPairs);
                    }
                } else if (Array.isArray(value)) {
                    // Handle nested arrays
                    if (value.length > 0) {
                        const nestedPairs = transformDataToKeyValuePairs(value, newPrefix);
                        result.push(...nestedPairs);
                    }
                } else {
                    // Handle primitive values
                    result.push({
                        key: newPrefix,
                        value: String(value)
                    });
                }
            }
        });
    } else {
        // Handle primitive values
        result.push({
            key: prefix || 'value',
            value: String(data)
        });
    }

    return result;
}

interface PlatformData {
    type: string;
    metadata?: Record<string, unknown>;
    url?: string;
}

interface PlatformModalProps {
    isOpen: boolean;
    onClose: () => void;
    platformData: PlatformData | null;
    platformDataFromAPI?: Record<string, unknown>;
    isLoading?: boolean;
    error?: unknown;
    contact?: Contact; // Add contact data to access integrations
}

export function PlatformModal({ isOpen, onClose, platformData, platformDataFromAPI, isLoading, error, contact }: PlatformModalProps) {
    if (!platformData) return null;

    // Combine original platform data with API data
    const enrichedPlatformData: PlatformData = {
        ...platformData,
        ...(platformDataFromAPI || {})
    };

    // Find the matching integration for the current platform
    console.log('PlatformModal - contact:', contact);
    console.log('PlatformModal - platformData:', platformData);
    const matchingIntegration = contact?.integrations?.find(
        (integration) => integration.type === platformData.type
    );

    // Helper function to check if there's no error
    const hasNoError = !error;

    const getPlatformIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'hubspot':
                return <Building className="w-6 h-6" />;
            case 'pipedrive':
                return <Globe className="w-6 h-6" />;
            default:
                return <Zap className="w-6 h-6" />;
        }
    };

    const getPlatformColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'hubspot':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700';
            case 'pipedrive':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-black dark:text-white">
                            {platformData.type.charAt(0).toUpperCase() + platformData.type.slice(1)} Platform Details
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-8">
                        {/* Platform Header */}
                        <div className="flex items-center space-x-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
                            <div className={`p-3 rounded-xl border-2 ${getPlatformColor(platformData.type)}`}>
                                {getPlatformIcon(platformData.type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-black dark:text-white">
                                    {platformData.type.charAt(0).toUpperCase() + platformData.type.slice(1)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Connected platform integration
                                </p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mb-4">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading platform data...</p>
                            </div>
                        ) : null}

                        {/* Error State */}
                        {error !== null && error !== undefined && (
                            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <span className="font-bold text-lg text-red-900 dark:text-red-100">Error Loading Data</span>
                                </div>
                                <p className="text-red-700 dark:text-red-300 mb-3">
                                    Failed to load platform data. Please try again later.
                                </p>
                                {error instanceof Error && (
                                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-xl border border-red-200 dark:border-red-700">
                                        {error.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Platform Actions */}
                        {hasNoError && (
                            <div className="flex justify-center sm:justify-start">
                                {enrichedPlatformData.url && (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => window.open(enrichedPlatformData.url!, '_blank')}
                                        className="px-6 py-3 font-semibold border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View in {platformData.type.charAt(0).toUpperCase() + platformData.type.slice(1)}
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Last Sync Info */}
                        {hasNoError && matchingIntegration?.lastSyncedAt && (
                            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-lg text-green-900 dark:text-green-100">Last Synchronized</span>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Data is up to date
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">
                                        {new Date(matchingIntegration.lastSyncedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Metadata Display */}
                        {hasNoError && enrichedPlatformData.metadata && Object.keys(enrichedPlatformData.metadata).length > 0 && (
                            <div className="space-y-6">
                                <div className="text-center sm:text-left">
                                    <h4 className="font-bold text-xl text-black dark:text-white">Platform Data</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Detailed information from {platformData.type}
                                    </p>
                                </div>
                                <div className="max-h-96 overflow-y-auto border-2 border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                        {transformDataToKeyValuePairs(enrichedPlatformData.metadata).map(({ key, value }) => (
                                            <div key={key} className="p-4 bg-white dark:bg-black rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200">
                                                <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize mb-2">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </dt>
                                                <dd className="text-sm text-black dark:text-white break-words leading-relaxed">
                                                    {value}
                                                </dd>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Data Message */}
                        {hasNoError && (!enrichedPlatformData.metadata || transformDataToKeyValuePairs(enrichedPlatformData.metadata).length === 0) && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No additional platform data available</p>
                                                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        This platform doesn&apos;t have additional metadata to display
                                    </p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
