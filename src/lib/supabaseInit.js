// Arquivo para inicialização do Supabase
console.log('Inicializando Supabase...');

// Importa o cliente Supabase
import { supabase } from './supabase';

// Exporta o cliente para uso em outros arquivos
export { supabase };

// Testa a conexão
supabase.from('clients').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Erro ao testar conexão com Supabase:', error);
    } else {
      console.log('Conexão com Supabase testada com sucesso');
    }
  })
  .catch(err => {
    console.error('Exceção ao testar conexão com Supabase:', err);
  });

// Exporta uma função para verificar a conexão
export function checkSupabaseConnection() {
  return supabase.from('clients').select('count', { count: 'exact', head: true });
}