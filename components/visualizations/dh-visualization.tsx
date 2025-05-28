"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DHVisualization() {
  const [step, setStep] = useState(0)
  const totalSteps = 5

  const nextStep = () => {
    setStep((prev) => (prev + 1) % (totalSteps + 1))
  }

  const prevStep = () => {
    setStep((prev) => (prev - 1 + (totalSteps + 1)) % (totalSteps + 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Diffie-Hellman Key Exchange</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={prevStep}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextStep}>
            Next
          </Button>
        </div>
      </div>

      <div className="relative h-96 border rounded-lg bg-muted/20 overflow-y-auto p-4">
        <div className="grid grid-cols-2 min-h-full gap-8">
          {/* Alice */}
          <div className="flex flex-col justify-start gap-3">
            <div className="text-sm font-medium text-center pb-2 border-b">Alice</div>

            {/* Public Parameters */}
            {step >= 1 && (
              <div className="mx-auto p-2 bg-gray-100 border border-gray-300 rounded text-xs text-center w-full">
                <div className="font-medium">Public Parameters</div>
                <div className="font-mono mt-1 text-[10px]">Prime p, Generator g</div>
              </div>
            )}

            {/* Private Key */}
            {step >= 2 && (
              <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                <div className="font-medium">Private Key</div>
                <div className="font-mono mt-1 text-[10px]">a (random number)</div>
              </div>
            )}

            {/* Public Key */}
            {step >= 3 && (
              <>
                <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-green-100 border border-green-300 rounded text-xs">
                  <div className="font-medium">Public Key</div>
                  <div className="font-mono mt-1 text-[10px]">A = g^a mod p</div>
                </div>
              </>
            )}

            {/* Exchange */}
            {step >= 4 && (
              <div className="flex justify-center items-center mt-2">
                <div className="p-2 bg-blue-100 border border-blue-300 rounded-full text-xs font-medium">
                  Send A to Bob
                </div>
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            )}

            {/* Shared Secret */}
            {step >= 5 && (
              <>
                <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-purple-100 border border-purple-300 rounded text-xs">
                  <div className="font-medium">Shared Secret</div>
                  <div className="font-mono mt-1 text-[10px]">s = B^a mod p</div>
                </div>
              </>
            )}
          </div>

          {/* Bob */}
          <div className="flex flex-col justify-start gap-3">
            <div className="text-sm font-medium text-center pb-2 border-b">Bob</div>

            {/* Public Parameters */}
            {step >= 1 && (
              <div className="mx-auto p-2 bg-gray-100 border border-gray-300 rounded text-xs text-center w-full">
                <div className="font-medium">Public Parameters</div>
                <div className="font-mono mt-1 text-[10px]">Prime p, Generator g</div>
              </div>
            )}

            {/* Private Key */}
            {step >= 2 && (
              <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                <div className="font-medium">Private Key</div>
                <div className="font-mono mt-1 text-[10px]">b (random number)</div>
              </div>
            )}

            {/* Public Key */}
            {step >= 3 && (
              <>
                <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-green-100 border border-green-300 rounded text-xs">
                  <div className="font-medium">Public Key</div>
                  <div className="font-mono mt-1 text-[10px]">B = g^b mod p</div>
                </div>
              </>
            )}

            {/* Exchange */}
            {step >= 4 && (
              <div className="flex justify-center items-center mt-2">
                <svg
                  className="w-10 h-10 text-gray-400 rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="p-2 bg-blue-100 border border-blue-300 rounded-full text-xs font-medium">
                  Send B to Alice
                </div>
              </div>
            )}

            {/* Shared Secret */}
            {step >= 5 && (
              <>
                <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-purple-100 border border-purple-300 rounded text-xs">
                  <div className="font-medium">Shared Secret</div>
                  <div className="font-mono mt-1 text-[10px]">s = A^b mod p</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">{getStepDescription(step)}</div>
    </div>
  )
}

function getStepDescription(step) {
  const descriptions = [
    "Diffie-Hellman key exchange allows two parties to establish a shared secret key over an insecure channel without any prior secrets.",
    "Step 1: Alice and Bob agree on public parameters: a large prime number p and a generator g.",
    "Step 2: Alice chooses a private key a, and Bob chooses a private key b. These are kept secret.",
    "Step 3: Alice computes her public key A = g^a mod p, and Bob computes his public key B = g^b mod p.",
    "Step 4: Alice and Bob exchange their public keys over the insecure channel. An eavesdropper can see A and B, but cannot easily determine a or b.",
    "Step 5: Alice computes the shared secret s = B^a mod p, and Bob computes s = A^b mod p. These are mathematically identical: s = g^(ab) mod p.",
  ]

  return descriptions[step] || descriptions[0]
}
