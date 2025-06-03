// Arquivo para inicialização direta do Supabase
import { createClient } from '@supabase/supabase-js';

// Usa as variáveis globais definidas no HTML ou valores fixos como fallback
const supabaseUrl = window.SUPABASE_URL || 'https://nbwyzcpxzuixmxgecilb.supabase.co';
const supabaseKey = window.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id3l6Y3B4enVpeG14Z2VjaWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDkwOTcsImV4cCI6MjA2Mzg4NTA5N30.SjSSFQ9ZGfvHoTGSHkqxudLLlPH8m0vBGefUK8ef9IM';

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase inicializado com URL:', supabaseUrl);