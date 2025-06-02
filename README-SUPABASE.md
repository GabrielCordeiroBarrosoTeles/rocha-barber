# Migração para Supabase

Este documento explica como configurar o Supabase para o sistema de agendamento da barbearia.

## Passo 1: Criar uma conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Anote a URL do projeto e a chave anônima (anon key)

## Passo 2: Configurar o banco de dados

1. No painel do Supabase, vá para "SQL Editor"
2. Copie e cole o conteúdo do arquivo `supabase-schema.sql` 
3. Execute o script para criar a tabela e configurar as políticas de segurança

## Passo 3: Configurar as variáveis de ambiente

1. Edite o arquivo `.env.local` na raiz do projeto
2. Substitua os valores das variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

## Passo 4: Migrar dados existentes

Ao iniciar o aplicativo pela primeira vez após a configuração, os dados existentes no localStorage serão automaticamente migrados para o Supabase.

Você também pode forçar a migração executando a seguinte função no console do navegador:

```javascript
import { migrateLocalDataToSupabase } from './lib/database';
migrateLocalDataToSupabase();
```

## Segurança

Por padrão, a configuração permite acesso anônimo aos dados. Em um ambiente de produção, você deve considerar:

1. Implementar autenticação de usuários
2. Restringir as políticas RLS para permitir apenas usuários autenticados
3. Adicionar criptografia para dados sensíveis

## Estrutura de dados

Os dados são armazenados na tabela `app_data` com a seguinte estrutura:

- `key`: Identificador único (appointments, clientPlans, workingDays, timeSlots)
- `data`: Objeto JSON contendo os dados
- `created_at`: Data de criação
- `updated_at`: Data da última atualização