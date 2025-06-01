"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { adminSignIn } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

export default function AdminLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await adminSignIn(formData.email, formData.password)

      if (result.success) {
        toast({
          title: "Admin login successful!",
          description: "Welcome to the admin dashboard.",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: typeof result.error === "string" ? result.error : "Invalid admin credentials. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Admin login error:", error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">FloodAid</span>
        </Link>
        <div className="flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Admin Access</h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">Authorized personnel only</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800">Administrator Login</CardTitle>
            <CardDescription className="text-red-600">
              This area is restricted to authorized administrators only
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-900 mb-2">Demo Admin Credentials:</h4>
              <div className="text-xs text-red-700">
                Email: admin@floodaid.com
                <br />
                Password: admin123
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to main site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
