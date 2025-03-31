'use server'

import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"
import connectDB from "@/db/db"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
const loginSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
})

import adminSchema from "@/db/schema/Admin"

export const adminLogin = async (formData) => {
  try {
    await connectDB()
    
    const rawData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password')
    }

    // Validate input
    const validated = loginSchema.safeParse(rawData)
    if (!validated.success) {
      return { error: "Invalid input format" }
    }

    const { username, email, password } = validated.data

    // Find admin
    const admin = await adminSchema.findOne({ 
      $and: [
        { username },
        { email },
        { account_status: 'active' }
      ]
    }).select('+password_hash')

    if (!admin) {
      return { error: "Invalid credentials or inactive account" }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash)
    if (!isPasswordValid) {
      return { error: "Invalid credentials" }
    }

    // Create JWT
    const token = await new SignJWT({ 
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secretKey)

    // Set HTTP-only cookie
    cookies().set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2 // 2 hours
    })

    // Create audit log entry here (implementation depends on your audit system)

  } catch (error) {
    console.error('Admin login error:', error)
    return { error: "Server error during authentication" }
  }

  redirect('/admin/dashboard')
}