import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price in Indian Rupees */
export function formatPrice(amount: number | null | undefined, listingType?: string): string {
  if (listingType === 'free' || amount === null || amount === undefined || amount === 0) {
    return 'Free'
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format date in Indian style: 23 Oct 2026 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return format(new Date(dateStr), 'd MMM yyyy')
  } catch {
    return dateStr
  }
}

/** Format relative time */
export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return ''
  }
}

/** Haversine distance in km */
export function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Format distance */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

/** Validate Indian phone number */
export function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, '')
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned)
}

/** Get condition label */
export function conditionLabel(condition: string): string {
  const map: Record<string, string> = {
    new_unopened: 'New & Unopened',
    like_new: 'Like New',
    gently_used: 'Gently Used',
    used_functional: 'Used — Functional',
  }
  return map[condition] || condition
}

/** Get status label */
export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Available',
    reserved: 'Reserved',
    completed: 'Redistributed',
    deleted: 'Removed',
  }
  return map[status] || status
}

/** Pickup preference label */
export function pickupLabel(pref: string): string {
  const map: Record<string, string> = {
    public_place: 'Meet at a public place',
    gate: 'Apartment / community gate',
    arrange_after: 'Arrange details after request acceptance',
  }
  return map[pref] || pref
}

/** Listing type label */
export function listingTypeLabel(type: string): string {
  const map: Record<string, string> = {
    free: 'Free Giveaway',
    resale: 'Low-cost Resale',
    exchange: 'Exchange / Barter',
  }
  return map[type] || type
}

/** Truncate text */
export function truncate(text: string, maxLen = 100): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '...'
}

/** Generate idempotency key */
export function idempotencyKey(parts: (string | number)[]): string {
  return parts.join('_')
}
