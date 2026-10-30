export interface Profile {
  id: string
  full_name: string
  avatar_url?: string
  phone?: string
  state?: string
  city?: string
  locality?: string
  pin_code?: string
  latitude?: number
  longitude?: number
  role: 'user' | 'admin'
  bio?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}

export interface Product {
  id: string
  owner_id: string
  title: string
  description: string
  category_id: string
  condition: 'new_unopened' | 'like_new' | 'gently_used' | 'used_functional'
  listing_type: 'free' | 'resale' | 'exchange'
  price?: number
  original_price?: number
  brand?: string
  purchase_date?: string
  reason?: string
  state: string
  city: string
  locality: string
  pin_code?: string
  latitude?: number
  longitude?: number
  pickup_preference: 'public_place' | 'gate' | 'arrange_after'
  status: 'active' | 'reserved' | 'completed' | 'deleted'
  is_draft: boolean
  views_count: number
  created_at: string
  updated_at: string
  // Joined
  categories?: Category
  profiles?: Profile
  product_images?: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  is_primary: boolean
  created_at: string
}

export interface Request {
  id: string
  product_id: string
  requester_id: string
  owner_id: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
  // Joined
  products?: Product
  profiles?: Profile
  requester?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products?: Product
}

export interface Conversation {
  id: string
  request_id: string
  created_at: string
  requests?: Request
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message_text: string
  read_at?: string
  created_at: string
  profiles?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  related_entity_id?: string
  related_entity_type?: string
  is_read: boolean
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  target_type: 'product' | 'user'
  target_id: string
  reason: string
  description?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
}

export interface NotificationPreferences {
  id: string
  user_id: string
  email_enabled: boolean
  availability_alerts: boolean
  saved_search_alerts: boolean
  message_emails: boolean
  request_emails: boolean
  digest_frequency: 'immediate' | 'daily' | 'disabled'
  updated_at: string
}

export interface SavedSearch {
  id: string
  user_id: string
  name: string
  search_query?: string
  category_id?: string
  city?: string
  locality?: string
  radius_km: number
  free_only: boolean
  active: boolean
  created_at: string
}

export interface ProductAlertSubscription {
  id: string
  user_id: string
  product_id: string
  active: boolean
  notified_at?: string
  created_at: string
}
