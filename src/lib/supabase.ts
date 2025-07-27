import { createClient } from '@supabase/supabase-js'

// These would be your actual Supabase project credentials
// For demo purposes, using placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data for demo purposes
export const mockCryptoPrices = {
  BTC: { price: 43250.30, change: 1234.50, change_percentage: 2.95 },
  ETH: { price: 2650.80, change: -125.40, change_percentage: -4.52 },
  ADA: { price: 0.485, change: 0.025, change_percentage: 5.43 },
  SOL: { price: 98.75, change: 4.20, change_percentage: 4.45 },
  DOT: { price: 7.32, change: -0.15, change_percentage: -2.01 },
  LINK: { price: 15.67, change: 0.89, change_percentage: 6.02 }
}

export const mockUser = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User'
}