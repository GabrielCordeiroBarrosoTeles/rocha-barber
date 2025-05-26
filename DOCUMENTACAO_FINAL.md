# Documentação do Sistema de Barbearia - Final

## Visão Geral

Este sistema foi desenvolvido para gerenciar agendamentos de uma barbearia, incluindo funcionalidades para:
- Agendamento de serviços
- Gerenciamento de planos mensais
- Configuração de dias e horários de funcionamento
- Painel administrativo

## Estrutura de Armazenamento de Dados

### 1. Armazenamento Local

O sistema utiliza dois métodos de armazenamento:

#### 1.1 localStorage (Principal)
No navegador, os dados são armazenados no localStorage para acesso rápido e confiável:
- `appointments`: Lista de todos os agendamentos
- `clientPlans`: Informações sobre os planos dos clientes
- `workingDays`: Configuração dos dias de funcionamento
- `timeSlots`: Horários disponíveis para agendamento
- `adminAuthenticated`: Status de autenticação do administrador

#### 1.2 IndexedDB (Backup)
Para persistência de longo prazo, os dados são armazenados no IndexedDB como backup:
- Banco de dados: `barberShopDB`
- Store: `data`
- Chaves: `appointments`, `clientPlans`, `workingDays`, `timeSlots`

## Módulos Principais

### 1. Módulo de Agendamentos (`appointments.js`)

Responsável por:
- Gerenciar a criação, leitura e exclusão de agendamentos
- Verificar disponibilidade de horários
- Validar dias de funcionamento

Principais funções:
- `getAppointments()`: Obtém todos os agendamentos
- `addAppointment(appointment)`: Adiciona um novo agendamento
- `removeAppointment(appointmentId)`: Remove um agendamento e restaura o plano se necessário
- `isWorkingDay(date)`: Verifica se uma data é um dia de funcionamento
- `getAvailableTimesForDate(date)`: Obtém horários disponíveis para uma data

### 2. Módulo de Planos (`plans.js`)

Gerencia os planos mensais dos clientes:
- Criação e atualização de planos
- Controle de agendamentos disponíveis
- Histórico de uso
- Renovação automática mensal

Principais funções:
- `getClientPlans()`: Obtém todos os planos de clientes
- `getClientPlan(clientName)`: Obtém o plano de um cliente específico
- `createClientPlan(clientName, planType)`: Cria um novo plano para um cliente
- `updateClientPlan(clientName, appointment)`: Atualiza o plano com um novo agendamento
- `restoreAppointmentToClientPlan(clientName, date, time)`: Restaura um agendamento ao plano quando cancelado e remove do histórico
- `getClientMonthlyStats()`: Obtém estatísticas dos clientes com plano mensal

### 3. Módulo de Banco de Dados (`database.js`)

Gerencia a persistência dos dados:
- Salvar e carregar dados do IndexedDB
- Sincronizar entre localStorage e IndexedDB
- Exportar e importar dados

Principais funções:
- `saveToIndexedDB(key, data)`: Salva dados no IndexedDB
- `loadFromIndexedDB(key)`: Carrega dados do IndexedDB
- `syncData(key, defaultValue)`: Sincroniza dados entre localStorage e IndexedDB
- `saveAndSync(key, data)`: Salva dados tanto no localStorage quanto no IndexedDB
- `exportAllData()`: Exporta todos os dados como arquivo JSON
- `importData(jsonData)`: Importa dados de um arquivo JSON

## Componentes React

### 1. Agendamento (`Agendamento.jsx`)

Permite aos clientes agendar serviços:
- Seleção de serviço
- Escolha de data e horário
- Verificação de disponibilidade
- Uso de plano mensal ou agendamento avulso
- Exibição de cortes restantes para clientes com plano mensal

### 2. Admin (`Admin.jsx`)

Painel administrativo para:
- Visualizar e gerenciar agendamentos
- Configurar dias e horários de funcionamento
- Monitorar planos mensais dos clientes
- Autenticação de administrador

## Melhorias Implementadas

### 1. Correção da Verificação de Dias de Funcionamento
- Implementada verificação direta dos dias de funcionamento usando o localStorage
- Corrigido o problema de sincronização entre a configuração de dias e o input de data
- Adicionado o nome do dia da semana na mensagem de erro para maior clareza
- Configurado sábado como fechado por padrão em todos os lugares

### 2. Organização de Agendamentos
- Agendamentos são ordenados primeiro por data e depois por horário
- Horários disponíveis são exibidos em ordem crescente
- Melhorada a lógica de carregamento para maior confiabilidade

### 3. Modal de Confirmação para Exclusão de Agendamentos
- Design melhorado com gradientes, ícones e animações
- Informações detalhadas sobre o agendamento a ser excluído
- Aviso sobre a restauração de agendamentos ao plano mensal

### 4. Restauração de Agendamentos ao Plano
- Ao excluir um agendamento de plano mensal, o cliente ganha +1 agendamento disponível
- O agendamento é removido do histórico do cliente
- Feedback visual sobre a operação

### 5. Exibição de Cortes Restantes
- Melhorada a exibição de cortes restantes na tela de agendamento
- Adicionada barra de progresso visual
- Exibição clara da quantidade de cortes disponíveis/total

### 6. Persistência de Dados
- Priorizado o uso do localStorage para maior confiabilidade
- Mantido o IndexedDB como backup para persistência de longo prazo
- Implementada lógica de fallback para garantir que os dados sejam sempre salvos

### 7. Renovação Automática de Planos Mensais
- Os planos mensais são renovados automaticamente quando muda o mês
- O histórico do mês anterior é preservado
- Os cortes disponíveis são resetados para o valor máximo do plano

## Implantação no Vercel

Para implantar o sistema no Vercel:

1. Certifique-se de que o repositório está no GitHub
2. Conecte o repositório ao Vercel
3. O arquivo `vercel.json` já está configurado para:
   - Usar o framework Vite
   - Definir o comando de build como `npm run build`
   - Configurar as rotas para SPA (Single Page Application)
   - Definir o diretório de saída como `dist`

4. Após a implantação, o sistema estará disponível no domínio fornecido pelo Vercel

## Considerações de Segurança

- Autenticação de administrador usando hash codificado
- Validação de dados em todas as operações
- Sanitização de entradas do usuário
- Confirmação para operações críticas como exclusão de agendamentos

## Perguntas Frequentes

### Os planos mensais são apagados quando passa o mês?
Não, os planos mensais não são apagados quando muda o mês. O sistema implementa uma renovação automática:

1. Quando um cliente com plano mensal faz um agendamento em um novo mês:
   - O sistema detecta a mudança de mês
   - O histórico do mês anterior é preservado (incluindo agendamentos usados)
   - O contador de agendamentos disponíveis é resetado para o valor máximo (4 cortes)
   - O cliente pode continuar usando o plano sem interrupção

2. O histórico de uso é mantido por até 12 meses, permitindo:
   - Acompanhar o uso do plano ao longo do tempo
   - Verificar agendamentos anteriores
   - Analisar padrões de uso

3. A data de início do plano é atualizada para o mês atual, mantendo o registro atualizado

Esta abordagem garante que os clientes com plano mensal tenham uma experiência contínua, sem necessidade de renovação manual a cada mês.