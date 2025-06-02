import { createClient } from '@supabase/supabase-js';
import { 
  getClientPlan as getClientPlanFromDB, 
  createClientPlan as createClientPlanInDB, 
  updateClientPlan as updateClientPlanInDB, 
  getOrCreateClient 
} from './database';

// Configuração do Supabase - usando import.meta.env para Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializa o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Definição dos planos disponíveis
export const PLANS = {
  MONTHLY: 'monthly',
  SINGLE: 'single'
};

// Configurações dos planos
export const PLAN_CONFIG = {
  [PLANS.MONTHLY]: {
    name: 'Plano Mensal',
    description: 'Direito a 4 cortes por mês',
    maxAppointments: 4,
    price: 'R$ 120,00',
  },
  [PLANS.SINGLE]: {
    name: 'Avulso',
    description: 'Agendamento único',
    maxAppointments: 1,
    price: null, // Preço definido pelo serviço
  }
};

// Funções para gerenciar os planos dos clientes
export async function getClientPlans() {
  // Implementar busca de todos os planos no Supabase
  const { data, error } = await supabase
    .from('client_plans')
    .select(`
      id, plan_type, remaining_appointments, month, year,
      clients (id, name)
    `);
  
  if (error) {
    console.error('Erro ao buscar planos:', error);
    return {};
  }
  
  // Formata os dados para o formato esperado pelo frontend
  const plans = {};
  data.forEach(plan => {
    if (plan.clients) {
      plans[plan.clients.name] = {
        type: plan.plan_type,
        remainingAppointments: plan.remaining_appointments,
        month: plan.month,
        year: plan.year
      };
    }
  });
  
  return plans;
}

export async function getClientPlan(clientName) {
  try {
    console.log("getClientPlan chamado para:", clientName);
    
    // Busca o cliente pelo nome
    const client = await getOrCreateClient(clientName);
    console.log("Cliente encontrado:", client);
    
    if (!client) return null;
    
    // Busca o plano do cliente
    const plan = await getClientPlanFromDB(client.id);
    console.log("Plano encontrado:", plan);
    
    // Se encontrou um plano, formata para o formato esperado pelo frontend
    if (plan) {
      // Para planos mensais, sempre retornar 4 cortes disponíveis
      if (plan.plan_type === PLANS.MONTHLY) {
        const maxAppointments = PLAN_CONFIG[PLANS.MONTHLY].maxAppointments;
        
        return {
          id: plan.id,
          type: plan.plan_type,
          remainingAppointments: maxAppointments, // Sempre 4 cortes disponíveis
          month: plan.month,
          year: plan.year,
          clientId: client.id
        };
      }
      
      // Para outros tipos de plano, retorna o valor do banco
      return {
        id: plan.id,
        type: plan.plan_type,
        remainingAppointments: plan.remaining_appointments,
        month: plan.month,
        year: plan.year,
        clientId: client.id
      };
    }
    
    return null;
  } catch (error) {
    console.error("Erro em getClientPlan:", error);
    return null;
  }
}

export async function createClientPlan(clientName, planType) {
  // Busca ou cria o cliente
  const client = await getOrCreateClient(clientName);
  if (!client) return null;
  
  // Cria o plano
  return await createClientPlanInDB(client.id, planType);
}

export async function updateClientPlan(clientName, appointment) {
  // Esta função não é mais usada diretamente para agendamentos
  // A lógica foi movida para a função addAppointment em appointments.js
  return true;
}

// Função para adicionar um agendamento de volta ao plano quando um agendamento é cancelado
export async function restoreAppointmentToClientPlan(clientName, appointmentDate, appointmentTime) {
  if (!clientName) return false;
  
  // Busca o cliente pelo nome
  const client = await getOrCreateClient(clientName);
  if (!client) return false;
  
  // Busca o plano do cliente
  const plan = await getClientPlanFromDB(client.id);
  if (!plan || plan.plan_type !== PLANS.MONTHLY) {
    return false;
  }
  
  // Incrementa o contador de agendamentos restantes
  await updateClientPlanInDB(plan.id, plan.remaining_appointments + 1);
  
  return true;
}

