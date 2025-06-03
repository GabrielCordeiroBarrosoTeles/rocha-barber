// appointments.js - Gerenciamento de agendamentos
import { 
  getAppointments as fetchAppointments,
  createAppointment,
  checkTimeAvailability,
  removeAppointment,
  getWorkingDays,
  getTimeSlots
} from './database';

import { 
  getOrCreateClient, 
  getClientPlan, 
  updateClientPlan,
  createClientPlan
} from './database';

// Função para obter todos os agendamentos
export async function getAppointments() {
  try {
    return await fetchAppointments();
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    return [];
  }
}

// Função para adicionar um novo agendamento
export async function addAppointment(appointment) {
  try {
    console.log('Iniciando agendamento:', appointment);
    
    // Cria ou obtém o cliente (passando o telefone para ser salvo na tabela clients)
    const client = await getOrCreateClient(appointment.name, appointment.phone);
    console.log('Cliente encontrado/criado:', client);
    
    // Se for plano mensal
    let clientPlanId = null;
    if (appointment.planType === 'monthly') {
      try {
        // Busca o plano do cliente
        let plan = await getClientPlan(client.id);
        console.log('Plano encontrado:', plan);
        
        // Se não tem plano, cria um novo
        if (!plan) {
          console.log('Criando novo plano mensal');
          plan = await createClientPlan(client.id, 'monthly');
          console.log('Novo plano criado:', plan);
          
          // Verifica se ainda tem agendamentos disponíveis
          if (plan.remaining_appointments <= 0) {
            console.error('Sem agendamentos disponíveis no plano');
            // Mesmo sem agendamentos, vamos tentar criar o agendamento avulso
            console.log('Continuando com agendamento avulso');
            appointment.planType = 'single';
          } else {
            // Atualiza o contador de agendamentos restantes
            const success = await updateClientPlan(plan.id, plan.remaining_appointments - 1);
            if (!success) {
              console.error('Falha ao atualizar contador de agendamentos');
              // Mesmo com falha, vamos tentar criar o agendamento avulso
              console.log('Continuando com agendamento avulso');
              appointment.planType = 'single';
            } else {
              clientPlanId = plan.id;
              console.log('Plano atualizado, ID:', clientPlanId);
            }
          }
        } else {
          // Plano encontrado, verifica agendamentos disponíveis
          if (plan.remaining_appointments <= 0) {
            console.error('Sem agendamentos disponíveis no plano');
            // Mesmo sem agendamentos, vamos tentar criar o agendamento avulso
            console.log('Continuando com agendamento avulso');
            appointment.planType = 'single';
          } else {
            // Atualiza o contador de agendamentos restantes
            const success = await updateClientPlan(plan.id, plan.remaining_appointments - 1);
            if (!success) {
              console.error('Falha ao atualizar contador de agendamentos');
              // Mesmo com falha, vamos tentar criar o agendamento avulso
              console.log('Continuando com agendamento avulso');
              appointment.planType = 'single';
            } else {
              clientPlanId = plan.id;
              console.log('Plano atualizado, ID:', clientPlanId);
            }
          }
        }
      } catch (planError) {
        console.error('Erro ao processar plano mensal:', planError);
        // Em caso de erro, continua com agendamento avulso
        console.log('Continuando com agendamento avulso devido a erro');
        appointment.planType = 'single';
      }
    }
    
    // Cria o agendamento
    console.log('Criando agendamento com dados:', {
      clientId: client.id,
      date: appointment.date,
      time: appointment.time,
      service: appointment.service,
      planType: appointment.planType,
      clientPlanId
    });
    
    // Aqui é onde o agendamento é realmente criado no Supabase
    const newAppointment = await createAppointment(
      client.id,
      appointment.date,
      appointment.time,
      appointment.service,
      appointment.planType,
      clientPlanId
    );
    
    console.log('Agendamento criado com sucesso:', newAppointment);
    
    // Retorna o agendamento completo com todas as informações necessárias
    return {
      ...appointment,
      id: newAppointment.id,
      clientId: client.id,
      clientName: client.name,
      clientPlanId: clientPlanId
    };
  } catch (error) {
    console.error('Erro ao adicionar agendamento:', error);
    throw error; // Propaga o erro para ser tratado pelo chamador
  }
}

// Função para verificar se uma data é um dia de funcionamento
export async function isWorkingDay(date) {
  try {
    // Obtém os dias de funcionamento do Supabase
    const workingDaysConfig = await getWorkingDays();
    
    if (!workingDaysConfig) {
      console.log('Configuração de dias não encontrada, usando padrão');
      // Padrão: trabalha de segunda a sábado
      const defaultConfig = {
        0: false, // Domingo
        1: true,  // Segunda
        2: true,  // Terça
        3: true,  // Quarta
        4: true,  // Quinta
        5: true,  // Sexta
        6: true   // Sábado
      };
      return defaultConfig[new Date(date).getDay().toString()] === true;
    }
    
    // Converte a string de data para objeto Date
    const parts = date.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Mês em JavaScript é 0-indexed
    const day = parseInt(parts[2]);
    
    // Criar a data usando UTC para evitar problemas de fuso horário
    const dateObj = new Date(Date.UTC(year, month, day));
    const dayOfWeek = dateObj.getUTCDay();
    
    // Verificar se o dia da semana está configurado como dia de trabalho
    return workingDaysConfig[dayOfWeek.toString()] === true;
  } catch (error) {
    console.error('Erro ao verificar dia de funcionamento:', error, date);
    // Em caso de erro, usa os valores padrão mais seguros
    try {
      // Tentar novamente com uma abordagem mais direta
      const parts = date.split('-');
      const dayOfWeek = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
      return dayOfWeek !== 0; // Não trabalha aos domingos por padrão
    } catch (e) {
      console.error('Erro fatal ao processar data:', e);
      return false; // Se tudo falhar, não permite agendamento
    }
  }
}

// Função para obter horários disponíveis para uma data
export async function getAvailableTimesForDate(date) {
  try {
    // Verifica se é um dia de funcionamento
    if (!await isWorkingDay(date)) {
      return [];
    }
    
    // Obtém todos os horários configurados do Supabase
    const timeSlots = await getTimeSlots();
    
    if (!timeSlots || timeSlots.length === 0) {
      console.log('Horários não encontrados, usando padrão');
      // Horários padrão
      return [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30"
      ];
    }
    
    // Filtra os horários já agendados
    const availableTimes = [];
    for (const time of timeSlots) {
      if (await checkTimeAvailability(date, time)) {
        availableTimes.push(time);
      }
    }
    
    return availableTimes;
  } catch (error) {
    console.error('Erro ao obter horários disponíveis:', error);
    return [];
  }
}