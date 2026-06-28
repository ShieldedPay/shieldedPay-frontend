import { HelpCircle, Book, MessageSquare, FileText, ExternalLink, Mail, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const resources = [
  {
    icon: Book,
    title: "Documentation",
    description: "Comprehensive guides for all ShieldedPay features",
    action: "View Docs",
    href: "#",
  },
  {
    icon: Zap,
    title: "Quick Start Guide",
    description: "Get up and running in under 10 minutes",
    action: "Start Tutorial",
    href: "#",
  },
  {
    icon: FileText,
    title: "API Reference",
    description: "Technical documentation for developers",
    action: "View API",
    href: "#",
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Connect with other ShieldedPay users",
    action: "Join Community",
    href: "#",
  },
]

const faqs = [
  {
    question: "How does zero-knowledge privacy work?",
    answer:
      "ShieldedPay uses ZK-SNARK proofs to encrypt salary data while still allowing verification. This means payroll can be audited without revealing individual amounts.",
  },
  {
    question: "How do employees claim their payments?",
    answer:
      "Employees receive a secure claim link via email. They enter their Stellar wallet address to claim funds, which are then transferred directly to their self-custodied wallet.",
  },
  {
    question: "What happens if an employee doesn't claim their payment?",
    answer:
      "Unclaimed payments remain in the smart contract until claimed. Employers can set expiration periods and reclaim unclaimed funds after a specified time.",
  },
  {
    question: "How is treasury yield generated?",
    answer:
      "Idle treasury funds are deposited into audited DeFi protocols on Stellar, earning 4-5% APY through lending and liquidity provision.",
  },
  {
    question: "Is ShieldedPay compliant with regulations?",
    answer:
      "Yes. While individual salary data is encrypted, our audit trail provides regulatory-compliant proof of payment for tax and compliance purposes.",
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers and get help with ShieldedPay.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <Card key={resource.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <resource.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button variant="outline" className="w-full" asChild>
                <a href={resource.href}>
                  {resource.action}
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Common questions about ShieldedPay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                {index < faqs.length - 1 && (
                  <div className="pt-4 border-b" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Support
          </CardTitle>
          <CardDescription>
            Can&apos;t find what you&apos;re looking for? Our team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Live Chat
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Average response time: under 2 hours during business hours (9 AM - 6 PM EST)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
