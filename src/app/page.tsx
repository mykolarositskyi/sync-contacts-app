import { ArrowRight, Users, Link as LinkIcon, RefreshCw, Shield, Zap, CheckCircle, Database, Building2, Play } from "lucide-react"
import Link from "next/link"
import { AuthTest } from "@/components/auth-test"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Overview",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-8 pt-32 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-black dark:text-white mb-8 leading-none">
              Contact
              <br />
              <span className="text-gray-400 dark:text-gray-600">Sync Hub</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
              Seamlessly synchronize your contacts across multiple CRM systems with real-time bidirectional updates.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/contacts">
                <Button size="lg" className="group bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/integrations">
                <Button variant="outline" size="lg" className="border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                  View Integrations
                </Button>
              </Link>
            </div>
            
            {/* Platform Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full font-medium">
                <Building2 className="w-4 h-4 mr-2" />
                HubSpot
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full font-medium">
                <Database className="w-4 h-4 mr-2" />
                Pipedrive
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Real-time Sync
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage and synchronize your contacts across platforms
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="group bg-white dark:bg-black p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Contact Management</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Create, edit, and organize contacts with an intuitive interface. Full CRUD operations with real-time updates.
              </p>
            </div>

            <div className="group bg-white dark:bg-black p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LinkIcon className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">CRM Integrations</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Connect to popular CRM systems like HubSpot and Pipedrive. Easy setup with powerful SDK integration.
              </p>
            </div>

            <div className="group bg-white dark:bg-black p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Bidirectional Sync</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Keep your contacts synchronized across all connected systems. Changes flow both ways automatically.
              </p>
            </div>

            <div className="group bg-white dark:bg-black p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Enterprise-grade security with proper authentication. Webhook handling for real-time updates.
              </p>
            </div>

            <div className="group bg-white dark:bg-black p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Real-time Updates</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Instant synchronization with webhook support. No more manual data entry or outdated information.
              </p>
            </div>

            <div className="group bg-white dark:bg-black p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Easy Setup</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Simple integration process with clear documentation. Get started in minutes, not hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to get your contacts synchronized
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-black text-white dark:text-black">1</span>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gray-300 dark:bg-gray-700 transform -translate-y-1/2"></div>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Connect Your CRMs</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Link your HubSpot, Pipedrive, or other CRM accounts through our secure integration platform.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-black text-white dark:text-black">2</span>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gray-300 dark:bg-gray-700 transform -translate-y-1/2"></div>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Manage Contacts</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Create and organize contacts in our intuitive interface. All changes sync automatically.
              </p>
            </div>

            <div className="text-center group">
              <div className="mb-8">
                <div className="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-black text-white dark:text-black">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Stay Synchronized</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Enjoy real-time bidirectional sync. Your data stays consistent across all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">
              Get Started
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose your path and start managing contacts today
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Link href="/contacts" className="group">
              <div className="bg-white dark:bg-black p-10 rounded-3xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                <div className="w-20 h-20 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white dark:text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">Manage Contacts</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Add, edit, and organize your contacts</p>
                <div className="inline-flex items-center text-black dark:text-white font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>

            <Link href="/integrations" className="group">
              <div className="bg-white dark:bg-black p-10 rounded-3xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                <div className="w-20 h-20 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <LinkIcon className="w-10 h-10 text-white dark:text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">Connect CRMs</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Set up your integrations</p>
                <div className="inline-flex items-center text-black dark:text-white font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  View Integrations <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>
          </div>
          
          {/* Test Auth Section */}
          <div className="text-center">
            <div className="inline-block p-8 bg-white dark:bg-black rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-xl">
              <div className="text-2xl font-bold text-black dark:text-white mb-4">Test Authentication</div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-4">
                <AuthTest />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Check your connection status</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-black dark:bg-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white dark:text-black mb-8 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 max-w-2xl mx-auto mb-12">
            Join thousands of users who have streamlined their contact management
          </p>
          <Link href="/contacts">
            <Button size="lg" className="group bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 px-10 py-5 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-white dark:border-black">
              Start Managing Contacts
              <Play className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
