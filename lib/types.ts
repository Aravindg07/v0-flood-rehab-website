export type UserType = "volunteer" | "refugee"

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  address?: string
  emergency_contact?: string
  user_type: UserType
  created_at?: string
}

export interface VolunteerProfile {
  id: string
  user_id: string
  skills?: string
  availability?: string
  active: boolean
}

export interface RefugeeProfile {
  id: string
  user_id: string
  family_size: number
  situation?: string
  needs?: string
}

export interface Admin {
  id: string
  email: string
  full_name: string
}

export interface Camp {
  id: string
  name: string
  location: string
  capacity: number
  current_occupancy: number
  volunteers_needed: number
  current_volunteers: number
  description?: string
  facilities?: string
  contact_person?: string
  contact_phone?: string
  status: "active" | "full" | "closed"
  created_at?: string
}

export interface ItemRequest {
  id: string
  camp_id: string
  item_name: string
  quantity_needed: number
  priority: "low" | "medium" | "high" | "urgent"
  description?: string
  status: "pending" | "approved" | "fulfilled"
  requested_by?: string
  created_at?: string
  camp?: Camp
}

export interface CampAssignment {
  id: string
  camp_id: string
  user_id: string
  status: "assigned" | "pending" | "left"
  created_at?: string
  camp?: Camp
}

export interface VolunteerAssignment {
  id: string
  camp_id: string
  user_id: string
  role?: string
  status: "active" | "inactive"
  created_at?: string
  camp?: Camp
}
