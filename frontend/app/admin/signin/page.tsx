"use client"

import { useActionState, useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { toast } from "react-hot-toast"
import Link from "next/link"
import {adminLogin} from "@/actions/admin.actions"

export default function AdminSignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [state, formAction] = useActionState(adminLogin, null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            const result = await adminLogin(formData)
            if (result?.error) {
                toast.error(result.error)
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
                            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Portal</h1>
                            <p className="text-foreground/70">Secure administrator authentication</p>
                        </div>

                        <form action={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="admin123"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@yourcompany.com"
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
                                {loading ? "Authenticating..." : "Authenticate"}
                            </Button>

                            <div className="text-center text-sm text-foreground/70">
                                Contact <Link href="/support" className="text-primary hover:text-primary/80">
                                    system administrator
                                </Link> for access issues
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}