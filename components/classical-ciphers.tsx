"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RefreshCwIcon, AlertTriangleIcon, ShieldCheckIcon, EyeIcon } from "lucide-react"

export default function ClassicalCiphers() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Classical Ciphers</CardTitle>
          <CardDescription>
            Explore fundamental encryption techniques that laid the foundation for modern cryptography
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="caesar" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="caesar">Caesar Cipher</TabsTrigger>
              <TabsTrigger value="xor">XOR Cipher</TabsTrigger>
              <TabsTrigger value="otp">One-Time Pad</TabsTrigger>
            </TabsList>

            <TabsContent value="caesar">
              <CaesarCipher />
            </TabsContent>

            <TabsContent value="xor">
              <XORCipher />
            </TabsContent>

            <TabsContent value="otp">
              <OneTimePad />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function CaesarCipher() {
  const [plaintext, setPlaintext] = useState("HELLO WORLD")
  const [shift, setShift] = useState([3])
  const [ciphertext, setCiphertext] = useState("")
  const [showFrequency, setShowFrequency] = useState(false)
  const [bruteForceResults, setBruteForceResults] = useState<string[]>([])

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    const encrypted = caesarEncrypt(plaintext, shift[0])
    setCiphertext(encrypted)
  }, [plaintext, shift])

  const caesarEncrypt = (text: string, shiftValue: number) => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => {
        if (char.match(/[A-Z]/)) {
          const charCode = char.charCodeAt(0) - 65
          const shiftedCode = (charCode + shiftValue) % 26
          return String.fromCharCode(shiftedCode + 65)
        }
        return char
      })
      .join("")
  }

  const caesarDecrypt = (text: string, shiftValue: number) => {
    return caesarEncrypt(text, 26 - shiftValue)
  }

  const getFrequencyAnalysis = (text: string) => {
    const frequencies: { [key: string]: number } = {}
    const cleanText = text.replace(/[^A-Z]/g, "")

    for (const char of cleanText) {
      frequencies[char] = (frequencies[char] || 0) + 1
    }

    return Object.entries(frequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const performBruteForce = () => {
    const results = []
    for (let i = 0; i < 26; i++) {
      const decrypted = caesarDecrypt(ciphertext, i)
      results.push(`Shift ${i}: ${decrypted}`)
    }
    setBruteForceResults(results)
  }

  const frequencyData = getFrequencyAnalysis(ciphertext)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caesar-plaintext">Plaintext</Label>
            <Textarea
              id="caesar-plaintext"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter text to encrypt"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caesar-shift">Shift Value: {shift[0]}</Label>
            <Slider
              id="caesar-shift"
              min={0}
              max={25}
              step={1}
              value={shift}
              onValueChange={setShift}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Alphabet Visualization</Label>
            <div className="grid grid-cols-13 gap-1 text-xs font-mono">
              {alphabet.split("").map((char, index) => {
                const shiftedIndex = (index + shift[0]) % 26
                const shiftedChar = alphabet[shiftedIndex]
                return (
                  <div key={index} className="text-center">
                    <div className="p-1 bg-blue-100 rounded">{char}</div>
                    <div className="text-gray-500">↓</div>
                    <div className="p-1 bg-green-100 rounded">{shiftedChar}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caesar-ciphertext">Ciphertext</Label>
            <Textarea id="caesar-ciphertext" value={ciphertext} readOnly rows={3} className="font-mono" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caesar-decrypted">Decrypted (using shift {shift[0]})</Label>
            <Textarea
              id="caesar-decrypted"
              value={caesarDecrypt(ciphertext, shift[0])}
              readOnly
              rows={3}
              className="font-mono"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => setShowFrequency(!showFrequency)} variant="outline" className="flex-1">
              <EyeIcon className="h-4 w-4 mr-2" />
              {showFrequency ? "Hide" : "Show"} Frequency Analysis
            </Button>
            <Button onClick={performBruteForce} variant="outline" className="flex-1">
              <AlertTriangleIcon className="h-4 w-4 mr-2" />
              Brute Force Attack
            </Button>
          </div>

          {showFrequency && (
            <div className="space-y-2">
              <Label>Letter Frequency (Top 5)</Label>
              <div className="space-y-1">
                {frequencyData.map(([letter, count]) => (
                  <div key={letter} className="flex justify-between text-sm">
                    <span className="font-mono">{letter}</span>
                    <span>{count} times</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {bruteForceResults.length > 0 && (
        <div className="space-y-2">
          <Label>Brute Force Results</Label>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {bruteForceResults.map((result, index) => (
              <div key={index} className="text-sm font-mono p-2 bg-gray-50 rounded">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <Alert>
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> Caesar cipher is extremely weak and can be broken by brute force (trying all
          26 possible shifts) or frequency analysis. It's only suitable for educational purposes.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function XORCipher() {
  const [plaintext, setPlaintext] = useState("Hello, World!")
  const [key, setKey] = useState("KEY")
  const [ciphertext, setCiphertext] = useState("")
  const [displayMode, setDisplayMode] = useState<"hex" | "ascii">("hex")
  const [keyReuse, setKeyReuse] = useState(false)
  const [message2, setMessage2] = useState("Secret Message")

  useEffect(() => {
    const encrypted = xorEncrypt(plaintext, key)
    setCiphertext(encrypted)
  }, [plaintext, key])

  const xorEncrypt = (text: string, keyStr: string) => {
    if (!keyStr) return text

    const result = []
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i)
      const keyChar = keyStr.charCodeAt(i % keyStr.length)
      const xorResult = textChar ^ keyChar
      result.push(xorResult)
    }
    return result
  }

  const xorDecrypt = (cipherArray: number[], keyStr: string) => {
    if (!keyStr) return ""

    const result = []
    for (let i = 0; i < cipherArray.length; i++) {
      const keyChar = keyStr.charCodeAt(i % keyStr.length)
      const xorResult = cipherArray[i] ^ keyChar
      result.push(String.fromCharCode(xorResult))
    }
    return result.join("")
  }

  const arrayToHex = (arr: number[]) => {
    return arr.map((byte) => byte.toString(16).padStart(2, "0")).join(" ")
  }

  const arrayToAscii = (arr: number[]) => {
    return arr.map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : "·")).join("")
  }

  const demonstrateKeyReuse = () => {
    const cipher1 = xorEncrypt(plaintext, key)
    const cipher2 = xorEncrypt(message2, key)

    // XOR the two ciphertexts together
    const xorResult = []
    const minLength = Math.min(cipher1.length, cipher2.length)
    for (let i = 0; i < minLength; i++) {
      xorResult.push(cipher1[i] ^ cipher2[i])
    }

    return {
      cipher1: arrayToHex(cipher1),
      cipher2: arrayToHex(cipher2),
      xorResult: arrayToHex(xorResult),
      plainXor: xorResult.map((byte) => String.fromCharCode(byte)).join(""),
    }
  }

  const cipherArray = typeof ciphertext === "string" ? [] : ciphertext
  const decrypted = xorDecrypt(cipherArray, key)
  const keyReuseDemo = keyReuse ? demonstrateKeyReuse() : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xor-plaintext">Plaintext</Label>
            <Textarea
              id="xor-plaintext"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter text to encrypt"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="xor-key">Key</Label>
            <Input
              id="xor-key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter encryption key"
              className="font-mono"
            />
            <div className="text-xs text-gray-500">Key repeats for longer messages</div>
          </div>

          <div className="space-y-2">
            <Label>Display Mode</Label>
            <div className="flex space-x-2">
              <Button
                variant={displayMode === "hex" ? "default" : "outline"}
                onClick={() => setDisplayMode("hex")}
                size="sm"
              >
                Hexadecimal
              </Button>
              <Button
                variant={displayMode === "ascii" ? "default" : "outline"}
                onClick={() => setDisplayMode("ascii")}
                size="sm"
              >
                ASCII
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>XOR Operation Visualization</Label>
            <div className="text-xs font-mono space-y-1 bg-gray-50 p-3 rounded">
              {plaintext
                .slice(0, 10)
                .split("")
                .map((char, index) => {
                  const keyChar = key[index % key.length] || ""
                  const textCode = char.charCodeAt(0)
                  const keyCode = keyChar.charCodeAt(0)
                  const result = textCode ^ keyCode

                  return (
                    <div key={index} className="flex justify-between">
                      <span>
                        '{char}' ({textCode.toString(2).padStart(8, "0")})
                      </span>
                      <span>XOR</span>
                      <span>
                        '{keyChar}' ({keyCode.toString(2).padStart(8, "0")})
                      </span>
                      <span>=</span>
                      <span>
                        {result.toString(2).padStart(8, "0")} ({result})
                      </span>
                    </div>
                  )
                })}
              {plaintext.length > 10 && <div>...</div>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xor-ciphertext">Ciphertext ({displayMode === "hex" ? "Hexadecimal" : "ASCII"})</Label>
            <Textarea
              id="xor-ciphertext"
              value={displayMode === "hex" ? arrayToHex(cipherArray) : arrayToAscii(cipherArray)}
              readOnly
              rows={3}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="xor-decrypted">Decrypted Text</Label>
            <Textarea id="xor-decrypted" value={decrypted} readOnly rows={3} />
          </div>

          <Button onClick={() => setKeyReuse(!keyReuse)} variant="outline" className="w-full">
            <AlertTriangleIcon className="h-4 w-4 mr-2" />
            {keyReuse ? "Hide" : "Demonstrate"} Key Reuse Vulnerability
          </Button>

          {keyReuse && (
            <div className="space-y-2">
              <Label htmlFor="xor-message2">Second Message (same key)</Label>
              <Input
                id="xor-message2"
                value={message2}
                onChange={(e) => setMessage2(e.target.value)}
                placeholder="Enter second message"
              />
            </div>
          )}
        </div>
      </div>

      {keyReuseDemo && (
        <div className="space-y-4">
          <Label>Key Reuse Attack Demonstration</Label>
          <div className="space-y-2 text-sm font-mono">
            <div>
              <strong>Cipher 1:</strong> {keyReuseDemo.cipher1}
            </div>
            <div>
              <strong>Cipher 2:</strong> {keyReuseDemo.cipher2}
            </div>
            <div>
              <strong>Cipher1 ⊕ Cipher2:</strong> {keyReuseDemo.xorResult}
            </div>
            <div>
              <strong>= Message1 ⊕ Message2:</strong> "{keyReuseDemo.plainXor}"
            </div>
          </div>
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              When the same key is used twice, XORing the ciphertexts reveals the XOR of the original messages,
              potentially leaking information about both messages.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Alert>
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> Simple XOR with a repeating key is vulnerable to frequency analysis and known
          plaintext attacks. Never reuse keys, and ensure keys are truly random and as long as the message for security.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function OneTimePad() {
  const [plaintext, setPlaintext] = useState("ATTACK AT DAWN")
  const [key, setKey] = useState("")
  const [ciphertext, setCiphertext] = useState("")
  const [keyReuse, setKeyReuse] = useState(false)
  const [message2, setMessage2] = useState("RETREAT NOW")
  const [displayMode, setDisplayMode] = useState<"binary" | "hex" | "ascii">("ascii")

  useEffect(() => {
    if (key.length === plaintext.length) {
      const encrypted = otpEncrypt(plaintext, key)
      setCiphertext(encrypted)
    }
  }, [plaintext, key])

  const generateRandomKey = () => {
    const keyLength = plaintext.length
    let randomKey = ""
    for (let i = 0; i < keyLength; i++) {
      // Generate random printable ASCII characters
      const randomChar = String.fromCharCode(Math.floor(Math.random() * 95) + 32)
      randomKey += randomChar
    }
    setKey(randomKey)
  }

  const otpEncrypt = (text: string, keyStr: string) => {
    const result = []
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i)
      const keyChar = keyStr.charCodeAt(i)
      const xorResult = textChar ^ keyChar
      result.push(xorResult)
    }
    return result
  }

  const otpDecrypt = (cipherArray: number[], keyStr: string) => {
    const result = []
    for (let i = 0; i < cipherArray.length; i++) {
      const keyChar = keyStr.charCodeAt(i)
      const xorResult = cipherArray[i] ^ keyChar
      result.push(String.fromCharCode(xorResult))
    }
    return result.join("")
  }

  const arrayToBinary = (arr: number[]) => {
    return arr.map((byte) => byte.toString(2).padStart(8, "0")).join(" ")
  }

  const arrayToHex = (arr: number[]) => {
    return arr.map((byte) => byte.toString(16).padStart(2, "0")).join(" ")
  }

  const arrayToAscii = (arr: number[]) => {
    return arr.map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : "·")).join("")
  }

  const demonstrateKeyReuse = () => {
    if (key.length < Math.max(plaintext.length, message2.length)) return null

    const cipher1 = otpEncrypt(plaintext, key)
    const cipher2 = otpEncrypt(message2, key)

    // XOR the two ciphertexts
    const xorResult = []
    const minLength = Math.min(cipher1.length, cipher2.length)
    for (let i = 0; i < minLength; i++) {
      xorResult.push(cipher1[i] ^ cipher2[i])
    }

    return {
      cipher1: arrayToHex(cipher1),
      cipher2: arrayToHex(cipher2),
      xorResult: arrayToHex(xorResult),
      plainXor: xorResult.map((byte) => String.fromCharCode(byte)).join(""),
    }
  }

  const cipherArray = Array.isArray(ciphertext) ? ciphertext : []
  const decrypted = key.length === plaintext.length ? otpDecrypt(cipherArray, key) : ""
  const keyReuseDemo = keyReuse ? demonstrateKeyReuse() : null

  const formatCiphertext = () => {
    switch (displayMode) {
      case "binary":
        return arrayToBinary(cipherArray)
      case "hex":
        return arrayToHex(cipherArray)
      case "ascii":
        return arrayToAscii(cipherArray)
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-plaintext">Plaintext</Label>
            <Textarea
              id="otp-plaintext"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter text to encrypt"
              rows={3}
            />
            <div className="text-xs text-gray-500">Length: {plaintext.length} characters</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="otp-key">One-Time Key</Label>
              <Button onClick={generateRandomKey} size="sm" variant="outline">
                <RefreshCwIcon className="h-4 w-4 mr-1" />
                Generate Random Key
              </Button>
            </div>
            <Textarea
              id="otp-key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Key must be same length as plaintext"
              rows={3}
              className="font-mono text-sm"
            />
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Length: {key.length} characters</span>
              {key.length === plaintext.length ? (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <ShieldCheckIcon className="h-3 w-3 mr-1" />
                  Perfect Length
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangleIcon className="h-3 w-3 mr-1" />
                  Length Mismatch
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Display Mode</Label>
            <div className="flex space-x-2">
              <Button
                variant={displayMode === "ascii" ? "default" : "outline"}
                onClick={() => setDisplayMode("ascii")}
                size="sm"
              >
                ASCII
              </Button>
              <Button
                variant={displayMode === "hex" ? "default" : "outline"}
                onClick={() => setDisplayMode("hex")}
                size="sm"
              >
                Hex
              </Button>
              <Button
                variant={displayMode === "binary" ? "default" : "outline"}
                onClick={() => setDisplayMode("binary")}
                size="sm"
              >
                Binary
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-ciphertext">Ciphertext ({displayMode})</Label>
            <Textarea id="otp-ciphertext" value={formatCiphertext()} readOnly rows={3} className="font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp-decrypted">Decrypted Text</Label>
            <Textarea id="otp-decrypted" value={decrypted} readOnly rows={3} />
          </div>

          <Button onClick={() => setKeyReuse(!keyReuse)} variant="outline" className="w-full">
            <AlertTriangleIcon className="h-4 w-4 mr-2" />
            {keyReuse ? "Hide" : "Demonstrate"} Key Reuse Attack
          </Button>

          {keyReuse && (
            <div className="space-y-2">
              <Label htmlFor="otp-message2">Second Message (same key - NEVER do this!)</Label>
              <Input
                id="otp-message2"
                value={message2}
                onChange={(e) => setMessage2(e.target.value)}
                placeholder="Enter second message"
              />
            </div>
          )}
        </div>
      </div>

      {keyReuseDemo && (
        <div className="space-y-4">
          <Label>Key Reuse Attack on One-Time Pad</Label>
          <div className="space-y-2 text-sm font-mono">
            <div>
              <strong>Message 1 encrypted:</strong> {keyReuseDemo.cipher1}
            </div>
            <div>
              <strong>Message 2 encrypted:</strong> {keyReuseDemo.cipher2}
            </div>
            <div>
              <strong>Cipher1 ⊕ Cipher2:</strong> {keyReuseDemo.xorResult}
            </div>
            <div>
              <strong>= Message1 ⊕ Message2:</strong> "{keyReuseDemo.plainXor}"
            </div>
          </div>
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical Security Violation:</strong> Reusing a one-time pad key completely breaks the security!
              The XOR of two ciphertexts reveals the XOR of the original messages, allowing cryptanalysis.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <ShieldCheckIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Perfect Security:</strong> When used correctly (random key, same length as message, used only once),
            the one-time pad provides perfect secrecy - it's mathematically unbreakable.
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Practical Limitations:</strong> Key distribution and management make one-time pads impractical for
            most applications. The key must be as long as all messages combined.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
