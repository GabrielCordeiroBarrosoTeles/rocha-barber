// src/lib/debug.js
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando import.meta.env para Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Função para verificar a conexão com o Supabase
export async function checkSupabaseConnection() {
  console.log('Verificando conexão com o Supabase...');
  console.log('URL:', SUPABASE_URL);
  console.log('ANON_KEY:', SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada');
  
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Credenciais do Supabase não configuradas corretamente');
      return false;
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Tenta fazer uma consulta simples
    const { data, error } = await supabase
      .from('working_days')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error);
      return false;
    }
    
    console.log('Conexão com o Supabase estabelecida com sucesso!');
    console.log('Dados de exemplo:', data);
    return true;
  } catch (error) {
    console.error('Erro ao inicializar o cliente Supabase:', error);
    return false;
  }
}