import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">FloodAid</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/contact">
            Contact
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/user/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/admin/login">
            Admin
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Together We Rebuild
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Join our flood rehabilitation program. Whether you're seeking help or want to volunteer, we're here
                    to connect communities and rebuild lives after natural disasters.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/user/register">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  alt="Flood rehabilitation efforts"
                  className="aspect-video overflow-hidden rounded-xl object-cover"
                  height="400"
                  src="/placeholder.svg?height=400&width=600"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How We Help</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform connects those in need with volunteers and resources for effective flood rehabilitation.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader className="text-center">
                  <Heart className="h-12 w-12 mx-auto text-red-500 mb-4" />
                  <CardTitle>For Refugees</CardTitle>
                  <CardDescription>
                    Access emergency shelter, food, medical aid, and rehabilitation resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Emergency accommodation</li>
                    <li>• Food and water supplies</li>
                    <li>• Medical assistance</li>
                    <li>• Rebuilding support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <CardTitle>For Volunteers</CardTitle>
                  <CardDescription>
                    Join our community of helpers and make a real difference in recovery efforts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Rescue operations</li>
                    <li>• Distribution of supplies</li>
                    <li>• Cleanup activities</li>
                    <li>• Rebuilding projects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                  <CardTitle>Coordination</CardTitle>
                  <CardDescription>Efficient management and coordination of all rehabilitation efforts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Resource allocation</li>
                    <li>• Volunteer coordination</li>
                    <li>• Progress tracking</li>
                    <li>• Impact reporting</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Ready to Make a Difference?
                </h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our community today. Whether you need help or want to help others, every action counts.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/user/register">
                  <Button size="lg" variant="secondary">
                    Join as Volunteer
                  </Button>
                </Link>
                <Link href="/user/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    Request Help
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 FloodAid. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  )
}
