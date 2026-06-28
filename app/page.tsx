import Link from "next/link"
import { Shield, ArrowRight, Globe, Lock, Zap, Users, Wallet, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Lock,
    title: "Zero-Knowledge Privacy",
    description:
      "Employee salaries and wallet addresses are protected using ZK-SNARK proofs. Complete privacy without sacrificing compliance.",
  },
  {
    icon: Globe,
    title: "Global Payments",
    description:
      "Pay contractors in 150+ countries with instant Stellar blockchain settlements. No more 3-5 day wire transfers.",
  },
  {
    icon: Zap,
    title: "Instant Withdrawals",
    description:
      "Employees claim payments on their own schedule with self-custodied wallets. No intermediaries required.",
  },
  {
    icon: TrendingUp,
    title: "Treasury Yield",
    description:
      "Earn 4-5% APY on idle payroll funds through DeFi integrations. Turn your treasury into a profit center.",
  },
]

const stats = [
  { value: "$2.4M+", label: "Payroll Processed" },
  { value: "150+", label: "Countries Supported" },
  { value: "< 5 sec", label: "Settlement Time" },
  { value: "4.5%", label: "Treasury APY" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">ShieldedPay</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/admin">Admin Portal</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-sm">
              <Lock className="mr-2 h-3.5 w-3.5 text-primary" />
              Privacy-First Global Payroll
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Pay Your Global Team with
              <span className="text-primary"> Complete Privacy</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance">
              Enterprise payroll platform built on Stellar blockchain with zero-knowledge 
              compliance. Pay contractors worldwide while protecting sensitive salary data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/admin">
                  <Users className="mr-2 h-4 w-4" />
                  Open HR Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/admin/treasury">
                  <Wallet className="mr-2 h-4 w-4" />
                  View Treasury
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Built for Modern Global Teams
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              ShieldedPay combines blockchain efficiency with enterprise-grade privacy 
              to revolutionize how you pay your global workforce.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              How ShieldedPay Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A seamless experience for both HR teams and contractors.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 font-semibold">HR Creates Payroll</h3>
              <p className="text-sm text-muted-foreground">
                Upload your contractor list and salaries. Our system generates 
                privacy-preserving commitments using ZK proofs.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 font-semibold">Funds Are Committed</h3>
              <p className="text-sm text-muted-foreground">
                Treasury funds are locked in smart contracts on Stellar. 
                Merkle trees ensure verifiable, tamper-proof disbursements.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 font-semibold">Contractors Claim</h3>
              <p className="text-sm text-muted-foreground">
                Employees receive a secure link to claim funds directly to their 
                Stellar wallet. No signup required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to Transform Your Payroll?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join forward-thinking companies using ShieldedPay to pay their 
            global teams securely and privately.
          </p>
          <Button size="lg" asChild>
            <Link href="/admin">
              Start Using ShieldedPay
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">ShieldedPay</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Privacy-first global payroll powered by Stellar blockchain.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Built with ZK-SNARKs</span>
              <span>|</span>
              <span>Stellar Network</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
