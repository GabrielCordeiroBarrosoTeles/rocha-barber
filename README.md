# Rocha Barber - Sistema de Agendamentos

Sistema completo de agendamentos para barbearia com gerenciamento de planos mensais, configuração de dias e horários de funcionamento, e painel administrativo.

## Visão Geral

Este sistema foi desenvolvido para gerenciar agendamentos de uma barbearia, incluindo funcionalidades para:
- Agendamento de serviços online
- Gerenciamento de planos mensais
- Configuração de dias e horários de funcionamento
- Painel administrativo
- Design responsivo com foco em mobile-first

## Funcionalidades Principais

### Agendamento de Serviços
- Seleção de serviço
- Escolha de data e horário disponíveis
- Verificação automática de disponibilidade
- Suporte a planos mensais e agendamentos avulsos
- Interface amigável e responsiva

### Planos Mensais
- Plano mensal com direito a 4 cortes por mês
- Renovação automática mensal
- Histórico de uso por até 12 meses
- Visualização de cortes disponíveis/utilizados
- **Importante**: Para usar o plano mensal, o cliente deve digitar seu nome EXATAMENTE da mesma forma em todos os agendamentos

### Painel Administrativo
- Visualização e gerenciamento de agendamentos
- Configuração de dias e horários de funcionamento
- Monitoramento de clientes com plano mensal
- Exportação e importação de dados
- Autenticação segura

## Estrutura de Armazenamento de Dados

### localStorage (Principal)
No navegador, os dados são armazenados no localStorage para acesso rápido:
- `appointments`: Lista de todos os agendamentos
- `clientPlans`: Informações sobre os planos dos clientes
- `workingDays`: Configuração dos dias de funcionamento
- `timeSlots`: Horários disponíveis para agendamento

### IndexedDB (Backup)
Para persistência de longo prazo, os dados são armazenados no IndexedDB:
- Banco de dados: `barberShopDB`
- Store: `data`
- Chaves: `appointments`, `clientPlans`, `workingDays`, `timeSlots`

## Tecnologias Utilizadas

- **Frontend**: React, Vite, TailwindCSS
- **Armazenamento**: localStorage, IndexedDB
- **Implantação**: Vercel

## Melhorias Implementadas

1. **Verificação de Dias de Funcionamento**
   - Verificação precisa dos dias disponíveis para agendamento
   - Configuração de dias de funcionamento pelo administrador
   - Feedback claro sobre dias não disponíveis

2. **Organização de Agendamentos**
   - Ordenação por data e horário
   - Exibição de horários disponíveis em ordem crescente
   - Interface intuitiva para seleção de horários

3. **Modal de Confirmação para Exclusão**
   - Design moderno com gradientes e animações
   - Informações detalhadas sobre o agendamento a ser excluído
   - Confirmação para evitar exclusões acidentais

4. **Planos Mensais Inteligentes**
   - Renovação automática mensal
   - Restauração de agendamentos cancelados ao plano
   - Histórico detalhado de uso

5. **Design Mobile-First**
   - Interface otimizada para dispositivos móveis
   - Experiência de usuário consistente em todos os dispositivos
   - Elementos visuais modernos e responsivos

6. **FAQ Integrado**
   - Seção de perguntas frequentes na página inicial
   - Informações claras sobre funcionamento do sistema
   - Instruções sobre uso do plano mensal

## Implantação no Vercel

Este projeto está configurado para ser implantado no Vercel. Para implantar:

1. Faça o fork deste repositório para sua conta GitHub
2. Conecte o repositório ao Vercel
3. O arquivo `vercel.json` já está configurado para:
   - Usar o framework Vite
   - Definir o comando de build como `npm run build`
   - Configurar as rotas para SPA (Single Page Application)
   - Definir o diretório de saída como `dist`

4. Após a implantação, o sistema estará disponível no domínio fornecido pelo Vercel

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Visualizar build de produção
npm run preview
```

## Acesso ao Painel Administrativo

- URL: `/admin`
- Usuário: `admin`
- Senha: `barber2024`

## Perguntas Frequentes

### Como funciona o agendamento?
Para agendar, basta clicar no botão "Agende seu horário" e preencher o formulário com seu nome, escolher a data e horário disponíveis. Você receberá uma confirmação após concluir o agendamento.

### O que é o plano mensal?
O plano mensal dá direito a 4 cortes por mês por R$ 120,00. É ideal para quem deseja manter o visual sempre em dia com economia. Importante: ao usar o plano mensal, digite seu nome EXATAMENTE da mesma forma em todos os agendamentos para que o sistema reconheça seu plano.

### Os planos mensais são apagados quando passa o mês?
Não, os planos mensais são renovados automaticamente a cada mês. O histórico do mês anterior é preservado e os cortes disponíveis são resetados para o valor máximo (4 cortes). O histórico de uso é mantido por até 12 meses.

### Posso cancelar ou remarcar meu agendamento?
Sim, para cancelar ou remarcar, entre em contato conosco pelo WhatsApp com pelo menos 2 horas de antecedência. Para clientes com plano mensal, o agendamento cancelado será devolvido ao seu saldo de cortes disponíveis.

### Quais são os dias e horários de funcionamento?
Estamos abertos de segunda a sexta-feira, das 8h às 18h. Não abrimos aos sábados e domingos. Os horários disponíveis para agendamento são exibidos no momento da reserva.

## Considerações de Segurança

- Autenticação de administrador usando hash codificado
- Validação de dados em todas as operações
- Sanitização de entradas do usuário
- Confirmação para operações críticas como exclusão de agendamentos