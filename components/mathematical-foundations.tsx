"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator } from "lucide-react"

export default function MathematicalFoundations() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Mathematical Foundations</CardTitle>
          <CardDescription>Essential mathematical concepts underlying modern cryptography</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="modular" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="modular">Modular Arithmetic</TabsTrigger>
              <TabsTrigger value="fields">Finite Fields</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="number-theory">Number Theory</TabsTrigger>
            </TabsList>

            <TabsContent value="modular">
              <ModularArithmetic />
            </TabsContent>

            <TabsContent value="fields">
              <FiniteFields />
            </TabsContent>

            <TabsContent value="groups">
              <Groups />
            </TabsContent>

            <TabsContent value="number-theory">
              <NumberTheory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ModularArithmetic() {
  const [a, setA] = useState(17)
  const [b, setB] = useState(8)
  const [m, setM] = useState(23)
  const [operation, setOperation] = useState<"add" | "sub" | "mul" | "pow">("add")
  const [exponent, setExponent] = useState(3)
  const [result, setResult] = useState<number | null>(null)
  const [steps, setSteps] = useState<string[]>([])

  const modPow = (base: number, exp: number, mod: number): { result: number; steps: string[] } => {
    const stepList = [`Computing ${base}^${exp} mod ${mod} using repeated squaring:`]

    if (exp === 0) {
      stepList.push(`${base}^0 = 1`)
      return { result: 1, steps: stepList }
    }

    let result = 1
    let currentBase = base % mod
    let currentExp = exp

    stepList.push(`Initial: base = ${currentBase}, exp = ${currentExp}`)

    while (currentExp > 0) {
      if (currentExp % 2 === 1) {
        result = (result * currentBase) % mod
        stepList.push(`Exp is odd: result = (${result / currentBase} × ${currentBase}) mod ${mod} = ${result}`)
      }
      currentBase = (currentBase * currentBase) % mod
      currentExp = Math.floor(currentExp / 2)

      if (currentExp > 0) {
        stepList.push(
          `Square base: ${Math.sqrt(currentBase) || "prev"}² mod ${mod} = ${currentBase}, exp = ${currentExp}`,
        )
      }
    }

    stepList.push(`Final result: ${result}`)
    return { result, steps: stepList }
  }

  const performOperation = () => {
    let res: number
    const stepList: string[] = []

    switch (operation) {
      case "add":
        res = (a + b) % m
        stepList.push(`${a} + ${b} = ${a + b}`)
        stepList.push(`${a + b} mod ${m} = ${res}`)
        break
      case "sub":
        res = (((a - b) % m) + m) % m
        stepList.push(`${a} - ${b} = ${a - b}`)
        stepList.push(`${a - b} mod ${m} = ${res}`)
        break
      case "mul":
        res = (a * b) % m
        stepList.push(`${a} × ${b} = ${a * b}`)
        stepList.push(`${a * b} mod ${m} = ${res}`)
        break
      case "pow":
        const powResult = modPow(a, exponent, m)
        res = powResult.result
        stepList.push(...powResult.steps)
        break
      default:
        res = 0
    }

    setResult(res)
    setSteps(stepList)
  }

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  const extendedGCD = (a: number, b: number): { gcd: number; x: number; y: number; steps: string[] } => {
    const steps = [`Extended Euclidean Algorithm for gcd(${a}, ${b}):`]

    let old_r = a,
      r = b
    let old_s = 1,
      s = 0
    let old_t = 0,
      t = 1

    steps.push(`Initial: r₀=${old_r}, r₁=${r}, s₀=${old_s}, s₁=${s}, t₀=${old_t}, t₁=${t}`)

    while (r !== 0) {
      const quotient = Math.floor(old_r / r)

      const temp_r = r
      r = old_r - quotient * r
      old_r = temp_r

      const temp_s = s
      s = old_s - quotient * s
      old_s = temp_s

      const temp_t = t
      t = old_t - quotient * t
      old_t = temp_t

      steps.push(`q=${quotient}: r=${r}, s=${old_s}, t=${old_t}`)
    }

    steps.push(`gcd(${a}, ${b}) = ${old_r}`)
    steps.push(`${a} × ${old_s} + ${b} × ${old_t} = ${old_r}`)

    return { gcd: old_r, x: old_s, y: old_t, steps }
  }

  const [gcdA, setGcdA] = useState(48)
  const [gcdB, setGcdB] = useState(18)
  const [gcdResult, setGcdResult] = useState<{ gcd: number; x: number; y: number; steps: string[] } | null>(null)

  const computeGCD = () => {
    const result = extendedGCD(gcdA, gcdB)
    setGcdResult(result)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Modular Arithmetic Operations</h3>
        <p className="text-sm text-gray-600">
          Explore arithmetic operations in modular systems, fundamental to cryptographic algorithms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="mod-a">a</Label>
                <Input id="mod-a" type="number" value={a} onChange={(e) => setA(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mod-b">b</Label>
                <Input id="mod-b" type="number" value={b} onChange={(e) => setB(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mod-m">mod m</Label>
                <Input id="mod-m" type="number" value={m} onChange={(e) => setM(Number(e.target.value))} min={2} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Operation</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  size="sm"
                >
                  a + b
                </Button>
                <Button
                  variant={operation === "sub" ? "default" : "outline"}
                  onClick={() => setOperation("sub")}
                  size="sm"
                >
                  a - b
                </Button>
                <Button
                  variant={operation === "mul" ? "default" : "outline"}
                  onClick={() => setOperation("mul")}
                  size="sm"
                >
                  a × b
                </Button>
                <Button
                  variant={operation === "pow" ? "default" : "outline"}
                  onClick={() => setOperation("pow")}
                  size="sm"
                >
                  a^exp
                </Button>
              </div>
            </div>

            {operation === "pow" && (
              <div className="space-y-2">
                <Label htmlFor="exponent">Exponent</Label>
                <Input
                  id="exponent"
                  type="number"
                  value={exponent}
                  onChange={(e) => setExponent(Number(e.target.value))}
                  min={0}
                />
              </div>
            )}

            <Button onClick={performOperation} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>

            {result !== null && (
              <div className="bg-green-50 p-3 rounded-md">
                <div className="font-semibold">Result:</div>
                <div className="font-mono text-lg">
                  {operation === "add" && `${a} + ${b} ≡ ${result} (mod ${m})`}
                  {operation === "sub" && `${a} - ${b} ≡ ${result} (mod ${m})`}
                  {operation === "mul" && `${a} × ${b} ≡ ${result} (mod ${m})`}
                  {operation === "pow" && `${a}^${exponent} ≡ ${result} (mod ${m})`}
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
        <h3 className="text-lg font-semibold">Extended Euclidean Algorithm</h3>
        <p className="text-sm text-gray-600">
          Find the greatest common divisor and express it as a linear combination.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="gcd-a">a</Label>
                <Input id="gcd-a" type="number" value={gcdA} onChange={(e) => setGcdA(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gcd-b">b</Label>
                <Input id="gcd-b" type="number" value={gcdB} onChange={(e) => setGcdB(Number(e.target.value))} />
              </div>
            </div>

            <Button onClick={computeGCD} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Compute Extended GCD
            </Button>

            {gcdResult && (
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="font-semibold">Result:</div>
                <div className="font-mono">
                  gcd({gcdA}, {gcdB}) = {gcdResult.gcd}
                </div>
                <div className="font-mono">
                  {gcdA} × {gcdResult.x} + {gcdB} × {gcdResult.y} = {gcdResult.gcd}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Algorithm Steps</h4>
            <div className="bg-gray-50 p-3 rounded-md max-h-64 overflow-y-auto">
              {gcdResult ? (
                <div className="text-sm space-y-1">
                  {gcdResult.steps.map((step, index) => (
                    <div key={index} className="font-mono">
                      {step}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Click "Compute" to see steps</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">Modular Arithmetic Rules</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <div>(a + b) mod m = ((a mod m) + (b mod m)) mod m</div>
              <div>(a - b) mod m = ((a mod m) - (b mod m) + m) mod m</div>
              <div>(a × b) mod m = ((a mod m) × (b mod m)) mod m</div>
              <div>a^n mod m can be computed efficiently using repeated squaring</div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">Applications in Cryptography</h4>
            <div className="text-sm text-green-700 mt-2 space-y-1">
              <div>• RSA encryption and decryption</div>
              <div>• Diffie-Hellman key exchange</div>
              <div>• Digital signature algorithms</div>
              <div>• Hash function design</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FiniteFields() {
  const [p, setP] = useState(7)
  const [elements, setElements] = useState<number[]>([])
  const [a, setA] = useState(3)
  const [b, setB] = useState(5)
  const [operation, setOperation] = useState<"add" | "mul" | "inv">("add")
  const [result, setResult] = useState<number | null>(null)

  useEffect(() => {
    // Generate elements of F_p
    const fieldElements = Array.from({ length: p }, (_, i) => i)
    setElements(fieldElements)
  }, [p])

  const modInverse = (a: number, m: number): number | null => {
    if (gcd(a, m) !== 1) return null // No inverse exists

    let [old_r, r] = [a, m]
    let [old_s, s] = [1, 0]

    while (r !== 0) {
      const quotient = Math.floor(old_r / r)
      ;[old_r, r] = [r, old_r - quotient * r]
      ;[old_s, s] = [s, old_s - quotient * s]
    }

    return old_s < 0 ? old_s + m : old_s
  }

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  const performFieldOperation = () => {
    let res: number | null = null

    switch (operation) {
      case "add":
        res = (a + b) % p
        break
      case "mul":
        res = (a * b) % p
        break
      case "inv":
        res = modInverse(a, p)
        break
    }

    setResult(res)
  }

  const isPrime = (n: number): boolean => {
    if (n < 2) return false
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false
    }
    return true
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Finite Fields F_p</h3>
        <p className="text-sm text-gray-600">
          Explore finite fields, which provide the algebraic structure for many cryptographic operations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-p">Prime p (field size)</Label>
              <Input
                id="field-p"
                type="number"
                value={p}
                onChange={(e) => setP(Number(e.target.value))}
                min={2}
                max={31}
              />
              <div className="text-xs text-gray-500">
                {isPrime(p) ? "✓ Prime number" : "⚠️ Not prime - not a valid field"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Field Elements F_{p}</Label>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-mono">
                  {"{"}
                  {elements.join(", ")}
                  {"}"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="field-a">Element a</Label>
                <Input
                  id="field-a"
                  type="number"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  min={0}
                  max={p - 1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field-b">Element b</Label>
                <Input
                  id="field-b"
                  type="number"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  min={0}
                  max={p - 1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Operation</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  size="sm"
                >
                  a + b
                </Button>
                <Button
                  variant={operation === "mul" ? "default" : "outline"}
                  onClick={() => setOperation("mul")}
                  size="sm"
                >
                  a × b
                </Button>
                <Button
                  variant={operation === "inv" ? "default" : "outline"}
                  onClick={() => setOperation("inv")}
                  size="sm"
                >
                  a⁻¹
                </Button>
              </div>
            </div>

            <Button onClick={performFieldOperation} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>

            {result !== null && (
              <div className="bg-green-50 p-3 rounded-md">
                <div className="font-semibold">Result:</div>
                <div className="font-mono text-lg">
                  {operation === "add" && `${a} + ${b} = ${result} in F_${p}`}
                  {operation === "mul" && `${a} × ${b} = ${result} in F_${p}`}
                  {operation === "inv" && result !== null && `${a}⁻¹ = ${result} in F_${p}`}
                  {operation === "inv" && result === null && `${a} has no inverse in F_${p}`}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Addition Table (mod {p})</h4>
            <div className="overflow-x-auto">
              <table className="text-xs border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-1 bg-gray-100">+</th>
                    {elements.map((i) => (
                      <th key={i} className="border border-gray-300 p-1 bg-gray-100">
                        {i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {elements.map((i) => (
                    <tr key={i}>
                      <th className="border border-gray-300 p-1 bg-gray-100">{i}</th>
                      {elements.map((j) => (
                        <td key={j} className="border border-gray-300 p-1 text-center">
                          {(i + j) % p}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Field Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">Field Axioms</h4>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <div>• Closure: a + b, a × b ∈ F_p</div>
              <div>• Associativity: (a + b) + c = a + (b + c)</div>
              <div>• Commutativity: a + b = b + a</div>
              <div>• Identity: 0 for addition, 1 for multiplication</div>
              <div>• Inverse: Every element has additive and multiplicative inverse</div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">Cryptographic Applications</h4>
            <div className="text-sm text-green-700 mt-2 space-y-1">
              <div>• Elliptic curve cryptography</div>
              <div>• AES S-box construction</div>
              <div>• Reed-Solomon error correction</div>
              <div>• Secret sharing schemes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Groups() {
  const [n, setN] = useState(12)
  const [a, setA] = useState(5)
  const [b, setB] = useState(7)
  const [generators, setGenerators] = useState<number[]>([])

  useEffect(() => {
    // Find generators of Z_n*
    const gens = []
    for (let g = 1; g < n; g++) {
      if (gcd(g, n) === 1) {
        const order = findOrder(g, n)
        if (order === eulerPhi(n)) {
          gens.push(g)
        }
      }
    }
    setGenerators(gens)
  }, [n])

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  const eulerPhi = (n: number): number => {
    let result = n
    for (let p = 2; p * p <= n; p++) {
      if (n % p === 0) {
        while (n % p === 0) n /= p
        result -= result / p
      }
    }
    if (n > 1) result -= result / n
    return Math.floor(result)
  }

  const findOrder = (a: number, n: number): number => {
    if (gcd(a, n) !== 1) return 0
    let order = 1
    let current = a % n
    while (current !== 1) {
      current = (current * a) % n
      order++
    }
    return order
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multiplicative Groups Z_n*</h3>
        <p className="text-sm text-gray-600">
          Explore multiplicative groups and their generators, crucial for discrete logarithm-based cryptography.
        </p>

        <div className="space-y-2">
          <Label htmlFor="group-n">Modulus n</Label>
          <Input id="group-n" type="number" value={n} onChange={(e) => setN(Number(e.target.value))} min={2} max={50} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Group Properties</h4>
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div>
                Group: Z_{n}* = {"{"}elements coprime to {n}
                {"}"}
              </div>
              <div>
                Order: φ({n}) = {eulerPhi(n)}
              </div>
              <div>Generators: {generators.length > 0 ? generators.join(", ") : "None"}</div>
            </div>

            <div className="space-y-2">
              <Label>Group Elements</Label>
              <div className="bg-blue-50 p-3 rounded-md max-h-32 overflow-y-auto">
                <div className="text-sm font-mono">
                  {Array.from({ length: n }, (_, i) => i + 1)
                    .filter((i) => gcd(i, n) === 1)
                    .join(", ")}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Element Orders</h4>
            <div className="bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto">
              <div className="text-sm space-y-1">
                {Array.from({ length: n }, (_, i) => i + 1)
                  .filter((i) => gcd(i, n) === 1)
                  .map((element) => (
                    <div key={element} className="flex justify-between">
                      <span>ord({element}):</span>
                      <span className="font-mono">{findOrder(element, n)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Group Theory in Cryptography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-md">
            <h4 className="font-semibold text-purple-800">Discrete Logarithm Problem</h4>
            <div className="text-sm text-purple-700 mt-2 space-y-1">
              <div>Given g, h in group G, find x such that g^x = h</div>
              <div>Easy to compute g^x, hard to find x from h</div>
              <div>Foundation of Diffie-Hellman, ElGamal, DSA</div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-md">
            <h4 className="font-semibold text-orange-800">Cyclic Groups</h4>
            <div className="text-sm text-orange-700 mt-2 space-y-1">
              <div>Generated by a single element (generator)</div>
              <div>All elements can be written as powers of generator</div>
              <div>Used in elliptic curve cryptography</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NumberTheory() {
  const [n, setN] = useState(561)
  const [a, setA] = useState(2)
  const [isPrimeResult, setIsPrimeResult] = useState<boolean | null>(null)
  const [fermatTest, setFermatTest] = useState<boolean | null>(null)
  const [millerRabinTest, setMillerRabinTest] = useState<boolean | null>(null)

  const isPrime = (n: number): boolean => {
    if (n < 2) return false
    if (n === 2) return true
    if (n % 2 === 0) return false

    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false
    }
    return true
  }

  const modPow = (base: number, exp: number, mod: number): number => {
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

  const fermatPrimalityTest = (n: number, a: number): boolean => {
    if (n <= 1) return false
    if (n === 2) return true
    if (n % 2 === 0) return false

    return modPow(a, n - 1, n) === 1
  }

  const millerRabinPrimalityTest = (n: number, a: number): boolean => {
    if (n <= 1) return false
    if (n === 2) return true
    if (n % 2 === 0) return false

    // Write n-1 as d * 2^r
    let d = n - 1
    let r = 0
    while (d % 2 === 0) {
      d /= 2
      r++
    }

    let x = modPow(a, d, n)
    if (x === 1 || x === n - 1) return true

    for (let i = 0; i < r - 1; i++) {
      x = modPow(x, 2, n)
      if (x === n - 1) return true
    }
    return false
  }

  const runTests = () => {
    setIsPrimeResult(isPrime(n))
    setFermatTest(fermatPrimalityTest(n, a))
    setMillerRabinTest(millerRabinPrimalityTest(n, a))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primality Testing</h3>
        <p className="text-sm text-gray-600">
          Compare different methods for testing if a number is prime, essential for RSA key generation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prime-n">Number to test (n)</Label>
              <Input id="prime-n" type="number" value={n} onChange={(e) => setN(Number(e.target.value))} min={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prime-a">Test base (a)</Label>
              <Input
                id="prime-a"
                type="number"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
                min={2}
                max={n - 1}
              />
            </div>

            <Button onClick={runTests} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Run Primality Tests
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Test Results</h4>
            <div className="space-y-2">
              {isPrimeResult !== null && (
                <div className={`p-3 rounded-md ${isPrimeResult ? "bg-green-50" : "bg-red-50"}`}>
                  <div className="font-semibold">Deterministic Test:</div>
                  <div>
                    {n} is {isPrimeResult ? "prime" : "composite"}
                  </div>
                </div>
              )}

              {fermatTest !== null && (
                <div className={`p-3 rounded-md ${fermatTest ? "bg-blue-50" : "bg-red-50"}`}>
                  <div className="font-semibold">Fermat Test (a={a}):</div>
                  <div>{fermatTest ? "Probably prime" : "Composite"}</div>
                  <div className="text-xs">a^(n-1) ≡ {modPow(a, n - 1, n)} (mod n)</div>
                </div>
              )}

              {millerRabinTest !== null && (
                <div className={`p-3 rounded-md ${millerRabinTest ? "bg-purple-50" : "bg-red-50"}`}>
                  <div className="font-semibold">Miller-Rabin Test (a={a}):</div>
                  <div>{millerRabinTest ? "Probably prime" : "Composite"}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Important Number Theory Concepts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-md">
            <h4 className="font-semibold text-indigo-800">Fermat's Little Theorem</h4>
            <div className="text-sm text-indigo-700 mt-2 space-y-1">
              <div>If p is prime and gcd(a,p) = 1, then:</div>
              <div className="font-mono">a^(p-1) ≡ 1 (mod p)</div>
              <div>Used in RSA and primality testing</div>
            </div>
          </div>
          <div className="bg-teal-50 p-4 rounded-md">
            <h4 className="font-semibold text-teal-800">Chinese Remainder Theorem</h4>
            <div className="text-sm text-teal-700 mt-2 space-y-1">
              <div>System of congruences with coprime moduli</div>
              <div>Has unique solution modulo product</div>
              <div>Used in RSA optimization</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md">
        <h4 className="font-semibold text-yellow-800">Carmichael Numbers</h4>
        <div className="text-sm text-yellow-700 mt-2">
          <div>Composite numbers that satisfy Fermat's test for all bases coprime to n</div>
          <div>Example: 561 = 3 × 11 × 17 (try testing with different bases)</div>
          <div>This is why Miller-Rabin test is preferred over Fermat test</div>
        </div>
      </div>
    </div>
  )
}
