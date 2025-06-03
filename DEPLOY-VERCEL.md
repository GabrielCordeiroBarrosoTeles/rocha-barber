# Instruções para Deploy na Vercel

## Problema: Tela Branca após Deploy

Se você está enfrentando o problema de tela branca após o deploy na Vercel com o erro:
```
Credenciais do Supabase não configuradas
Uncaught Error: supabaseUrl is required.
```

## Solução

1. **Configuração das Variáveis de Ambiente na Vercel**

   Acesse o painel da Vercel e adicione as seguintes variáveis de ambiente:

   ```
   VITE_SUPABASE_URL=https://nbwyzcpxzuixmxgecilb.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id3l6Y3B4enVpeG14Z2VjaWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDkwOTcsImV4cCI6MjA2Mzg4NTA5N30.SjSSFQ9ZGfvHoTGSHkqxudLLlPH8m0vBGefUK8ef9IM
   ```

   Caminho: Projeto na Vercel > Settings > Environment Variables

2. **Redeploy**

   Após adicionar as variáveis, faça um novo deploy do projeto.

## Verificação

Após o deploy, verifique o console do navegador para garantir que não há mais erros relacionados ao Supabase.

## Alternativa (se o problema persistir)

Se mesmo após configurar as variáveis de ambiente o problema persistir, as alterações feitas no código já devem resolver o problema, pois:

1. Criamos um arquivo `supabase.js` com as credenciais fixas
2. Importamos esse arquivo no início da aplicação
3. Garantimos que o cliente Supabase seja inicializado antes de qualquer componente

## Contato

Se precisar de mais ajuda, entre em contato com o desenvolvedor.