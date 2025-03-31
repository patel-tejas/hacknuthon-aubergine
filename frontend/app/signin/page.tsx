"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useUser } from "@/context/UserContext"  // Import the user context

export default function SignIn() {
  const router = useRouter()
  const { login } = useUser() // Get the login function from context
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Inline signIn function using axios
  const signIn = async (formData) => {
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    try {
      // Use the /api/signin endpoint
      const response = await axios.post('/api/signin', data)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.data.error }
      }
      return { error: "Something went wrong" }
    }
  }

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const result = await signIn(formData)
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.token) {
        // Store token in localStorage
        localStorage.setItem('token', result.token)
        // Call the login function from context
        login(result.token)
        toast.success("Signed in successfully!")
        // Use context login function to store token and update user info
        router.push('/transactions')
      }
    } catch (error) {
      toast.error("Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AnimatedGradientBackground />
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-screen">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-background/60 backdrop-blur-md border border-border rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
              <p className="text-foreground/70">Sign in to your account</p>
            </div>

            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="flex items-center justify-center space-x-4">
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-primary hover:text-primary/80">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="text-center text-sm text-foreground/70">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:text-primary/80">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
