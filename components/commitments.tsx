"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon, EyeIcon, LockIcon, UnlockIcon, Dice1Icon as DiceIcon } from "lucide-react"

export default function Commitments() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Commitment Schemes</CardTitle>
          <CardDescription>
            Cryptographic protocols that allow you to commit to a value while keeping it secret, then reveal it later
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Commitments</TabsTrigger>
              <TabsTrigger value="pedersen">Pedersen Commitments</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicCommitmentDemo />
            </TabsContent>

            <TabsContent value="pedersen">
              <PedersenCommitmentDemo />
            </TabsContent>

            <TabsContent value="applications">
              <CommitmentApplications />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function BasicCommitmentDemo() {
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
                    <DiceIcon className="h-4 w-4 mr-1" />
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

              <div className="bg-yellow-50 p-3 rounded-md text-sm">
                <strong>Why use a nonce?</strong> Without randomness, identical secrets would produce identical
                commitments, potentially revealing information through pattern analysis.
              </div>
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
          <LockIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Binding Property:</strong> Once you create a commitment, you cannot change the secret value you
            committed to without detection.
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

function PedersenCommitmentDemo() {
  const [secret, setSecret] = useState(7)
  const [randomness, setRandomness] = useState(13)
  const [generator1] = useState(3) // g
  const [generator2] = useState(5) // h
  const [modulus] = useState(23)
  const [commitment, setCommitment] = useState(0)
  const [commitment2Secret, setCommitment2Secret] = useState(11)
  const [commitment2Randomness, setCommitment2Randomness] = useState(17)
  const [commitment2, setCommitment2] = useState(0)
  const [sumCommitment, setSumCommitment] = useState(0)

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

  // Pedersen commitment: C = g^m * h^r mod p
  const computePedersenCommitment = (message: number, rand: number) => {
    const gm = modPow(generator1, message, modulus)
    const hr = modPow(generator2, rand, modulus)
    return (gm * hr) % modulus
  }

  const generateRandomness = () => {
    setRandomness(Math.floor(Math.random() * (modulus - 1)) + 1)
  }

  const generateRandomness2 = () => {
    setCommitment2Randomness(Math.floor(Math.random() * (modulus - 1)) + 1)
  }

  const computeCommitments = () => {
    const c1 = computePedersenCommitment(secret, randomness)
    const c2 = computePedersenCommitment(commitment2Secret, commitment2Randomness)

    setCommitment(c1)
    setCommitment2(c2)

    // Demonstrate homomorphic property: C1 * C2 = g^(m1+m2) * h^(r1+r2)
    const sum = (c1 * c2) % modulus
    setSumCommitment(sum)
  }

  const expectedSum = computePedersenCommitment(secret + commitment2Secret, randomness + commitment2Randomness)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pedersen Commitments</h3>
        <p className="text-sm text-gray-600">
          Algebraic commitments with homomorphic properties, allowing operations on committed values.
        </p>

        <div className="bg-blue-50 p-3 rounded-md text-sm">
          <strong>Formula:</strong> C = g^m × h^r mod p
          <br />
          <strong>Parameters:</strong> g = {generator1}, h = {generator2}, p = {modulus}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">First Commitment</h4>

            <div className="space-y-2">
              <Label htmlFor="pedersen-secret">Secret Message (m₁)</Label>
              <Input
                id="pedersen-secret"
                type="number"
                value={secret}
                onChange={(e) => setSecret(Number(e.target.value))}
                min={0}
                max={modulus - 1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="pedersen-randomness">Randomness (r₁)</Label>
                <Button onClick={generateRandomness} size="sm" variant="outline">
                  <DiceIcon className="h-4 w-4 mr-1" />
                  Random
                </Button>
              </div>
              <Input
                id="pedersen-randomness"
                type="number"
                value={randomness}
                onChange={(e) => setRandomness(Number(e.target.value))}
                min={1}
                max={modulus - 1}
              />
            </div>

            <div className="space-y-2">
              <Label>Commitment C₁</Label>
              <Input value={commitment || "Click 'Compute' to generate"} readOnly className="bg-green-50 font-mono" />
              <div className="text-xs text-gray-600">
                C₁ = {generator1}^{secret} × {generator2}^{randomness} mod {modulus}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Second Commitment</h4>

            <div className="space-y-2">
              <Label htmlFor="pedersen-secret2">Secret Message (m₂)</Label>
              <Input
                id="pedersen-secret2"
                type="number"
                value={commitment2Secret}
                onChange={(e) => setCommitment2Secret(Number(e.target.value))}
                min={0}
                max={modulus - 1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="pedersen-randomness2">Randomness (r₂)</Label>
                <Button onClick={generateRandomness2} size="sm" variant="outline">
                  <DiceIcon className="h-4 w-4 mr-1" />
                  Random
                </Button>
              </div>
              <Input
                id="pedersen-randomness2"
                type="number"
                value={commitment2Randomness}
                onChange={(e) => setCommitment2Randomness(Number(e.target.value))}
                min={1}
                max={modulus - 1}
              />
            </div>

            <div className="space-y-2">
              <Label>Commitment C₂</Label>
              <Input value={commitment2 || "Click 'Compute' to generate"} readOnly className="bg-green-50 font-mono" />
              <div className="text-xs text-gray-600">
                C₂ = {generator1}^{commitment2Secret} × {generator2}^{commitment2Randomness} mod {modulus}
              </div>
            </div>
          </div>
        </div>

        <Button onClick={computeCommitments} className="w-full">
          Compute Commitments
        </Button>

        {commitment && commitment2 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Homomorphic Property</h4>
            <div className="bg-purple-50 p-4 rounded-md space-y-2">
              <div className="text-sm">
                <strong>Product of Commitments:</strong> C₁ × C₂ = {commitment} × {commitment2} = {sumCommitment} mod{" "}
                {modulus}
              </div>
              <div className="text-sm">
                <strong>Commitment to Sum:</strong> g^(m₁+m₂) × h^(r₁+r₂) = {generator1}^{secret + commitment2Secret} ×{" "}
                {generator2}^{randomness + commitment2Randomness} = {expectedSum} mod {modulus}
              </div>
              <div
                className={`text-sm font-semibold ${sumCommitment === expectedSum ? "text-green-700" : "text-red-700"}`}
              >
                {sumCommitment === expectedSum ? "✓ Homomorphic property verified!" : "✗ Calculation error"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <LockIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Computational Binding:</strong> Breaking the binding property requires solving the discrete
            logarithm problem.
          </AlertDescription>
        </Alert>

        <Alert>
          <EyeIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Perfect Hiding:</strong> Given only the commitment, all possible messages are equally likely.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

function CommitmentApplications() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Commitment Scheme Applications</h3>

      <div className="grid gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Auction Systems</h4>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm mb-3">
              <strong>Sealed-bid auctions:</strong> Bidders commit to their bids without revealing them, then
              simultaneously reveal all bids.
            </p>
            <div className="text-xs space-y-1">
              <div>
                <strong>1. Commit Phase:</strong> Each bidder submits commit(bid, nonce)
              </div>
              <div>
                <strong>2. Reveal Phase:</strong> All bidders reveal their bids and nonces
              </div>
              <div>
                <strong>3. Verification:</strong> Verify all commitments match revealed values
              </div>
              <div>
                <strong>4. Winner Selection:</strong> Highest valid bid wins
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Coin Flipping Protocol</h4>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm mb-3">
              <strong>Fair coin flipping over the internet:</strong> Two parties can fairly generate a random bit
              without trusting each other.
            </p>
            <div className="text-xs space-y-1">
              <div>
                <strong>1. Alice commits:</strong> commit(bit_A, nonce_A)
              </div>
              <div>
                <strong>2. Bob reveals:</strong> bit_B
              </div>
              <div>
                <strong>3. Alice reveals:</strong> bit_A, nonce_A
              </div>
              <div>
                <strong>4. Result:</strong> bit_A ⊕ bit_B
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Zero-Knowledge Proofs</h4>
          <div className="bg-purple-50 p-4 rounded-md">
            <p className="text-sm mb-3">
              <strong>Building block for ZK protocols:</strong> Commitments are fundamental to many zero-knowledge proof
              systems.
            </p>
            <div className="text-xs space-y-1">
              <div>
                <strong>Sigma Protocols:</strong> First message is often a commitment
              </div>
              <div>
                <strong>zk-SNARKs:</strong> Polynomial commitments enable succinct proofs
              </div>
              <div>
                <strong>Bulletproofs:</strong> Vector commitments for range proofs
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Blockchain Applications</h4>
          <div className="bg-orange-50 p-4 rounded-md">
            <p className="text-sm mb-3">
              <strong>Privacy and scalability:</strong> Commitments enable private transactions and efficient
              verification.
            </p>
            <div className="text-xs space-y-1">
              <div>
                <strong>Confidential Transactions:</strong> Hide transaction amounts
              </div>
              <div>
                <strong>Commit-Reveal Schemes:</strong> Fair randomness generation
              </div>
              <div>
                <strong>State Commitments:</strong> Merkle trees and polynomial commitments
              </div>
              <div>
                <strong>Privacy Coins:</strong> Pedersen commitments in Monero
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Voting Systems</h4>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm mb-3">
              <strong>Private and verifiable voting:</strong> Voters can commit to their choices while maintaining
              privacy and enabling verification.
            </p>
            <div className="text-xs space-y-1">
              <div>
                <strong>Commit Phase:</strong> Voters submit encrypted/committed votes
              </div>
              <div>
                <strong>Tally Phase:</strong> Homomorphic properties enable private counting
              </div>
              <div>
                <strong>Verification:</strong> Zero-knowledge proofs of valid votes
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert>
        <LockIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Key Insight:</strong> Commitments solve the fundamental problem of "putting something in a sealed
          envelope" in the digital world, enabling fair protocols between mutually distrusting parties.
        </AlertDescription>
      </Alert>
    </div>
  )
}
