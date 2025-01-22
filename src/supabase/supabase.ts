
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jxnvawcqgjycdwmjrtcg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bnZhd2NxZ2p5Y2R3bWpydGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTgyMDQsImV4cCI6MjA1MzEzNDIwNH0.SHxfjoc-ANsqCBDsHgyi_01WgqD83ltp9aKseEOTIWo'
export const supabase = createClient(supabaseUrl, supabaseKey)