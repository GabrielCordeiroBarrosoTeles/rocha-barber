// src/lib/database.js
import { supabase } from './supabase-direct';

// O cliente supabase já está importado do arquivo supabase.js
// Teste de conexão em segundo plano e exibe informações detalhadas
setTimeout(() => {
  supabase.from('clients').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.error('Erro ao testar conexão com Supabase:', error);
        alert('Erro de conexão com o banco de dados. Verifique sua conexão com a internet.');
      } else {
        console.log('Conexão com Supabase testada com sucesso');
      }
    })
    .catch(err => {
      console.error('Exceção ao testar conexão com Supabase:', err);
      alert('Erro de conexão com o banco de dados. Verifique sua conexão com a internet.');
    });
}, 1000);

export { supabase };

// Função para obter os dias de trabalho
export async function getWorkingDays() {
  try {
    // Primeiro tenta obter do Supabase
    const { data, error } = await supabase
      .from('working_days')
      .select('day_of_week, is_working');
    
    if (!error && data && data.length > 0) {
      // Converte os dados para o formato esperado
      const workingDays = {};
      data.forEach(row => {
        workingDays[row.day_of_week] = row.is_working;
      });
      
      // Preenche dias que não existem na tabela com valores padrão
      for (let i = 0; i <= 6; i++) {
        if (workingDays[i] === undefined) {
          workingDays[i] = i >= 1 && i <= 5; // Segunda a sexta = true, resto = false
        }
      }
      
      // Salva no localStorage para acesso offline
      localStorage.setItem('workingDays', JSON.stringify(workingDays));
      return workingDays;
    }
    
    // Se não encontrar no Supabase, tenta localStorage
    const localWorkingDays = localStorage.getItem('workingDays');
    if (localWorkingDays) {
      return JSON.parse(localWorkingDays);
    }
    
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
    console.log('updateWorkingDays chamada com:', days);
    
    // Salva no localStorage primeiro para garantir acesso offline
    localStorage.setItem('workingDays', JSON.stringify(days));
    console.log('Salvo no localStorage');
    
    // Converte o objeto days para o formato da tabela working_days
    const workingDaysData = Object.keys(days).map(dayOfWeek => ({
      day_of_week: parseInt(dayOfWeek),
      is_working: days[dayOfWeek]
    }));
    
    console.log('Dados convertidos:', workingDaysData);
    
    // Salva cada dia na tabela working_days
    for (const dayData of workingDaysData) {
      const { error } = await supabase
        .from('working_days')
        .upsert(dayData, { onConflict: 'day_of_week' });
      
      if (error) {
        console.error('Erro ao salvar dia', dayData.day_of_week, ':', error);
        return false;
      }
    }
    
    console.log('Dias de trabalho salvos no banco com sucesso');
    return true;
  } catch (error) {
    console.error('Exceção ao atualizar dias de trabalho:', error);
    return false;
  }
}

// Função para obter os horários disponíveis
export async function getTimeSlots() {
  try {
    // Primeiro tenta obter do Supabase
    const { data, error } = await supabase
      .from('time_slots')
      .select('time_value')
      .eq('is_active', true)
      .order('time_value');
    
    if (!error && data && data.length > 0) {
      const timeSlots = data.map(row => row.time_value);
      // Salva no localStorage para acesso offline
      localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
      return timeSlots;
    }
    
    // Se não encontrar no Supabase, tenta localStorage
    const localTimeSlots = localStorage.getItem('timeSlots');
    if (localTimeSlots) {
      return JSON.parse(localTimeSlots);
    }
    
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
    console.log('updateTimeSlots chamada com:', slots);
    
    // Salva no localStorage primeiro para garantir acesso offline
    localStorage.setItem('timeSlots', JSON.stringify(slots));
    
    // Primeiro, desativa todos os horários existentes
    await supabase
      .from('time_slots')
      .update({ is_active: false })
      .neq('id', 0); // Atualiza todos
    
    // Depois, insere/ativa os horários da lista
    for (const timeValue of slots) {
      const { error } = await supabase
        .from('time_slots')
        .upsert({ 
          time_value: timeValue,
          is_active: true 
        }, { onConflict: 'time_value' });
      
      if (error) {
        console.error('Erro ao salvar horário', timeValue, ':', error);
        return false;
      }
    }
    
    console.log('Horários salvos no banco com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar horários:', error);
    return false;
  }
}

