"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, MapPin, Calendar, Users, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCurrentUser, signOut } from "@/lib/auth"
import { getCampsNeedingVolunteers, getCampsWithAvailability, getUserProfile } from "@/lib/api"
import type { User, Camp, VolunteerProfile, RefugeeProfile } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<VolunteerProfile | RefugeeProfile | null>(null)
  const [camps, setCamps] = useState<Camp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser()

        if (!userData) {
          toast({
            title: "Authentication required",
            description: "Please log in to access this page.",
            variant: "destructive",
          })
          router.push("/user/login")
          return
        }

        setUser(userData)

        // Fetch user profile based on user type
        const profileData = await getUserProfile(userData.id, userData.user_type)
        setProfile(profileData)

        // Fetch camps based on user type
        if (userData.user_type === "volunteer") {
          const campsData = await getCampsNeedingVolunteers()
          setCamps(campsData)
        } else {
          const campsData = await getCampsWithAvailability()
          setCamps(campsData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FloodAid</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.full_name}</span>
              <Badge variant={user.user_type === "volunteer" ? "default" : "secondary"}>
                {user.user_type === "volunteer" ? "Volunteer" : "Refugee"}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.user_type === "volunteer" ? "Volunteer Dashboard" : "Refugee Dashboard"}
          </h1>
          <p className="mt-2 text-gray-600">
            {user.user_type === "volunteer"
              ? "Find opportunities to help in flood rehabilitation efforts"
              : "Access resources and track your assistance requests"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.user_type === "volunteer" ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    Available Opportunities
                  </CardTitle>
                  <CardDescription>Current volunteer opportunities in your area</CardDescription>
                </CardHeader>
                <CardContent>
                  {camps.length > 0 ? (
                    <div className="space-y-3">
                      {camps.map((camp) => (
                        <div key={camp.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{camp.name}</h4>
                          <p className="text-sm text-gray-600">{camp.location}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-500">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              Needs {camp.volunteers_needed - camp.current_volunteers} volunteers
                            </div>
                            <Button size="sm" variant="outline">
                              Volunteer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No volunteer opportunities available at the moment.</p>
                    </div>
                  )}
                  <Button className="w-full mt-4" size="sm">
                    View All Opportunities
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    My Commitments
                  </CardTitle>
                  <CardDescription>Your upcoming volunteer activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900">Cleanup Drive</h4>
                      <p className="text-sm text-blue-700">Tomorrow, 9:00 AM</p>
                      <p className="text-xs text-blue-600">Riverside District</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900">Supply Distribution</h4>
                      <p className="text-sm text-green-700">Friday, 2:00 PM</p>
                      <p className="text-xs text-green-600">Community Center</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    Manage Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Impact Summary
                  </CardTitle>
                  <CardDescription>Your contribution to the cause</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">24</div>
                      <div className="text-sm text-gray-600">Hours Volunteered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-gray-600">Families Helped</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">5</div>
                      <div className="text-sm text-gray-600">Events Participated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Assistance Status
                  </CardTitle>
                  <CardDescription>Current status of your requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900">Emergency Shelter</h4>
                      <p className="text-sm text-green-700">Approved - Room 204</p>
                      <Badge variant="default" className="mt-1 bg-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Food Assistance</h4>
                      <p className="text-sm text-yellow-700">Under Review</p>
                      <Badge variant="secondary" className="mt-1">
                        Pending
                      </Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    Request Additional Help
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Available Camps
                  </CardTitle>
                  <CardDescription>Camps with space available</CardDescription>
                </CardHeader>
                <CardContent>
                  {camps.length > 0 ? (
                    <div className="space-y-3">
                      {camps.map((camp) => (
                        <div key={camp.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{camp.name}</h4>
                          <p className="text-sm text-gray-600">{camp.location}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-green-600">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {camp.capacity - camp.current_occupancy} spaces available
                            </div>
                            <Button size="sm" variant="outline">
                              Request Space
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No camps with availability at the moment.</p>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View All Camps
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Your scheduled meetings and checkups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900">Case Worker Meeting</h4>
                      <p className="text-sm text-blue-700">Today, 3:00 PM</p>
                      <p className="text-xs text-blue-600">Social Services Office</p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-900">Health Checkup</h4>
                      <p className="text-sm text-purple-700">Wednesday, 10:00 AM</p>
                      <p className="text-xs text-purple-600">Community Health Center</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    Manage Appointments
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
