import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacts",
}

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 