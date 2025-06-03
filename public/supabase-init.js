// Script para inicializar o Supabase antes de qualquer código React
(function() {
  // Valores fixos para produção
  const supabaseUrl = 'https://nbwyzcpxzuixmxgecilb.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id3l6Y3B4enVpeG14Z2VjaWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDkwOTcsImV4cCI6MjA2Mzg4NTA5N30.SjSSFQ9ZGfvHoTGSHkqxudLLlPH8m0vBGefUK8ef9IM';

  // Define variáveis globais para uso posterior
  window.SUPABASE_URL = supabaseUrl;
  window.SUPABASE_KEY = supabaseKey;
  
  console.log('Supabase inicializado via script externo');
})();