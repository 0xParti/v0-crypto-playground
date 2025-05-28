"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function RSAVisualization() {
  const [step, setStep] = useState(0)
  const totalSteps = 6

  const nextStep = () => {
    setStep((prev) => (prev + 1) % (totalSteps + 1))
  }

  const prevStep = () => {
    setStep((prev) => (prev - 1 + (totalSteps + 1)) % (totalSteps + 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">RSA Encryption and Decryption</h3>
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
        <div className="flex flex-col min-h-full justify-between space-y-4">
          {/* Key Generation */}
          <div className={`transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
            <div className="text-xs font-medium mb-1">Key Generation:</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                <div className="font-medium">Private Key</div>
                <div className="font-mono mt-1 text-[10px]">(d, n)</div>
              </div>
              <div className="p-2 bg-green-100 border border-green-300 rounded text-xs">
                <div className="font-medium">Public Key</div>
                <div className="font-mono mt-1 text-[10px]">(e, n)</div>
              </div>
            </div>
          </div>

          {/* Encryption */}
          {step >= 2 && step <= 4 && (
            <>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-16 text-xs font-medium">Plaintext:</div>
                <div className="flex-1 p-2 bg-blue-100 border border-blue-300 rounded text-xs font-mono">M</div>
              </div>

              {step >= 3 && (
                <div className="flex flex-col items-center my-2">
                  <svg className="w-6 h-6 text-gray-500 my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="p-2 bg-green-100 border border-green-300 rounded text-xs w-64 text-center">
                    Encrypt with Public Key (e, n)
                    <div className="font-mono mt-1 text-[10px]">C = M^e mod n</div>
                  </div>
                </div>
              )}

              {step >= 4 && (
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs font-medium">Ciphertext:</div>
                  <div className="flex-1 p-2 bg-purple-100 border border-purple-300 rounded text-xs font-mono">C</div>
                </div>
              )}
            </>
          )}

          {/* Decryption */}
          {step >= 5 && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-16 text-xs font-medium">Ciphertext:</div>
                <div className="flex-1 p-2 bg-purple-100 border border-purple-300 rounded text-xs font-mono">C</div>
              </div>

              <div className="flex flex-col items-center my-2">
                <svg className="w-6 h-6 text-gray-500 my-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs w-64 text-center">
                  Decrypt with Private Key (d, n)
                  <div className="font-mono mt-1 text-[10px]">M = C^d mod n</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-16 text-xs font-medium">Plaintext:</div>
                <div className="flex-1 p-2 bg-blue-100 border border-blue-300 rounded text-xs font-mono">M</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">{getStepDescription(step)}</div>
    </div>
  )
}

function getStepDescription(step) {
  const descriptions = [
    "RSA is an asymmetric encryption algorithm that uses a pair of keys: public for encryption and private for decryption.",
    "Step 1: Key Generation - Generate two large prime numbers p and q, compute n = p×q, and select e and d such that (e×d) mod φ(n) = 1.",
    "Step 2: To encrypt a message, first convert it to a number M (smaller than n).",
    "Step 3: Encryption - Compute ciphertext C = M^e mod n using the recipient's public key (e, n).",
    "Step 4: The encrypted message (ciphertext) can only be decrypted with the private key.",
    "Step 5: Decryption - Compute plaintext M = C^d mod n using the private key (d, n).",
    "RSA security relies on the difficulty of factoring the product of two large prime numbers.",
  ]

  return descriptions[step] || descriptions[0]
}
