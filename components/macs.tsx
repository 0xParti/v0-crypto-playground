"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon, ShieldIcon, EyeIcon, AlertTriangleIcon } from "lucide-react"

export default function MACs() {
  const [message, setMessage] = useState("Hello, World!")
  const [key, setKey] = useState("secret-key-123")
  const [hmacResult, setHmacResult] = useState("")
  const [verifyMessage, setVerifyMessage] = useState("Hello, World!")
  const [verifyKey, setVerifyKey] = useState("secret-key-123")
  const [verifyTag, setVerifyTag] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [showSteps, setShowSteps] = useState(false)
  const [showAttack, setShowAttack] = useState(false)
  const [tamperedMessage, setTamperedMessage] = useState("Hello, World! (modified)")

  // Simplified HMAC simulation (not cryptographically secure)
  const simulateHMAC = (msg: string, k: string) => {
    // This is a simplified demonstration - real HMAC uses proper hash functions
    const ipad = "36".repeat(32) // Inner padding
    const opad = "5c".repeat(32) // Outer padding

    // Simulate key padding
    const paddedKey = k.padEnd(64, "0").slice(0, 64)

    // Simulate XOR operations
    let innerKey = ""
    let outerKey = ""
    for (let i = 0; i < paddedKey.length; i += 2) {
      const keyByte = Number.parseInt(paddedKey.slice(i, i + 2), 16) || paddedKey.charCodeAt(i / 2) || 0
      const ipadByte = Number.parseInt(ipad.slice(i, i + 2), 16)
      const opadByte = Number.parseInt(opad.slice(i, i + 2), 16)

      innerKey += (keyByte ^ ipadByte).toString(16).padStart(2, "0")
      outerKey += (keyByte ^ opadByte).toString(16).padStart(2, "0")
    }

    // Simulate hash operations (simplified)
    const innerHash = simpleHash(innerKey + stringToHex(msg))
    const finalHash = simpleHash(outerKey + innerHash)

    return finalHash
  }

  const simpleHash = (input: string) => {
    // Very simple hash simulation for demonstration
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
  }

  const stringToHex = (str: string) => {
    return str
      .split("")
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  }

  useEffect(() => {
    const tag = simulateHMAC(message, key)
    setHmacResult(tag)
  }, [message, key])

  const verifyMAC = () => {
    const computedTag = simulateHMAC(verifyMessage, verifyKey)
    setVerificationResult(computedTag === verifyTag)
  }

  const copyTagToVerify = () => {
    setVerifyTag(hmacResult)
    setVerifyMessage(message)
    setVerifyKey(key)
  }

  const demonstrateAttack = () => {
    const originalTag = simulateHMAC(message, key)
    const tamperedTag = simulateHMAC(tamperedMessage, key)

    setVerifyMessage(tamperedMessage)
    setVerifyTag(originalTag) // Using original tag with tampered message
    setVerifyKey(key)

    // This will fail verification
    const isValid = originalTag === tamperedTag
    setVerificationResult(isValid)
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Message Authentication Codes (MACs)</CardTitle>
          <CardDescription>Ensure message integrity and authenticity using shared secret keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MAC Generation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">MAC Generation</h3>

                <div className="space-y-2">
                  <Label htmlFor="mac-message">Message</Label>
                  <Textarea
                    id="mac-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message to authenticate"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mac-key">Secret Key</Label>
                  <Input
                    id="mac-key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter secret key"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mac-result">HMAC Tag</Label>
                  <Input id="mac-result" value={hmacResult} readOnly className="font-mono bg-gray-50" />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => setShowSteps(!showSteps)} variant="outline" className="flex-1">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    {showSteps ? "Hide" : "Show"} HMAC Steps
                  </Button>
                  <Button onClick={copyTagToVerify} className="flex-1">
                    Copy to Verification →
                  </Button>
                </div>
              </div>

              {/* MAC Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">MAC Verification</h3>

                <div className="space-y-2">
                  <Label htmlFor="verify-message">Message to Verify</Label>
                  <Textarea
                    id="verify-message"
                    value={verifyMessage}
                    onChange={(e) => setVerifyMessage(e.target.value)}
                    placeholder="Enter message to verify"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verify-key">Secret Key</Label>
                  <Input
                    id="verify-key"
                    value={verifyKey}
                    onChange={(e) => setVerifyKey(e.target.value)}
                    placeholder="Enter secret key"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verify-tag">MAC Tag to Verify</Label>
                  <Input
                    id="verify-tag"
                    value={verifyTag}
                    onChange={(e) => setVerifyTag(e.target.value)}
                    placeholder="Enter MAC tag"
                    className="font-mono"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={verifyMAC} className="flex-1">
                    <ShieldIcon className="h-4 w-4 mr-2" />
                    Verify MAC
                  </Button>
                  <Button onClick={() => setShowAttack(!showAttack)} variant="outline" className="flex-1">
                    <AlertTriangleIcon className="h-4 w-4 mr-2" />
                    Demo Attack
                  </Button>
                </div>

                {verificationResult !== null && (
                  <div
                    className={`p-3 rounded-md flex items-center gap-2 ${
                      verificationResult ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {verificationResult ? (
                      <>
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-green-700 font-medium">MAC Verification Successful</span>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-5 w-5 text-red-500" />
                        <span className="text-red-700 font-medium">MAC Verification Failed - Message Tampered!</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {showSteps && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">HMAC Construction Steps</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm font-mono">
                  <div>
                    <strong>1. Key Padding:</strong> Pad key to block size (64 bytes for SHA-256)
                  </div>
                  <div>
                    <strong>2. Inner Padding:</strong> XOR key with ipad (0x36 repeated)
                  </div>
                  <div>
                    <strong>3. Inner Hash:</strong> H((K ⊕ ipad) || message)
                  </div>
                  <div>
                    <strong>4. Outer Padding:</strong> XOR key with opad (0x5c repeated)
                  </div>
                  <div>
                    <strong>5. Outer Hash:</strong> H((K ⊕ opad) || inner_hash)
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <strong>Formula:</strong> HMAC(K, m) = H((K ⊕ opad) || H((K ⊕ ipad) || m))
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md text-sm">
                  <strong>Why the double hash?</strong> The nested structure prevents length extension attacks and
                  provides security even if the underlying hash function has certain weaknesses.
                </div>
              </div>
            )}

            {showAttack && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tampering Attack Demonstration</h3>
                <div className="space-y-2">
                  <Label htmlFor="tampered-message">Tampered Message</Label>
                  <Textarea
                    id="tampered-message"
                    value={tamperedMessage}
                    onChange={(e) => setTamperedMessage(e.target.value)}
                    placeholder="Modify the original message"
                    rows={2}
                  />
                </div>
                <Button onClick={demonstrateAttack} variant="destructive" className="w-full">
                  Attempt to Verify Tampered Message with Original Tag
                </Button>
                <Alert>
                  <AlertTriangleIcon className="h-4 w-4" />
                  <AlertDescription>
                    This demonstrates how MACs detect tampering. Even small changes to the message will cause
                    verification to fail, proving the message has been modified.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>MAC Types & Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-medium">Common MAC Algorithms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    HMAC
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Hash-based MAC using cryptographic hash functions (SHA-256, SHA-3, etc.). Most widely used due to
                    security and efficiency.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    CMAC
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Cipher-based MAC using block ciphers (AES-CMAC). Provides similar security to HMAC but uses block
                    cipher primitives.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    GMAC
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Galois MAC, part of GCM mode. Provides both encryption and authentication in a single operation.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    Poly1305
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    High-speed MAC designed for use with stream ciphers like ChaCha20. Used in modern protocols like TLS
                    1.3.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Security Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="font-medium text-green-800">Integrity</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Detects any modification to the message, no matter how small.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="font-medium text-blue-800">Authenticity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Proves the message came from someone who knows the secret key.
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <h4 className="font-medium text-purple-800">Non-repudiation*</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    *Limited: Both parties can generate valid MACs with shared key.
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-md">
                  <h4 className="font-medium text-orange-800">Replay Protection</h4>
                  <p className="text-sm text-orange-700 mt-1">When combined with timestamps or sequence numbers.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Real-World Applications</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">TLS/SSL:</span> HMAC protects the integrity of encrypted communications
                </li>
                <li>
                  <span className="font-medium">IPsec:</span> Authenticates IP packets in VPN connections
                </li>
                <li>
                  <span className="font-medium">JWT Tokens:</span> HMAC-signed tokens for web authentication
                </li>
                <li>
                  <span className="font-medium">API Security:</span> Request signing to prevent tampering
                </li>
                <li>
                  <span className="font-medium">File Integrity:</span> Detecting unauthorized file modifications
                </li>
                <li>
                  <span className="font-medium">Database Security:</span> Protecting stored data integrity
                </li>
              </ul>
            </div>

            <Alert>
              <ShieldIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Key Management:</strong> MAC security depends entirely on keeping the secret key confidential.
                Use secure key derivation, rotation, and storage practices. Consider using authenticated encryption
                modes (like AES-GCM) that provide both confidentiality and authenticity.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
