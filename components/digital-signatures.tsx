"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, KeyIcon, PenIcon, ShieldCheckIcon, XIcon, Calculator, ArrowRight } from "lucide-react"
import SignatureVisualization from "./visualizations/signature-visualization"

export default function DigitalSignatures() {
  const [algorithm, setAlgorithm] = useState("ECDSA")
  const [message, setMessage] = useState("This message will be signed to prove its authenticity and integrity.")
  const [signature, setSignature] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [error, setError] = useState("")
  const [tamperedMessage, setTamperedMessage] = useState("")

  // DSA specific state
  const [dsaStep, setDsaStep] = useState(0)
  const [dsaParams, setDsaParams] = useState({
    p: 23, // prime
    q: 11, // prime divisor of p-1
    g: 2, // generator
    x: 5, // private key
    y: 0, // public key (g^x mod p)
    k: 3, // random nonce
    r: 0, // signature component
    s: 0, // signature component
    hash: 0, // hash of message
  })

  const generateKeyPair = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll generate mock keys
      // In a real app, you would use crypto.subtle.generateKey

      let mockPublicKey = ""
      let mockPrivateKey = ""

      if (algorithm === "RSA-PSS") {
        mockPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvWpIQFjQQCPpaIlJKpeg
irp5kLkQmXz7n8K8l5pZ5cICoiGMUjUj8UXvtZ0aEUFbxZLCRZ8cHVjr4XgbDPfY
JGHh+P/C9LhwJEYKJF7cEfvCdC+PhwMDjUGC4wuw1Jt9J8NqoYjT74r8ULvj5p8+
VkQmU8+Ks5HcVZ7+nNHdX7QhwaZKc0JvVIliQwk5r9n4J9fj1kcfZ7+5e8S8HRN7
XW8beMBwlPPbDHHhvlk3jFZvmWaDwQfTZxH5dVR2eCu1fxyKzHdm4tgXCyc2Vy8j
IQUB4Tlsp6ZzQkGQHPX9t33bxZ1yJcCRqJ+hJSC4+4q3AqIvYFTf1aFPmxnGCHwq
xQIDAQAB
-----END PUBLIC KEY-----`

        mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9akhAWNBAI+lo
iUkql6CKunmQuRCZfPufwryXmlnlwgKiIYxSNSPxRe+1nRoRQVvFksJFnxwdWOvh
eBsM99gkYeH4/8L0uHAkRgokXtwR+8J0L4+HAwONQYLjC7DUm30nw2qhiNPvivxQ
u+Pmnz5WRCZTz4qzkdxVnv6c0d1ftCHBpkpzQm9UiWJDCTmv2fgn1+PWRx9nv7l7
xLwdE3tdbxt4wHCU89sMceG+WTeMVm+ZZoPBB9NnEfl1VHZ4K7V/HIrMd2bi2BcL
JzZXLyMhBQHhOWynpnNCQZAc9f23fdvFnXIlwJGon6ElILj7ircCoi9gVN/VoU+b
GcYIfCrFAgMBAAECggEAJeukUuGQpUQJUFLuMFRx7nwFVGUXHMJFSgXHvti9CvM9
3wKA0I9KuGxQJKxPJLMNZF0uTRDZWODwQKKxBYDqfRjjPEy2i0qxAs2r6ZF2jYYu
lzLaYIPUYi1QxPqYjj+VfS9oLNDLVCTLTHMBVApfxjYEGCWD6j/mO/7Ajw1yTKy8
LNIhHRrZ5TjJ5L9M3YUhCiHqXUJa50XUWcHcHIwwJavQQWlwQQKC8q7H0ZrbwGwi
jx7NdEI8Bik+e25KxUcT/aJP/+J/5MTQy5TRYfnqKLMGhYEsOMaRRVNr9/ZnCOCO
EKlb9ungOqzTxABJzQU7U7QYy9ueXcj4tJxRyRxy4QKBgQDnYQVXhP5Iy5LKEjbx
jBECBCgQMoNzQf+Jh7LGPG9GNQtZ8bQfnVl7hcVIxr3pEPO98TwXNFQCkYgYThaY
FEw6ag0MWJ5I0/hHFfbRrPYYNS8Jv4NYv0vXEKUmfQX5JlI0rnotXYkzxRQPVS/a
3/ps9B9KtLAFgkRZj0SFw9a8IQKBgQDRdXnrAGIkZQky8y0GvEELxunb/Q9q9+LX
wUzULwKKjMxQdF+mHu2K8KyIAcqGOuTQyEjU3TpO34wNUBXk5WbpzA5FCbMgvgB/
LBY+6KB4w7hxHVn+iJTYgUNzQPBAkRZMdX+Y6qHZMvVTUjzE1Z1WBQ6DCl9NyTvT
lBIYgqwGJQKBgQCLJeQJ2sTqBvbpdOyXbWN9TE1IQzPdYY0lHtUPzGk0+t5z5vIh
SkZ0tE9VFzAJQFPynOMfbvA+/jWQCBZXpp/dGzGEOTwU8bnBpLpphGcmZQj5IkJK
RtPFQxTzghpGytA2UrAQEGqxJYXNqzBvRyI9PEyFUbZyS8As5zCLTbQQIQKBgQCR
Tn5XNQJFIUPpQGZmIPGW+1ySVY7QzN0IfUZNhZFrC5gHNpeKfnCnYpGnQoWYQkJ3
5rQwUQf3QQd5vF/31nsIwQpsi0ta7EjJBD8IjLKz9hMuDwjM5N9qJpOe7nNmNNnG
d7IJ2npHGOKF6Jn+BhKpbmzVxGqSHwNzJyJY/YqXDQKBgHHUX20WZE91NW+Z7dI7
sb5Oub9GXkn5xaIJI9CvdW8E661MSvK3qZ2wPnpcDjgUKJyXYaVBA5Qco3yN9TtO
WqNjFDYhGeVJnPS9dKpdAwQlUQsUQcnkQiizVVTxGwUBFgBgd5oYQLwqt8QU/bqZ
rBKT+9m83Hh1d5nIQtQQXnBL
-----END PRIVATE KEY-----`
      } else if (algorithm === "ECDSA") {
        mockPublicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEDxvt+SXHaXUcAE1eSEpfUDm8YZ8w
DzrH5u3nSrQ7Fx2aK0GUjlnmQkCKwmKqLpOy3+6RgYZB4xZF4qlwYWYiMQ==
-----END PUBLIC KEY-----`

        mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgQj9z2Tnj0jgxzFJL
Zn1bK+i4tsHZwQ+ZjGWzKM+aWZuhRANCAASxUULHyZEP+RZYBl0sgfQMUOx9YhBP
JMZzxdJYjT6wNmR8xKEbQJKKRUUmq3936WNu7ZY1WUbL2y9MCbZ6UVgA
-----END PRIVATE KEY-----`
      } else if (algorithm === "Ed25519") {
        mockPublicKey = `302a300506032b6570032100d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a`
        mockPrivateKey = `302e020100300506032b6570042204206b9295efc3ea32b8ca71dbe4213f7f3886eba6af76ab7d67af7262e8c4d1e0d1`
      } else if (algorithm === "DSA") {
        // Generate DSA parameters
        const newParams = { ...dsaParams }
        newParams.y = modPow(newParams.g, newParams.x, newParams.p)
        setDsaParams(newParams)

        mockPublicKey = `DSA Public Key:
p = ${newParams.p} (prime)
q = ${newParams.q} (prime divisor of p-1)  
g = ${newParams.g} (generator)
y = ${newParams.y} (g^x mod p)`

        mockPrivateKey = `DSA Private Key:
x = ${newParams.x} (private key)`
      }

      setPublicKey(mockPublicKey)
      setPrivateKey(mockPrivateKey)
      setVerificationResult(null)
      setDsaStep(0)
    } catch (err) {
      setError(`Key generation error: ${err.message}`)
      console.error(err)
    }
  }

  const sign = async () => {
    try {
      setError("")

      if (algorithm === "DSA") {
        // DSA signing process
        const newParams = { ...dsaParams }

        // Step 1: Hash the message (simplified)
        newParams.hash = simpleHash(message) % newParams.q

        // Step 2: Calculate r = (g^k mod p) mod q
        newParams.r = modPow(newParams.g, newParams.k, newParams.p) % newParams.q

        // Step 3: Calculate s = k^(-1) * (hash + x*r) mod q
        const kInv = modInverse(newParams.k, newParams.q)
        newParams.s = (kInv * (newParams.hash + newParams.x * newParams.r)) % newParams.q

        setDsaParams(newParams)
        setSignature(`r = ${newParams.r}, s = ${newParams.s}`)
        setDsaStep(1)
      } else {
        // For other algorithms, simulate signing
        const mockSignature = simulateSignature(message, algorithm)
        setSignature(mockSignature)
      }

      setTamperedMessage(message)
      setVerificationResult(null)
    } catch (err) {
      setError(`Signing error: ${err.message}`)
      console.error(err)
    }
  }

  const verify = async () => {
    try {
      setError("")

      if (algorithm === "DSA") {
        // DSA verification process
        const hashToVerify = simpleHash(tamperedMessage) % dsaParams.q

        // Calculate w = s^(-1) mod q
        const w = modInverse(dsaParams.s, dsaParams.q)

        // Calculate u1 = hash * w mod q
        const u1 = (hashToVerify * w) % dsaParams.q

        // Calculate u2 = r * w mod q
        const u2 = (dsaParams.r * w) % dsaParams.q

        // Calculate v = ((g^u1 * y^u2) mod p) mod q
        const v =
          ((modPow(dsaParams.g, u1, dsaParams.p) * modPow(dsaParams.y, u2, dsaParams.p)) % dsaParams.p) % dsaParams.q

        // Signature is valid if v == r
        const isValid = v === dsaParams.r
        setVerificationResult(isValid)
        setDsaStep(2)
      } else {
        // For other algorithms, simulate verification
        const isValid = tamperedMessage === message
        setVerificationResult(isValid)
      }
    } catch (err) {
      setError(`Verification error: ${err.message}`)
      console.error(err)
    }
  }

  // Helper functions for DSA
  const modPow = (base, exp, mod) => {
    let result = 1
    base = base % mod
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod
      }
      exp = Math.floor(exp / 2)
      base = (base * base) % mod
    }
    return result
  }

  const modInverse = (a, m) => {
    // Extended Euclidean Algorithm
    const gcd = (a, b) =>
      b === 0
        ? [a, 1, 0]
        : (() => {
            const [g, x, y] = gcd(b, a % b)
            return [g, y, x - Math.floor(a / b) * y]
          })()

    const [g, x] = gcd(a, m)
    return g === 1 ? ((x % m) + m) % m : null
  }

  const simpleHash = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Simulate signature (for demonstration purposes)
  const simulateSignature = (message, algorithm) => {
    // This is a simplified simulation for educational purposes
    // In a real application, use the Web Crypto API

    // Create a mock signature based on the message and algorithm
    const encoder = new TextEncoder()
    const data = encoder.encode(message)

    // Create a deterministic but fake signature
    let result = ""
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      sum = (sum + data[i]) % 256
    }

    const signatureLength =
      algorithm === "RSA-PSS" ? 256 : algorithm === "ECDSA" ? 64 : algorithm === "Ed25519" ? 64 : 64

    for (let i = 0; i < signatureLength; i++) {
      // Generate a deterministic sequence based on the input
      const byte = (sum + i * 17) % 256
      result += byte.toString(16).padStart(2, "0")
    }

    return result
  }

  const nextDsaStep = () => {
    if (dsaStep === 0) {
      sign()
    } else if (dsaStep === 1) {
      verify()
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Digital Signatures</CardTitle>
          <CardDescription>Sign messages to prove authenticity and verify signatures</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="interactive" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
              <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            </TabsList>

            <TabsContent value="interactive">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="algorithm">Signature Algorithm</Label>
                      <Select value={algorithm} onValueChange={setAlgorithm}>
                        <SelectTrigger id="algorithm">
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RSA-PSS">RSA-PSS</SelectItem>
                          <SelectItem value="ECDSA">ECDSA (P-256)</SelectItem>
                          <SelectItem value="Ed25519">Ed25519</SelectItem>
                          <SelectItem value="DSA">DSA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter message to sign"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={generateKeyPair} className="flex-1">
                        <KeyIcon className="h-4 w-4 mr-2" />
                        Generate Key Pair
                      </Button>
                      <Button onClick={sign} className="flex-1">
                        <PenIcon className="h-4 w-4 mr-2" />
                        Sign
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signature">Signature (Hex)</Label>
                      <Textarea id="signature" value={signature} readOnly rows={4} className="font-mono text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tamperedMessage">Message to Verify</Label>
                      <Textarea
                        id="tamperedMessage"
                        value={tamperedMessage}
                        onChange={(e) => setTamperedMessage(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={verify} className="flex-1">
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        Verify Signature
                      </Button>

                      {verificationResult !== null && (
                        <Badge variant={verificationResult ? "outline" : "destructive"} className="ml-2">
                          {verificationResult ? (
                            <span className="flex items-center">
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Valid
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <XIcon className="h-3 w-3 mr-1" />
                              Invalid
                            </span>
                          )}
                        </Badge>
                      )}
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                {algorithm === "DSA" && (
                  <DSAStepByStep params={dsaParams} step={dsaStep} message={message} onNextStep={nextDsaStep} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="publicKey">Public Key</Label>
                    <Textarea id="publicKey" value={publicKey} readOnly rows={6} className="font-mono text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privateKey">Private Key</Label>
                    <Textarea id="privateKey" value={privateKey} readOnly rows={6} className="font-mono text-xs" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mathematics">
              <SignatureMathematics />
            </TabsContent>

            <TabsContent value="algorithms">
              <SignatureAlgorithms />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Digital Signatures Work</CardTitle>
          <CardDescription>Visualization of the digital signature process</CardDescription>
        </CardHeader>
        <CardContent>
          <SignatureVisualization />
        </CardContent>
      </Card>
    </div>
  )
}

function DSAStepByStep({ params, step, message, onNextStep }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          DSA Step-by-Step Process
        </CardTitle>
        <CardDescription>Follow the Digital Signature Algorithm step by step</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Parameters */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">DSA Parameters</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">p:</span> {params.p} (prime)
              </div>
              <div>
                <span className="font-medium">q:</span> {params.q} (prime divisor)
              </div>
              <div>
                <span className="font-medium">g:</span> {params.g} (generator)
              </div>
              <div>
                <span className="font-medium">x:</span> {params.x} (private key)
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-medium">y:</span> {params.y} (public key = g^x mod p)
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 0 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 0 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                1
              </div>
              <span>Setup</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center space-x-2 ${step >= 1 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                2
              </div>
              <span>Sign</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? "text-purple-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                3
              </div>
              <span>Verify</span>
            </div>
          </div>

          {/* Step content */}
          {step === 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Step 1: Setup and Key Generation</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="text-sm">
                  <div className="font-medium">1. Choose prime p = {params.p}</div>
                  <div className="font-medium">2. Choose prime q = {params.q} such that q divides (p-1)</div>
                  <div className="font-medium">3. Choose generator g = {params.g}</div>
                  <div className="font-medium">4. Choose private key x = {params.x} (random, 0 &lt; x &lt; q)</div>
                  <div className="font-medium">
                    5. Compute public key y = g^x mod p = {params.g}^{params.x} mod {params.p} = {params.y}
                  </div>
                </div>
              </div>
              <Button onClick={onNextStep} className="w-full">
                Proceed to Signing
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Step 2: Signing Process</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Message: "{message}"</div>
                  <div className="font-medium">1. Hash message: H(m) = {params.hash}</div>
                  <div className="font-medium">2. Choose random k = {params.k} (0 &lt; k &lt; q)</div>
                  <div className="font-medium">
                    3. Calculate r = (g^k mod p) mod q = ({params.g}^{params.k} mod {params.p}) mod {params.q} ={" "}
                    {params.r}
                  </div>
                  <div className="font-medium">4. Calculate s = k^(-1) × (H(m) + x×r) mod q = {params.s}</div>
                  <div className="font-medium">
                    5. Signature: (r, s) = ({params.r}, {params.s})
                  </div>
                </div>
              </div>
              <Button onClick={onNextStep} className="w-full">
                Proceed to Verification
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Step 3: Verification Process</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="text-sm">
                  <div className="font-medium">
                    Given: signature (r, s) = ({params.r}, {params.s})
                  </div>
                  <div className="font-medium">1. Calculate w = s^(-1) mod q</div>
                  <div className="font-medium">2. Calculate u1 = H(m) × w mod q</div>
                  <div className="font-medium">3. Calculate u2 = r × w mod q</div>
                  <div className="font-medium">4. Calculate v = ((g^u1 × y^u2) mod p) mod q</div>
                  <div className="font-medium">5. Signature is valid if v = r</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-800 font-medium">
                  ✓ Verification complete! The signature mathematics ensure that only someone with the private key x
                  could have created a signature that passes verification.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SignatureMathematics() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mathematical Foundations</h3>
        <p className="text-sm text-gray-600">
          Digital signatures rely on mathematical problems that are easy to compute in one direction but hard to
          reverse.
        </p>

        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-semibold text-blue-800">Core Mathematical Formula</h4>
          <div className="mt-2 space-y-2">
            <div className="font-mono text-sm">Signature: σ = Sign(H(m), d)</div>
            <div className="font-mono text-sm">Verification: Verify(H(m), σ, Q) → {"{true, false}"}</div>
            <div className="text-xs text-blue-700 mt-2">
              Where: m = message, H = hash function, d = private key, Q = public key, σ = signature
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-md">
            <h4 className="font-semibold text-purple-800">RSA Signatures</h4>
            <div className="text-sm text-purple-700 mt-2 space-y-2">
              <div className="font-mono">σ = H(m)^d mod N</div>
              <div className="font-mono">Verify: σ^e ≟ H(m) mod N</div>
              <div className="text-xs mt-2">
                Where N = pq (product of primes), e = public exponent, d = private exponent
              </div>
              <div className="text-xs">Security: Based on integer factorization problem</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">ECDSA Signatures</h4>
            <div className="text-sm text-green-700 mt-2 space-y-2">
              <div className="font-mono">r = (k × G).x mod n</div>
              <div className="font-mono">s = k⁻¹(H(m) + r × d) mod n</div>
              <div className="font-mono">σ = (r, s)</div>
              <div className="text-xs mt-2">
                Where G = base point, k = random nonce, d = private key, n = curve order
              </div>
              <div className="text-xs">Security: Based on elliptic curve discrete logarithm problem</div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-md">
          <h4 className="font-semibold text-orange-800">EdDSA (Ed25519) Signatures</h4>
          <div className="text-sm text-orange-700 mt-2 space-y-2">
            <div className="font-mono">{"R = r × B (where r = H(h_b, ..., h_{2b-1}, M))"}</div>
            <div className="font-mono">S = (r + H(R, A, M) × s) mod ℓ</div>
            <div className="font-mono">σ = (R, S)</div>
            <div className="text-xs mt-2">
              Where B = base point, A = public key, M = message, s = private scalar, ℓ = curve order
            </div>
            <div className="text-xs">Security: Based on discrete logarithm problem on Edwards curves</div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md">
          <h4 className="font-semibold text-yellow-800">DSA (Digital Signature Algorithm)</h4>
          <div className="text-sm text-yellow-700 mt-2 space-y-2">
            <div className="font-mono">r = (g^k mod p) mod q</div>
            <div className="font-mono">s = k⁻¹(H(m) + x × r) mod q</div>
            <div className="font-mono">σ = (r, s)</div>
            <div className="text-xs mt-2">
              Where p, q = primes (q divides p-1), g = generator, k = random nonce, x = private key
            </div>
            <div className="text-xs">Security: Based on discrete logarithm problem in finite fields</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Security Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-md">
            <h4 className="font-semibold text-red-800">Unforgeability</h4>
            <div className="text-sm text-red-700 mt-2 space-y-1">
              <div>Cannot forge signatures without private key</div>
              <div>Computationally infeasible to create valid σ for new message</div>
              <div>Based on underlying hard mathematical problem</div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <h4 className="font-semibold text-yellow-800">Non-repudiation</h4>
            <div className="text-sm text-yellow-700 mt-2 space-y-1">
              <div>Signer cannot deny having signed the message</div>
              <div>Only holder of private key could create signature</div>
              <div>Provides legal proof of authenticity</div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">Message Integrity</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <div>Any change to message invalidates signature</div>
              <div>Hash function ensures message binding</div>
              <div>Detects tampering or corruption</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hash Functions in Signatures</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm space-y-2">
            <div>
              <strong>Why hash first?</strong>
            </div>
            <div>• Fixed-size input: Signatures work on fixed-length data</div>
            <div>• Efficiency: Faster to sign hash than entire message</div>
            <div>• Security: Collision resistance prevents signature forgery</div>
            <div>• Standardization: Common hash sizes (SHA-256: 256 bits)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignatureAlgorithms() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Signature Algorithm Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Algorithm</th>
                <th className="border border-gray-300 p-2 text-left">Key Size</th>
                <th className="border border-gray-300 p-2 text-left">Signature Size</th>
                <th className="border border-gray-300 p-2 text-left">Security Basis</th>
                <th className="border border-gray-300 p-2 text-left">Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">RSA-PSS</td>
                <td className="border border-gray-300 p-2">2048-4096 bits</td>
                <td className="border border-gray-300 p-2">256-512 bytes</td>
                <td className="border border-gray-300 p-2">Integer factorization</td>
                <td className="border border-gray-300 p-2">Slow signing, fast verification</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">ECDSA P-256</td>
                <td className="border border-gray-300 p-2">256 bits</td>
                <td className="border border-gray-300 p-2">64 bytes</td>
                <td className="border border-gray-300 p-2">EC discrete log</td>
                <td className="border border-gray-300 p-2">Fast signing and verification</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">Ed25519</td>
                <td className="border border-gray-300 p-2">256 bits</td>
                <td className="border border-gray-300 p-2">64 bytes</td>
                <td className="border border-gray-300 p-2">Edwards curve DL</td>
                <td className="border border-gray-300 p-2">Very fast, constant time</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-medium">DSA</td>
                <td className="border border-gray-300 p-2">1024-3072 bits</td>
                <td className="border border-gray-300 p-2">40-64 bytes</td>
                <td className="border border-gray-300 p-2">Discrete logarithm</td>
                <td className="border border-gray-300 p-2">Moderate speed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Algorithm Details</h3>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">RSA-PSS (Probabilistic Signature Scheme)</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-2">
              <div>
                <strong>Key Generation:</strong>
              </div>
              <div className="font-mono ml-4">1. Choose large primes p, q</div>
              <div className="font-mono ml-4">2. N = p × q, φ(N) = (p-1)(q-1)</div>
              <div className="font-mono ml-4">3. Choose e (usually 65537)</div>
              <div className="font-mono ml-4">4. d = e⁻¹ mod φ(N)</div>
              <div className="font-mono ml-4">5. Public key: (N, e), Private key: (N, d)</div>

              <div className="mt-3">
                <strong>Signing Process:</strong>
              </div>
              <div className="font-mono ml-4">1. H = Hash(message)</div>
              <div className="font-mono ml-4">2. EM = PSS-Encode(H, salt)</div>
              <div className="font-mono ml-4">3. σ = EM^d mod N</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">ECDSA (Elliptic Curve Digital Signature Algorithm)</h4>
            <div className="text-sm text-green-700 mt-2 space-y-2">
              <div>
                <strong>Key Generation:</strong>
              </div>
              <div className="font-mono ml-4">1. Choose elliptic curve E and base point G</div>
              <div className="font-mono ml-4">2. Choose random private key d ∈ [1, n-1]</div>
              <div className="font-mono ml-4">3. Compute public key Q = d × G</div>

              <div className="mt-3">
                <strong>Signing Process:</strong>
              </div>
              <div className="font-mono ml-4">1. Choose random k ∈ [1, n-1]</div>
              <div className="font-mono ml-4">2. (x₁, y₁) = k × G</div>
              <div className="font-mono ml-4">3. r = x₁ mod n (if r = 0, choose new k)</div>
              <div className="font-mono ml-4">4. s = k⁻¹(H(m) + r × d) mod n</div>
              <div className="font-mono ml-4">5. Signature: (r, s)</div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-md">
            <h4 className="font-semibold text-purple-800">Ed25519 (Edwards-curve Digital Signature Algorithm)</h4>
            <div className="text-sm text-purple-700 mt-2 space-y-2">
              <div>
                <strong>Key Generation:</strong>
              </div>
              <div className="font-mono ml-4">1. Generate 32-byte private key seed</div>
              <div className="font-mono ml-4">{"2. (h₀,...,h₆₃) = SHA-512(seed)"}</div>
              <div className="font-mono ml-4">{"3. s = 2²⁵⁴ + Σ 2ⁱ hᵢ (for i=3..253)"}</div>
              <div className="font-mono ml-4">4. A = s × B (public key)</div>

              <div className="mt-3">
                <strong>Signing Process:</strong>
              </div>
              <div className="font-mono ml-4">{"1. r = H(h₃₂,...,h₆₃, M) mod ℓ"}</div>
              <div className="font-mono ml-4">2. R = r × B</div>
              <div className="font-mono ml-4">3. S = (r + H(R,A,M) × s) mod ℓ</div>
              <div className="font-mono ml-4">4. Signature: (R, S)</div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <h4 className="font-semibold text-yellow-800">DSA (Digital Signature Algorithm)</h4>
            <div className="text-sm text-yellow-700 mt-2 space-y-2">
              <div>
                <strong>Key Generation:</strong>
              </div>
              <div className="font-mono ml-4">1. Choose prime p (1024-3072 bits)</div>
              <div className="font-mono ml-4">2. Choose prime q (160-256 bits) such that q | (p-1)</div>
              <div className="font-mono ml-4">3. Choose generator g of order q in Z*p</div>
              <div className="font-mono ml-4">4. Choose private key x ∈ [1, q-1]</div>
              <div className="font-mono ml-4">5. Compute public key y = g^x mod p</div>

              <div className="mt-3">
                <strong>Signing Process:</strong>
              </div>
              <div className="font-mono ml-4">1. Choose random k ∈ [1, q-1]</div>
              <div className="font-mono ml-4">2. r = (g^k mod p) mod q</div>
              <div className="font-mono ml-4">3. s = k⁻¹(H(m) + x × r) mod q</div>
              <div className="font-mono ml-4">4. Signature: (r, s)</div>

              <div className="mt-3">
                <strong>Verification Process:</strong>
              </div>
              <div className="font-mono ml-4">1. w = s⁻¹ mod q</div>
              <div className="font-mono ml-4">2. u1 = H(m) × w mod q</div>
              <div className="font-mono ml-4">3. u2 = r × w mod q</div>
              <div className="font-mono ml-4">4. v = ((g^u1 × y^u2) mod p) mod q</div>
              <div className="font-mono ml-4">5. Valid if v = r</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Security Considerations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-md">
            <h4 className="font-semibold text-red-800">Common Vulnerabilities</h4>
            <div className="text-sm text-red-700 mt-2 space-y-1">
              <div>
                • <strong>Nonce reuse:</strong> Using same k in ECDSA/DSA reveals private key
              </div>
              <div>
                • <strong>Weak randomness:</strong> Predictable k values compromise security
              </div>
              <div>
                • <strong>Side-channel attacks:</strong> Timing, power analysis
              </div>
              <div>
                • <strong>Hash collisions:</strong> Weak hash functions enable forgery
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">Best Practices</h4>
            <div className="text-sm text-green-700 mt-2 space-y-1">
              <div>
                • <strong>Use deterministic nonces:</strong> RFC 6979 for ECDSA/DSA
              </div>
              <div>
                • <strong>Constant-time implementations:</strong> Prevent timing attacks
              </div>
              <div>
                • <strong>Strong hash functions:</strong> SHA-256 or better
              </div>
              <div>
                • <strong>Key rotation:</strong> Regular key updates
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
