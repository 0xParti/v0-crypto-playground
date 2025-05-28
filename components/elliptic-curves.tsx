"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon, KeyIcon, Calculator, PenIcon, ShieldCheckIcon } from "lucide-react"

export default function EllipticCurves() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Elliptic Curve Cryptography</CardTitle>
          <CardDescription>
            Explore the mathematics and applications of elliptic curves in modern cryptography
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basics">EC Basics</TabsTrigger>
              <TabsTrigger value="operations">Point Operations</TabsTrigger>
              <TabsTrigger value="ecdh">ECDH</TabsTrigger>
              <TabsTrigger value="ecdsa">ECDSA</TabsTrigger>
            </TabsList>

            <TabsContent value="basics">
              <ECBasics />
            </TabsContent>

            <TabsContent value="operations">
              <PointOperations />
            </TabsContent>

            <TabsContent value="ecdh">
              <ECDHDemo />
            </TabsContent>

            <TabsContent value="ecdsa">
              <ECDSADemo />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ECBasics() {
  const [a, setA] = useState(-1)
  const [b, setB] = useState(1)
  const [p, setP] = useState(23)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [discriminant, setDiscriminant] = useState(0)

  useEffect(() => {
    // Calculate discriminant: -16(4a³ + 27b²)
    const disc = -16 * (4 * Math.pow(a, 3) + 27 * Math.pow(b, 2))
    setDiscriminant(disc)

    // Find all points on the curve
    const curvePoints = []
    for (let x = 0; x < p; x++) {
      const rhs = (Math.pow(x, 3) + a * x + b) % p
      for (let y = 0; y < p; y++) {
        if ((y * y) % p === rhs) {
          curvePoints.push({ x, y })
        }
      }
    }
    setPoints(curvePoints)
  }, [a, b, p])

  const isValidCurve = discriminant !== 0

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Elliptic Curve Equation</h3>
        <p className="text-sm text-gray-600">
          An elliptic curve over a finite field F_p is defined by the equation: y² = x³ + ax + b (mod p)
        </p>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="text-lg font-mono text-center">
            y² ≡ x³ + {a}x + {b} (mod {p})
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="param-a">Parameter a</Label>
            <Input
              id="param-a"
              type="number"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              min={-100}
              max={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="param-b">Parameter b</Label>
            <Input
              id="param-b"
              type="number"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              min={-100}
              max={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prime-p">Prime p</Label>
            <Input
              id="prime-p"
              type="number"
              value={p}
              onChange={(e) => setP(Number(e.target.value))}
              min={5}
              max={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Curve Properties</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Discriminant:</span>
                <span className="font-mono">Δ = {discriminant}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid Curve:</span>
                <Badge variant={isValidCurve ? "outline" : "destructive"}>
                  {isValidCurve ? "Yes (Δ ≠ 0)" : "No (Δ = 0)"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Number of Points:</span>
                <span className="font-mono">{points.length + 1}</span> {/* +1 for point at infinity */}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <strong>Discriminant Formula:</strong>
              <div className="font-mono mt-1">Δ = -16(4a³ + 27b²)</div>
              <div className="mt-2">
                For our curve: Δ = -16(4×{a}³ + 27×{b}²) = {discriminant}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Points on Curve</h4>
            <div className="max-h-48 overflow-y-auto border rounded p-2">
              <div className="text-sm font-mono space-y-1">
                <div className="text-gray-600">O (point at infinity)</div>
                {points.map((point, index) => (
                  <div key={index}>
                    ({point.x}, {point.y})
                  </div>
                ))}
              </div>
            </div>
            {!isValidCurve && (
              <Alert variant="destructive">
                <AlertDescription>
                  Invalid curve: discriminant is zero. This curve has singularities and cannot be used for cryptography.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Why Elliptic Curves?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">Advantages</h4>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• Smaller key sizes for equivalent security</li>
              <li>• Faster computations</li>
              <li>• Lower power consumption</li>
              <li>• Reduced storage requirements</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">Security Comparison</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <div>RSA 1024-bit ≈ ECC 160-bit</div>
              <div>RSA 2048-bit ≈ ECC 224-bit</div>
              <div>RSA 3072-bit ≈ ECC 256-bit</div>
              <div>RSA 15360-bit ≈ ECC 512-bit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PointOperations() {
  const [a] = useState(-1)
  const [b] = useState(1)
  const [p] = useState(23)
  const [point1X, setPoint1X] = useState(3)
  const [point1Y, setPoint1Y] = useState(10)
  const [point2X, setPoint2X] = useState(9)
  const [point2Y, setPoint2Y] = useState(7)
  const [operation, setOperation] = useState<"add" | "double">("add")
  const [result, setResult] = useState<{ x: number; y: number } | null>(null)
  const [steps, setSteps] = useState<string[]>([])

  const modInverse = (a: number, m: number): number => {
    // Extended Euclidean Algorithm
    let [old_r, r] = [a, m]
    let [old_s, s] = [1, 0]

    while (r !== 0) {
      const quotient = Math.floor(old_r / r)
      ;[old_r, r] = [r, old_r - quotient * r]
      ;[old_s, s] = [s, old_s - quotient * s]
    }

    return old_s < 0 ? old_s + m : old_s
  }

  const isOnCurve = (x: number, y: number): boolean => {
    const lhs = (y * y) % p
    const rhs = (Math.pow(x, 3) + a * x + b) % p
    return lhs === rhs
  }

  const pointAdd = (x1: number, y1: number, x2: number, y2: number) => {
    const stepList = []

    if (x1 === x2 && y1 === y2) {
      // Point doubling
      stepList.push("Point doubling: P + P = 2P")
      stepList.push(`λ = (3x₁² + a) / (2y₁) mod p`)

      const numerator = (3 * x1 * x1 + a) % p
      const denominator = (2 * y1) % p
      const lambda = (numerator * modInverse(denominator, p)) % p

      stepList.push(`λ = (3×${x1}² + ${a}) / (2×${y1}) = ${numerator} / ${denominator} = ${lambda} mod ${p}`)

      const x3 = (lambda * lambda - 2 * x1) % p
      const y3 = (lambda * (x1 - x3) - y1) % p

      stepList.push(`x₃ = λ² - 2x₁ = ${lambda}² - 2×${x1} = ${x3} mod ${p}`)
      stepList.push(`y₃ = λ(x₁ - x₃) - y₁ = ${lambda}×(${x1} - ${x3}) - ${y1} = ${y3} mod ${p}`)

      return { x: x3 < 0 ? x3 + p : x3, y: y3 < 0 ? y3 + p : y3, steps: stepList }
    } else {
      // Point addition
      stepList.push("Point addition: P₁ + P₂ = P₃")
      stepList.push(`λ = (y₂ - y₁) / (x₂ - x₁) mod p`)

      const numerator = (y2 - y1) % p
      const denominator = (x2 - x1) % p
      const lambda = (numerator * modInverse(denominator, p)) % p

      stepList.push(`λ = (${y2} - ${y1}) / (${x2} - ${x1}) = ${numerator} / ${denominator} = ${lambda} mod ${p}`)

      const x3 = (lambda * lambda - x1 - x2) % p
      const y3 = (lambda * (x1 - x3) - y1) % p

      stepList.push(`x₃ = λ² - x₁ - x₂ = ${lambda}² - ${x1} - ${x2} = ${x3} mod ${p}`)
      stepList.push(`y₃ = λ(x₁ - x₃) - y₁ = ${lambda}×(${x1} - ${x3}) - ${y1} = ${y3} mod ${p}`)

      return { x: x3 < 0 ? x3 + p : x3, y: y3 < 0 ? y3 + p : y3, steps: stepList }
    }
  }

  const performOperation = () => {
    if (!isOnCurve(point1X, point1Y)) {
      setSteps([`Error: Point (${point1X}, ${point1Y}) is not on the curve`])
      setResult(null)
      return
    }

    if (operation === "add" && !isOnCurve(point2X, point2Y)) {
      setSteps([`Error: Point (${point2X}, ${point2Y}) is not on the curve`])
      setResult(null)
      return
    }

    if (operation === "add") {
      const { x, y, steps } = pointAdd(point1X, point1Y, point2X, point2Y)
      setResult({ x, y })
      setSteps(steps)
    } else {
      const { x, y, steps } = pointAdd(point1X, point1Y, point1X, point1Y)
      setResult({ x, y })
      setSteps(steps)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Elliptic Curve Point Operations</h3>
        <p className="text-sm text-gray-600">
          Explore point addition and point doubling on the elliptic curve y² = x³ - x + 1 (mod 23)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Operation Type</Label>
              <div className="flex space-x-2">
                <Button
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  size="sm"
                >
                  Point Addition
                </Button>
                <Button
                  variant={operation === "double" ? "default" : "outline"}
                  onClick={() => setOperation("double")}
                  size="sm"
                >
                  Point Doubling
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Point P₁</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={point1X}
                  onChange={(e) => setPoint1X(Number(e.target.value))}
                  placeholder="x₁"
                  className="w-20"
                />
                <Input
                  type="number"
                  value={point1Y}
                  onChange={(e) => setPoint1Y(Number(e.target.value))}
                  placeholder="y₁"
                  className="w-20"
                />
              </div>
              <div className="text-xs text-gray-500">On curve: {isOnCurve(point1X, point1Y) ? "✓" : "✗"}</div>
            </div>

            {operation === "add" && (
              <div className="space-y-2">
                <Label>Point P₂</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={point2X}
                    onChange={(e) => setPoint2X(Number(e.target.value))}
                    placeholder="x₂"
                    className="w-20"
                  />
                  <Input
                    type="number"
                    value={point2Y}
                    onChange={(e) => setPoint2Y(Number(e.target.value))}
                    placeholder="y₂"
                    className="w-20"
                  />
                </div>
                <div className="text-xs text-gray-500">On curve: {isOnCurve(point2X, point2Y) ? "✓" : "✗"}</div>
              </div>
            )}

            <Button onClick={performOperation} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate {operation === "add" ? "P₁ + P₂" : "2P₁"}
            </Button>

            {result && (
              <div className="bg-green-50 p-3 rounded-md">
                <div className="font-semibold">Result:</div>
                <div className="font-mono">
                  {operation === "add" ? "P₁ + P₂" : "2P₁"} = ({result.x}, {result.y})
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Calculation Steps</h4>
            <div className="bg-gray-50 p-3 rounded-md max-h-64 overflow-y-auto">
              {steps.length > 0 ? (
                <div className="text-sm space-y-1">
                  {steps.map((step, index) => (
                    <div key={index} className="font-mono">
                      {step}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Click "Calculate" to see steps</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Point Operation Formulas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">Point Addition (P₁ + P₂)</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-1 font-mono">
              <div>λ = (y₂ - y₁) / (x₂ - x₁) mod p</div>
              <div>x₃ = λ² - x₁ - x₂ mod p</div>
              <div>y₃ = λ(x₁ - x₃) - y₁ mod p</div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <h4 className="font-semibold text-purple-800">Point Doubling (2P)</h4>
            <div className="text-sm text-purple-700 mt-2 space-y-1 font-mono">
              <div>λ = (3x₁² + a) / (2y₁) mod p</div>
              <div>x₃ = λ² - 2x₁ mod p</div>
              <div>y₃ = λ(x₁ - x₃) - y₁ mod p</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ECDHDemo() {
  const [alicePrivate, setAlicePrivate] = useState(7)
  const [bobPrivate, setBobPrivate] = useState(11)
  const [basePointX] = useState(3)
  const [basePointY] = useState(10)
  const [alicePublic, setAlicePublic] = useState<{ x: number; y: number } | null>(null)
  const [bobPublic, setBobPublic] = useState<{ x: number; y: number } | null>(null)
  const [aliceShared, setAliceShared] = useState<{ x: number; y: number } | null>(null)
  const [bobShared, setBobShared] = useState<{ x: number; y: number } | null>(null)

  // Simplified scalar multiplication for demonstration
  const scalarMultiply = (k: number, px: number, py: number) => {
    if (k === 0) return null // Point at infinity
    if (k === 1) return { x: px, y: py }

    let result = { x: px, y: py }
    for (let i = 1; i < k; i++) {
      // This is a very simplified version - real implementations use efficient algorithms
      result = pointAdd(result.x, result.y, px, py)
    }
    return result
  }

  const pointAdd = (x1: number, y1: number, x2: number, y2: number) => {
    const p = 23
    const a = -1

    if (x1 === x2 && y1 === y2) {
      // Point doubling
      const numerator = (3 * x1 * x1 + a) % p
      const denominator = (2 * y1) % p
      const lambda = (numerator * modInverse(denominator, p)) % p

      const x3 = (lambda * lambda - 2 * x1) % p
      const y3 = (lambda * (x1 - x3) - y1) % p

      return { x: x3 < 0 ? x3 + p : x3, y: y3 < 0 ? y3 + p : y3 }
    } else {
      // Point addition
      const numerator = (y2 - y1) % p
      const denominator = (x2 - x1) % p
      const lambda = (numerator * modInverse(denominator, p)) % p

      const x3 = (lambda * lambda - x1 - x2) % p
      const y3 = (lambda * (x1 - x3) - y1) % p

      return { x: x3 < 0 ? x3 + p : x3, y: y3 < 0 ? y3 + p : y3 }
    }
  }

  const modInverse = (a: number, m: number): number => {
    let [old_r, r] = [a, m]
    let [old_s, s] = [1, 0]

    while (r !== 0) {
      const quotient = Math.floor(old_r / r)
      ;[old_r, r] = [r, old_r - quotient * r]
      ;[old_s, s] = [s, old_s - quotient * s]
    }

    return old_s < 0 ? old_s + m : old_s
  }

  const performECDH = () => {
    // Alice computes her public key: A = a × G
    const alicePub = scalarMultiply(alicePrivate, basePointX, basePointY)
    setAlicePublic(alicePub)

    // Bob computes his public key: B = b × G
    const bobPub = scalarMultiply(bobPrivate, basePointX, basePointY)
    setBobPublic(bobPub)

    // Alice computes shared secret: S = a × B
    if (bobPub) {
      const aliceSecret = scalarMultiply(alicePrivate, bobPub.x, bobPub.y)
      setAliceShared(aliceSecret)
    }

    // Bob computes shared secret: S = b × A
    if (alicePub) {
      const bobSecret = scalarMultiply(bobPrivate, alicePub.x, alicePub.y)
      setBobShared(bobSecret)
    }
  }

  const sharedSecretsMatch = aliceShared && bobShared && aliceShared.x === bobShared.x && aliceShared.y === bobShared.y

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Elliptic Curve Diffie-Hellman (ECDH)</h3>
        <p className="text-sm text-gray-600">
          Demonstrate key exchange using elliptic curve operations on y² = x³ - x + 1 (mod 23)
        </p>

        <div className="bg-blue-50 p-3 rounded-md">
          <div className="text-sm">
            <strong>Base Point G:</strong> ({basePointX}, {basePointY})
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Alice</h4>
            <div className="space-y-2">
              <Label htmlFor="alice-private">Private Key (a)</Label>
              <Input
                id="alice-private"
                type="number"
                value={alicePrivate}
                onChange={(e) => setAlicePrivate(Number(e.target.value))}
                min={1}
                max={22}
              />
            </div>

            {alicePublic && (
              <div className="space-y-2">
                <Label>Public Key (A = a × G)</Label>
                <Input value={`(${alicePublic.x}, ${alicePublic.y})`} readOnly className="font-mono bg-green-50" />
              </div>
            )}

            {aliceShared && (
              <div className="space-y-2">
                <Label>Shared Secret (S = a × B)</Label>
                <Input value={`(${aliceShared.x}, ${aliceShared.y})`} readOnly className="font-mono bg-purple-50" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Bob</h4>
            <div className="space-y-2">
              <Label htmlFor="bob-private">Private Key (b)</Label>
              <Input
                id="bob-private"
                type="number"
                value={bobPrivate}
                onChange={(e) => setBobPrivate(Number(e.target.value))}
                min={1}
                max={22}
              />
            </div>

            {bobPublic && (
              <div className="space-y-2">
                <Label>Public Key (B = b × G)</Label>
                <Input value={`(${bobPublic.x}, ${bobPublic.y})`} readOnly className="font-mono bg-green-50" />
              </div>
            )}

            {bobShared && (
              <div className="space-y-2">
                <Label>Shared Secret (S = b × A)</Label>
                <Input value={`(${bobShared.x}, ${bobShared.y})`} readOnly className="font-mono bg-purple-50" />
              </div>
            )}
          </div>
        </div>

        <Button onClick={performECDH} className="w-full">
          <KeyIcon className="h-4 w-4 mr-2" />
          Perform ECDH Key Exchange
        </Button>

        {sharedSecretsMatch !== null && (
          <div
            className={`p-3 rounded-md flex items-center gap-2 ${
              sharedSecretsMatch ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            {sharedSecretsMatch ? (
              <>
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span className="text-green-700 font-medium">Shared secrets match! Key exchange successful.</span>
              </>
            ) : (
              <>
                <XIcon className="h-5 w-5 text-red-500" />
                <span className="text-red-700 font-medium">Shared secrets don't match. Error in calculation.</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">ECDH Protocol Steps</h3>
        <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
          <div>
            <strong>1. Setup:</strong> Both parties agree on curve parameters and base point G
          </div>
          <div>
            <strong>2. Key Generation:</strong> Alice chooses private key a, Bob chooses private key b
          </div>
          <div>
            <strong>3. Public Key Computation:</strong> Alice computes A = a × G, Bob computes B = b × G
          </div>
          <div>
            <strong>4. Key Exchange:</strong> Alice and Bob exchange public keys A and B
          </div>
          <div>
            <strong>5. Shared Secret:</strong> Alice computes S = a × B, Bob computes S = b × A
          </div>
          <div>
            <strong>6. Verification:</strong> Both parties now have the same shared secret S = ab × G
          </div>
        </div>
      </div>
    </div>
  )
}

function ECDSADemo() {
  const [message, setMessage] = useState("Hello, ECDSA!")
  const [privateKey, setPrivateKey] = useState(7)
  const [k, setK] = useState(5) // Random nonce for signing
  const [signature, setSignature] = useState<{ r: number; s: number } | null>(null)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

  // Simplified hash function for demonstration
  const simpleHash = (msg: string): number => {
    let hash = 0
    for (let i = 0; i < msg.length; i++) {
      hash = (hash * 31 + msg.charCodeAt(i)) % 23
    }
    return hash
  }

  const modInverse = (a: number, m: number): number => {
    let [old_r, r] = [a, m]
    let [old_s, s] = [1, 0]

    while (r !== 0) {
      const quotient = Math.floor(old_r / r)
      ;[old_r, r] = [r, old_r - quotient * r]
      ;[old_s, s] = [s, old_s - quotient * s]
    }

    return old_s < 0 ? old_s + m : old_s
  }

  const signMessage = () => {
    const n = 23 // Order of the curve (simplified)
    const h = simpleHash(message)

    // r = (k × G).x mod n
    // For simplicity, we'll use a mock calculation
    const r = (k * 3) % n // Simplified: should be x-coordinate of k×G

    // s = k⁻¹(h + r × privateKey) mod n
    const kInv = modInverse(k, n)
    const s = (kInv * (h + r * privateKey)) % n

    setSignature({ r, s })
    setVerificationResult(null)
  }

  const verifySignature = () => {
    if (!signature) return

    const n = 23
    const h = simpleHash(message)

    // w = s⁻¹ mod n
    const w = modInverse(signature.s, n)

    // u₁ = hw mod n
    const u1 = (h * w) % n

    // u₂ = rw mod n
    const u2 = (signature.r * w) % n

    // Verification: check if r ≡ (u₁G + u₂Q).x mod n
    // For simplicity, we'll use a mock verification
    const expectedR = (u1 * 3 + u2 * privateKey * 3) % n // Simplified calculation

    setVerificationResult(expectedR === signature.r)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Elliptic Curve Digital Signature Algorithm (ECDSA)</h3>
        <p className="text-sm text-gray-600">
          Demonstrate digital signatures using elliptic curve cryptography (simplified for education)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Signing</h4>

            <div className="space-y-2">
              <Label htmlFor="ecdsa-message">Message</Label>
              <Input
                id="ecdsa-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to sign"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ecdsa-private">Private Key (d)</Label>
              <Input
                id="ecdsa-private"
                type="number"
                value={privateKey}
                onChange={(e) => setPrivateKey(Number(e.target.value))}
                min={1}
                max={22}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ecdsa-k">Random Nonce (k)</Label>
              <Input
                id="ecdsa-k"
                type="number"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                min={1}
                max={22}
              />
              <div className="text-xs text-gray-500">
                ⚠️ In practice, k must be cryptographically random and never reused
              </div>
            </div>

            <Button onClick={signMessage} className="w-full">
              <PenIcon className="h-4 w-4 mr-2" />
              Sign Message
            </Button>

            {signature && (
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="font-semibold">Signature:</div>
                <div className="font-mono text-sm">
                  r = {signature.r}
                  <br />s = {signature.s}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Verification</h4>

            <div className="space-y-2">
              <Label>Message Hash</Label>
              <Input value={`h = ${simpleHash(message)}`} readOnly className="font-mono bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label>Public Key</Label>
              <Input value={`Q = ${privateKey} × G`} readOnly className="font-mono bg-gray-50" />
            </div>

            <Button onClick={verifySignature} className="w-full" disabled={!signature}>
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Verify Signature
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
                    <span className="text-green-700 font-medium">Signature Valid</span>
                  </>
                ) : (
                  <>
                    <XIcon className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 font-medium">Signature Invalid</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">ECDSA Algorithm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">Signing Process</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <div>1. Choose random k ∈ [1, n-1]</div>
              <div>2. Compute (x₁, y₁) = k × G</div>
              <div>3. r = x₁ mod n (if r = 0, choose new k)</div>
              <div>4. s = k⁻¹(h + r × d) mod n</div>
              <div>5. Signature is (r, s)</div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">Verification Process</h4>
            <div className="text-sm text-green-700 mt-2 space-y-1">
              <div>1. Verify r, s ∈ [1, n-1]</div>
              <div>2. w = s⁻¹ mod n</div>
              <div>3. u₁ = hw mod n</div>
              <div>4. u₂ = rw mod n</div>
              <div>5. (x₁, y₁) = u₁G + u₂Q</div>
              <div>6. Valid if r ≡ x₁ mod n</div>
            </div>
          </div>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Security Note:</strong> This is a simplified demonstration. Real ECDSA implementations use
          cryptographically secure curves like P-256, proper hash functions like SHA-256, and secure random number
          generation for the nonce k.
        </AlertDescription>
      </Alert>
    </div>
  )
}
