// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Valores fixos para produção
const supabaseUrl = 'https://nbwyzcpxzuixmxgecilb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id3l6Y3B4enVpeG14Z2VjaWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDkwOTcsImV4cCI6MjA2Mzg4NTA5N30.SjSSFQ9ZGfvHoTGSHkqxudLLlPH8m0vBGefUK8ef9IM';

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);