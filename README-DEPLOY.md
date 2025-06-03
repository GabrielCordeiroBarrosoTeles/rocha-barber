# Instruções para Deploy na Vercel

## Configuração de Variáveis de Ambiente

Para garantir que o aplicativo funcione corretamente na Vercel, é necessário configurar as seguintes variáveis de ambiente no painel da Vercel:

1. Acesse o painel do projeto na Vercel
2. Vá para "Settings" > "Environment Variables"
3. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL=https://nbwyzcpxzuixmxgecilb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5id3l6Y3B4enVpeG14Z2VjaWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMDkwOTcsImV4cCI6MjA2Mzg4NTA5N30.SjSSFQ9ZGfvHoTGSHkqxudLLlPH8m0vBGefUK8ef9IM
```

4. Clique em "Save"
5. Redeploy o projeto para aplicar as alterações

## Verificação de Logs

Se ocorrerem problemas, verifique os logs de build e runtime na Vercel para identificar possíveis erros.

## Arquivos de Configuração

Os seguintes arquivos foram configurados para garantir o funcionamento correto do deploy:

- `vercel.json`: Configuração de rotas e variáveis de ambiente
- `.env.production`: Variáveis de ambiente para build de produção
- `vite.config.js`: Configuração do Vite para produção
- `public/_redirects`: Configuração de redirecionamento para SPA

## Solução de Problemas Comuns

### Tela Branca

Se o site estiver exibindo uma tela branca:

1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Verifique se há erros de JavaScript no console do navegador
3. Verifique se o roteamento está funcionando corretamente
4. Verifique se o Supabase está acessível e configurado corretamente

### Erros de Conexão com o Supabase

Se houver erros de conexão com o Supabase:

1. Verifique se as credenciais do Supabase estão corretas
2. Verifique se o projeto do Supabase está ativo
3. Verifique se as políticas de segurança do Supabase permitem acesso da origem do seu site