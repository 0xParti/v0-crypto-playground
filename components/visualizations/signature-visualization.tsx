"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SignatureVisualization() {
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
        <h3 className="text-lg font-medium">Digital Signature Process</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={prevStep}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextStep}>
            Next
          </Button>
        </div>
      </div>

      <div className="relative h-[500px] border rounded-lg bg-muted/20 overflow-y-auto p-4">
        <div className="grid grid-cols-2 min-h-full gap-8">
          {/* Signing Process */}
          <div className="flex flex-col justify-start gap-3">
            <div className="text-sm font-medium text-center pb-2 border-b">Signing (Alice)</div>

            {/* Original Document */}
            <div className={`transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
              <div className="text-xs font-medium mb-1">Document:</div>
              <div className="p-2 bg-blue-100 border border-blue-300 rounded text-xs">Original Message</div>
            </div>

            {/* Hashing */}
            {step >= 2 && (
              <>
                <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-green-100 border border-green-300 rounded text-xs text-center">
                  Hash Function
                  <div className="font-mono mt-1 text-[10px]">(SHA-256, etc.)</div>
                </div>
              </>
            )}

            {/* Message Digest */}
            {step >= 3 && (
              <>
                <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-purple-100 border border-purple-300 rounded text-xs font-mono">
                  Message Digest (Hash)
                </div>
              </>
            )}

            {/* Signing */}
            {step >= 4 && (
              <>
                <svg className="w-6 h-6 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-center">
                  Sign with Private Key
                  <div className="font-mono mt-1 text-[10px]">(RSA, ECDSA, etc.)</div>
                </div>
              </>
            )}

            {/* Digital Signature */}
            {step >= 5 && (
              <div className="p-2 bg-red-100 border border-red-300 rounded text-xs font-mono">Digital Signature</div>
            )}
          </div>

          {/* Verification Process */}
          <div className="flex flex-col justify-start gap-3">
            <div className="text-sm font-medium text-center pb-2 border-b">Verification (Bob)</div>

            {/* Received Document and Signature */}
            {step >= 5 && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs font-medium mb-1">Received Document:</div>
                    <div className="p-2 bg-blue-100 border border-blue-300 rounded text-xs">Original Message</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1">Received Signature:</div>
                    <div className="p-2 bg-red-100 border border-red-300 rounded text-xs font-mono">
                      Digital Signature
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {/* Hash the received document */}
                  <div>
                    <svg
                      className="w-6 h-6 text-gray-500 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <div className="p-2 bg-green-100 border border-green-300 rounded text-xs text-center">
                      Hash Function
                    </div>
                  </div>

                  {/* Verify the signature */}
                  <div>
                    <svg
                      className="w-6 h-6 text-gray-500 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <div className="p-2 bg-orange-100 border border-orange-300 rounded text-xs text-center">
                      Verify with Public Key
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Verification Result */}
            {step >= 6 && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">Signature Valid</span>
              </div>
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
    "Digital signatures provide authentication, non-repudiation, and integrity verification for digital messages.",
    "Step 1: Alice has a document she wants to sign to prove it came from her.",
    "Step 2: The document is passed through a cryptographic hash function to create a fixed-size digest.",
    "Step 3: The hash function produces a unique digest that represents the document's contents.",
    "Step 4: Alice encrypts the digest with her private key to create the digital signature.",
    "Step 5: The document and signature are sent to Bob. Bob receives both the document and signature.",
    "Step 6: Bob verifies the signature by: 1) Hashing the document, 2) Decrypting the signature with Alice's public key, and 3) Comparing the results. If they match, the signature is valid.",
  ]

  return descriptions[step] || descriptions[0]
}
