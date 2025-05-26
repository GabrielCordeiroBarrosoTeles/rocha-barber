import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { PLANS, PLAN_CONFIG, getClientPlan, createClientPlan, updateClientPlan } from "../lib/plans";

export default function Agendamento() {
  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [planType, setPlanType] = useState(PLANS.SINGLE);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientPlan, setClientPlan] = useState(null);
  const [errors, setErrors] = useState({});

  // Dias da semana disponíveis (true = disponível, false = indisponível)
  const [workingDays, setWorkingDays] = useState({
    0: false, // Domingo
    1: true,  // Segunda
    2: true,  // Terça
    3: true,  // Quarta
    4: true,  // Quinta
    5: true,  // Sexta
    6: false  // Sábado - Alterado para false conforme solicitado
  });

  // Horários disponíveis
  const [timeSlots, setTimeSlots] = useState([
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30"
  ]);

  useEffect(() => {
    // Recuperar serviço selecionado do localStorage
    const serviceData = localStorage.getItem('selectedService');
    if (serviceData) {
      setSelectedService(JSON.parse(serviceData));
    }

    // Carregar configurações de dias e horários
    const savedWorkingDays = JSON.parse(localStorage.getItem('workingDays') || JSON.stringify(workingDays));
    const savedTimeSlots = JSON.parse(localStorage.getItem('timeSlots') || JSON.stringify(timeSlots));
    
    setWorkingDays(savedWorkingDays);
    setTimeSlots(savedTimeSlots);

    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.min = today;
    }
  }, []);

  // Verificar plano do cliente quando o nome mudar
  useEffect(() => {
    const checkClientPlan = async () => {
      if (name.trim().length > 3) {
        try {
          const plan = await getClientPlan(name);
          setClientPlan(plan);
          
          if (plan && plan.type === PLANS.MONTHLY) {
            setPlanType(PLANS.MONTHLY);
          }
        } catch (error) {
          console.error('Erro ao verificar plano do cliente:', error);
          setClientPlan(null);
        }
      } else {
        setClientPlan(null);
      }
    };
    
    checkClientPlan();
  }, [name]);

  // Função para verificar se um horário já está agendado
  const checkTimeAvailability = async (selectedDate, selectedTime) => {
    try {
      // Importa a função de verificação de disponibilidade
      const { checkTimeAvailability } = await import('../lib/appointments');
      return await checkTimeAvailability(selectedDate, selectedTime);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
  };

  // Atualizar horários disponíveis quando a data for selecionada
  useEffect(() => {
    const loadAvailableTimes = async () => {
      if (date) {
        try {
          // Importar o utilitário de datas
          const { getDayOfWeek, getDayName, isWorkingDay } = await import('./DateHelper');
          
          // Obter o dia da semana de forma confiável
          const dayOfWeek = getDayOfWeek(date);
          
          // Obter configurações de dias de trabalho do localStorage
          const workingDaysConfig = JSON.parse(localStorage.getItem('workingDays') || JSON.stringify({
            0: false, // Domingo
            1: true,  // Segunda
            2: true,  // Terça
            3: true,  // Quarta
            4: true,  // Quinta
            5: true,  // Sexta
            6: false  // Sábado
          }));
          
          // Verificar se o dia está disponível
          if (workingDaysConfig[dayOfWeek] !== true) {
            setAvailableTimes([]);
            // Obter o nome do dia da semana
            const dayName = getDayName(dayOfWeek);
            // Adicionar log para debug
            console.log(`Data selecionada: ${date}, Dia da semana detectado: ${dayOfWeek} (${dayName})`);
            setMessage(`Este dia não está disponível para agendamentos (${dayName}).`);
            return;
          }
          
          // Obtém os horários disponíveis diretamente do localStorage
          let timeSlots = [];
          const localTimeSlots = localStorage.getItem('timeSlots');
          
          if (localTimeSlots) {
            timeSlots = JSON.parse(localTimeSlots);
          } else {
            // Valores padrão
            timeSlots = [
              "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
              "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
              "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
              "17:00", "17:30"
            ];
          }
          
          // Obtém os agendamentos existentes
          const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
          
          // Filtra os horários já agendados
          const available = timeSlots.filter(time => 
            !appointments.some(app => app.date === date && app.time === time)
          );
          
          // Organiza os horários em ordem crescente
          available.sort((a, b) => {
            const timeA = a.split(':').map(Number);
            const timeB = b.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
          });
          
          setAvailableTimes(available);
          setMessage(available.length === 0 ? 'Não há horários disponíveis nesta data.' : '');
        } catch (error) {
          console.error('Erro ao carregar horários disponíveis:', error);
          setMessage('Não foi possível verificar os horários disponíveis. Por favor, tente outra data.');
        }
      }
    };
    
    loadAvailableTimes();
  }, [date]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!date) {
      newErrors.date = 'Data é obrigatória';
    }
    
    if (!time) {
      newErrors.time = 'Horário é obrigatório';
    }
    
    if (!selectedService) {
      newErrors.service = 'Selecione um serviço';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('Por favor, corrija os erros no formulário.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Criar objeto de agendamento
      const appointment = {
        name,
        service: selectedService?.title || 'Serviço não especificado',
        price: selectedService?.price || 'Preço não especificado',
        date,
        time,
        planType,
      };
      
      // Verificar se é plano mensal e processar
      if (planType === PLANS.MONTHLY) {
        // Importa as funções necessárias
        const { createClientPlan, updateClientPlan } = await import('../lib/plans');
        
        let plan = clientPlan;
        
        // Se não tem plano, criar um novo
        if (!plan) {
          plan = await createClientPlan(name, PLANS.MONTHLY);
        }
        
        // Atualizar o plano com o novo agendamento
        const success = await updateClientPlan(name, {
          date,
          time,
          service: selectedService?.title
        });
        
        if (!success) {
          setMessage('Você já utilizou todos os agendamentos do seu plano mensal para este mês.');
          setIsLoading(false);
          return;
        }
      }
      
      // Importa a função para adicionar agendamento
      const { addAppointment } = await import('../lib/appointments');
      
      // Salvar agendamento usando o novo sistema
      await addAppointment(appointment);
      
      // Mostrar mensagem de sucesso
      setMessage('Agendamento realizado com sucesso!');
      
      // Limpar formulário
      setName('');
      setDate('');
      setTime('');
      setPlanType(PLANS.SINGLE);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Erro ao realizar agendamento:', error);
      setMessage('Erro ao realizar agendamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeOptions = () => {
    return [
      { value: '', label: 'Selecione um horário' },
      ...availableTimes.map(time => ({ value: time, label: time }))
    ];
  };

  const getPlanOptions = () => {
    return [
      { value: PLANS.SINGLE, label: 'Agendamento Avulso' },
      { value: PLANS.MONTHLY, label: 'Plano Mensal (4 cortes/mês)' }
    ];
  };

  // Importar o CSS específico para mobile-first
  useEffect(() => {
    // Importar o CSS dinamicamente
    import('./Agendamento.mobile.css');
  }, []);

  return (
    <section className="w-full py-6 md:py-16 bg-gradient-to-b from-amber-50 to-zinc-100 min-h-screen">
      <div className="agendamento-container">
        <div className="agendamento-card animate-fade-in">
          <div className="agendamento-header">
            <h2 className="agendamento-title">Agendar Serviço</h2>
          </div>
          
          <div className="agendamento-content">
            {selectedService ? (
              <div className="service-selected">
                <div>
                  <h3 className="service-title">{selectedService.title}</h3>
                  <p className="service-price">{selectedService.price}</p>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Selecionado
                </span>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
                <p className="text-zinc-500">Nenhum serviço selecionado</p>
                <a href="/" className="text-amber-600 hover:text-amber-800 text-sm mt-2 inline-block">
                  Voltar e selecionar um serviço
                </a>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="agendamento-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nome completo</label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              
              {clientPlan && clientPlan.type === PLANS.MONTHLY && (
                <div className="plan-active">
                  <div className="plan-header">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="plan-title">Plano Mensal Ativo</h4>
                  </div>
                  <div className="plan-counter">
                    <span className="plan-counter-label">Cortes disponíveis:</span>
                    <span className="plan-counter-value">
                      {clientPlan.remainingAppointments} / {PLAN_CONFIG[PLANS.MONTHLY].maxAppointments}
                    </span>
                  </div>
                  <div className="plan-progress">
                    <div 
                      className="plan-progress-bar" 
                      style={{ width: `${(clientPlan.remainingAppointments / PLAN_CONFIG[PLANS.MONTHLY].maxAppointments) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="planType" className="form-label">Tipo de Agendamento</label>
                <select
                  id="planType"
                  className="form-select"
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  disabled={clientPlan !== null}
                >
                  {getPlanOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="date" className="form-label">Data</label>
                <input
                  type="date"
                  id="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="time" className="form-label">Horário</label>
                <select
                  id="time"
                  className="form-select"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={availableTimes.length === 0}
                >
                  {getTimeOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.time && <span className="form-error">{errors.time}</span>}
              </div>
              
              {message && (
                <div className={`message ${
                  message.includes('sucesso') 
                    ? 'message-success' 
                    : message.includes('não está disponível') 
                      ? 'message-warning' 
                      : 'message-error'
                }`}>
                  {message}
                </div>
              )}
            
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || availableTimes.length === 0}
              >
                {isLoading ? 'Processando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          </div>
          
          <div className="agendamento-footer">
            <a href="/" className="back-link">
              Voltar para a página inicial
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}