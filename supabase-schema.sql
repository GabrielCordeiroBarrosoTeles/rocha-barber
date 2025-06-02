-- Esquema para o banco de dados Supabase
-- Execute este script no SQL Editor do Supabase

-- Tabela para armazenar os dados da aplicação
CREATE TABLE IF NOT EXISTS app_data (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por chave
CREATE INDEX IF NOT EXISTS app_data_key_idx ON app_data (key);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp automaticamente
DROP TRIGGER IF EXISTS update_app_data_updated_at ON app_data;
CREATE TRIGGER update_app_data_updated_at
BEFORE UPDATE ON app_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
-- Habilita RLS na tabela
ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura anônima (ajuste conforme necessário)
CREATE POLICY "Permitir leitura anônima" ON app_data
  FOR SELECT USING (true);

-- Política para permitir inserção anônima (ajuste conforme necessário)
CREATE POLICY "Permitir inserção anônima" ON app_data
  FOR INSERT WITH CHECK (true);

-- Política para permitir atualização anônima (ajuste conforme necessário)
CREATE POLICY "Permitir atualização anônima" ON app_data
  FOR UPDATE USING (true);

-- IMPORTANTE: Em produção, você deve restringir estas políticas
-- para usuários autenticados ou com funções específicas