// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Usa variáveis de ambiente do Vite (import.meta.env.VITE_*)
// Fallback para valores hardcoded caso as variáveis não estejam definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nbwyzcpxzuixmxgecilb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id3l6Y3B4enVpeG14Z2VjaWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDkwOTcsImV4cCI6MjA2Mzg4NTA5N30.SjSSFQ9ZGfvHoTGSHkqxudLLlPH8m0vBGefUK8ef9IM';

// Valida se as variáveis estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não estão definidas!');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão no arquivo .env');
}

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);