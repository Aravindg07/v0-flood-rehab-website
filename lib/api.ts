import { supabase } from "./supabase"
import type { Camp, ItemRequest, VolunteerProfile, RefugeeProfile } from "./types"

// Camp related functions
export async function getCamps() {
  try {
    const { data, error } = await supabase.from("camps").select("*").order("name")

    if (error) throw error

    return data as Camp[]
  } catch (error) {
    console.error("Error fetching camps:", error)
    return []
  }
}

export async function getCampById(id: string) {
  try {
    const { data, error } = await supabase.from("camps").select("*").eq("id", id).single()

    if (error) throw error

    return data as Camp
  } catch (error) {
    console.error(`Error fetching camp with id ${id}:`, error)
    return null
  }
}

export async function createCamp(campData: Omit<Camp, "id" | "created_at">) {
  try {
    const { data, error } = await supabase.from("camps").insert(campData).select().single()

    if (error) throw error

    return { success: true, camp: data }
  } catch (error) {
    console.error("Error creating camp:", error)
    return { success: false, error }
  }
}

export async function updateCamp(id: string, campData: Partial<Camp>) {
  try {
    const { data, error } = await supabase.from("camps").update(campData).eq("id", id).select().single()

    if (error) throw error

    return { success: true, camp: data }
  } catch (error) {
    console.error(`Error updating camp with id ${id}:`, error)
    return { success: false, error }
  }
}

// Item request related functions
export async function getItemRequests() {
  try {
    const { data, error } = await supabase
      .from("item_requests")
      .select(`
        *,
        camp:camps(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data as ItemRequest[]
  } catch (error) {
    console.error("Error fetching item requests:", error)
    return []
  }
}

export async function getItemRequestsByCamp(campId: string) {
  try {
    const { data, error } = await supabase
      .from("item_requests")
      .select("*")
      .eq("camp_id", campId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data as ItemRequest[]
  } catch (error) {
    console.error(`Error fetching item requests for camp ${campId}:`, error)
    return []
  }
}

export async function createItemRequest(requestData: Omit<ItemRequest, "id" | "created_at" | "camp">) {
  try {
    const { data, error } = await supabase.from("item_requests").insert(requestData).select().single()

    if (error) throw error

    return { success: true, request: data }
  } catch (error) {
    console.error("Error creating item request:", error)
    return { success: false, error }
  }
}

export async function updateItemRequest(id: string, requestData: Partial<ItemRequest>) {
  try {
    const { data, error } = await supabase.from("item_requests").update(requestData).eq("id", id).select().single()

    if (error) throw error

    return { success: true, request: data }
  } catch (error) {
    console.error(`Error updating item request with id ${id}:`, error)
    return { success: false, error }
  }
}

// User related functions
export async function getUserProfile(userId: string, userType: "volunteer" | "refugee") {
  try {
    const tableName = userType === "volunteer" ? "volunteer_profiles" : "refugee_profiles"

    const { data, error } = await supabase.from(tableName).select("*").eq("user_id", userId).single()

    if (error) throw error

    return data as VolunteerProfile | RefugeeProfile
  } catch (error) {
    console.error(`Error fetching ${userType} profile for user ${userId}:`, error)
    return null
  }
}

export async function updateUserProfile(
  userId: string,
  userType: "volunteer" | "refugee",
  profileData: Partial<VolunteerProfile | RefugeeProfile>,
) {
  try {
    const tableName = userType === "volunteer" ? "volunteer_profiles" : "refugee_profiles"

    const { data, error } = await supabase.from(tableName).update(profileData).eq("user_id", userId).select().single()

    if (error) throw error

    return { success: true, profile: data }
  } catch (error) {
    console.error(`Error updating ${userType} profile for user ${userId}:`, error)
    return { success: false, error }
  }
}

// Get camps that need volunteers
export async function getCampsNeedingVolunteers() {
  try {
    const { data, error } = await supabase
      .from("camps")
      .select("*")
      .lt("current_volunteers", "volunteers_needed")
      .eq("status", "active")
      .order("name")

    if (error) throw error

    return data as Camp[]
  } catch (error) {
    console.error("Error fetching camps needing volunteers:", error)
    return []
  }
}

// Get camps with availability for refugees
export async function getCampsWithAvailability() {
  try {
    const { data, error } = await supabase
      .from("camps")
      .select("*")
      .lt("current_occupancy", "capacity")
      .eq("status", "active")
      .order("name")

    if (error) throw error

    return data as Camp[]
  } catch (error) {
    console.error("Error fetching camps with availability:", error)
    return []
  }
}
