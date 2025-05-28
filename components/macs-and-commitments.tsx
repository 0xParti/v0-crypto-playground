"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon, ShieldIcon, EyeIcon, LockIcon, UnlockIcon } from "lucide-react"

export default function MACsAndCommitments() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>MACs, Commitments & Zero-Knowledge Basics</CardTitle>
          <CardDescription>
            Explore message authentication, commitment schemes, and fundamental zero-knowledge protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mac" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="mac">MAC & HMAC</TabsTrigger>
              <TabsTrigger value="commitments">Commitments</TabsTrigger>
              <TabsTrigger value="sigma">Sigma Protocols</TabsTrigger>
              <TabsTrigger value="polynomial">Polynomial Proofs</TabsTrigger>
              <TabsTrigger value="interpolation">Lagrange Interpolation</TabsTrigger>
            </TabsList>

            <TabsContent value="mac">
              <MACDemo />
            </TabsContent>

            <TabsContent value="commitments">
              <CommitmentDemo />
            </TabsContent>

            <TabsContent value="sigma">
              <SigmaProtocolDemo />
            </TabsContent>

            <TabsContent value="polynomial">
              <PolynomialProofDemo />
            </TabsContent>

            <TabsContent value="interpolation">
              <LagrangeInterpolationDemo />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function MACDemo() {
  const [message, setMessage] = useState("Hello, World!")
  const [key, setKey] = useState("secret-key-123")
  const [hmacResult, setHmacResult] = useState("")
  const [verifyMessage, setVerifyMessage] = useState("Hello, World!")
  const [verifyKey, setVerifyKey] = useState("secret-key-123")
  const [verifyTag, setVerifyTag] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [showSteps, setShowSteps] = useState(false)

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

  return (
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

          <Button onClick={() => setShowSteps(!showSteps)} variant="outline" className="w-full">
            <EyeIcon className="h-4 w-4 mr-2" />
            {showSteps ? "Hide" : "Show"} HMAC Steps
          </Button>

          <Button onClick={copyTagToVerify} className="w-full">
            Copy to Verification →
          </Button>
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

          <Button onClick={verifyMAC} className="w-full">
            <ShieldIcon className="h-4 w-4 mr-2" />
            Verify MAC
          </Button>

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
                  <span className="text-red-700 font-medium">MAC Verification Failed</span>
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
              <strong>1. Key Padding:</strong> Pad key to block size (64 bytes)
            </div>
            <div>
              <strong>2. Inner Padding:</strong> XOR key with ipad (0x36...36)
            </div>
            <div>
              <strong>3. Inner Hash:</strong> H((K ⊕ ipad) || message)
            </div>
            <div>
              <strong>4. Outer Padding:</strong> XOR key with opad (0x5c...5c)
            </div>
            <div>
              <strong>5. Outer Hash:</strong> H((K ⊕ opad) || inner_hash)
            </div>
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <strong>Formula:</strong> HMAC(K, m) = H((K ⊕ opad) || H((K ⊕ ipad) || m))
            </div>
          </div>
        </div>
      )}

      <Alert>
        <ShieldIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> This is a simplified demonstration. Real HMAC uses cryptographic hash
          functions like SHA-256. MACs provide both integrity and authenticity - they prove the message hasn't been
          tampered with and came from someone with the secret key.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function CommitmentDemo() {
  const [secret, setSecret] = useState("42")
  const [nonce, setNonce] = useState("")
  const [commitment, setCommitment] = useState("")
  const [revealSecret, setRevealSecret] = useState("")
  const [revealNonce, setRevealNonce] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [phase, setPhase] = useState<"commit" | "reveal">("commit")

  // Simple commitment scheme: commit = hash(secret || nonce)
  const generateCommitment = (sec: string, n: string) => {
    const combined = sec + n
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
  }

  const generateRandomNonce = () => {
    const randomNonce = Math.random().toString(36).substring(2, 15)
    setNonce(randomNonce)
  }

  const createCommitment = () => {
    if (!nonce) {
      generateRandomNonce()
      return
    }
    const comm = generateCommitment(secret, nonce)
    setCommitment(comm)
    setPhase("reveal")
  }

  const verifyCommitment = () => {
    const recomputedCommitment = generateCommitment(revealSecret, revealNonce)
    setVerificationResult(recomputedCommitment === commitment)
  }

  const resetDemo = () => {
    setPhase("commit")
    setCommitment("")
    setVerificationResult(null)
    setRevealSecret("")
    setRevealNonce("")
  }

  const copyToReveal = () => {
    setRevealSecret(secret)
    setRevealNonce(nonce)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          <Badge variant={phase === "commit" ? "default" : "outline"}>1. Commit Phase</Badge>
          <Badge variant={phase === "reveal" ? "default" : "outline"}>2. Reveal Phase</Badge>
        </div>
      </div>

      {phase === "commit" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Commit Phase</h3>
          <p className="text-sm text-gray-600">
            Create a commitment to your secret value. The commitment hides the secret but allows you to prove it later.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commit-secret">Secret Value</Label>
                <Input
                  id="commit-secret"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter your secret"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="commit-nonce">Random Nonce</Label>
                  <Button onClick={generateRandomNonce} size="sm" variant="outline">
                    Generate Random
                  </Button>
                </div>
                <Input
                  id="commit-nonce"
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  placeholder="Random value for hiding"
                  className="font-mono"
                />
              </div>

              <Button onClick={createCommitment} className="w-full" disabled={!secret}>
                <LockIcon className="h-4 w-4 mr-2" />
                Create Commitment
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Commitment Formula</Label>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">commit = hash(secret || nonce)</div>
              </div>

              {commitment && (
                <div className="space-y-2">
                  <Label>Generated Commitment</Label>
                  <Input value={commitment} readOnly className="font-mono bg-blue-50" />
                  <p className="text-xs text-gray-500">
                    This commitment can be shared publicly without revealing the secret.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === "reveal" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reveal Phase</h3>
          <p className="text-sm text-gray-600">
            Reveal your secret and nonce to prove your commitment. Others can verify you committed to this exact value.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Original Commitment</Label>
                <Input value={commitment} readOnly className="font-mono bg-gray-50" />
              </div>

              <Button onClick={copyToReveal} variant="outline" className="w-full">
                Copy Original Values →
              </Button>

              <Button onClick={resetDemo} variant="outline" className="w-full">
                Start New Commitment
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reveal-secret">Revealed Secret</Label>
                <Input
                  id="reveal-secret"
                  value={revealSecret}
                  onChange={(e) => setRevealSecret(e.target.value)}
                  placeholder="Enter the secret you committed to"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reveal-nonce">Revealed Nonce</Label>
                <Input
                  id="reveal-nonce"
                  value={revealNonce}
                  onChange={(e) => setRevealNonce(e.target.value)}
                  placeholder="Enter the nonce you used"
                  className="font-mono"
                />
              </div>

              <Button onClick={verifyCommitment} className="w-full">
                <UnlockIcon className="h-4 w-4 mr-2" />
                Verify Commitment
              </Button>

              {verificationResult !== null && (
                <div
                  className={`p-3 rounded-md flex items-center gap-2 ${
                    verificationResult ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  {verificationResult ? (
                    <>
                      <CheckIcon className="h-5 w-5 text-green-500" />
                      <span className="text-green-700 font-medium">Commitment Verified!</span>
                    </>
                  ) : (
                    <>
                      <XIcon className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 font-medium">Commitment Verification Failed</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <ShieldIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Binding Property:</strong> Once you create a commitment, you cannot change the secret value you
            committed to.
          </AlertDescription>
        </Alert>

        <Alert>
          <EyeIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Hiding Property:</strong> The commitment reveals nothing about the secret until you choose to reveal
            it.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

function SigmaProtocolDemo() {
  const [secret, setSecret] = useState(7)
  const [generator, setGenerator] = useState(3)
  const [modulus, setModulus] = useState(23)
  const [publicValue, setPublicValue] = useState(0)
  const [challenge, setChallenge] = useState(0)
  const [response, setResponse] = useState(0)
  const [randomness, setRandomness] = useState(0)
  const [commitment, setCommitment] = useState(0)
  const [step, setStep] = useState(0)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

  // Sigma protocol for proving knowledge of discrete log
  // Public: g, h = g^x mod p
  // Secret: x
  // Prove: I know x such that h = g^x mod p

  useEffect(() => {
    // Compute public value h = g^x mod p
    const h = modPow(generator, secret, modulus)
    setPublicValue(h)
  }, [secret, generator, modulus])

  const modPow = (base: number, exp: number, mod: number) => {
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

  const generateCommitment = () => {
    // Step 1: Prover chooses random r and computes commitment a = g^r mod p
    const r = Math.floor(Math.random() * (modulus - 1)) + 1
    const a = modPow(generator, r, modulus)
    setRandomness(r)
    setCommitment(a)
    setStep(1)
  }

  const generateChallenge = () => {
    // Step 2: Verifier sends random challenge c
    const c = Math.floor(Math.random() * (modulus - 1)) + 1
    setChallenge(c)
    setStep(2)
  }

  const generateResponse = () => {
    // Step 3: Prover computes response z = r + c*x mod (p-1)
    const z = (randomness + challenge * secret) % (modulus - 1)
    setResponse(z)
    setStep(3)
  }

  const verifyProof = () => {
    // Verification: Check if g^z = a * h^c mod p
    const leftSide = modPow(generator, response, modulus)
    const rightSide = (commitment * modPow(publicValue, challenge, modulus)) % modulus
    setVerificationResult(leftSide === rightSide)
    setStep(4)
  }

  const resetProtocol = () => {
    setStep(0)
    setVerificationResult(null)
    setCommitment(0)
    setChallenge(0)
    setResponse(0)
    setRandomness(0)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sigma Protocol: Proof of Knowledge of Discrete Logarithm</h3>
        <p className="text-sm text-gray-600">
          Prove you know the secret x such that h = g^x mod p, without revealing x.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sigma-generator">Generator (g)</Label>
            <Input
              id="sigma-generator"
              type="number"
              value={generator}
              onChange={(e) => setGenerator(Number(e.target.value))}
              min={2}
              max={modulus - 1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigma-modulus">Modulus (p)</Label>
            <Input
              id="sigma-modulus"
              type="number"
              value={modulus}
              onChange={(e) => setModulus(Number(e.target.value))}
              min={5}
              max={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigma-secret">Secret (x)</Label>
            <Input
              id="sigma-secret"
              type="number"
              value={secret}
              onChange={(e) => setSecret(Number(e.target.value))}
              min={1}
              max={modulus - 1}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-md">
          <div className="text-sm">
            <strong>Public Information:</strong> g = {generator}, p = {modulus}, h = g^x mod p = {publicValue}
          </div>
          <div className="text-sm mt-1">
            <strong>Secret:</strong> x = {secret} (only the prover knows this)
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Badge key={i} variant={step >= i ? "default" : "outline"}>
                {i === 0 ? "Setup" : i === 1 ? "Commit" : i === 2 ? "Challenge" : i === 3 ? "Response" : "Verify"}
              </Badge>
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="text-center space-y-4">
            <p>Ready to start the sigma protocol. Click to generate the first commitment.</p>
            <Button onClick={generateCommitment} className="w-full md:w-auto">
              Start Protocol: Generate Commitment
            </Button>
          </div>
        )}

        {step >= 1 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Step 1: Commitment</h4>
              <div className="text-sm space-y-1">
                <div>Prover chooses random r = {randomness}</div>
                <div>
                  Prover computes a = g^r mod p = {generator}^{randomness} mod {modulus} = {commitment}
                </div>
                <div>Prover sends commitment a = {commitment} to verifier</div>
              </div>
            </div>

            {step === 1 && (
              <Button onClick={generateChallenge} className="w-full md:w-auto">
                Next: Verifier Sends Challenge
              </Button>
            )}
          </div>
        )}

        {step >= 2 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Step 2: Challenge</h4>
              <div className="text-sm space-y-1">
                <div>Verifier chooses random challenge c = {challenge}</div>
                <div>Verifier sends challenge c = {challenge} to prover</div>
              </div>
            </div>

            {step === 2 && (
              <Button onClick={generateResponse} className="w-full md:w-auto">
                Next: Prover Computes Response
              </Button>
            )}
          </div>
        )}

        {step >= 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Step 3: Response</h4>
              <div className="text-sm space-y-1">
                <div>Prover computes z = r + c×x mod (p-1)</div>
                <div>
                  z = {randomness} + {challenge}×{secret} mod {modulus - 1} = {response}
                </div>
                <div>Prover sends response z = {response} to verifier</div>
              </div>
            </div>

            {step === 3 && (
              <Button onClick={verifyProof} className="w-full md:w-auto">
                Next: Verify Proof
              </Button>
            )}
          </div>
        )}

        {step >= 4 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Step 4: Verification</h4>
              <div className="text-sm space-y-1">
                <div>Verifier checks: g^z ≟ a × h^c mod p</div>
                <div>
                  Left side: g^z = {generator}^{response} mod {modulus} = {modPow(generator, response, modulus)}
                </div>
                <div>
                  Right side: a × h^c = {commitment} × {publicValue}^{challenge} mod {modulus} ={" "}
                  {(commitment * modPow(publicValue, challenge, modulus)) % modulus}
                </div>
              </div>
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
                    <span className="text-green-700 font-medium">Proof Verified! Prover knows the secret.</span>
                  </>
                ) : (
                  <>
                    <XIcon className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 font-medium">Proof Failed! Invalid proof.</span>
                  </>
                )}
              </div>
            )}

            <Button onClick={resetProtocol} variant="outline" className="w-full md:w-auto">
              Reset Protocol
            </Button>
          </div>
        )}
      </div>

      <Alert>
        <ShieldIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Zero-Knowledge Property:</strong> This protocol proves knowledge of the secret x without revealing any
          information about x itself. The verifier learns nothing beyond the fact that the prover knows the secret.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function PolynomialProofDemo() {
  const [polynomial, setPolynomial] = useState([1, 2, 3]) // coefficients for x^2 + 2x + 3
  const [evaluationPoint, setEvaluationPoint] = useState(5)
  const [claimedValue, setClaimedValue] = useState(0)
  const [actualValue, setActualValue] = useState(0)
  const [fingerprint, setFingerprint] = useState("")
  const [verificationPoint, setVerificationPoint] = useState(0)
  const [showReedSolomon, setShowReedSolomon] = useState(false)

  useEffect(() => {
    // Evaluate polynomial at the given point
    const value = evaluatePolynomial(polynomial, evaluationPoint)
    setActualValue(value)
    setClaimedValue(value)
  }, [polynomial, evaluationPoint])

  const evaluatePolynomial = (coeffs: number[], x: number) => {
    return coeffs.reduce((sum, coeff, index) => {
      return sum + coeff * Math.pow(x, coeffs.length - 1 - index)
    }, 0)
  }

  const generateFingerprint = () => {
    // Reed-Solomon fingerprinting: evaluate polynomial at random point
    const randomPoint = Math.floor(Math.random() * 100) + 1
    const fingerprintValue = evaluatePolynomial(polynomial, randomPoint)
    setVerificationPoint(randomPoint)
    setFingerprint(`P(${randomPoint}) = ${fingerprintValue}`)
  }

  const updateCoefficient = (index: number, value: string) => {
    const newPoly = [...polynomial]
    newPoly[index] = Number(value) || 0
    setPolynomial(newPoly)
  }

  const addTerm = () => {
    setPolynomial([...polynomial, 0])
  }

  const removeTerm = () => {
    if (polynomial.length > 1) {
      setPolynomial(polynomial.slice(0, -1))
    }
  }

  const formatPolynomial = (coeffs: number[]) => {
    return coeffs
      .map((coeff, index) => {
        const power = coeffs.length - 1 - index
        if (power === 0) return coeff.toString()
        if (power === 1) return `${coeff}x`
        return `${coeff}x^${power}`
      })
      .join(" + ")
      .replace(/\+ -/g, "- ")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Polynomial Proofs & Reed-Solomon Fingerprinting</h3>
        <p className="text-sm text-gray-600">
          Demonstrate how polynomials can be used for efficient verification and fingerprinting.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Polynomial Coefficients (highest degree first)</Label>
            <div className="flex flex-wrap gap-2 items-center">
              {polynomial.map((coeff, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={coeff}
                    onChange={(e) => updateCoefficient(index, e.target.value)}
                    className="w-16"
                  />
                  <span className="text-sm">
                    {polynomial.length - 1 - index === 0
                      ? ""
                      : polynomial.length - 1 - index === 1
                        ? "x"
                        : `x^${polynomial.length - 1 - index}`}
                  </span>
                  {index < polynomial.length - 1 && <span>+</span>}
                </div>
              ))}
              <Button onClick={addTerm} size="sm" variant="outline">
                +
              </Button>
              <Button onClick={removeTerm} size="sm" variant="outline" disabled={polynomial.length <= 1}>
                -
              </Button>
            </div>
            <div className="text-sm text-gray-600">Polynomial: P(x) = {formatPolynomial(polynomial)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Polynomial Evaluation</h4>

              <div className="space-y-2">
                <Label htmlFor="eval-point">Evaluation Point (x)</Label>
                <Input
                  id="eval-point"
                  type="number"
                  value={evaluationPoint}
                  onChange={(e) => setEvaluationPoint(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Actual Value</Label>
                <Input value={`P(${evaluationPoint}) = ${actualValue}`} readOnly className="bg-green-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="claimed-value">Claimed Value (for testing)</Label>
                <Input
                  id="claimed-value"
                  type="number"
                  value={claimedValue}
                  onChange={(e) => setClaimedValue(Number(e.target.value))}
                />
              </div>

              <div
                className={`p-3 rounded-md ${
                  claimedValue === actualValue
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {claimedValue === actualValue ? (
                  <span className="text-green-700">✓ Claimed value matches actual evaluation</span>
                ) : (
                  <span className="text-red-700">✗ Claimed value is incorrect</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Reed-Solomon Fingerprinting</h4>
              <p className="text-xs text-gray-600">
                Generate a compact fingerprint by evaluating the polynomial at a random point.
              </p>

              <Button onClick={generateFingerprint} className="w-full">
                Generate Random Fingerprint
              </Button>

              {fingerprint && (
                <div className="space-y-2">
                  <Label>Fingerprint</Label>
                  <Input value={fingerprint} readOnly className="font-mono bg-blue-50" />
                  <p className="text-xs text-gray-600">
                    This fingerprint can be used to verify polynomial identity with high probability.
                  </p>
                </div>
              )}

              <Button onClick={() => setShowReedSolomon(!showReedSolomon)} variant="outline" className="w-full">
                {showReedSolomon ? "Hide" : "Show"} Reed-Solomon Details
              </Button>
            </div>
          </div>
        </div>

        {showReedSolomon && (
          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <h4 className="font-semibold">Reed-Solomon Fingerprinting Explained</h4>
            <div className="text-sm space-y-2">
              <div>
                <strong>Idea:</strong> Two different polynomials of degree d can agree on at most d points.
              </div>
              <div>
                <strong>Protocol:</strong> To verify P(x) = Q(x), evaluate both at a random point r.
              </div>
              <div>
                <strong>Security:</strong> If P ≠ Q, then Pr[P(r) = Q(r)] ≤ d/|field|
              </div>
              <div>
                <strong>Efficiency:</strong> Only need to send one field element instead of d+1 coefficients.
              </div>
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <strong>Example:</strong> For degree-{polynomial.length - 1} polynomial over field size 100, error
                probability ≤ {polynomial.length - 1}/100 = {(((polynomial.length - 1) / 100) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>

      <Alert>
        <ShieldIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Applications:</strong> Reed-Solomon fingerprinting is used in error-correcting codes, probabilistic
          checksum verification, and as a building block in many zero-knowledge proof systems.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function LagrangeInterpolationDemo() {
  const [points, setPoints] = useState([
    { x: 1, y: 2 },
    { x: 2, y: 5 },
    { x: 3, y: 10 },
  ])
  const [interpolationX, setInterpolationX] = useState(4)
  const [interpolatedY, setInterpolatedY] = useState(0)
  const [showCalculation, setShowCalculation] = useState(false)
  const [threshold, setThreshold] = useState(2)
  const [secretShares, setSecretShares] = useState<{ x: number; y: number }[]>([])
  const [reconstructedSecret, setReconstructedSecret] = useState<number | null>(null)

  useEffect(() => {
    const y = lagrangeInterpolation(points, interpolationX)
    setInterpolatedY(y)
  }, [points, interpolationX])

  const lagrangeInterpolation = (pts: { x: number; y: number }[], x: number) => {
    let result = 0

    for (let i = 0; i < pts.length; i++) {
      let term = pts[i].y

      for (let j = 0; j < pts.length; j++) {
        if (i !== j) {
          term *= (x - pts[j].x) / (pts[i].x - pts[j].x)
        }
      }

      result += term
    }

    return Math.round(result * 100) / 100 // Round to 2 decimal places
  }

  const updatePoint = (index: number, field: "x" | "y", value: string) => {
    const newPoints = [...points]
    newPoints[index][field] = Number(value) || 0
    setPoints(newPoints)
  }

  const addPoint = () => {
    const maxX = Math.max(...points.map((p) => p.x))
    setPoints([...points, { x: maxX + 1, y: 0 }])
  }

  const removePoint = () => {
    if (points.length > 2) {
      setPoints(points.slice(0, -1))
    }
  }

  // Secret sharing demonstration
  const generateSecretShares = () => {
    const secret = 42 // The secret we want to share
    const polynomial = [secret] // Constant term is the secret

    // Generate random coefficients for polynomial of degree (threshold - 1)
    for (let i = 1; i < threshold; i++) {
      polynomial.push(Math.floor(Math.random() * 100))
    }

    // Generate shares by evaluating polynomial at different points
    const shares = []
    for (let x = 1; x <= threshold + 2; x++) {
      // Generate more shares than threshold
      let y = 0
      for (let i = 0; i < polynomial.length; i++) {
        y += polynomial[i] * Math.pow(x, i)
      }
      shares.push({ x, y })
    }

    setSecretShares(shares)
  }

  const reconstructSecret = () => {
    // Use first 'threshold' number of shares to reconstruct
    const selectedShares = secretShares.slice(0, threshold)
    const secret = lagrangeInterpolation(selectedShares, 0) // Evaluate at x=0 to get constant term
    setReconstructedSecret(Math.round(secret))
  }

  const getLagrangeBasis = (pts: { x: number; y: number }[], i: number, x: number) => {
    let numerator = ""
    let denominator = ""

    for (let j = 0; j < pts.length; j++) {
      if (i !== j) {
        numerator += `(${x} - ${pts[j].x})`
        denominator += `(${pts[i].x} - ${pts[j].x})`
      }
    }

    return `${numerator} / ${denominator}`
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lagrange Interpolation</h3>
        <p className="text-sm text-gray-600">
          Given n points, find the unique polynomial of degree ≤ n-1 that passes through all points.
        </p>

        <Tabs defaultValue="interpolation" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="interpolation">Basic Interpolation</TabsTrigger>
            <TabsTrigger value="secret-sharing">Secret Sharing</TabsTrigger>
          </TabsList>

          <TabsContent value="interpolation" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data Points</Label>
                <div className="space-y-2">
                  {points.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm w-8">({index + 1})</span>
                      <span className="text-sm">x:</span>
                      <Input
                        type="number"
                        value={point.x}
                        onChange={(e) => updatePoint(index, "x", e.target.value)}
                        className="w-20"
                      />
                      <span className="text-sm">y:</span>
                      <Input
                        type="number"
                        value={point.y}
                        onChange={(e) => updatePoint(index, "y", e.target.value)}
                        className="w-20"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button onClick={addPoint} size="sm" variant="outline">
                      Add Point
                    </Button>
                    <Button onClick={removePoint} size="sm" variant="outline" disabled={points.length <= 2}>
                      Remove Point
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="interp-x">Interpolation Point (x)</Label>
                    <Input
                      id="interp-x"
                      type="number"
                      value={interpolationX}
                      onChange={(e) => setInterpolationX(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Interpolated Value</Label>
                    <Input
                      value={`P(${interpolationX}) = ${interpolatedY}`}
                      readOnly
                      className="bg-blue-50 font-mono"
                    />
                  </div>

                  <Button onClick={() => setShowCalculation(!showCalculation)} variant="outline" className="w-full">
                    {showCalculation ? "Hide" : "Show"} Calculation Steps
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-semibold mb-2">Lagrange Formula</h4>
                    <div className="text-sm font-mono">P(x) = Σ y_i × L_i(x)</div>
                    <div className="text-xs mt-1">where L_i(x) = Π (x - x_j) / (x_i - x_j) for j ≠ i</div>
                  </div>

                  {showCalculation && (
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      <h4 className="font-semibold mb-2">Calculation for x = {interpolationX}</h4>
                      {points.map((point, i) => (
                        <div key={i} className="mb-2">
                          <div>
                            L_{i}({interpolationX}) = {getLagrangeBasis(points, i, interpolationX)}
                          </div>
                          <div className="text-xs text-gray-600 ml-4">
                            Term {i + 1}: {point.y} × L_{i}({interpolationX})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="secret-sharing" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Shamir's Secret Sharing</h4>
              <p className="text-sm text-gray-600">Use Lagrange interpolation to implement threshold secret sharing.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Threshold (minimum shares needed)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      min={2}
                      max={10}
                    />
                  </div>

                  <Button onClick={generateSecretShares} className="w-full">
                    Generate Secret Shares (Secret = 42)
                  </Button>

                  {secretShares.length > 0 && (
                    <div className="space-y-2">
                      <Label>Generated Shares</Label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {secretShares.map((share, index) => (
                          <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                            Share {index + 1}: ({share.x}, {share.y})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {secretShares.length > 0 && (
                    <>
                      <div className="bg-blue-50 p-3 rounded-md">
                        <div className="text-sm">
                          <strong>Threshold:</strong> {threshold} shares needed
                        </div>
                        <div className="text-sm">
                          <strong>Available:</strong> {secretShares.length} shares
                        </div>
                      </div>

                      <Button onClick={reconstructSecret} className="w-full">
                        Reconstruct Secret (using first {threshold} shares)
                      </Button>

                      {reconstructedSecret !== null && (
                        <div
                          className={`p-3 rounded-md ${
                            reconstructedSecret === 42
                              ? "bg-green-50 border border-green-200"
                              : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <div className="font-semibold">Reconstructed Secret: {reconstructedSecret}</div>
                          {reconstructedSecret === 42 ? (
                            <div className="text-green-700 text-sm">✓ Secret successfully reconstructed!</div>
                          ) : (
                            <div className="text-red-700 text-sm">✗ Reconstruction failed</div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <h5 className="font-semibold mb-1">How it works:</h5>
                    <div className="space-y-1">
                      <div>1. Secret is the constant term of a random polynomial</div>
                      <div>2. Shares are evaluations of this polynomial</div>
                      <div>3. Any {threshold} shares can reconstruct the polynomial</div>
                      <div>4. Evaluate reconstructed polynomial at x=0 to get secret</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Alert>
        <ShieldIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Applications:</strong> Lagrange interpolation is fundamental to many cryptographic protocols including
          secret sharing, polynomial commitments, and zero-knowledge proofs like zk-SNARKs.
        </AlertDescription>
      </Alert>
    </div>
  )
}
