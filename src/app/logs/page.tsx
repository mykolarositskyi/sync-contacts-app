"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Activity, Clock, User, Mail } from "lucide-react"

// Mock data for logs
const mockLogs = [
  {
    id: 1,
    action: "contact_created",
    contactName: "John Doe",
    contactEmail: "john.doe@example.com",
    initiator: "sync_app",
    timestamp: "2024-01-15T10:30:00Z",
    details: "New contact created via manual entry"
  },
  {
    id: 2,
    action: "contact_updated",
    contactName: "Jane Smith",
    contactEmail: "jane.smith@example.com",
    initiator: "hubspot",
    timestamp: "2024-01-15T09:15:00Z",
    details: "Contact information updated from HubSpot"
  },
  {
    id: 3,
    action: "contact_deleted",
    contactName: "Bob Johnson",
    contactEmail: "bob.johnson@example.com",
    initiator: "pipedrive",
    timestamp: "2024-01-15T08:45:00Z",
    details: "Contact removed from Pipedrive"
  },
  {
    id: 4,
    action: "contact_created",
    contactName: "Alice Brown",
    contactEmail: "alice.brown@example.com",
    initiator: "hubspot",
    timestamp: "2024-01-15T07:20:00Z",
    details: "Contact imported from HubSpot"
  },
  {
    id: 5,
    action: "contact_updated",
    contactName: "Charlie Wilson",
    contactEmail: "charlie.wilson@example.com",
    initiator: "sync_app",
    timestamp: "2024-01-15T06:30:00Z",
    details: "Contact details updated manually"
  },
  {
    id: 6,
    action: "contact_created",
    contactName: "Diana Davis",
    contactEmail: "diana.davis@example.com",
    initiator: "pipedrive",
    timestamp: "2024-01-15T05:15:00Z",
    details: "Contact created in Pipedrive"
  }
]

const actionLabels = {
  contact_created: "Created",
  contact_updated: "Updated", 
  contact_deleted: "Deleted"
}

const actionColors = {
  contact_created: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700",
  contact_updated: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700",
  contact_deleted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700"
}

const initiatorLabels = {
  sync_app: "Sync App",
  hubspot: "HubSpot",
  pipedrive: "Pipedrive"
}

const initiatorColors = {
  sync_app: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700",
  hubspot: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-700",
  pipedrive: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
}

export default function LogsPage() {
  const [filterAction, setFilterAction] = useState<string>("all")
  const [filterInitiator, setFilterInitiator] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = mockLogs.filter(log => {
    const matchesAction = filterAction === "all" || log.action === filterAction
    const matchesInitiator = filterInitiator === "all" || log.initiator === filterInitiator
    const matchesSearch = searchQuery === "" || 
      log.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesAction && matchesInitiator && matchesSearch
  })

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black dark:text-white mb-6 leading-none">
              Activity Logs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Track all contact synchronization activities and changes across your integrated platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-16">
        <div className="container mx-auto px-6 lg:px-8">
          <Card className="border-2 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl text-black dark:text-white">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-semibold text-black dark:text-white">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search contacts or details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action-filter" className="text-sm font-semibold text-black dark:text-white">
                    Action Type
                  </Label>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="contact_created">Contact Created</SelectItem>
                      <SelectItem value="contact_updated">Contact Updated</SelectItem>
                      <SelectItem value="contact_deleted">Contact Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initiator-filter" className="text-sm font-semibold text-black dark:text-white">
                    Source
                  </Label>
                  <Select value={filterInitiator} onValueChange={setFilterInitiator}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="sync_app">Sync App</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Logs Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Activity Logs
            </h2>
            <Badge variant="secondary" className="text-sm font-semibold">
              <Activity className="w-3 h-3 mr-1" />
              {filteredLogs.length} logs found
            </Badge>
          </div>

          {filteredLogs.length === 0 ? (
            <Card className="border-2 border-gray-200 dark:border-gray-800">
              <CardContent className="py-16 text-center">
                <Activity className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No logs found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="border-2 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        {/* Action and Source Badges */}
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="secondary"
                            className={`${actionColors[log.action as keyof typeof actionColors]} hover:${actionColors[log.action as keyof typeof actionColors]}`}
                          >
                            {actionLabels[log.action as keyof typeof actionColors]}
                          </Badge>
                          <Badge 
                            variant="secondary"
                            className={`${initiatorColors[log.initiator as keyof typeof initiatorColors]} hover:${initiatorColors[log.initiator as keyof typeof initiatorColors]}`}
                          >
                            {initiatorLabels[log.initiator as keyof typeof initiatorColors]}
                          </Badge>
                        </div>
                        
                        {/* Contact Information */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <h3 className="font-bold text-lg text-black dark:text-white">
                              {log.contactName}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <p className="text-gray-600 dark:text-gray-400">
                              {log.contactEmail}
                            </p>
                          </div>
                        </div>
                        
                        {/* Details */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {log.details}
                        </p>
                      </div>
                      
                      {/* Timestamp */}
                      <div className="flex items-center gap-2 text-right lg:text-left">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
