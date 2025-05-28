"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, RefreshCwIcon } from "lucide-react"
import HashVisualization from "./visualizations/hash-visualization"

export default function Hashing() {
  const [algorithm, setAlgorithm] = useState("SHA-256")
  const [input, setInput] = useState("Hello, world!")
  const [hash, setHash] = useState("")
  const [error, setError] = useState("")

  const computeHash = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll simulate hashing
      // In a real app, you would use crypto.subtle.digest

      // Convert input to bytes
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      // Simulate hashing (in a real app, use crypto.subtle.digest)
      const hashBuffer = await simulateHash(data, algorithm)

      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      setHash(hashHex)
    } catch (err) {
      setError(`Hashing error: ${err.message}`)
      console.error(err)
    }
  }

  // Simulate hashing (for demonstration purposes)
  const simulateHash = async (data, algorithm) => {
    // This is a simplified simulation for educational purposes
    // In a real application, use the Web Crypto API

    // For demonstration, we'll create a mock hash based on the input length and algorithm
    // This is NOT a real hash function, just for visualization
    const mockHashLength =
      algorithm === "SHA-256"
        ? 32
        : algorithm === "SHA-512"
          ? 64
          : algorithm === "SHA-1"
            ? 20
            : algorithm === "MD5"
              ? 16
              : 32

    // Create a deterministic but fake hash based on input
    const result = new Uint8Array(mockHashLength)
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      sum = (sum + data[i]) % 256
    }

    for (let i = 0; i < mockHashLength; i++) {
      // Generate a deterministic sequence based on the input
      result[i] = (sum + i * 17) % 256
    }

    return result.buffer
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Cryptographic Hashing</CardTitle>
          <CardDescription>Generate a fixed-size hash from any input data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="algorithm">Hash Algorithm</Label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger id="algorithm">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MD5">MD5 (Not secure, for demonstration only)</SelectItem>
                      <SelectItem value="SHA-1">SHA-1 (Not secure, for demonstration only)</SelectItem>
                      <SelectItem value="SHA-256">SHA-256</SelectItem>
                      <SelectItem value="SHA-512">SHA-512</SelectItem>
                      <SelectItem value="SHA3-256">SHA3-256 (Keccak)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="input">Input Data</Label>
                  <Textarea
                    id="input"
                    placeholder="Enter text to hash"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button onClick={computeHash} className="w-full">
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Compute Hash
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hash">Hash Output (Hex)</Label>
                  <Textarea id="hash" value={hash} readOnly rows={4} className="font-mono text-sm" />
                </div>

                <div className="space-y-2">
                  <Label>Hash Length</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={hash ? `${hash.length / 2} bytes (${hash.length} hex characters)` : ""}
                      readOnly
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hash Visualization</Label>
                  <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                    {hash && (
                      <div className="flex h-full">
                        {Array.from(hash).map((char, i) => {
                          // Convert hex char to a number 0-15
                          const value = Number.parseInt(char, 16)
                          // Map to a color
                          const hue = (value * 22) % 360
                          return (
                            <div
                              key={i}
                              className="h-full flex-1"
                              style={{ backgroundColor: `hsl(${hue}, 80%, 60%)` }}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Hashing Works</CardTitle>
          <CardDescription>Visualization of the hashing process</CardDescription>
        </CardHeader>
        <CardContent>
          <HashVisualization />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hashing Cheatsheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-medium">Hash Functions</h3>
              <p className="text-muted-foreground">
                Cryptographic hash functions convert data of arbitrary size to a fixed-size output with these
                properties:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Deterministic: Same input always produces the same output</li>
                <li>One-way: Computationally infeasible to reverse</li>
                <li>Avalanche effect: Small changes in input cause large changes in output</li>
                <li>Collision-resistant: Difficult to find two inputs with the same output</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Common Hash Algorithms</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">MD5:</span> 128-bit output.{" "}
                  <span className="text-red-500 font-medium">Not secure</span> - vulnerable to collision attacks.
                </li>
                <li>
                  <span className="font-medium">SHA-1:</span> 160-bit output.{" "}
                  <span className="text-red-500 font-medium">Not secure</span> - vulnerable to collision attacks.
                </li>
                <li>
                  <span className="font-medium">SHA-256:</span> 256-bit output. Part of the SHA-2 family, widely used
                  and considered secure.
                </li>
                <li>
                  <span className="font-medium">SHA-512:</span> 512-bit output. Part of the SHA-2 family, provides
                  higher security.
                </li>
                <li>
                  <span className="font-medium">SHA3-256:</span> 256-bit output. Part of the SHA-3 family (Keccak),
                  newer standard.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Use Cases</h3>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Password storage (with proper salting)</li>
                <li>Data integrity verification</li>
                <li>Digital signatures (as part of the signing process)</li>
                <li>File checksums</li>
                <li>Blockchain and cryptocurrency applications</li>
              </ul>
            </div>

            <div className="flex items-start gap-2 bg-muted p-3 rounded-md">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">Security Note:</span> For password storage, always use specialized
                  password hashing functions like bcrypt, Argon2, or PBKDF2 with appropriate salting, not
                  general-purpose hash functions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
