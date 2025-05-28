"use client"

import { useState, useEffect } from "react"

export default function AESVisualization({ mode = "CBC" }) {
  const [blocks, setBlocks] = useState<string[]>([])
  const [step, setStep] = useState(0)
  const totalSteps = mode === "ECB" ? 4 : mode === "CBC" ? 6 : 8

  useEffect(() => {
    // Generate random blocks for visualization
    const newBlocks = Array(4)
      .fill(0)
      .map(() => {
        return Array(16)
          .fill(0)
          .map(() =>
            Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0"),
          )
          .join("")
      })
    setBlocks(newBlocks)
    setStep(0)
  }, [mode])

  const nextStep = () => {
    setStep((prev) => (prev + 1) % (totalSteps + 1))
  }

  const prevStep = () => {
    setStep((prev) => (prev - 1 + (totalSteps + 1)) % (totalSteps + 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">AES-{mode} Encryption Process</h3>
        <div className="flex space-x-2">
          <button onClick={prevStep} className="px-3 py-1 text-sm rounded-md border hover:bg-muted">
            Previous
          </button>
          <button onClick={nextStep} className="px-3 py-1 text-sm rounded-md border hover:bg-muted">
            Next
          </button>
        </div>
      </div>

      <div className="relative h-80 border rounded-lg bg-muted/20 overflow-y-auto p-4">
        {mode === "ECB" && <ECBVisualization blocks={blocks} step={step} />}

        {mode === "CBC" && <CBCVisualization blocks={blocks} step={step} />}

        {mode === "GCM" && <GCMVisualization blocks={blocks} step={step} />}
      </div>

      <div className="text-sm text-muted-foreground">
        {mode === "ECB" && getECBStepDescription(step)}
        {mode === "CBC" && getCBCStepDescription(step)}
        {mode === "GCM" && getGCMStepDescription(step)}
      </div>
    </div>
  )
}

function ECBVisualization({ blocks, step }) {
  return (
    <div className="h-full min-h-full">
      <div className="flex flex-col h-full justify-between">
        <div className="grid grid-cols-4 gap-4">
          {blocks.map((block, i) => (
            <div
              key={i}
              className={`p-2 rounded border flex items-center justify-center text-xs font-mono
                ${step >= 1 ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300"}`}
            >
              Block {i + 1}
            </div>
          ))}
        </div>

        {step >= 2 && (
          <div className="flex justify-center">
            <div className="w-32 h-16 border-2 border-green-500 rounded-lg flex items-center justify-center bg-green-50">
              <div className="text-center">
                <div className="text-xs font-medium">AES</div>
                <div className="text-xs">Encryption</div>
              </div>
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="grid grid-cols-4 gap-4">
            {blocks.map((block, i) => (
              <div
                key={i}
                className="p-2 rounded border flex items-center justify-center text-xs font-mono bg-purple-100 border-purple-300"
              >
                Encrypted {i + 1}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CBCVisualization({ blocks, step }) {
  return (
    <div className="h-full min-h-full">
      <div className="flex flex-col h-full justify-between">
        {step >= 1 && (
          <div className="flex justify-start mb-4">
            <div className="p-2 rounded border flex items-center justify-center text-xs font-mono bg-yellow-100 border-yellow-300 w-24">
              IV
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {blocks.map((block, i) => (
            <div
              key={i}
              className={`p-2 rounded border flex items-center justify-center text-xs font-mono
                ${step >= 2 ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300"}`}
            >
              Block {i + 1}
            </div>
          ))}
        </div>

        {step >= 3 && (
          <div className="flex justify-center my-4">
            <div className="flex items-center">
              {Array.from({ length: blocks.length }, (_, i) => i).map(
                (i) =>
                  step >= 3 &&
                  i === 0 && (
                    <svg
                      key={i}
                      className="w-6 h-6 text-gray-500 mx-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ),
              )}
              <div className="w-8 h-8 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-xs">
                XOR
              </div>
            </div>
          </div>
        )}

        {step >= 4 && (
          <div className="flex justify-center my-4">
            <div className="w-32 h-16 border-2 border-green-500 rounded-lg flex items-center justify-center bg-green-50">
              <div className="text-center">
                <div className="text-xs font-medium">AES</div>
                <div className="text-xs">Encryption</div>
              </div>
            </div>
          </div>
        )}

        {step >= 5 && (
          <div className="grid grid-cols-4 gap-4">
            {blocks.map((block, i) => (
              <div
                key={i}
                className="p-2 rounded border flex items-center justify-center text-xs font-mono bg-purple-100 border-purple-300"
              >
                Encrypted {i + 1}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GCMVisualization({ blocks, step }) {
  return (
    <div className="h-full min-h-full">
      <div className="flex flex-col h-full justify-between">
        {step >= 1 && (
          <div className="flex justify-between mb-4">
            <div className="p-2 rounded border flex items-center justify-center text-xs font-mono bg-yellow-100 border-yellow-300 w-24">
              Nonce
            </div>
            <div className="p-2 rounded border flex items-center justify-center text-xs font-mono bg-orange-100 border-orange-300 w-24">
              Counter
            </div>
          </div>
        )}

        {step >= 2 && (
          <div className="flex justify-center my-2">
            <div className="w-32 h-16 border-2 border-green-500 rounded-lg flex items-center justify-center bg-green-50">
              <div className="text-center">
                <div className="text-xs font-medium">AES</div>
                <div className="text-xs">Encryption</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {blocks.map((block, i) => (
            <div
              key={i}
              className={`p-2 rounded border flex items-center justify-center text-xs font-mono
                ${step >= 3 ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300"}`}
            >
              Block {i + 1}
            </div>
          ))}
        </div>

        {step >= 4 && (
          <div className="flex justify-center my-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-xs">
                XOR
              </div>
            </div>
          </div>
        )}

        {step >= 5 && (
          <div className="grid grid-cols-4 gap-4">
            {blocks.map((block, i) => (
              <div
                key={i}
                className="p-2 rounded border flex items-center justify-center text-xs font-mono bg-purple-100 border-purple-300"
              >
                Encrypted {i + 1}
              </div>
            ))}
          </div>
        )}

        {step >= 6 && (
          <div className="flex justify-center mt-4">
            <div className="p-2 rounded border flex items-center justify-center text-xs font-mono bg-teal-100 border-teal-300 w-32">
              Authentication Tag
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getECBStepDescription(step) {
  const descriptions = [
    "Electronic Codebook (ECB) mode encrypts each block independently with the same key.",
    "Step 1: Divide plaintext into fixed-size blocks (128 bits for AES).",
    "Step 2: Encrypt each block separately using the AES algorithm with the same key.",
    "Step 3: The encrypted blocks form the ciphertext.",
    "Note: ECB mode is not recommended for most applications because identical plaintext blocks will encrypt to identical ciphertext blocks, potentially revealing patterns in the data.",
  ]

  return descriptions[step] || descriptions[0]
}

function getCBCStepDescription(step) {
  const descriptions = [
    "Cipher Block Chaining (CBC) mode uses an Initialization Vector (IV) and chains blocks together for better security.",
    "Step 1: Generate a random Initialization Vector (IV) the same size as a block.",
    "Step 2: Divide plaintext into fixed-size blocks (128 bits for AES).",
    "Step 3: XOR the first plaintext block with the IV.",
    "Step 4: Encrypt the result using the AES algorithm with the key.",
    "Step 5: Use each encrypted block as the IV for the next block, creating a chain dependency.",
    "CBC provides better security than ECB because identical plaintext blocks will encrypt to different ciphertext blocks.",
  ]

  return descriptions[step] || descriptions[0]
}

function getGCMStepDescription(step) {
  const descriptions = [
    "Galois/Counter Mode (GCM) combines counter mode encryption with authentication.",
    "Step 1: Generate a unique nonce (number used once) and initialize a counter.",
    "Step 2: Encrypt the counter value (not the plaintext) using AES.",
    "Step 3: Divide plaintext into fixed-size blocks.",
    "Step 4: XOR each plaintext block with the encrypted counter to produce ciphertext.",
    "Step 5: Increment the counter for each block.",
    "Step 6: Calculate an authentication tag over the ciphertext and any additional authenticated data.",
    "GCM provides both confidentiality and integrity, making it an authenticated encryption mode.",
  ]

  return descriptions[step] || descriptions[0]
}
