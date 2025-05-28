"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, KeyIcon, LockIcon, UnlockIcon } from "lucide-react"
import AESVisualization from "./visualizations/aes-visualization"

export default function SymmetricEncryption() {
  const [algorithm, setAlgorithm] = useState("AES-CBC")
  const [plaintext, setPlaintext] = useState("Hello, cryptography world!")
  const [key, setKey] = useState("")
  const [iv, setIv] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [error, setError] = useState("")
  const [keyFormat, setKeyFormat] = useState("hex")
  const [outputFormat, setOutputFormat] = useState("base64")

  // Generate random key and IV on component mount
  useEffect(() => {
    generateRandomKey()
    generateRandomIv()
  }, [algorithm])

  const generateRandomKey = () => {
    const keyLength = algorithm.includes("AES-128") ? 16 : 32 // 128 bits or 256 bits
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(keyLength)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    setKey(randomKey)
  }

  const generateRandomIv = () => {
    if (algorithm.includes("CBC") || algorithm.includes("GCM")) {
      const ivLength = algorithm.includes("GCM") ? 12 : 16 // 96 bits for GCM, 128 bits for CBC
      const randomIv = Array.from(crypto.getRandomValues(new Uint8Array(ivLength)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      setIv(randomIv)
    } else {
      setIv("")
    }
  }

  const hexToUint8Array = (hexString) => {
    if (hexString.length % 2 !== 0) {
      throw new Error("Hex string must have an even number of characters")
    }
    const arrayBuffer = new Uint8Array(hexString.length / 2)
    for (let i = 0; i < hexString.length; i += 2) {
      const byteValue = Number.parseInt(hexString.substring(i, i + 2), 16)
      arrayBuffer[i / 2] = byteValue
    }
    return arrayBuffer
  }

  const getAlgorithmParams = () => {
    const [aesType, mode] = algorithm.split("-")
    const keyLength = aesType === "AES-128" ? 128 : 256

    if (mode === "ECB") {
      return { name: "AES-CBC", length: keyLength }
    } else if (mode === "CBC") {
      return { name: "AES-CBC", length: keyLength }
    } else if (mode === "GCM") {
      return { name: "AES-GCM", length: keyLength }
    }
    return { name: "AES-CBC", length: 256 }
  }

  const encrypt = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll simulate the encryption
      // In a real app, you would use the Web Crypto API

      // Convert inputs to appropriate formats
      const textEncoder = new TextEncoder()
      const plaintextBytes = textEncoder.encode(plaintext)
      const keyBytes = hexToUint8Array(key)
      const ivBytes = iv ? hexToUint8Array(iv) : null

      // Simulate encryption (in a real app, use crypto.subtle.encrypt)
      // This is a placeholder for demonstration
      const encryptedBytes = simulateEncryption(plaintextBytes, keyBytes, ivBytes, algorithm)

      // Convert to output format
      const encryptedBase64 = btoa(String.fromCharCode(...encryptedBytes))
      setCiphertext(encryptedBase64)
    } catch (err) {
      setError(`Encryption error: ${err.message}`)
      console.error(err)
    }
  }

  const decrypt = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll simulate the decryption
      // In a real app, you would use the Web Crypto API

      // Convert inputs to appropriate formats
      const ciphertextBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
      const keyBytes = hexToUint8Array(key)
      const ivBytes = iv ? hexToUint8Array(iv) : null

      // Simulate decryption (in a real app, use crypto.subtle.decrypt)
      const decryptedBytes = simulateDecryption(ciphertextBytes, keyBytes, ivBytes, algorithm)

      // Convert to text
      const textDecoder = new TextDecoder()
      const decrypted = textDecoder.decode(decryptedBytes)
      setDecryptedText(decrypted)
    } catch (err) {
      setError(`Decryption error: ${err.message}`)
      console.error(err)
    }
  }

  // Simulate encryption (for demonstration purposes)
  const simulateEncryption = (data, key, iv, algorithm) => {
    // This is a simplified simulation for educational purposes
    // In a real application, use the Web Crypto API

    // For demonstration, we'll just XOR the data with the key
    // (This is NOT secure encryption, just for visualization)
    const result = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i] ^ key[i % key.length]
      if (iv && algorithm.includes("CBC")) {
        // Simulate CBC mode by also XORing with IV
        result[i] = result[i] ^ iv[i % iv.length]
      }
    }
    return result
  }

  // Simulate decryption (for demonstration purposes)
  const simulateDecryption = (data, key, iv, algorithm) => {
    // For our simple XOR simulation, encryption and decryption are the same
    return simulateEncryption(data, key, iv, algorithm)
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Symmetric Encryption</CardTitle>
          <CardDescription>Encrypt and decrypt data using the same secret key</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="algorithm">Algorithm</Label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger id="algorithm">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AES-256-ECB">AES-256-ECB</SelectItem>
                      <SelectItem value="AES-256-CBC">AES-256-CBC</SelectItem>
                      <SelectItem value="AES-256-GCM">AES-256-GCM</SelectItem>
                      <SelectItem value="AES-128-ECB">AES-128-ECB</SelectItem>
                      <SelectItem value="AES-128-CBC">AES-128-CBC</SelectItem>
                      <SelectItem value="AES-128-GCM">AES-128-GCM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plaintext">Plaintext</Label>
                  <Textarea
                    id="plaintext"
                    placeholder="Enter text to encrypt"
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="key">Secret Key (Hex)</Label>
                    <Button variant="outline" size="sm" onClick={generateRandomKey} className="h-8 text-xs">
                      <KeyIcon className="h-3 w-3 mr-1" />
                      Generate Key
                    </Button>
                  </div>
                  <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} className="font-mono text-sm" />
                </div>

                {(algorithm.includes("CBC") || algorithm.includes("GCM")) && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="iv">
                        {algorithm.includes("GCM") ? "Nonce (Hex)" : "Initialization Vector (Hex)"}
                      </Label>
                      <Button variant="outline" size="sm" onClick={generateRandomIv} className="h-8 text-xs">
                        Generate {algorithm.includes("GCM") ? "Nonce" : "IV"}
                      </Button>
                    </div>
                    <Input id="iv" value={iv} onChange={(e) => setIv(e.target.value)} className="font-mono text-sm" />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={encrypt} className="flex-1">
                    <LockIcon className="h-4 w-4 mr-2" />
                    Encrypt
                  </Button>
                  <Button onClick={decrypt} variant="outline" className="flex-1">
                    <UnlockIcon className="h-4 w-4 mr-2" />
                    Decrypt
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ciphertext">Ciphertext (Base64)</Label>
                  <Textarea
                    id="ciphertext"
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decrypted">Decrypted Text</Label>
                  <Textarea id="decrypted" value={decryptedText} readOnly rows={4} />
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
          <CardTitle>How AES Works</CardTitle>
          <CardDescription>Visualization of the AES encryption process</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cbc" className="w-full">
            <TabsList>
              <TabsTrigger value="ecb">ECB Mode</TabsTrigger>
              <TabsTrigger value="cbc">CBC Mode</TabsTrigger>
              <TabsTrigger value="gcm">GCM Mode</TabsTrigger>
            </TabsList>
            <TabsContent value="ecb" className="mt-4">
              <AESVisualization mode="ECB" />
            </TabsContent>
            <TabsContent value="cbc" className="mt-4">
              <AESVisualization mode="CBC" />
            </TabsContent>
            <TabsContent value="gcm" className="mt-4">
              <AESVisualization mode="GCM" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Symmetric Encryption Cheatsheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-medium">AES (Advanced Encryption Standard)</h3>
              <p className="text-muted-foreground">
                A symmetric block cipher that encrypts data in fixed-size blocks (128 bits) using keys of 128, 192, or
                256 bits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Block Cipher Modes</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">ECB (Electronic Codebook):</span> Each block is encrypted independently.
                  Not recommended for most applications due to pattern leakage.
                </li>
                <li>
                  <span className="font-medium">CBC (Cipher Block Chaining):</span> Each block is XORed with the
                  previous ciphertext block before encryption. Requires an IV.
                </li>
                <li>
                  <span className="font-medium">GCM (Galois/Counter Mode):</span> Combines counter mode encryption with
                  authentication. Provides both confidentiality and integrity.
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-2 bg-muted p-3 rounded-md">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">Security Note:</span> Always use a secure random IV for CBC mode and
                  never reuse the same key-IV pair. For GCM, never reuse the same key-nonce pair.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
