"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AuthTest() {
  const { customerId, customerName, setCustomerName } = useAuth()
  const [nameInput, setNameInput] = useState("")

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Test Customer</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
          This customer id and name will be used to connect external apps and
          run integrations.
        </p>
        <p className="font-mono text-sm">
          Customer ID: {customerId || "Loading..."}
        </p>
        <p>Name: {customerName || "Not set"}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Enter customer name"
          className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
        />
        <Button
          onClick={() => {
            if (nameInput.trim()) {
              setCustomerName(nameInput.trim())
              setNameInput("")
            }
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
        >
          Update Name
        </Button>
      </div>
    </div>
  )
}
