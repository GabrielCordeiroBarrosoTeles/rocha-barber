// appointments.js - Gerenciamento de agendamentos
import { syncData, saveAndSync, loadFromIndexedDB } from './database';
import { restoreAppointmentToClientPlan } from './plans';

// Função para obter todos os agendamentos
export async function getAppointments() {
  return await syncData('appointments', []);
}

// Função para salvar agendamentos
export async function saveAppointments(appointments) {
  return await saveAndSync('appointments', appointments);
}

// Função para adicionar um novo agendamento
export async function addAppointment(appointment) {
  const appointments = await getAppointments();
  appointments.push({
    ...appointment,
    id: generateId(), // Adiciona um ID único para cada agendamento
    createdAt: new Date().toISOString()
  });
  
  await saveAppointments(appointments);
  return appointment;
}

// Função para verificar disponibilidade de horário
export async function checkTimeAvailability(date, time) {
  const appointments = await getAppointments();
  return !appointments.some(app => app.date === date && app.time === time);
}

// Função para remover um agendamento
export async function removeAppointment(appointmentId) {
  const appointments = await getAppointments();
  const index = appointments.findIndex(app => app.id === appointmentId);
  
  if (index === -1) {
    return false;
  }
  
  // Armazena o agendamento removido para restaurar o plano se necessário
  const removedAppointment = appointments[index];
  
  // Remove o agendamento da lista
  appointments.splice(index, 1);
  await saveAppointments(appointments);
  
  // Se o agendamento era de um plano mensal, restaura o agendamento ao plano
  // e remove do histórico
  if (removedAppointment.planType === 'monthly') {
    await restoreAppointmentToClientPlan(
      removedAppointment.name,
      removedAppointment.date,
      removedAppointment.time
    );
  }
  
  return true;
}

// Função para verificar se uma data é um dia de funcionamento
export function isWorkingDay(date) {
  try {
    // Obtém diretamente do localStorage para garantir consistência
    const localData = localStorage.getItem('workingDays');
    let workingDaysConfig;
    
    if (localData) {
      workingDaysConfig = JSON.parse(localData);
    } else {
      // Valores padrão se não encontrar no localStorage
      workingDaysConfig = {
        0: false, // Domingo
        1: true,  // Segunda
        2: true,  // Terça
        3: true,  // Quarta
        4: true,  // Quinta
        5: true,  // Sexta
        6: false  // Sábado - fechado por padrão
      };
      
      // Salva os valores padrão no localStorage para uso futuro
      localStorage.setItem('workingDays', JSON.stringify(workingDaysConfig));
    }
    
    // Converte a string de data para objeto Date
    // Importante: usar new Date(date) pode dar problemas com fusos horários
    // Vamos garantir que a data seja interpretada corretamente
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
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Não trabalha aos domingos e sábados por padrão
    } catch (e) {
      console.error('Erro fatal ao processar data:', e);
      return false; // Se tudo falhar, não permite agendamento
    }
  }
}

// Função para obter horários disponíveis para uma data
export async function getAvailableTimesForDate(date) {
  // Verifica se é um dia de funcionamento (usando a versão síncrona)
  if (!isWorkingDay(date)) {
    return [];
  }
  
  // Obtém todos os horários configurados diretamente do localStorage para maior confiabilidade
  let timeSlots;
  const localData = localStorage.getItem('timeSlots');
  
  if (localData) {
    try {
      timeSlots = JSON.parse(localData);
    } catch (e) {
      console.error('Erro ao processar horários do localStorage:', e);
      // Valores padrão em caso de erro
      timeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30"
      ];
    }
  } else {
    // Valores padrão se não encontrar no localStorage
    timeSlots = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
      "17:00", "17:30"
    ];
    
    // Salva os valores padrão no localStorage para uso futuro
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
  }
  
  // Filtra os horários já agendados
  const availableTimes = [];
  for (const time of timeSlots) {
    if (await checkTimeAvailability(date, time)) {
      availableTimes.push(time);
    }
  }
  
  return availableTimes;
}

// Função auxiliar para gerar IDs únicos
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}