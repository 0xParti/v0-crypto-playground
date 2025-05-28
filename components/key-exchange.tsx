"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, KeyIcon, LockIcon } from "lucide-react"
import DHVisualization from "./visualizations/dh-visualization"

export default function KeyExchange() {
  const [algorithm, setAlgorithm] = useState("DH")
  const [alicePrivate, setAlicePrivate] = useState("")
  const [alicePublic, setAlicePublic] = useState("")
  const [bobPrivate, setBobPrivate] = useState("")
  const [bobPublic, setBobPublic] = useState("")
  const [aliceShared, setAliceShared] = useState("")
  const [bobShared, setBobShared] = useState("")
  const [error, setError] = useState("")

  const generateKeys = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll generate mock keys
      // In a real app, you would use crypto.subtle.generateKey

      if (algorithm === "DH") {
        // Simulate Diffie-Hellman parameters
        const p = 23 // A small prime for demonstration
        const g = 5 // A generator for the group

        // Generate private keys (random numbers)
        const alicePrivateKey = Math.floor(Math.random() * (p - 2)) + 2
        const bobPrivateKey = Math.floor(Math.random() * (p - 2)) + 2

        // Calculate public keys: g^private mod p
        const alicePublicKey = Math.pow(g, alicePrivateKey) % p
        const bobPublicKey = Math.pow(g, bobPrivateKey) % p

        // Calculate shared secrets: (other's public)^myPrivate mod p
        const aliceSharedSecret = Math.pow(bobPublicKey, alicePrivateKey) % p
        const bobSharedSecret = Math.pow(alicePublicKey, bobPrivateKey) % p

        setAlicePrivate(alicePrivateKey.toString())
        setAlicePublic(alicePublicKey.toString())
        setBobPrivate(bobPrivateKey.toString())
        setBobPublic(bobPublicKey.toString())
        setAliceShared("")
        setBobShared("")
      } else if (algorithm === "ECDH") {
        // Simulate ECDH with mock values
        setAlicePrivate("a77dc3d9a411e6f93811a1ce5c3f3e37a6752a047c8c7c33b9e1f25ddde69448")
        setAlicePublic(
          "04b2c8c31f95a9a4f29f82e04ee5818d7c6f279105a7fef4f3e3158f60e6968456aa7b7da7f7957a4559a3137e3734d1517346a1dfce9c810f4f352a3720d0379",
        )
        setBobPrivate("7d7dc3d9a411e6f93811a1ce5c3f3e37a6752a047c8c7c33b9e1f25ddde69441")
        setBobPublic(
          "04c2c8c31f95a9a4f29f82e04ee5818d7c6f279105a7fef4f3e3158f60e6968456aa7b7da7f7957a4559a3137e3734d1517346a1dfce9c810f4f352a3720d0378",
        )
        setAliceShared("")
        setBobShared("")
      }
    } catch (err) {
      setError(`Key generation error: ${err.message}`)
      console.error(err)
    }
  }

  const computeSharedSecrets = () => {
    try {
      setError("")

      if (algorithm === "DH") {
        // Parse values
        const p = 23 // Same prime as above
        const alicePrivateKey = Number.parseInt(alicePrivate)
        const bobPublicKey = Number.parseInt(bobPublic)
        const bobPrivateKey = Number.parseInt(bobPrivate)
        const alicePublicKey = Number.parseInt(alicePublic)

        // Calculate shared secrets
        const aliceSharedSecret = Math.pow(bobPublicKey, alicePrivateKey) % p
        const bobSharedSecret = Math.pow(alicePublicKey, bobPrivateKey) % p

        setAliceShared(aliceSharedSecret.toString())
        setBobShared(bobSharedSecret.toString())
      } else if (algorithm === "ECDH") {
        // For ECDH, we'll just use a mock shared secret
        const mockSharedSecret = "c97445d5a5bf5841796fedca59c49d5e0aa99d610e8ddb23c9c9342c31d22556"
        setAliceShared(mockSharedSecret)
        setBobShared(mockSharedSecret)
      }
    } catch (err) {
      setError(`Computation error: ${err.message}`)
      console.error(err)
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Key Exchange</CardTitle>
          <CardDescription>Securely establish a shared secret key over an insecure channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="algorithm">Key Exchange Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger id="algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DH">Diffie-Hellman</SelectItem>
                    <SelectItem value="ECDH">Elliptic Curve Diffie-Hellman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={generateKeys} className="flex-1">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Generate Keys
                </Button>
                <Button onClick={computeSharedSecrets} className="flex-1" disabled={!alicePrivate || !bobPublic}>
                  <LockIcon className="h-4 w-4 mr-2" />
                  Compute Shared Secrets
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alicePrivate">Private Key</Label>
                    <Input id="alicePrivate" value={alicePrivate} readOnly className="font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alicePublic">Public Key</Label>
                    <Input id="alicePublic" value={alicePublic} readOnly className="font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aliceShared">
                      Shared Secret
                      {aliceShared && bobShared && aliceShared === bobShared && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          Match
                        </Badge>
                      )}
                    </Label>
                    <Input id="aliceShared" value={aliceShared} readOnly className="font-mono text-xs" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Bob</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bobPrivate">Private Key</Label>
                    <Input id="bobPrivate" value={bobPrivate} readOnly className="font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bobPublic">Public Key</Label>
                    <Input id="bobPublic" value={bobPublic} readOnly className="font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bobShared">
                      Shared Secret
                      {aliceShared && bobShared && aliceShared === bobShared && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          Match
                        </Badge>
                      )}
                    </Label>
                    <Input id="bobShared" value={bobShared} readOnly className="font-mono text-xs" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Key Exchange Works</CardTitle>
          <CardDescription>Visualization of the Diffie-Hellman key exchange process</CardDescription>
        </CardHeader>
        <CardContent>
          <DHVisualization />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Exchange Cheatsheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-medium">Diffie-Hellman Key Exchange</h3>
              <p className="text-muted-foreground">
                A method that allows two parties to establish a shared secret key over an insecure channel without
                having any prior secrets.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Key Concepts</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Classic DH:</span> Based on the discrete logarithm problem in modular
                  arithmetic.
                </li>
                <li>
                  <span className="font-medium">ECDH:</span> Uses elliptic curve cryptography, providing the same
                  security with smaller keys.
                </li>
                <li>
                  <span className="font-medium">Perfect Forward Secrecy:</span> Using ephemeral (temporary) keys ensures
                  that past communications cannot be decrypted if long-term keys are compromised.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Process</h3>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Each party generates a private key</li>
                <li>Each party derives a public key from their private key</li>
                <li>The parties exchange public keys</li>
                <li>Each party computes the same shared secret using their private key and the other's public key</li>
                <li>
                  The shared secret is typically used as input to a key derivation function to create encryption keys
                </li>
              </ol>
            </div>

            <div className="flex items-start gap-2 bg-muted p-3 rounded-md">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">Security Note:</span> Basic Diffie-Hellman is vulnerable to
                  man-in-the-middle attacks. Always use authenticated key exchange protocols like TLS in real
                  applications.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
