import { createClient } from '@supabase/supabase-js'

// 🔥 REEMPLAZA CON TUS CREDENCIALES
const supabaseUrl = 'https://exdricytzylemlozaack.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZHJpY3l0enlsZW1sb3phYWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODg0MjAsImV4cCI6MjA3NzM2NDQyMH0.CWN3xvvDLzoLBA3Yy4FL4qCsu9lKGRK5t9DtxvYZTP4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)