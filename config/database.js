//config/database.js - Conexión a la base de datos PostgreSQL con Supabase
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cylkxpnemlvpkwkzhlmk.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bGt4cG5lbWx2cGt3a3pobG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNjM5NjgsImV4cCI6MjA0MzgzOTk2OH0.H9n1wII6lfCMm5RYTqr6ycHpcJ5oVVMIxNtirDo2mS0'
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase