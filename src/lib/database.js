// src/lib/database.js
import { supabase } from './supabase-direct';

// O cliente supabase já está importado do arquivo supabase.js
// Teste de conexão em segundo plano
setTimeout(() => {
  supabase.from('clients').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.error('Erro ao testar conexão com Supabase:', error);
      } else {
        console.log('Conexão com Supabase testada com sucesso');
      }
    })
    .catch(err => {
      console.error('Exceção ao testar conexão com Supabase:', err);
    });
}, 1000);

export { supabase };

// Função para obter os dias de trabalho
export async function getWorkingDays() {
  try {
    // Primeiro tenta obter do localStorage para garantir resposta rápida
    const localWorkingDays = localStorage.getItem('workingDays');
    if (localWorkingDays) {
      return JSON.parse(localWorkingDays);
    }
    
    // Se não encontrar no localStorage, tenta obter do Supabase
    const { data, error } = await supabase
      .from('working_days')
      .select('*')
      .single();
    
    if (error) {
      console.error('Erro ao obter dias de trabalho:', error);
      // Valores padrão
      const defaultWorkingDays = {
        0: false, // Domingo
        1: true,  // Segunda
        2: true,  // Terça
        3: true,  // Quarta
        4: true,  // Quinta
        5: true,  // Sexta
        6: false  // Sábado
      };
      
      // Salva os valores padrão no localStorage
      localStorage.setItem('workingDays', JSON.stringify(defaultWorkingDays));
      
      return defaultWorkingDays;
    }
    
    // Salva no localStorage para acesso offline
    localStorage.setItem('workingDays', JSON.stringify(data.days));
    
    return data.days;
  } catch (error) {
    console.error('Erro ao obter dias de trabalho:', error);
    // Valores padrão
    const defaultWorkingDays = {
      0: false, // Domingo
      1: true,  // Segunda
      2: true,  // Terça
      3: true,  // Quarta
      4: true,  // Quinta
      5: true,  // Sexta
      6: false  // Sábado
    };
    
    // Salva os valores padrão no localStorage
    localStorage.setItem('workingDays', JSON.stringify(defaultWorkingDays));
    
    return defaultWorkingDays;
  }
}

// Função para atualizar os dias de trabalho
export async function updateWorkingDays(days) {
  try {
    // Salva no localStorage primeiro para garantir acesso offline
    localStorage.setItem('workingDays', JSON.stringify(days));
    
    // Tenta salvar no Supabase
    const { error } = await supabase
      .from('working_days')
      .upsert({ id: 1, days });
    
    if (error) {
      console.error('Erro ao atualizar dias de trabalho no Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar dias de trabalho:', error);
    return false;
  }
}

// Função para obter os horários disponíveis
export async function getTimeSlots() {
  try {
    // Primeiro tenta obter do localStorage para garantir resposta rápida
    const localTimeSlots = localStorage.getItem('timeSlots');
    if (localTimeSlots) {
      return JSON.parse(localTimeSlots);
    }
    
    // Se não encontrar no localStorage, tenta obter do Supabase
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .single();
    
    if (error) {
      console.error('Erro ao obter horários:', error);
      // Valores padrão
      const defaultTimeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30"
      ];
      
      // Salva os valores padrão no localStorage
      localStorage.setItem('timeSlots', JSON.stringify(defaultTimeSlots));
      
      return defaultTimeSlots;
    }
    
    // Salva no localStorage para acesso offline
    localStorage.setItem('timeSlots', JSON.stringify(data.slots));
    
    return data.slots;
  } catch (error) {
    console.error('Erro ao obter horários:', error);
    // Valores padrão
    const defaultTimeSlots = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
      "17:00", "17:30"
    ];
    
    // Salva os valores padrão no localStorage
    localStorage.setItem('timeSlots', JSON.stringify(defaultTimeSlots));
    
    return defaultTimeSlots;
  }
}

