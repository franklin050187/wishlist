export interface Gift {
  id: number
  title: string
  description: string
  image_url: string
  link: string
  purchased: boolean
  purchaser_name?: string
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  role: 'admin' | 'user' | 'viewer'
  email: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
} 