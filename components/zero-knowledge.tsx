"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon, ShieldIcon, EyeIcon, BrainIcon } from "lucide-react"

export default function ZeroKnowledge() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Zero-Knowledge Fundamentals</CardTitle>
          <CardDescription className="text-base">
            Explore the foundations of zero-knowledge proofs: proving knowledge without revealing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sigma" className="w-full">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-8 h-auto">
              <TabsTrigger value="sigma" className="text-sm py-3">
                Sigma Protocols
              </TabsTrigger>
              <TabsTrigger value="polynomial" className="text-sm py-3">
                Polynomial Proofs
              </TabsTrigger>
              <TabsTrigger value="interpolation" className="text-sm py-3">
                Lagrange Interpolation
              </TabsTrigger>
              <TabsTrigger value="fiat-shamir" className="text-sm py-3">
                Fiat-Shamir
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sigma" className="space-y-6">
              <SigmaProtocolDemo />
            </TabsContent>

            <TabsContent value="polynomial" className="space-y-6">
              <PolynomialProofDemo />
            </TabsContent>

            <TabsContent value="interpolation" className="space-y-6">
              <LagrangeInterpolationDemo />
            </TabsContent>

            <TabsContent value="fiat-shamir" className="space-y-6">
              <FiatShamirDemo />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
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

  const updatePublicValue = () => {
    const h = modPow(generator, secret, modulus)
    setPublicValue(h)
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
    updatePublicValue()
  }

  // Update public value when parameters change
  React.useEffect(() => {
    updatePublicValue()
  }, [secret, generator, modulus])

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Sigma Protocol: Proof of Knowledge of Discrete Logarithm</h3>
          <p className="text-gray-600">Prove you know the secret x such that h = g^x mod p, without revealing x.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sigma-generator" className="text-sm font-medium">
              Generator (g)
            </Label>
            <Input
              id="sigma-generator"
              type="number"
              value={generator}
              onChange={(e) => setGenerator(Number(e.target.value))}
              min={2}
              max={modulus - 1}
              className="text-center"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigma-modulus" className="text-sm font-medium">
              Modulus (p)
            </Label>
            <Input
              id="sigma-modulus"
              type="number"
              value={modulus}
              onChange={(e) => setModulus(Number(e.target.value))}
              min={5}
              max={100}
              className="text-center"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sigma-secret" className="text-sm font-medium">
              Secret (x)
            </Label>
            <Input
              id="sigma-secret"
              type="number"
              value={secret}
              onChange={(e) => setSecret(Number(e.target.value))}
              min={1}
              max={modulus - 1}
              className="text-center"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm space-y-1">
            <div>
              <strong>Public Information:</strong> g = {generator}, p = {modulus}, h = g^x mod p = {publicValue}
            </div>
            <div>
              <strong>Secret:</strong> x = {secret} (only the prover knows this)
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Badge key={i} variant={step >= i ? "default" : "outline"} className="px-3 py-1">
                {i === 0 ? "Setup" : i === 1 ? "Commit" : i === 2 ? "Challenge" : i === 3 ? "Response" : "Verify"}
              </Badge>
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Ready to start the sigma protocol. Click to generate the first commitment.</p>
            <Button onClick={generateCommitment} size="lg" className="px-8">
              Start Protocol: Generate Commitment
            </Button>
          </div>
        )}

        {step >= 1 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Step 1: Commitment</h4>
              <div className="text-sm space-y-2">
                <div>Prover chooses random r = {randomness}</div>
                <div>
                  Prover computes a = g^r mod p = {generator}^{randomness} mod {modulus} = {commitment}
                </div>
                <div>Prover sends commitment a = {commitment} to verifier</div>
              </div>
            </div>

            {step === 1 && (
              <div className="text-center">
                <Button onClick={generateChallenge} size="lg">
                  Next: Verifier Sends Challenge
                </Button>
              </div>
            )}
          </div>
        )}

        {step >= 2 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Step 2: Challenge</h4>
              <div className="text-sm space-y-2">
                <div>Verifier chooses random challenge c = {challenge}</div>
                <div>Verifier sends challenge c = {challenge} to prover</div>
              </div>
            </div>

            {step === 2 && (
              <div className="text-center">
                <Button onClick={generateResponse} size="lg">
                  Next: Prover Computes Response
                </Button>
              </div>
            )}
          </div>
        )}

        {step >= 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Step 3: Response</h4>
              <div className="text-sm space-y-2">
                <div>Prover computes z = r + c×x mod (p-1)</div>
                <div>
                  z = {randomness} + {challenge}×{secret} mod {modulus - 1} = {response}
                </div>
                <div>Prover sends response z = {response} to verifier</div>
              </div>
            </div>

            {step === 3 && (
              <div className="text-center">
                <Button onClick={verifyProof} size="lg">
                  Next: Verify Proof
                </Button>
              </div>
            )}
          </div>
        )}

        {step >= 4 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Step 4: Verification</h4>
              <div className="text-sm space-y-2">
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
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  verificationResult ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                {verificationResult ? (
                  <>
                    <CheckIcon className="h-6 w-6 text-green-500" />
                    <span className="text-green-700 font-medium text-lg">Proof Verified! Prover knows the secret.</span>
                  </>
                ) : (
                  <>
                    <XIcon className="h-6 w-6 text-red-500" />
                    <span className="text-red-700 font-medium text-lg">Proof Failed! Invalid proof.</span>
                  </>
                )}
              </div>
            )}

            <div className="text-center">
              <Button onClick={resetProtocol} variant="outline" size="lg">
                Reset Protocol
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Alert className="border-blue-200 bg-blue-50">
          <EyeIcon className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Zero-Knowledge:</strong> The verifier learns nothing about the secret x beyond the fact that the
            prover knows it.
          </AlertDescription>
        </Alert>

        <Alert className="border-orange-200 bg-orange-50">
          <ShieldIcon className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Soundness:</strong> A prover without knowledge of x can only succeed with negligible probability.
          </AlertDescription>
        </Alert>

        <Alert className="border-green-200 bg-green-50">
          <CheckIcon className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Completeness:</strong> An honest prover who knows x will always convince an honest verifier.
          </AlertDescription>
        </Alert>
      </div>
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

  const evaluatePolynomial = (coeffs: number[], x: number) => {
    return coeffs.reduce((sum, coeff, index) => {
      return sum + coeff * Math.pow(x, coeffs.length - 1 - index)
    }, 0)
  }

  React.useEffect(() => {
    // Evaluate polynomial at the given point
    const value = evaluatePolynomial(polynomial, evaluationPoint)
    setActualValue(value)
    setClaimedValue(value)
  }, [polynomial, evaluationPoint])

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
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Polynomial Proofs & Reed-Solomon Fingerprinting</h3>
          <p className="text-gray-600">
            Demonstrate how polynomials can be used for efficient verification and fingerprinting.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Polynomial Coefficients (highest degree first)</Label>
            <div className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 rounded-lg border">
              {polynomial.map((coeff, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={coeff}
                    onChange={(e) => updateCoefficient(index, e.target.value)}
                    className="w-16 text-center"
                  />
                  <span className="text-sm font-medium">
                    {polynomial.length - 1 - index === 0
                      ? ""
                      : polynomial.length - 1 - index === 1
                        ? "x"
                        : `x^${polynomial.length - 1 - index}`}
                  </span>
                  {index < polynomial.length - 1 && <span className="text-lg">+</span>}
                </div>
              ))}
              <div className="flex gap-2 ml-4">
                <Button onClick={addTerm} size="sm" variant="outline">
                  +
                </Button>
                <Button onClick={removeTerm} size="sm" variant="outline" disabled={polynomial.length <= 1}>
                  -
                </Button>
              </div>
            </div>
            <div className="text-gray-600 font-mono">Polynomial: P(x) = {formatPolynomial(polynomial)}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Polynomial Evaluation</h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eval-point" className="text-sm font-medium">
                    Evaluation Point (x)
                  </Label>
                  <Input
                    id="eval-point"
                    type="number"
                    value={evaluationPoint}
                    onChange={(e) => setEvaluationPoint(Number(e.target.value))}
                    className="text-center"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Actual Value</Label>
                  <Input
                    value={`P(${evaluationPoint}) = ${actualValue}`}
                    readOnly
                    className="bg-green-50 text-center font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimed-value" className="text-sm font-medium">
                    Claimed Value (for testing)
                  </Label>
                  <Input
                    id="claimed-value"
                    type="number"
                    value={claimedValue}
                    onChange={(e) => setClaimedValue(Number(e.target.value))}
                    className="text-center"
                  />
                </div>

                <div
                  className={`p-4 rounded-lg border ${
                    claimedValue === actualValue ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  {claimedValue === actualValue ? (
                    <span className="text-green-700 font-medium">✓ Claimed value matches actual evaluation</span>
                  ) : (
                    <span className="text-red-700 font-medium">✗ Claimed value is incorrect</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Reed-Solomon Fingerprinting</h4>
              <p className="text-sm text-gray-600">
                Generate a compact fingerprint by evaluating the polynomial at a random point.
              </p>

              <Button onClick={generateFingerprint} size="lg" className="w-full">
                Generate Random Fingerprint
              </Button>

              {fingerprint && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fingerprint</Label>
                    <Input value={fingerprint} readOnly className="font-mono bg-blue-50 text-center" />
                  </div>
                  <p className="text-sm text-gray-600">
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
          <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
            <h4 className="text-lg font-semibold">Reed-Solomon Fingerprinting Explained</h4>
            <div className="space-y-3">
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
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <strong>Example:</strong> For degree-{polynomial.length - 1} polynomial over field size 100, error
                probability ≤ {polynomial.length - 1}/100 = {(((polynomial.length - 1) / 100) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>

      <Alert className="border-purple-200 bg-purple-50">
        <BrainIcon className="h-5 w-5 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <strong>Applications:</strong> Reed-Solomon fingerprinting is used in error-correcting codes, probabilistic
          checksum verification, and as a building block in many zero-knowledge proof systems like zk-SNARKs.
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

  React.useEffect(() => {
    const y = lagrangeInterpolation(points, interpolationX)
    setInterpolatedY(y)
  }, [points, interpolationX])

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
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Lagrange Interpolation</h3>
          <p className="text-gray-600">
            Given n points, find the unique polynomial of degree ≤ n-1 that passes through all points.
          </p>
        </div>

        <Tabs defaultValue="interpolation" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="interpolation">Basic Interpolation</TabsTrigger>
            <TabsTrigger value="secret-sharing">Secret Sharing</TabsTrigger>
          </TabsList>

          <TabsContent value="interpolation" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Data Points</Label>
                <div className="space-y-3">
                  {points.map((point, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium w-8">({index + 1})</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">x:</span>
                        <Input
                          type="number"
                          value={point.x}
                          onChange={(e) => updatePoint(index, "x", e.target.value)}
                          className="w-20 text-center"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">y:</span>
                        <Input
                          type="number"
                          value={point.y}
                          onChange={(e) => updatePoint(index, "y", e.target.value)}
                          className="w-20 text-center"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <Button onClick={addPoint} size="sm" variant="outline">
                      Add Point
                    </Button>
                    <Button onClick={removePoint} size="sm" variant="outline" disabled={points.length <= 2}>
                      Remove Point
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="interp-x" className="text-sm font-medium">
                        Interpolation Point (x)
                      </Label>
                      <Input
                        id="interp-x"
                        type="number"
                        value={interpolationX}
                        onChange={(e) => setInterpolationX(Number(e.target.value))}
                        className="text-center"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Interpolated Value</Label>
                      <Input
                        value={`P(${interpolationX}) = ${interpolatedY}`}
                        readOnly
                        className="bg-blue-50 font-mono text-center"
                      />
                    </div>

                    <Button onClick={() => setShowCalculation(!showCalculation)} variant="outline" className="w-full">
                      {showCalculation ? "Hide" : "Show"} Calculation Steps
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3">Lagrange Formula</h4>
                    <div className="font-mono text-sm">P(x) = Σ y_i × L_i(x)</div>
                    <div className="text-xs mt-2 text-gray-600">where L_i(x) = Π (x - x_j) / (x_i - x_j) for j ≠ i</div>
                  </div>

                  {showCalculation && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3">Calculation for x = {interpolationX}</h4>
                      <div className="space-y-2 text-sm">
                        {points.map((point, i) => (
                          <div key={i} className="space-y-1">
                            <div className="font-mono">
                              L_{i}({interpolationX}) = {getLagrangeBasis(points, i, interpolationX)}
                            </div>
                            <div className="text-xs text-gray-600 ml-4">
                              Term {i + 1}: {point.y} × L_{i}({interpolationX})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="secret-sharing" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Shamir's Secret Sharing</h4>
                <p className="text-gray-600">Use Lagrange interpolation to implement threshold secret sharing.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="threshold" className="text-sm font-medium">
                        Threshold (minimum shares needed)
                      </Label>
                      <Input
                        id="threshold"
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        min={2}
                        max={10}
                        className="text-center"
                      />
                    </div>

                    <Button onClick={generateSecretShares} size="lg" className="w-full">
                      Generate Secret Shares (Secret = 42)
                    </Button>

                    {secretShares.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Generated Shares</Label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {secretShares.map((share, index) => (
                            <div key={index} className="text-sm font-mono bg-gray-50 p-3 rounded border">
                              Share {index + 1}: ({share.x}, {share.y})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {secretShares.length > 0 && (
                    <>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Threshold:</strong> {threshold} shares needed
                          </div>
                          <div>
                            <strong>Available:</strong> {secretShares.length} shares
                          </div>
                        </div>
                      </div>

                      <Button onClick={reconstructSecret} size="lg" className="w-full">
                        Reconstruct Secret (using first {threshold} shares)
                      </Button>

                      {reconstructedSecret !== null && (
                        <div
                          className={`p-4 rounded-lg border ${
                            reconstructedSecret === 42 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="font-semibold text-lg">Reconstructed Secret: {reconstructedSecret}</div>
                          {reconstructedSecret === 42 ? (
                            <div className="text-green-700 text-sm mt-1">✓ Secret successfully reconstructed!</div>
                          ) : (
                            <div className="text-red-700 text-sm mt-1">✗ Reconstruction failed</div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h5 className="font-semibold mb-3">How it works:</h5>
                    <div className="space-y-2 text-sm">
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

      <Alert className="border-purple-200 bg-purple-50">
        <BrainIcon className="h-5 w-5 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <strong>Applications:</strong> Lagrange interpolation is fundamental to many cryptographic protocols including
          secret sharing, polynomial commitments, and zero-knowledge proofs like zk-SNARKs.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function FiatShamirDemo() {
  const [secret, setSecret] = useState(7)
  const [generator, setGenerator] = useState(3)
  const [modulus, setModulus] = useState(23)
  const [publicValue, setPublicValue] = useState(0)
  const [randomness, setRandomness] = useState(0)
  const [commitment, setCommitment] = useState(0)
  const [challenge, setChallenge] = useState(0)
  const [response, setResponse] = useState(0)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [hashInput, setHashInput] = useState("")
  const [steps, setSteps] = useState<string[]>([])
  const [isInteractive, setIsInteractive] = useState(true)

  // Modular exponentiation
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

  // Simple hash function for demonstration purposes
  const simpleHash = (input: string) => {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash + input.charCodeAt(i)) % modulus
      if (hash < 0) hash += modulus
    }
    return (Math.abs(hash) % (modulus - 1)) + 1 // Ensure non-zero
  }

  // Update public value when parameters change
  React.useEffect(() => {
    const h = modPow(generator, secret, modulus)
    setPublicValue(h)
  }, [secret, generator, modulus])

  const resetDemo = () => {
    setRandomness(0)
    setCommitment(0)
    setChallenge(0)
    setResponse(0)
    setVerificationResult(null)
    setHashInput("")
    setSteps([])
  }

  const runInteractiveProof = () => {
    resetDemo()
    setIsInteractive(true)

    // Step 1: Prover chooses random r and computes commitment a = g^r mod p
    const r = Math.floor(Math.random() * (modulus - 1)) + 1
    const a = modPow(generator, r, modulus)
    setRandomness(r)
    setCommitment(a)

    // Step 2: Verifier sends random challenge c
    const c = Math.floor(Math.random() * (modulus - 1)) + 1
    setChallenge(c)

    // Step 3: Prover computes response z = r + c*x mod (p-1)
    const z = (r + c * secret) % (modulus - 1)
    setResponse(z)

    // Step 4: Verification
    const leftSide = modPow(generator, z, modulus)
    const rightSide = (a * modPow(publicValue, c, modulus)) % modulus
    setVerificationResult(leftSide === rightSide)

    setSteps([
      `1. Prover chooses random r = ${r}`,
      `2. Prover computes commitment a = g^r mod p = ${a}`,
      `3. Verifier sends challenge c = ${c}`,
      `4. Prover computes response z = r + c*x mod (p-1) = ${z}`,
      `5. Verifier checks g^z = a * h^c mod p: ${leftSide} = ${rightSide}`,
    ])
  }

  const runNonInteractiveProof = () => {
    resetDemo()
    setIsInteractive(false)

    // Step 1: Prover chooses random r and computes commitment a = g^r mod p
    const r = Math.floor(Math.random() * (modulus - 1)) + 1
    const a = modPow(generator, r, modulus)
    setRandomness(r)
    setCommitment(a)

    // Step 2: Compute challenge using hash function (Fiat-Shamir transform)
    const input = `g=${generator},h=${publicValue},a=${a},p=${modulus}`
    setHashInput(input)
    const c = simpleHash(input)
    setChallenge(c)

    // Step 3: Prover computes response z = r + c*x mod (p-1)
    const z = (r + c * secret) % (modulus - 1)
    setResponse(z)

    // Step 4: Verification
    const leftSide = modPow(generator, z, modulus)
    const rightSide = (a * modPow(publicValue, c, modulus)) % modulus
    setVerificationResult(leftSide === rightSide)

    setSteps([
      `1. Prover chooses random r = ${r}`,
      `2. Prover computes commitment a = g^r mod p = ${a}`,
      `3. Prover computes challenge c = Hash(g,h,a,p) = ${c}`,
      `4. Prover computes response z = r + c*x mod (p-1) = ${z}`,
      `5. Verifier checks g^z = a * h^c mod p: ${leftSide} = ${rightSide}`,
    ])
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Fiat-Shamir Heuristic</h3>
          <p className="text-gray-600">
            Transform interactive zero-knowledge proofs into non-interactive ones by replacing the verifier's random
            challenge with a hash function.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fs-generator" className="text-sm font-medium">
              Generator (g)
            </Label>
            <Input
              id="fs-generator"
              type="number"
              value={generator}
              onChange={(e) => setGenerator(Number(e.target.value))}
              min={2}
              max={modulus - 1}
              className="text-center"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fs-modulus" className="text-sm font-medium">
              Modulus (p)
            </Label>
            <Input
              id="fs-modulus"
              type="number"
              value={modulus}
              onChange={(e) => setModulus(Number(e.target.value))}
              min={5}
              max={100}
              className="text-center"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fs-secret" className="text-sm font-medium">
              Secret (x)
            </Label>
            <Input
              id="fs-secret"
              type="number"
              value={secret}
              onChange={(e) => setSecret(Number(e.target.value))}
              min={1}
              max={modulus - 1}
              className="text-center"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="space-y-1 text-sm">
            <div>
              <strong>Public Information:</strong> g = {generator}, p = {modulus}, h = g^x mod p = {publicValue}
            </div>
            <div>
              <strong>Secret:</strong> x = {secret} (only the prover knows this)
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button
            onClick={runInteractiveProof}
            size="lg"
            className="flex-1"
            variant={isInteractive ? "default" : "outline"}
          >
            Run Interactive Proof
          </Button>
          <Button
            onClick={runNonInteractiveProof}
            size="lg"
            className="flex-1"
            variant={!isInteractive ? "default" : "outline"}
          >
            Run Non-Interactive Proof (Fiat-Shamir)
          </Button>
        </div>

        {steps.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4 text-lg">
              {isInteractive ? "Interactive" : "Non-Interactive"} Proof Steps
            </h4>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3 text-sm">
                  <div className="text-gray-500 font-medium min-w-[20px]">{index + 1}.</div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hashInput && (
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4 text-lg">Fiat-Shamir Transform</h4>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Hash Input:</strong> <span className="font-mono bg-white px-2 py-1 rounded">{hashInput}</span>
              </div>
              <div>
                <strong>Challenge = Hash(Input):</strong>{" "}
                <span className="font-mono bg-white px-2 py-1 rounded">{challenge}</span>
              </div>
              <div className="text-xs text-gray-600 mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                <strong>Note:</strong> For demonstration, we're using a simple hash function. In practice, cryptographic
                hash functions like SHA-256 would be used.
              </div>
            </div>
          </div>
        )}

        {verificationResult !== null && (
          <div
            className={`p-6 rounded-lg flex items-center gap-4 border ${
              verificationResult ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            {verificationResult ? (
              <>
                <CheckIcon className="h-8 w-8 text-green-500" />
                <span className="text-green-700 font-medium text-lg">Proof Verified! Prover knows the secret.</span>
              </>
            ) : (
              <>
                <XIcon className="h-8 w-8 text-red-500" />
                <span className="text-red-700 font-medium text-lg">Proof Failed! Invalid proof.</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Alert className="border-orange-200 bg-orange-50">
          <ShieldIcon className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Security:</strong> The Fiat-Shamir heuristic is secure in the random oracle model, but care must be
            taken with the hash function implementation.
          </AlertDescription>
        </Alert>

        <Alert className="border-purple-200 bg-purple-50">
          <BrainIcon className="h-5 w-5 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Applications:</strong> Used in digital signatures, identification protocols, and blockchain
            zero-knowledge proofs to eliminate interaction.
          </AlertDescription>
        </Alert>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border">
        <h4 className="font-semibold mb-4 text-lg">How Fiat-Shamir Works</h4>
        <div className="space-y-4 text-sm">
          <p>
            The Fiat-Shamir heuristic transforms an interactive proof into a non-interactive one by replacing the
            verifier's random challenge with the output of a hash function.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="font-semibold">Interactive Protocol:</div>
              <div className="ml-4 space-y-1">
                <div>1. Prover sends commitment</div>
                <div>2. Verifier sends random challenge</div>
                <div>3. Prover sends response</div>
                <div>4. Verifier checks the proof</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Non-Interactive Protocol:</div>
              <div className="ml-4 space-y-1">
                <div>1. Prover sends commitment</div>
                <div>2. Prover computes challenge = Hash(public inputs, commitment)</div>
                <div>3. Prover sends response</div>
                <div>4. Verifier recomputes challenge and checks the proof</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