// Função para atualizar os horários disponíveis
export async function updateTimeSlots(slots) {
  try {
    // Salva no localStorage primeiro para garantir acesso offline
    localStorage.setItem('timeSlots', JSON.stringify(slots));
    
    // Tenta salvar no Supabase
    const { error } = await supabase
      .from('time_slots')
      .upsert({ id: 1, slots });
    
    if (error) {
      console.error('Erro ao atualizar horários no Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar horários:', error);
    return false;
  }
}

// Função para obter ou criar um cliente pelo nome
export async function getOrCreateClient(name) {
  try {
    if (!name) return null;
    
    // Busca o cliente pelo nome
    const { data: existingClient, error: searchError } = await supabase
      .from('clients')
      .select('*')
      .eq('name', name)
      .single();
    
    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erro ao buscar cliente:', searchError);
      return null;
    }
    
    if (existingClient) {
      return existingClient;
    }
    
    // Cria um novo cliente
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert({ name })
      .select()
      .single();
    
    if (insertError) {
      console.error('Erro ao criar cliente:', insertError);
      return null;
    }
    
    return newClient;
  } catch (error) {
    console.error('Erro ao obter/criar cliente:', error);
    return null;
  }
}

// Função para obter o plano de um cliente
export async function getClientPlan(clientId) {
  try {
    if (!clientId) return null;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    console.log(`Buscando plano para cliente ID ${clientId}, mês ${currentMonth}, ano ${currentYear}`);
    
    // Primeiro tenta buscar o plano do mês atual
    const { data, error } = await supabase
      .from('client_plans')
      .select('*')
      .eq('client_id', clientId)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erro ao buscar plano do cliente:', error);
      // Tenta buscar o plano mais recente do cliente
      const { data: latestPlan, error: latestError } = await supabase
        .from('client_plans')
        .select('*')
        .eq('client_id', clientId)
        .eq('plan_type', 'monthly')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!latestError && latestPlan) {
        console.log('Plano mais recente encontrado:', latestPlan);
        return latestPlan;
      }
      
      return null;
    }
    
    if (data) {
      console.log('Plano encontrado para o mês atual:', data);
      return data;
    }
    
    // Se não encontrou plano para o mês atual, busca o plano mais recente
    console.log('Buscando plano mais recente para o cliente');
    const { data: latestPlan, error: latestError } = await supabase
      .from('client_plans')
      .select('*')
      .eq('client_id', clientId)
      .eq('plan_type', 'monthly')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (latestError && latestError.code !== 'PGRST116') {
      console.error('Erro ao buscar plano mais recente:', latestError);
      return null;
    }
    
    if (latestPlan) {
      console.log('Plano mais recente encontrado:', latestPlan);
      return latestPlan;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter plano do cliente:', error);
    return null;
  }
}

// Função para criar um plano para um cliente
export async function createClientPlan(clientId, planType) {
  try {
    if (!clientId || !planType) {
      console.error('ID do cliente ou tipo de plano não fornecido');
      return {
        id: Date.now(),
        client_id: clientId,
        plan_type: planType,
        remaining_appointments: planType === 'monthly' ? 4 : 1,
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      };
    }
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    console.log(`Criando plano para cliente ID ${clientId}, tipo ${planType}, mês ${currentMonth}, ano ${currentYear}`);
    
    // Define o número de agendamentos com base no tipo de plano
    let remainingAppointments = 1;
    if (planType === 'monthly') {
      remainingAppointments = 4; // Começa com 4 agendamentos disponíveis
    }
    
    // Verifica se já existe um plano para este cliente neste mês
    try {
      const { data: existingPlan, error: checkError } = await supabase
        .from('client_plans')
        .select('*')
        .eq('client_id', clientId)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();
      
      if (!checkError && existingPlan) {
        console.log('Cliente já possui um plano para este mês:', existingPlan);
        return existingPlan;
      }
    } catch (checkErr) {
      console.log('Erro ao verificar plano existente, continuando com criação:', checkErr);
    }
    
    // Cria um novo plano
    try {
      const planData = {
        client_id: clientId,
        plan_type: planType,
        remaining_appointments: remainingAppointments,
        month: currentMonth,
        year: currentYear
      };
      
      const { data, error } = await supabase
        .from('client_plans')
        .insert(planData)
        .select();
      
      if (error) {
        console.error('Erro ao criar plano para cliente:', error);
        // Retorna um objeto de plano mesmo com erro para não interromper o fluxo
        return {
          id: Date.now(),
          ...planData
        };
      }
      
      if (data && data.length > 0) {
        console.log('Novo plano criado com sucesso:', data[0]);
        return data[0];
      } else {
        console.log('Plano criado mas sem dados retornados, usando dados locais');
        return {
          id: Date.now(),
          ...planData
        };
      }
    } catch (insertErr) {
      console.error('Exceção ao inserir plano:', insertErr);
      // Retorna um objeto de plano mesmo com erro para não interromper o fluxo
      return {
        id: Date.now(),
        client_id: clientId,
        plan_type: planType,
        remaining_appointments: remainingAppointments,
        month: currentMonth,
        year: currentYear
      };
    }
  } catch (error) {
    console.error('Erro ao criar plano para cliente:', error);
    // Retorna um objeto de plano mesmo com erro para não interromper o fluxo
    return {
      id: Date.now(),
      client_id: clientId,
      plan_type: planType,
      remaining_appointments: planType === 'monthly' ? 4 : 1,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };
  }
}

