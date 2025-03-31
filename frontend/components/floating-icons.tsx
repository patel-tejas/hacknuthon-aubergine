"use client"

import { motion } from "framer-motion"
import { Bitcoin, Brain, Cpu, Database, Network, Zap } from "lucide-react"

export function FloatingIcons() {
  const icons = [
    { Icon: Brain, delay: 0, x: "10%", y: "20%" },
    { Icon: Cpu, delay: 1, x: "80%", y: "15%" },
    { Icon: Database, delay: 2, x: "70%", y: "70%" },
    { Icon: Network, delay: 1.5, x: "20%", y: "80%" },
    { Icon: Bitcoin, delay: 0.5, x: "90%", y: "40%" },
    { Icon: Zap, delay: 2.5, x: "30%", y: "60%" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20"
          initial={{ x: item.x, y: item.y, opacity: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            y: [`calc(${item.y} - 20px)`, `calc(${item.y} + 20px)`, `calc(${item.y} - 20px)`],
          }}
          transition={{
            delay: item.delay,
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <item.Icon size={40} />
        </motion.div>
      ))}
    </div>
  )
}

