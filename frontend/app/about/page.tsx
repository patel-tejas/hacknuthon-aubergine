"use client"

import { Navbar } from "@/components/navbar"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Activity, Clock, Users } from "lucide-react"

export default function About() {
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
              About <span className="gradient-text">FraudShield AI</span>
            </motion.h1>
            <motion.p
              className="text-xl text-foreground/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Pioneering AI-driven financial security solutions to combat modern fraud challenges
            </motion.p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-foreground/80 mb-4">
                Founded by cybersecurity experts and financial technologists, FraudShield AI emerged from the growing need 
                to combat sophisticated financial fraud in digital transactions. Our journey began in 2022 with a single 
                mission: to make financial systems inherently secure.
              </p>
              <p className="text-foreground/80 mb-4">
                After witnessing first-hand the limitations of traditional fraud detection systems, our team developed 
                a hybrid AI approach that combines machine learning with real-time behavioral analysis.
              </p>
              <p className="text-foreground/80">
                Today, we protect over $12B in annual transactions for banks, fintech companies, and payment processors 
                worldwide.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="w-full h-[400px] rounded-xl overflow-hidden border border-border glow-border">
                <div className="absolute inset-0 grid-pattern"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>

                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <motion.div 
                    className="bg-background/40 backdrop-blur-md p-6 rounded-xl border border-border"
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">Core Philosophy</h3>
                    <p className="text-foreground/80">
                      "Stay ahead of fraudsters through continuous innovation and adaptive machine learning models"
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                value: "98.7%",
                label: "Fraud Detection Accuracy",
                delay: 0,
              },
              {
                icon: Activity,
                value: "47ms",
                label: "Average Detection Time",
                delay: 0.1,
              },
              {
                icon: Users,
                value: "200+",
                label: "Financial Institutions Protected",
                delay: 0.2,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Security Leadership
            </motion.h2>
            <motion.p
              className="text-xl text-foreground/80 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our team combines decades of experience in cybersecurity, AI, and financial systems
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Prajinraj Ranawat",
                role: "AI/ML Engineer",
                delay: 0,
              },
              {
                name: "Smit Joshi",
                role: "AI/ML Engineer",
                delay: 0.1,
              },
              {
                name: "Shreyash Shukla",
                role: "Frontend Engineer & Documentation Expert",
                delay: 0.2,
              },
              {
                name: "Tejas Patel",
                role: "Full Stack Dev",
                delay: 0.3,
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.delay }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="bg-primary/10 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-border rounded-xl p-8 md:p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Join the Fight Against Fraud</h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
                Secure your financial operations with next-generation AI protection
              </p>
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
                Security
              </Link>
              <Link href="#" className="text-foreground/70 hover:text-foreground">
                Contact
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