export async function getClientMonthlyStats() {
  try {
    // Busca todos os clientes com planos mensais
    const { data: plansData, error: plansError } = await supabase
      .from('client_plans')
      .select(`
        id, plan_type, remaining_appointments, month, year, created_at,
        clients (id, name)
      `)
      .eq('plan_type', PLANS.MONTHLY);
    
    if (plansError) {
      console.error('Erro ao buscar estatísticas:', plansError);
      return [];
    }
    
    // Busca todos os agendamentos
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('id, client_id, date, time, service, client_plan_id, plan_type')
      .order('date', { ascending: true });
    
    if (appointmentsError) {
      console.error('Erro ao buscar agendamentos:', appointmentsError);
    }
    
    // Também busca agendamentos do localStorage para garantir que temos os mais recentes
    const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Formata os dados para o formato esperado pelo frontend
    return plansData.map(plan => {
      // Filtrar agendamentos deste plano do Supabase
      const clientAppointmentsFromDB = appointmentsData
        ?.filter(app => app.client_plan_id === plan.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date)) || [];
      
      // Filtrar agendamentos deste plano do localStorage
      const clientAppointmentsFromLocal = localAppointments
        .filter(app => app.planType === 'monthly' && 
                      app.name === plan.clients?.name)
        .map(app => ({
          id: app.id,
          client_id: plan.clients?.id,
          date: app.date,
          time: app.time,
          service: app.service,
          client_plan_id: plan.id,
          plan_type: 'monthly'
        }));
      
      // Combinar agendamentos de ambas as fontes, removendo duplicados
      const allAppointments = [...clientAppointmentsFromDB];
      clientAppointmentsFromLocal.forEach(localApp => {
        if (!allAppointments.some(dbApp => dbApp.id === localApp.id)) {
          allAppointments.push(localApp);
        }
      });
      
      // Ordenar por data
      const clientAppointments = allAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Encontrar o primeiro agendamento deste plano
      const firstAppointment = clientAppointments.length > 0 ? clientAppointments[0] : null;
      
      // Calcular dias restantes no plano
      const today = new Date();
      let daysLeft = 0;
      
      if (firstAppointment) {
        // Usar a data do primeiro agendamento como referência
        const firstDate = new Date(firstAppointment.date);
        
        // Adicionar 30 dias à data do primeiro agendamento
        const expiryDate = new Date(firstDate);
        expiryDate.setDate(firstDate.getDate() + 30);
        
        // Calcular dias restantes
        const timeDiff = expiryDate.getTime() - today.getTime();
        daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // Se for negativo, não há mais dias restantes
        if (daysLeft < 0) daysLeft = 0;
      }
      
      // Formatar os agendamentos para exibição
      const formattedAppointments = clientAppointments.map(app => ({
        id: app.id,
        date: app.date,
        time: app.time,
        service: app.service
      }));
      
      // Usar o número real de agendamentos
      const usedAppointments = clientAppointments.length;
      
      // Calcular cortes restantes com base no total menos os usados
      const remaining = PLAN_CONFIG[PLANS.MONTHLY].maxAppointments - usedAppointments;
      
      return {
        id: plan.id,
        name: plan.clients?.name || 'Cliente desconhecido',
        clientId: plan.clients?.id,
        used: usedAppointments,
        remaining: remaining >= 0 ? remaining : 0, // Garantir que não seja negativo
        total: PLAN_CONFIG[PLANS.MONTHLY].maxAppointments,
        month: plan.month,
        year: plan.year,
        daysLeft: daysLeft,
        firstAppointmentDate: firstAppointment?.date,
        appointments: formattedAppointments
      };
    });
  } catch (error) {
    console.error('Erro ao processar estatísticas de planos mensais:', error);
    return [];
  }
}

// Função para obter o histórico de um cliente específico
export async function getClientHistory(clientName) {
  // Implementar busca de histórico no Supabase
  return [];
}