// Função para atualizar o plano de um cliente
export async function updateClientPlan(planId, remainingAppointments) {
  try {
    if (!planId) return false;
    
    const { error } = await supabase
      .from('client_plans')
      .update({ remaining_appointments: remainingAppointments })
      .eq('id', planId);
    
    if (error) {
      console.error('Erro ao atualizar plano do cliente:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar plano do cliente:', error);
    return false;
  }
}

// Função para obter todos os agendamentos
export async function getAppointments() {
  try {
    // Primeiro tenta obter do Supabase
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id, date, time, service, created_at, plan_type, phone,
        clients (id, name)
      `)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Erro ao obter agendamentos do Supabase:', error);
      // Tenta recuperar do localStorage como fallback
      const localAppointments = localStorage.getItem('appointments');
      if (localAppointments) {
        return JSON.parse(localAppointments);
      }
      return [];
    }
    
    // Formata os dados para o formato esperado pelo frontend
    const formattedAppointments = data.map(appointment => ({
      id: appointment.id,
      name: appointment.clients?.name || 'Cliente desconhecido',
      date: appointment.date,
      time: appointment.time,
      service: appointment.service,
      planType: appointment.plan_type,
      phone: appointment.phone,
      createdAt: appointment.created_at
    }));
    
    // Salva no localStorage para acesso offline
    localStorage.setItem('appointments', JSON.stringify(formattedAppointments));
    
    return formattedAppointments;
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    // Tenta recuperar do localStorage como fallback
    const localAppointments = localStorage.getItem('appointments');
    if (localAppointments) {
      return JSON.parse(localAppointments);
    }
    return [];
  }
}

// Função para criar um agendamento
export async function createAppointment(clientId, date, time, service, planType, clientPlanId, phone) {
  try {
    if (!clientId || !date || !time || !service) return null;
    
    console.log('Criando agendamento com dados:', {
      client_id: clientId,
      date,
      time,
      service,
      plan_type: planType,
      client_plan_id: clientPlanId,
      phone
    });
    
    // Cria o agendamento no Supabase
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id: clientId,
        date,
        time,
        service,
        plan_type: planType,
        client_plan_id: clientPlanId,
        phone
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar agendamento no Supabase:', error);
      return null;
    }
    
    console.log('Agendamento criado com sucesso no Supabase:', data);
    
    // Atualiza o localStorage
    const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const newAppointment = {
      id: data.id,
      name: '', // Será preenchido depois
      date: data.date,
      time: data.time,
      service: data.service,
      planType: data.plan_type,
      phone: data.phone,
      createdAt: data.created_at
    };
    
    // Busca o nome do cliente
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('name')
        .eq('id', clientId)
        .single();
      
      if (clientData) {
        newAppointment.name = clientData.name;
      }
    } catch (e) {
      console.error('Erro ao buscar nome do cliente:', e);
    }
    
    localAppointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(localAppointments));
    
    return data;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return null;
  }
}

// Função para verificar se um horário está disponível
export async function checkTimeAvailability(date, time) {
  try {
    // Verifica no localStorage primeiro
    const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const isBooked = localAppointments.some(app => app.date === date && app.time === time);
    
    if (isBooked) {
      return false;
    }
    
    // Verifica no Supabase
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time);
    
    if (error) {
      console.error('Erro ao verificar disponibilidade de horário no Supabase:', error);
      return true; // Em caso de erro, assume que está disponível
    }
    
    return data.length === 0;
  } catch (error) {
    console.error('Erro ao verificar disponibilidade de horário:', error);
    return true; // Em caso de erro, assume que está disponível
  }
}

// Função para remover um agendamento
export async function removeAppointment(id) {
  try {
    console.log('Removendo agendamento ID:', id);
    
    // Busca o agendamento para verificar se é de plano mensal
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*, clients(name)')
      .eq('id', id)
      .single();
    
    // Se não encontrou no Supabase, tenta encontrar no localStorage
    let localAppointment = null;
    if (fetchError) {
      console.log('Agendamento não encontrado no Supabase, buscando no localStorage');
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      localAppointment = localAppointments.find(app => app.id === id);
      
      if (!localAppointment) {
        console.error('Agendamento não encontrado nem no Supabase nem no localStorage');
        return false;
      }
    }
    
    const appData = appointment || localAppointment;
    console.log('Agendamento encontrado:', appData);
    
    // Se for um agendamento de plano mensal, restaura o agendamento ao plano
    if (appData && 
        (appData.plan_type === 'monthly' || appData.planType === 'monthly')) {
      try {
        console.log('Agendamento é de plano mensal, restaurando ao plano...');
        
        // Busca o plano atual
        let clientId = appData.client_id;
        let clientName = appData.clients?.name || appData.name;
        
        // Se não temos o client_id mas temos o nome, busca o cliente pelo nome
        if (!clientId && clientName) {
          const { data: clientData } = await supabase
            .from('clients')
            .select('id')
            .eq('name', clientName)
            .single();
          
          if (clientData) {
            clientId = clientData.id;
          }
        }
        
        if (clientId) {
          // Busca o plano atual do cliente
          const { data: plan } = await supabase
            .from('client_plans')
            .select('*')
            .eq('client_id', clientId)
            .eq('plan_type', 'monthly')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (plan) {
            console.log('Plano encontrado:', plan);
            
            // Incrementa o contador de agendamentos restantes
            const newRemainingAppointments = plan.remaining_appointments + 1;
            console.log(`Atualizando agendamentos restantes: ${plan.remaining_appointments} -> ${newRemainingAppointments}`);
            
            // Atualiza o plano
            const { error: updateError } = await supabase
              .from('client_plans')
              .update({ remaining_appointments: newRemainingAppointments })
              .eq('id', plan.id);
            
            if (updateError) {
              console.error('Erro ao restaurar agendamento ao plano:', updateError);
            } else {
              console.log('Plano atualizado com sucesso');
            }
          }
        }
      } catch (e) {
        console.error('Erro ao restaurar agendamento ao plano:', e);
      }
    }
    
    // Remove do Supabase se existir lá
    if (!fetchError) {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao remover agendamento do Supabase:', error);
      } else {
        console.log('Agendamento removido do Supabase com sucesso');
      }
    }
    
    // Remove do localStorage
    const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = localAppointments.filter(app => app.id !== id);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    console.log('Agendamento removido do localStorage com sucesso');
    
    return true;
  } catch (error) {
    console.error('Erro ao remover agendamento:', error);
    return false;
  }
}

// Função para sincronizar dados entre localStorage e Supabase
export async function syncData(key, defaultValue) {
  try {
    // Primeiro tenta obter do localStorage
    const localData = localStorage.getItem(key);
    if (localData) {
      const parsedData = JSON.parse(localData);
      
      // Tenta sincronizar com o Supabase em segundo plano
      if (key === 'workingDays') {
        updateWorkingDays(parsedData).catch(e => console.error('Erro ao sincronizar dias de trabalho:', e));
      } else if (key === 'timeSlots') {
        updateTimeSlots(parsedData).catch(e => console.error('Erro ao sincronizar horários:', e));
      }
      
      return parsedData;
    }
    
    // Se não encontrar no localStorage, usa o valor padrão
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (error) {
    console.error(`Erro ao sincronizar ${key}:`, error);
    return defaultValue;
  }
}

// Função para salvar e sincronizar dados
export async function saveAndSync(key, value) {
  try {
    // Salva no localStorage
    localStorage.setItem(key, JSON.stringify(value));
    
    // Sincroniza com o Supabase
    if (key === 'workingDays') {
      await updateWorkingDays(value);
    } else if (key === 'timeSlots') {
      await updateTimeSlots(value);
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao salvar e sincronizar ${key}:`, error);
    return false;
  }
}