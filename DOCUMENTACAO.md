# Documentação do Sistema de Barbearia

## Visão Geral

Este sistema foi desenvolvido para gerenciar agendamentos de uma barbearia, incluindo funcionalidades para:
- Agendamento de serviços
- Gerenciamento de planos mensais
- Configuração de dias e horários de funcionamento
- Painel administrativo

## Estrutura de Armazenamento de Dados

### 1. Armazenamento Local

O sistema utiliza dois métodos de armazenamento:

#### 1.1 localStorage (Cliente)
No navegador, os dados são armazenados no localStorage para acesso rápido:
- `appointments`: Lista de todos os agendamentos
- `clientPlans`: Informações sobre os planos dos clientes
- `workingDays`: Configuração dos dias de funcionamento
- `timeSlots`: Horários disponíveis para agendamento
- `adminAuthenticated`: Status de autenticação do administrador

#### 1.2 Arquivos JSON (Servidor)
Para persistência e uso no servidor, os dados são armazenados em arquivos JSON na pasta `/data`:
- `appointments.json`: Todos os agendamentos
- `clientPlans.json`: Planos dos clientes
- `workingDays.json`: Configuração de dias de funcionamento
- `timeSlots.json`: Horários disponíveis

### 2. Sincronização

O sistema sincroniza automaticamente os dados entre o localStorage e os arquivos JSON, garantindo que:
- Os dados estejam disponíveis mesmo após o fechamento do navegador
- Possam ser acessados pelo servidor para renderização SSR
- Sejam preservados em backups

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

Principais funções:
- `getClientPlans()`: Obtém todos os planos de clientes
- `getClientPlan(clientName)`: Obtém o plano de um cliente específico
- `createClientPlan(clientName, planType)`: Cria um novo plano para um cliente
- `updateClientPlan(clientName, appointment)`: Atualiza o plano com um novo agendamento
- `restoreAppointmentToClientPlan(clientName)`: Restaura um agendamento ao plano quando cancelado
- `getClientMonthlyStats()`: Obtém estatísticas dos clientes com plano mensal

### 3. Módulo de Banco de Dados (`database.js`)

Gerencia a persistência dos dados:
- Salvar e carregar dados de arquivos JSON
- Sincronizar entre localStorage e arquivos

Principais funções:
- `saveData(filename, data)`: Salva dados em arquivo JSON
- `loadData(filename, defaultValue)`: Carrega dados de arquivo JSON
- `syncData(key, defaultValue)`: Sincroniza dados entre localStorage e arquivos
- `saveAndSync(key, data)`: Salva dados tanto no localStorage quanto em arquivo

### 4. Módulo de API (`api.js`)

Fornece funções para integração com o servidor:
- Inicialização do banco de dados
- Sincronização de dados
- Exportação e importação de backups

Principais funções:
- `initializeDatabase()`: Inicializa o banco de dados no servidor
- `syncWithServer()`: Sincroniza dados do localStorage com o servidor
- `exportAllData()`: Exporta todos os dados como JSON
- `importData(jsonData)`: Importa dados de um arquivo JSON

## Componentes React

### 1. Agendamento (`Agendamento.jsx`)

Permite aos clientes agendar serviços:
- Seleção de serviço
- Escolha de data e horário
- Verificação de disponibilidade
- Uso de plano mensal ou agendamento avulso

### 2. Admin (`Admin.jsx`)

Painel administrativo para:
- Visualizar e gerenciar agendamentos
- Configurar dias e horários de funcionamento
- Monitorar planos mensais dos clientes
- Autenticação de administrador

## Fluxos Principais

### 1. Agendamento de Serviço

1. Cliente seleciona um serviço
2. Preenche nome e escolhe tipo de agendamento (avulso ou plano mensal)
3. Seleciona data e horário disponíveis
4. Sistema verifica disponibilidade e valida o dia de funcionamento
5. Agendamento é registrado e, se for plano mensal, atualiza o contador do cliente

### 2. Cancelamento de Agendamento

1. Administrador acessa o painel administrativo
2. Localiza o agendamento na lista
3. Clica em "Excluir"
4. Confirma a exclusão no modal de confirmação
5. Sistema remove o agendamento e, se for de plano mensal, restaura o agendamento ao plano do cliente

### 3. Configuração de Dias de Funcionamento

1. Administrador acessa a aba "Configurações"
2. Clica nos dias para alternar entre aberto/fechado
3. Sistema salva as configurações e as utiliza para validar agendamentos

## Implantação no Vercel

Para implantar o sistema no Vercel:

1. Certifique-se de que o repositório está no GitHub
2. Conecte o repositório ao Vercel
3. Configure as variáveis de ambiente necessárias
4. Defina o comando de build como `npm run build`
5. Defina o diretório de saída como `dist`

O sistema está preparado para funcionar no Vercel com:
- Armazenamento de dados em arquivos JSON
- Sincronização entre cliente e servidor
- Renderização do lado do servidor (SSR) quando necessário

## Backup e Restauração

O sistema permite:
- Exportar todos os dados como arquivo JSON
- Importar dados de um arquivo JSON de backup
- Manter histórico de uso dos planos mensais

Para fazer backup manualmente, use a função `exportAllData()` no console do navegador ou adicione um botão no painel administrativo.

## Considerações de Segurança

- Autenticação de administrador usando hash codificado
- Validação de dados em todas as operações
- Sanitização de entradas do usuário
- Confirmação para operações críticas como exclusão de agendamentos