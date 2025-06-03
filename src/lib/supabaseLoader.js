// Arquivo para garantir que o Supabase seja carregado antes de qualquer componente
import { supabaseClient } from './supabaseClient';

// Exporta o cliente para uso global
window.supabaseClient = supabaseClient;

// Exporta para uso em módulos
export { supabaseClient };