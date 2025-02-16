export interface Mentor {
  id: number
  name: string
  role: string
  image: string
  experience?: string
  expertise?: string[]
  hourlyRate?: number
  gender?: string
}

export interface FilterOption {
  label: string
  count: number
}

export interface Filters {
  experienceLevel: FilterOption[]
  expertise: FilterOption[]
  mentorGender: FilterOption[]
  hourlyRate: FilterOption[]
}

