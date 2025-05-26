# ✂️ Rocha Barber - Sistema de Agendamentos Inteligente

Um sistema completo para barbearias que desejam elevar sua organização, atendimento e fidelização de clientes com planos mensais e gestão facilitada.

---

## 📌 Visão Geral

O **Rocha Barber** é uma plataforma moderna e responsiva de agendamentos online, pensada para facilitar o dia a dia da barbearia, melhorar a experiência dos clientes e oferecer um painel administrativo completo.

### 🔑 Principais Recursos

* Agendamento de serviços online
* Planos mensais com controle de uso
* Gerenciamento de dias e horários de funcionamento
* Painel administrativo seguro
* Interface responsiva (mobile-first)

---

## ⚙️ Funcionalidades Detalhadas

### 🗓️ Agendamento de Serviços

* Escolha do serviço desejado
* Seleção de data e horário disponíveis
* Verificação automática de disponibilidade
* Suporte a planos mensais e agendamentos avulsos
* Interface intuitiva e adaptável a todos os dispositivos

### 💈 Planos Mensais

* Assinatura com **4 cortes mensais** por R\$ 120,00
* Renovação automática ao fim de cada mês
* Histórico de uso por até **12 meses**
* Visualização clara dos cortes disponíveis e utilizados
* **Atenção**: o nome usado nos agendamentos deve ser digitado exatamente igual para que o sistema reconheça o plano

### 📊 Painel Administrativo

* Gerenciamento completo dos agendamentos
* Configuração de dias e horários de funcionamento
* Monitoramento do uso dos planos mensais
* Exportação e importação de dados
* Autenticação segura de administradores

---

## 🧠 Armazenamento de Dados

### localStorage (uso principal)

* `appointments`: agendamentos
* `clientPlans`: planos ativos
* `workingDays`: dias disponíveis
* `timeSlots`: horários liberados

### IndexedDB (backup persistente)

* Banco de dados: `barberShopDB`
* Store: `data`
* Chaves utilizadas: `appointments`, `clientPlans`, `workingDays`, `timeSlots`

---

## 💻 Tecnologias Utilizadas

* **Frontend**: React + Vite
* **Estilização**: TailwindCSS
* **Armazenamento**: localStorage + IndexedDB
* **Deploy**: Vercel

---

## 🚀 Melhorias Implementadas

### ✅ Verificação de Disponibilidade

* Filtro automático por dias de funcionamento
* Alertas claros para datas indisponíveis

### 📅 Organização de Horários

* Exibição ordenada dos horários disponíveis
* Interface clean e intuitiva

### 🧼 Modal de Exclusão

* Confirmação com detalhes do agendamento
* Estilo moderno com gradiente e animação
* Prevenção de exclusões acidentais

### 🧠 Inteligência nos Planos

* Renovação mensal automática
* Reversão automática em caso de cancelamento
* Histórico detalhado para o cliente

### 📱 Design Mobile-First

* Totalmente adaptável a celulares
* UX fluido e moderno em qualquer tela

### ❓ FAQ Integrado

* Dúvidas comuns respondidas de forma clara
* Orientações sobre o plano mensal e funcionamento

---

## 🌐 Implantação no Vercel

### Como publicar:

1. Faça um **fork** do repositório no GitHub
2. Conecte o repositório à sua conta Vercel
3. O projeto já possui o `vercel.json` configurado para:

   * Framework: **Vite**
   * Comando de build: `npm run build`
   * Diretório de saída: `dist`
   * Configurações para SPA

Após o deploy, seu sistema estará ativo com domínio próprio da Vercel.

---

## 🧪 Ambiente de Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Visualizar build
npm run preview
```

---

## 🔐 Acesso ao Painel Administrativo

* URL: `/admin`
* Usuário: `admin`
* Senha: `barber2024`

---

## ❓ Perguntas Frequentes (FAQ)

### Como faço um agendamento?

Clique em “**Agende seu horário**”, informe seu nome, selecione o serviço, escolha a data e o horário disponíveis. Após isso, você receberá a confirmação do agendamento.

### O que é o plano mensal?

Plano exclusivo com **4 cortes por mês por R\$ 120,00**, ideal para quem mantém o estilo sempre em dia. Os cortes renovam a cada mês automaticamente.

### Preciso usar o mesmo nome sempre?

Sim. Para que o sistema reconheça seu plano corretamente, **o nome informado deve ser sempre o mesmo**.

### Posso cancelar ou remarcar?

Sim. Entre em contato pelo WhatsApp com pelo menos **2 horas de antecedência**. Se tiver um plano mensal, o corte cancelado **retorna ao seu saldo**.

### Quais os horários de funcionamento?

Segunda a sexta-feira, das **8h às 18h**. A barbearia **não abre aos fins de semana**.

---

## 🔒 Segurança e Boas Práticas

* Autenticação de administrador com hash
* Validação de dados em tempo real
* Sanitização de entradas do usuário
* Confirmação para ações críticas (como exclusão de agendamentos)
