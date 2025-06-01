import { supabase } from "./supabase"
import type { User, Admin } from "./types"

export async function signUp(email: string, password: string, userData: Omit<User, "id" | "created_at">) {
  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.from("users").select("email").eq("email", email)

    if (existingUsers && existingUsers.length > 0) {
      return { success: false, error: { message: "User with this email already exists" } }
    }

    // Insert user data directly into users table
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password, // In production, this should be hashed
        ...userData,
      })
      .select()

    if (error) throw error

    if (data && data.length > 0) {
      const newUser = data[0]

      // Create profile based on user type
      if (userData.user_type === "volunteer") {
        const { error: profileError } = await supabase.from("volunteer_profiles").insert({
          user_id: newUser.id,
          active: true,
        })
        if (profileError) console.warn("Profile creation warning:", profileError)
      } else {
        const { error: profileError } = await supabase.from("refugee_profiles").insert({
          user_id: newUser.id,
          family_size: 1,
        })
        if (profileError) console.warn("Profile creation warning:", profileError)
      }

      return { success: true, user: newUser }
    }

    return { success: false, error: { message: "Failed to create user" } }
  } catch (error) {
    console.error("Error signing up:", error)
    return { success: false, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("password", password) // In production, compare hashed passwords

    if (error) {
      console.error("Database error:", error)
      return { success: false, error: { message: "Database error occurred" } }
    }

    if (data && data.length > 0) {
      const user = data[0]
      // Store user session in localStorage
      localStorage.setItem("userSession", JSON.stringify(user))
      return { success: true, user }
    }

    return { success: false, error: { message: "Invalid email or password" } }
  } catch (error) {
    console.error("Error signing in:", error)
    return { success: false, error: { message: "An unexpected error occurred" } }
  }
}

export async function signOut() {
  try {
    localStorage.removeItem("userSession")
    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error }
  }
}

export async function adminSignIn(email: string, password: string) {
  try {
    // Check if admin exists with provided credentials
    const { data, error } = await supabase.from("admins").select("*").eq("email", email).eq("password", password)

    if (error) {
      console.error("Database error:", error)
      return { success: false, error: "Database error occurred" }
    }

    if (data && data.length > 0) {
      const admin = data[0]
      // Store admin session in localStorage
      localStorage.setItem("adminSession", JSON.stringify(admin))
      return { success: true, admin }
    }

    return { success: false, error: "Invalid admin credentials" }
  } catch (error) {
    console.error("Error signing in as admin:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function adminSignOut() {
  try {
    localStorage.removeItem("adminSession")
    return { success: true }
  } catch (error) {
    console.error("Error signing out admin:", error)
    return { success: false, error }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get user session from localStorage
    const userSession = localStorage.getItem("userSession")
    if (!userSession) return null

    const user = JSON.parse(userSession)

    // Verify user still exists in database
    const { data, error } = await supabase.from("users").select("*").eq("id", user.id)

    if (error || !data || data.length === 0) {
      localStorage.removeItem("userSession")
      return null
    }

    return data[0]
  } catch (error) {
    console.error("Error getting current user:", error)
    localStorage.removeItem("userSession")
    return null
  }
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
    // Get admin session from localStorage
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) return null

    const admin = JSON.parse(adminSession)

    // Verify admin still exists in database
    const { data, error } = await supabase.from("admins").select("*").eq("id", admin.id)

    if (error || !data || data.length === 0) {
      localStorage.removeItem("adminSession")
      return null
    }

    return data[0]
  } catch (error) {
    console.error("Error getting current admin:", error)
    localStorage.removeItem("adminSession")
    return null
  }
}
