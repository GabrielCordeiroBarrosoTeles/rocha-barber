// Arquivo de fallback para o Supabase
import { createClient } from '@supabase/supabase-js';

// Valores fixos para produção
const supabaseUrl = 'https://nbwyzcpxzuixmxgecilb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id3l6Y3B4enVpeG14Z2VjaWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDkwOTcsImV4cCI6MjA2Mzg4NTA5N30.SjSSFQ9ZGfvHoTGSHkqxudLLlPH8m0vBGefUK8ef9IM';

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Adiciona ao objeto window para acesso global
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

// Exporta uma função para verificar se o Supabase está funcionando
export function checkSupabase() {
  return supabase ? true : false;
}