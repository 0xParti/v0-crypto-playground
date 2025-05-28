"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function HashVisualization() {
  const [step, setStep] = useState(0)
  const totalSteps = 4

  const nextStep = () => {
    setStep((prev) => (prev + 1) % (totalSteps + 1))
  }

  const prevStep = () => {
    setStep((prev) => (prev - 1 + (totalSteps + 1)) % (totalSteps + 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Hash Function Process</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={prevStep}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextStep}>
            Next
          </Button>
        </div>
      </div>

      <div className="relative h-80 border rounded-lg bg-muted/20 overflow-y-auto p-4">
        <div className="flex flex-col min-h-full justify-between space-y-4">
          {/* Input data */}
          <div className={`transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs font-medium">Input:</div>
              <div className="flex-1 p-2 bg-blue-100 border border-blue-300 rounded text-xs font-mono">
                Data of arbitrary length
              </div>
            </div>
          </div>

          {/* Preprocessing */}
          {step >= 2 && (
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-500 my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs w-full text-center">
                Preprocessing (padding, length encoding)
              </div>
            </div>
          )}

          {/* Compression function */}
          {step >= 3 && (
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-500 my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <div className="p-2 bg-green-100 border border-green-300 rounded text-xs w-full text-center">
                Compression Function (processes blocks in iterations)
              </div>
            </div>
          )}

          {/* Output */}
          {step >= 4 && (
            <div className="flex items-center gap-2">
              <div className="w-16 text-xs font-medium">Output:</div>
              <div className="flex-1 p-2 bg-purple-100 border border-purple-300 rounded text-xs font-mono">
                Fixed-size hash value (e.g., 256 bits for SHA-256)
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">{getStepDescription(step)}</div>
    </div>
  )
}

function getStepDescription(step) {
  const descriptions = [
    "Hash functions transform input data of arbitrary size into a fixed-size output with unique properties.",
    "Step 1: The hash function takes input data of any length.",
    "Step 2: The input is preprocessed by adding padding and length information to ensure security properties.",
    "Step 3: The data is processed through a compression function that operates on fixed-size blocks, maintaining an internal state.",
    "Step 4: The final state is output as the fixed-size hash value, which is unique to the input data.",
  ]

  return descriptions[step] || descriptions[0]
}
