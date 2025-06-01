"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
import { getCamps } from "@/lib/api"
import type { Camp } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function UserLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [camps, setCamps] = useState<Camp[]>([])
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const campsData = await getCamps()
        setCamps(campsData)
      } catch (error) {
        console.error("Error fetching camps:", error)
      }
    }

    fetchCamps()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn(formData.email, formData.password)

      if (result.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back to FloodAid.",
        })
        router.push("/user/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: result.error?.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
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
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/user/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Sign in to access your FloodAid account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email address</Label>
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

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Volunteer: alice@example.com / password123</div>
                  <div>Refugee: bob@example.com / password123</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Camps</CardTitle>
              <CardDescription>Current status of relief camps</CardDescription>
            </CardHeader>
            <CardContent>
              {camps.length > 0 ? (
                <div className="space-y-4">
                  {camps.map((camp) => (
                    <div key={camp.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{camp.name}</h4>
                          <p className="text-sm text-gray-600">{camp.location}</p>
                        </div>
                        <Badge variant={camp.current_occupancy >= camp.capacity ? "destructive" : "default"}>
                          {camp.current_occupancy >= camp.capacity ? "Full" : "Available"}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Capacity: </span>
                        <span className={camp.current_occupancy >= camp.capacity ? "text-red-600" : "text-green-600"}>
                          {camp.current_occupancy}/{camp.capacity}
                        </span>
                        {camp.current_occupancy < camp.capacity && (
                          <span className="text-green-600 ml-1">
                            ({camp.capacity - camp.current_occupancy} spaces available)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Loading camps...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
