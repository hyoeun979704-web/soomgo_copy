export interface User {
  id: number
  email: string
  name: string
  role: 'customer' | 'pro'
}

export interface Category {
  id: number
  name: string
  icon: string
}

export interface Service {
  id: number
  name: string
  image: string
  request_count: number
  category_id: number
}

export interface Banner {
  id: number
  title: string
  subtitle: string
  bg_color: string
}

export interface Pro {
  id: number
  name: string
  intro: string
  region: string
  career_years: number
  rating: number
  review_count: number
  hire_count: number
}

export interface Dashboard {
  categories: Category[]
  banners: Banner[]
  popular_services: Service[]
  recommended_pros: Pro[]
}

export interface Quote {
  id: number
  price: number
  message: string
  created_at: string
  pro: Pro
}

export interface QuoteRequest {
  id: number
  service: Service
  region: string
  schedule: string
  detail: string
  status: string
  created_at: string
  quote_count: number
}

export interface QuoteRequestDetail extends QuoteRequest {
  quotes: Quote[]
}

export interface ChatRoomSummary {
  id: number
  partner_name: string
  last_message: string | null
  last_message_at: string | null
}

export interface Message {
  id: number
  room_id: number
  sender_id: number
  content: string
  created_at: string
}
