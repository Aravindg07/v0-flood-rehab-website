"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, AlertTriangle, BarChart3, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCurrentAdmin, adminSignOut } from "@/lib/auth"
import { getCamps, getItemRequests } from "@/lib/api"
import type { Camp, ItemRequest, Admin } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface Stats {
  totalCamps: number
  activeCamps: number
  totalRequests: number
  urgentRequests: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [camps, setCamps] = useState<Camp[]>([])
  const [itemRequests, setItemRequests] = useState<ItemRequest[]>([])
  const [stats, setStats] = useState<Stats>({
    totalCamps: 0,
    activeCamps: 0,
    totalRequests: 0,
    urgentRequests: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminData = await getCurrentAdmin()

        if (!adminData) {
          toast({
            title: "Authentication required",
            description: "Please log in as an admin to access this page.",
            variant: "destructive",
          })
          router.push("/admin/login")
          return
        }

        setAdmin(adminData)

        // Fetch camps and item requests
        const [campsData, requestsData] = await Promise.all([getCamps(), getItemRequests()])

        setCamps(campsData)
        setItemRequests(requestsData)

        // Calculate stats
        const activeCamps = campsData.filter((camp) => camp.status === "active").length
        const urgentRequests = requestsData.filter(
          (req) => req.priority === "urgent" && req.status === "pending",
        ).length

        setStats({
          totalCamps: campsData.length,
          activeCamps,
          totalRequests: requestsData.length,
          urgentRequests,
        })
      } catch (error) {
        console.error("Error fetching admin data:", error)
        toast({
          title: "Error",
          description: "Failed to load admin dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSignOut = async () => {
    await adminSignOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FloodAid Admin</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {admin.full_name}</span>
              <Badge variant="destructive">Administrator</Badge>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage flood rehabilitation operations and coordinate resources</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/admin/add-camp">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Camp
              </Button>
            </Link>
            <Link href="/admin/request-items">
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Request Items
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Camps</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCamps}</div>
              <p className="text-xs text-muted-foreground">{stats.activeCamps} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Camps</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCamps}</div>
              <p className="text-xs text-muted-foreground">Currently operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Item Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-muted-foreground">Total requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.urgentRequests}</div>
              <p className="text-xs text-muted-foreground">Needs immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Item Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Recent Item Requests
              </CardTitle>
              <CardDescription>Latest requests from camps for supplies and resources</CardDescription>
            </CardHeader>
            <CardContent>
              {itemRequests.length > 0 ? (
                <div className="space-y-4">
                  {itemRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{request.item_name}</h4>
                          <Badge
                            variant={
                              request.priority === "urgent"
                                ? "destructive"
                                : request.priority === "high"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {request.priority}
                          </Badge>
                          <Badge variant="outline">{request.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {request.camp?.name} - {request.camp?.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {request.quantity_needed} |{" "}
                          {request.created_at ? new Date(request.created_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent requests</h3>
                  <p className="text-gray-600">Item requests will appear here when camps submit them.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Camp Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Camp Status Overview
              </CardTitle>
              <CardDescription>Current status of all relief camps</CardDescription>
            </CardHeader>
            <CardContent>
              {camps.length > 0 ? (
                <div className="space-y-4">
                  {camps.map((camp) => (
                    <div key={camp.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{camp.name}</h4>
                        <Badge
                          variant={
                            camp.status === "active" ? "default" : camp.status === "full" ? "destructive" : "secondary"
                          }
                        >
                          {camp.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{camp.location}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Occupancy:</span>
                          <span
                            className={`ml-1 ${camp.current_occupancy >= camp.capacity ? "text-red-600" : "text-green-600"}`}
                          >
                            {camp.current_occupancy}/{camp.capacity}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Volunteers:</span>
                          <span
                            className={`ml-1 ${camp.current_volunteers < camp.volunteers_needed ? "text-orange-600" : "text-green-600"}`}
                          >
                            {camp.current_volunteers}/{camp.volunteers_needed}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No camps found</h3>
                  <p className="text-gray-600">Add camps to start managing relief operations.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
