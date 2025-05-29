"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronRightIcon,
  BookOpenIcon,
  KeyIcon,
  ShieldIcon,
  BrainIcon,
  AlertTriangle,
  Twitter,
  Github,
} from "lucide-react"

import SymmetricEncryption from "@/components/symmetric-encryption"
import AsymmetricEncryption from "@/components/asymmetric-encryption"
import Hashing from "@/components/hashing"
import DigitalSignatures from "@/components/digital-signatures"
import KeyExchange from "@/components/key-exchange"
import ClassicalCiphers from "@/components/classical-ciphers"
import MACs from "@/components/macs"
import Commitments from "@/components/commitments"
import ZeroKnowledge from "@/components/zero-knowledge"
import EllipticCurves from "@/components/elliptic-curves"
import MathematicalFoundations from "@/components/mathematical-foundations"

const categories = [
  {
    id: "foundations",
    name: "Foundations",
    icon: BookOpenIcon,
    description: "Mathematical foundations and classical cryptography",
    sections: [
      { id: "mathematical-foundations", name: "Mathematical Foundations", component: MathematicalFoundations },
      { id: "classical", name: "Classical Ciphers", component: ClassicalCiphers },
    ],
  },
  {
    id: "symmetric",
    name: "Symmetric Cryptography",
    icon: KeyIcon,
    description: "Shared key cryptographic systems",
    sections: [
      { id: "symmetric-encryption", name: "Symmetric Encryption", component: SymmetricEncryption },
      { id: "hashing", name: "Hashing", component: Hashing },
      { id: "macs", name: "MACs", component: MACs },
    ],
  },
  {
    id: "asymmetric",
    name: "Asymmetric Cryptography",
    icon: ShieldIcon,
    description: "Public key cryptographic systems",
    sections: [
      { id: "asymmetric-encryption", name: "Asymmetric Encryption", component: AsymmetricEncryption },
      { id: "digital-signatures", name: "Digital Signatures", component: DigitalSignatures },
      { id: "key-exchange", name: "Key Exchange", component: KeyExchange },
      { id: "elliptic-curves", name: "Elliptic Curves", component: EllipticCurves },
    ],
  },
  {
    id: "advanced",
    name: "Advanced Topics",
    icon: BrainIcon,
    description: "Modern cryptographic protocols and concepts",
    sections: [
      { id: "commitments", name: "Commitments", component: Commitments },
      { id: "zero-knowledge", name: "Zero-Knowledge", component: ZeroKnowledge },
    ],
  },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("foundations")
  const [selectedSection, setSelectedSection] = useState("mathematical-foundations")

  const currentCategory = categories.find((cat) => cat.id === selectedCategory)
  const currentSection = currentCategory?.sections.find((section) => section.id === selectedSection)
  const CurrentComponent = currentSection?.component

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Interactive Cryptography Playground</h1>
          <p className="text-gray-600 mt-1">Learn and experiment with cryptographic algorithms in real-time</p>
        </div>
      </header>

      {/* Disclaimer and Author Info */}
      <div className="max-w-7xl mx-auto px-6 py-4 bg-yellow-50 border-b border-yellow-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Educational Purpose Only</span>
            </div>
            <p className="text-sm text-yellow-700">
              This cryptography playground is designed for educational purposes only. The implementations shown here are
              simplified for learning and should never be used in real cryptographic applications or production systems.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm text-gray-600">
              Created by <span className="font-semibold">Parti</span>
            </div>
            <div className="flex gap-3">
              <a
                href="https://x.com/0xParticle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Twitter className="h-4 w-4" />
                @0xParticle
              </a>
              <a
                href="https://github.com/0xParti"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm"
              >
                <Github className="h-4 w-4" />
                0xParti
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <ScrollArea className="h-screen">
            <div className="p-4 space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <Button
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setSelectedSection(category.sections[0].id)
                    }}
                  >
                    <category.icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </Button>

                  {selectedCategory === category.id && (
                    <div className="ml-8 space-y-1">
                      {category.sections.map((section) => (
                        <Button
                          key={section.id}
                          variant={selectedSection === section.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm"
                          onClick={() => setSelectedSection(section.id)}
                        >
                          <ChevronRightIcon className="h-3 w-3 mr-2" />
                          {section.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">{CurrentComponent && <CurrentComponent />}</div>
        </div>
      </div>
    </div>
  )
}
