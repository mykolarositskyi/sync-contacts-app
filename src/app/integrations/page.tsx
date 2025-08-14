import { IntegrationList } from "./components/integrations-list"

export default function Integrations() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black dark:text-white mb-6 leading-none">
              Integrations
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Connect your CRM tools and start syncing contacts automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations List */}
      <section className="pb-24">
        <div className="container mx-auto px-6 lg:px-8">
          <IntegrationList />
        </div>
      </section>
    </div>
  )
}
