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

import { syncData, saveAndSync } from './database';

// Funções para gerenciar os planos dos clientes
export async function getClientPlans() {
  const plans = await syncData('clientPlans', {});
  return plans;
}

export async function saveClientPlans(plans) {
  await saveAndSync('clientPlans', plans);
}

export async function getClientPlan(clientName) {
  const plans = await getClientPlans();
  return plans[clientName] || null;
}

export async function createClientPlan(clientName, planType) {
  const plans = await getClientPlans();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  plans[clientName] = {
    type: planType,
    startDate: new Date().toISOString(),
    month: currentMonth,
    year: currentYear,
    remainingAppointments: PLAN_CONFIG[planType].maxAppointments,
    appointments: []
  };
  
  await saveClientPlans(plans);
  return plans[clientName];
}

export async function updateClientPlan(clientName, appointment) {
  const plans = await getClientPlans();
  
  if (!plans[clientName]) {
    return false;
  }
  
  // Verificar se o plano é do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  if (plans[clientName].month !== currentMonth || plans[clientName].year !== currentYear) {
    // Guardar histórico do mês anterior
    if (!plans[clientName].history) {
      plans[clientName].history = [];
    }
    
    plans[clientName].history.push({
      month: plans[clientName].month,
      year: plans[clientName].year,
      appointments: plans[clientName].appointments,
      used: PLAN_CONFIG[plans[clientName].type].maxAppointments - plans[clientName].remainingAppointments
    });
    
    // Limitar histórico a 12 meses
    if (plans[clientName].history.length > 12) {
      plans[clientName].history.shift();
    }
    
    // Renovar plano para o mês atual - os planos são renovados automaticamente a cada mês
    plans[clientName].month = currentMonth;
    plans[clientName].year = currentYear;
    plans[clientName].remainingAppointments = PLAN_CONFIG[plans[clientName].type].maxAppointments;
    plans[clientName].appointments = [];
    
    // Atualiza a data de início para o mês atual
    plans[clientName].startDate = new Date().toISOString();
  }
  
  // Verificar se ainda tem agendamentos disponíveis
  if (plans[clientName].remainingAppointments <= 0) {
    return false;
  }
  
  // Registrar o agendamento e diminuir o contador
  plans[clientName].appointments.push({
    ...appointment,
    date: appointment.date,
    createdAt: new Date().toISOString()
  });
  plans[clientName].remainingAppointments--;
  
  await saveClientPlans(plans);
  return true;
}

// Função para adicionar um agendamento de volta ao plano quando um agendamento é cancelado
// e remover o agendamento do histórico se necessário
export async function restoreAppointmentToClientPlan(clientName, appointmentDate, appointmentTime) {
  if (!clientName) return false;
  
  const plans = await getClientPlans();
  if (!plans[clientName] || plans[clientName].type !== PLANS.MONTHLY) {
    return false;
  }
  
  // Adiciona +1 ao contador de agendamentos restantes
  plans[clientName].remainingAppointments++;
  
  // Garante que não ultrapasse o máximo permitido
  const maxAppointments = PLAN_CONFIG[plans[clientName].type].maxAppointments;
  if (plans[clientName].remainingAppointments > maxAppointments) {
    plans[clientName].remainingAppointments = maxAppointments;
  }
  
  // Remove o agendamento da lista de agendamentos do cliente
  if (plans[clientName].appointments && plans[clientName].appointments.length > 0) {
    plans[clientName].appointments = plans[clientName].appointments.filter(app => 
      !(app.date === appointmentDate && app.time === appointmentTime)
    );
  }
  
  // Remove o agendamento do histórico se existir
  if (plans[clientName].history && plans[clientName].history.length > 0) {
    plans[clientName].history = plans[clientName].history.map(hist => {
      if (hist.appointments && hist.appointments.length > 0) {
        hist.appointments = hist.appointments.filter(app => 
          !(app.date === appointmentDate && app.time === appointmentTime)
        );
        
        // Atualiza o contador de uso se um agendamento foi removido
        const originalLength = hist.appointments.length;
        const newLength = hist.appointments.length;
        if (originalLength !== newLength) {
          hist.used = Math.max(0, hist.used - 1);
        }
      }
      return hist;
    });
  }
  
  await saveClientPlans(plans);
  return true;
}

export async function getClientMonthlyStats() {
  const plans = await getClientPlans();
  const stats = [];
  
  Object.entries(plans).forEach(([clientName, plan]) => {
    if (plan.type === PLANS.MONTHLY) {
      stats.push({
        name: clientName,
        used: PLAN_CONFIG[PLANS.MONTHLY].maxAppointments - plan.remainingAppointments,
        remaining: plan.remainingAppointments,
        total: PLAN_CONFIG[PLANS.MONTHLY].maxAppointments,
        month: plan.month,
        year: plan.year,
        appointments: plan.appointments || [],
        history: plan.history || []
      });
    }
  });
  
  return stats;
}

// Função para obter o histórico de um cliente específico
export async function getClientHistory(clientName) {
  const plan = await getClientPlan(clientName);
  if (!plan || plan.type !== PLANS.MONTHLY) {
    return [];
  }
  
  return plan.history || [];
}