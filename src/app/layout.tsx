import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { IntegrationProvider } from "./integration-provider"
import { AuthProvider } from "./auth-provider"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Contact Sync Hub",
    template: "%s | Contact Sync Hub",
  },
  description: "A powerful contact management platform that seamlessly syncs your contacts across multiple CRM systems with real-time bidirectional synchronization.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AuthProvider>
          <IntegrationProvider>
            <Header />
            <main>
              {children}
            </main>
          </IntegrationProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
