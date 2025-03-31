"use client"

import { Navbar } from "@/components/navbar"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Activity, ShieldAlert, Scale, Database, Bell, ClipboardList } from "lucide-react"

export default function Features() {
  return (
    <div className="min-h-screen">
      <AnimatedGradientBackground />
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Protect Your Business with <span className="gradient-text">AI-Powered Security</span>
            </motion.h1>
            <motion.p
              className="text-xl text-foreground/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Advanced financial fraud detection combining real-time monitoring, machine learning, and regulatory compliance
            </motion.p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-Time Monitoring",
                description: "Continuous analysis of transactions as they occur with <50ms latency",
                icon: Activity,
                delay: 0.1,
              },
              {
                title: "Anomaly Detection",
                description: "Identify suspicious patterns using Isolation Forest and Random Forest models",
                icon: ShieldAlert,
                delay: 0.2,
              },
              {
                title: "Regulation Compliance",
                description: "Automated checks against global financial regulations (AML, KYC, PCI-DSS)",
                icon: Scale,
                delay: 0.3,
              },
              {
                title: "Historical Analysis",
                description: "Learn from past fraud patterns to improve detection accuracy",
                icon: Database,
                delay: 0.4,
              },
              {
                title: "Smart Alerts",
                description: "Context-rich notifications with risk scoring and investigation workflows",
                icon: Bell,
                delay: 0.5,
              },
              {
                title: "Case Management",
                description: "Full audit trails and reporting for compliance officers",
                icon: ClipboardList,
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70 mb-4" dangerouslySetInnerHTML={{ __html: feature.description }} />
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="#">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feature Spotlight */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Hybrid Detection Engine</h2>
              <p className="text-foreground/80 mb-4">
                Our system combines rule-based checks with machine learning models to achieve 99.8% detection accuracy
                while maintaining a false positive rate below 0.2%.
              </p>
              <p className="text-foreground/80 mb-4">
                The multi-layered approach analyzes transactions through:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground/80">
                <li>Real-time pattern matching</li>
                <li>Behavioral biometrics</li>
                <li>Network analysis</li>
                <li>Historical trend comparison</li>
              </ul>
              <Button asChild>
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Keep existing animation structure, update icons and text */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-[400px] rounded-xl overflow-hidden border border-border glow-border">
                {/* Update floating icons to match security theme */}
                <motion.div
                  className="absolute top-1/4 left-1/4 bg-secondary/30 p-3 rounded-lg"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <ShieldAlert className="w-6 h-6 text-secondary" />
                </motion.div>

                <motion.div
                  className="absolute bottom-1/4 right-1/4 bg-accent/30 p-3 rounded-lg"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                >
                  <Activity className="w-6 h-6 text-accent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Superior Fraud Detection</h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              How our solution outperforms traditional fraud detection systems
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b border-border"></th>
                  <th className="p-4 text-center border-b border-border">
                    <span className="gradient-text font-bold">FraudShield AI</span>
                  </th>
                  <th className="p-4 text-center border-b border-border">Traditional Systems</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-border font-medium">Detection Accuracy</td>
                  <td className="p-4 text-center border-b border-border text-primary">99.8%</td>
                  <td className="p-4 text-center border-b border-border text-foreground/70">85-92%</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-border font-medium">False Positives</td>
                  <td className="p-4 text-center border-b border-border text-primary">0.2%</td>
                  <td className="p-4 text-center border-b border-border text-foreground/70">2-5%</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-border font-medium">Compliance Automation</td>
                  <td className="p-4 text-center border-b border-border text-primary">Full Coverage</td>
                  <td className="p-4 text-center border-b border-border text-foreground/70">Manual Checks</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-border font-medium">Processing Speed</td>
                  <td className="p-4 text-center border-b border-border text-primary">50ms</td>
                  <td className="p-4 text-center border-b border-border text-foreground/70">200-500ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-border rounded-xl p-8 md:p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Transactions?</h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
                Join financial institutions reducing fraud losses by an average of 87%
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">
                    Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Updated Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2"></div>
              <span className="text-xl font-bold gradient-text">FraudShield AI</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-foreground/70 hover:text-foreground">
                Compliance
              </Link>
              <Link href="#" className="text-foreground/70 hover:text-foreground">
                Documentation
              </Link>
              <Link href="#" className="text-foreground/70 hover:text-foreground">
                Security
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-foreground/50 text-sm">
            © 2024 FraudShield AI. FDIC-compliant solutions.
          </div>
        </div>
      </footer>
    </div>
  )
}