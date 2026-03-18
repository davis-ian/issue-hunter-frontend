export interface SearchProfile {
  id: number
  name: string
  description: string
  labels: string
  languages: string
  query: string
  intervalMinutes: number
  enabled: boolean
  priority: number
  createdAt: string
  updatedAt: string
  lastPolledAt?: string | null
  nextRunAfter?: string | null
  lastResultCount: number
  lastError: string
}

export interface SearchProfilePayload {
  name: string
  description: string
  labels: string
  languages: string
  query: string
  intervalMinutes: number
  enabled: boolean
  priority: number
}
