"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { FloatingIcons } from "@/components/floating-icons"
import { ArrowRight, Brain, Database, Lock, Zap, Network } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen">
      <AnimatedGradientBackground />
      <FloatingIcons />
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="gradient-text">AI-Powered Fraud Detection</span> for Financial Security
              </h1>
              <p className="text-xl text-foreground/80 mb-8">
                Real-time transaction monitoring system that detects suspicious activity using machine learning, 
                reduces false positives, and ensures regulatory compliance for financial institutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Try Live Demo</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/features">
                    How It Works <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border glow-border">
                <div className="absolute inset-0 grid-pattern"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>

                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-primary/40 flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Brain className="w-8 h-8 text-primary" />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-1/4 left-1/4 bg-secondary/30 p-3 rounded-lg"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Database className="w-6 h-6 text-secondary" />
                </motion.div>

                <motion.div
                  className="absolute bottom-1/4 right-1/4 bg-accent/30 p-3 rounded-lg"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                >
                  <Lock className="w-6 h-6 text-accent" />
                </motion.div>

                <motion.div
                  className="absolute top-1/3 right-1/5 bg-primary/30 p-3 rounded-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
                >
                  <Zap className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Core Features</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Advanced fraud detection system combining real-time analysis with regulatory compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-Time Monitoring",
                description: "Instant analysis of transactions using streaming data processing",
                icon: Zap,
                delay: 0.1,
              },
              {
                title: "ML Anomaly Detection",
                description: "Identify patterns with Isolation Forest & Random Forest models",
                icon: Brain,
                delay: 0.2,
              },
              {
                title: "Compliance Automation",
                description: "Auto-verify against financial regulations and policies",
                icon: Lock,
                delay: 0.3,
              },
              {
                title: "Risk Scoring",
                description: "Dynamic risk assessment with threat evaluation",
                icon: Network,
                delay: 0.4,
              },
              {
                title: "Historical Analysis",
                description: "Learn from past fraud cases to improve accuracy",
                icon: Database,
                delay: 0.5,
              },
              {
                title: "Admin Dashboard",
                description: "Prioritized alerts with investigation workflows",
                icon: ArrowRight,
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
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
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
            <div className="absolute inset-0 grid-pattern opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure Your Financial Operations</h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
                Join banks and financial institutions preventing fraud with our AI-powered solution
              </p>
              <Button size="lg" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
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
                Contact Security
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
