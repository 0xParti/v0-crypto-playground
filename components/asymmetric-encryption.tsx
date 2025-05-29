"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyIcon, LockIcon, UnlockIcon } from "lucide-react"
import RSAVisualization from "./visualizations/rsa-visualization"

export default function AsymmetricEncryption() {
  const [algorithm, setAlgorithm] = useState("RSA-OAEP")
  const [plaintext, setPlaintext] = useState(
    "This message will be encrypted with the public key and can only be decrypted with the private key.",
  )
  const [ciphertext, setCiphertext] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [error, setError] = useState("")
  const [keySize, setKeySize] = useState("2048")

  const generateKeyPair = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll generate mock RSA keys
      // In a real app, you would use crypto.subtle.generateKey

      const mockPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvWpIQFjQQCPpaIlJKpeg
irp5kLkQmXz7n8K8l5pZ5cICoiGMUjUj8UXvtZ0aEUFbxZLCRZ8cHVjr4XgbDPfY
JGHh+P/C9LhwJEYKJF7cEfvCdC+PhwMDjUGC4wuw1Jt9J8NqoYjT74r8ULvj5p8+
VkQmU8+Ks5HcVZ7+nNHdX7QhwaZKc0JvVIliQwk5r9n4J9fj1kcfZ7+5e8S8HRN7
XW8beMBwlPPbDHHhvlk3jFZvmWaDwQfTZxH5dVR2eCu1fxyKzHdm4tgXCyc2Vy8j
IQUB4Tlsp6ZzQkGQHPX9t33bxZ1yJcCRqJ+hJSC4+4q3AqIvYFTf1aFPmxnGCHwq
xQIDAQAB
-----END PUBLIC KEY-----`

      const mockPrivateKey = `-----BEGIN PRIVATE KEY-----
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

      setPublicKey(mockPublicKey)
      setPrivateKey(mockPrivateKey)
    } catch (err) {
      setError(`Key generation error: ${err instanceof Error ? err.message : "Unknown error"}`)
      console.error(err)
    }
  }

  const encrypt = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll simulate RSA encryption
      // In a real app, you would use crypto.subtle.encrypt with the imported public key

      // Simulate encryption (this is just for demonstration)
      const mockEncrypted = btoa(plaintext)
      setCiphertext(mockEncrypted)
    } catch (err) {
      setError(`Encryption error: ${err instanceof Error ? err.message : "Unknown error"}`)
      console.error(err)
    }
  }

  const decrypt = async () => {
    try {
      setError("")

      // For demonstration purposes, we'll simulate RSA decryption
      // In a real app, you would use crypto.subtle.decrypt with the imported private key

      // Simulate decryption (this is just for demonstration)
      const mockDecrypted = atob(ciphertext)
      setDecryptedText(mockDecrypted)
    } catch (err) {
      setError(`Decryption error: ${err instanceof Error ? err.message : "Unknown error"}`)
      console.error(err)
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Asymmetric Encryption</CardTitle>
          <CardDescription>Encrypt with a public key and decrypt with a private key</CardDescription>
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
                      <SelectItem value="RSA-OAEP">RSA-OAEP</SelectItem>
                      <SelectItem value="RSA-PKCS1">RSA-PKCS1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keySize">Key Size</Label>
                  <Select value={keySize} onValueChange={setKeySize}>
                    <SelectTrigger id="keySize">
                      <SelectValue placeholder="Select key size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024">1024 bits</SelectItem>
                      <SelectItem value="2048">2048 bits</SelectItem>
                      <SelectItem value="4096">4096 bits</SelectItem>
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

                <div className="flex space-x-2">
                  <Button onClick={generateKeyPair} className="flex-1">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Generate Key Pair
                  </Button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="publicKey">Public Key (PEM)</Label>
                <Textarea id="publicKey" value={publicKey} readOnly rows={8} className="font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="privateKey">Private Key (PEM)</Label>
                <Textarea id="privateKey" value={privateKey} readOnly rows={8} className="font-mono text-xs" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How RSA Works</CardTitle>
          <CardDescription>Visualization of the RSA encryption and decryption process</CardDescription>
        </CardHeader>
        <CardContent>
          <RSAVisualization />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RSA Mathematical Foundation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800">RSA Key Generation</h4>
              <div className="text-sm text-blue-700 mt-2 space-y-2">
                <div className="font-mono">1. Choose two large primes: p, q</div>
                <div className="font-mono">2. Compute modulus: N = p × q</div>
                <div className="font-mono">3. Compute Euler's totient: φ(N) = (p-1)(q-1)</div>
                <div className="font-mono">4. Choose public exponent: e (commonly 65537)</div>
                <div className="font-mono">5. Compute private exponent: d ≡ e⁻¹ (mod φ(N))</div>
                <div className="text-xs mt-2 bg-blue-100 p-2 rounded">
                  <strong>Key insight:</strong> d is the modular multiplicative inverse of e modulo φ(N). This means e ×
                  d ≡ 1 (mod φ(N)). Finding d is easy if you know the prime factorization of N (i.e., p and q), but
                  computationally infeasible without it. This is the foundation of RSA security - the difficulty of
                  factoring large composite numbers.
                </div>
                <div className="text-xs mt-2">Public key: (N, e) | Private key: (N, d)</div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-semibold text-green-800">Encryption</h4>
              <div className="text-sm text-green-700 mt-2 space-y-2">
                <div className="font-mono">1. Obtain the recipient's public key (N, e).</div>
                <div className="font-mono">2. Represent the message as an integer m, such that 0 ≤ m {"<"} N.</div>
                <div className="font-mono">
                  3. Compute the ciphertext: c = m<sup>e</sup> mod N
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="font-semibold text-red-800">Decryption</h4>
              <div className="text-sm text-red-700 mt-2 space-y-2">
                <div className="font-mono">1. Use the recipient's private key (N, d) to compute:</div>
                <div className="font-mono">
                  2. m = c<sup>d</sup> mod N
                </div>
                <div className="font-mono">3. The result, m, is the original message.</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Use Cases</h3>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Secure key exchange</li>
                <li>Digital signatures</li>
                <li>Encrypting small amounts of sensitive data</li>
                <li>Hybrid encryption systems (with symmetric encryption)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
