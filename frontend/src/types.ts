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
  service_name: string
  business_name: string
  category: string
}

export interface Review {
  id: number
  author: string
  service_name: string
  rating: number
  content: string
  image: string
  created_at: string
}

export interface ProDetail extends Pro {
  service_id: number | null
  reviews: Review[]
}

export interface RoomQuote {
  service_name: string
  price: number
  pro_id: number
}

export interface RoomDetail {
  id: number
  partner_name: string
  quote: RoomQuote | null
  created_at: string
}

export interface Post {
  id: number
  title: string
  body: string
  region: string
  likes: number
  comments: number
  image: string
}

export interface Portfolio {
  id: number
  title: string
  region: string
  images: string[]
  business_name: string
}

export interface Bundle {
  caption: string
  title: string
  label: string
  image: string
}

export interface Magazine {
  badge: string
  title: string
  body: string
  views: string
  image: string
  bg_color: string
}

export interface CuratedSection {
  title: string
  services: Service[]
}

export interface Dashboard {
  location: string
  categories: Category[]
  banners: Banner[]
  review_highlights: Portfolio[]
  today_pros: Pro[]
  bundles: Bundle[]
  portfolios: Portfolio[]
  posts: Post[]
  curated_sections: CuratedSection[]
  magazine: Magazine[]
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
