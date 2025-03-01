import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || 'https://zyscwlksespdrpnrifzm.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5c2N3bGtzZXNwZHJwbnJpZnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjY4NzQsImV4cCI6MjA1NTE0Mjg3NH0.6_oROXE_6Zve-HfQBiHbFpAVJKZNM_JCAl4Uqow9fXo'

console.log('Frontend - Supabase URL:', supabaseUrl)
console.log('Frontend - Supabase Key:', supabaseKey ? 'Set' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required for frontend.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