// Função para obter ou criar um cliente pelo nome
export async function getOrCreateClient(name, phone = null) {
  try {
    if (!name) throw new Error('Nome do cliente não fornecido');
    
    // Busca o cliente pelo nome
    const { data: existingClient, error: searchError } = await supabase
      .from('clients')
      .select('*')
      .eq('name', name)
      .single();
    
    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Erro ao buscar cliente:', searchError);
      throw new Error(`Erro ao buscar cliente: ${searchError.message}`);
    }
    
    if (existingClient) {
      // Se encontrou o cliente e temos um telefone, atualiza o telefone se necessário
      if (phone && existingClient.phone !== phone) {
        const { error: updateError } = await supabase
          .from('clients')
          .update({ phone })
          .eq('id', existingClient.id);
          
        if (updateError) {
          console.error('Erro ao atualizar telefone do cliente:', updateError);
        }
      }
      return existingClient;
    }
    
    // Cria um novo cliente com telefone se fornecido
    const clientData = { name };
    if (phone) {
      clientData.phone = phone;
    }
    
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();
    
    if (insertError) {
      console.error('Erro ao criar cliente:', insertError);
      throw new Error(`Erro ao criar cliente: ${insertError.message}`);
    }
    
    return newClient;
  } catch (error) {
    console.error('Erro ao obter/criar cliente:', error);
    throw error; // Propaga o erro para ser tratado pelo chamador
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
        id, date, time, service, created_at, plan_type,
        clients (id, name, phone)
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
      phone: appointment.clients?.phone,
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
    if (!clientId || !date || !time || !service) {
      console.error('Dados obrigatórios não fornecidos para criar agendamento');
      throw new Error('Dados incompletos para criar agendamento');
    }
    
    // Garantir que a data não seja afetada por problemas de fuso horário
    // Mantém a data exatamente como foi inserida pelo usuário
    const dateParts = date.split('-');
    if (dateParts.length === 3) {
      // A data já está no formato correto, não precisa modificar
      console.log('Data original mantida:', date);
    }
    
    console.log('Criando agendamento com dados:', {
      client_id: clientId,
      date,
      time,
      service,
      plan_type: planType,
      client_plan_id: clientPlanId
    });
    
    // Verifica a conexão com o Supabase antes de tentar inserir
    try {
      const { error: connectionError } = await supabase.from('appointments').select('count', { count: 'exact', head: true });
      if (connectionError) {
        console.error('Erro de conexão com o Supabase:', connectionError);
        throw new Error(`Erro de conexão com o banco de dados: ${connectionError.message}`);
      }
    } catch (connError) {
      console.error('Falha ao verificar conexão com o Supabase:', connError);
      throw new Error('Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.');
    }
    
    // Cria o agendamento no Supabase - removendo o campo phone que não existe na tabela
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id: clientId,
        date: date, // Garantir que a data seja exatamente a que o usuário selecionou
        time,
        service,
        plan_type: planType,
        client_plan_id: clientPlanId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar agendamento no Supabase:', error);
      throw new Error(`Erro ao criar agendamento: ${error.message}`);
    }
    
    if (!data || !data.id) {
      console.error('Agendamento criado sem retornar ID válido');
      throw new Error('Falha ao criar agendamento no banco de dados');
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
    throw error; // Propaga o erro para ser tratado pelo chamador
  }
}

// Função para verificar se um horário está disponível
export async function checkTimeAvailability(date, time) {
  try {
    // Garantir que a data não seja afetada por problemas de fuso horário
    let dateToCheck = date;
    
    // Verifica no localStorage primeiro
    const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const isBooked = localAppointments.some(app => app.date === dateToCheck && app.time === time);
    
    if (isBooked) {
      return false;
    }
    
    // Verifica no Supabase
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', dateToCheck)
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
      .select('*, clients(name, id)')
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
        if (appData.clients && appData.clients.id) {
          clientId = appData.clients.id;
        }
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
    
    // Remove do Supabase independentemente de ter encontrado ou não
    // Isso garante que tentaremos excluir mesmo se houver problemas na busca
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Erro ao remover agendamento do Supabase:', deleteError);
      // Mesmo com erro, continuamos para remover do localStorage
    } else {
      console.log('Agendamento removido do Supabase com sucesso');
    }
    
    // Remove do localStorage
    const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = localAppointments.filter(app => app.id !== id);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    console.log('Agendamento removido do localStorage com sucesso');
    
    return true;
  } catch (error) {
    console.error('Erro ao remover agendamento:', error);
    
    // Mesmo com erro, tenta remover do localStorage para manter consistência
    try {
      const localAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const updatedAppointments = localAppointments.filter(app => app.id !== id);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      console.log('Agendamento removido do localStorage após erro');
    } catch (e) {
      console.error('Erro ao remover do localStorage após falha:', e);
    }
    
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