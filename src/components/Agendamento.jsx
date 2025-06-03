import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { PLANS, PLAN_CONFIG, getClientPlan } from "../lib/plans";
import { getDayOfWeek, getDayName } from "./DateHelper";
import './modal.css';

export default function Agendamento() {
  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
    6: false  // Sábado - Fechado por padrão
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
      try {
        const parsedService = JSON.parse(serviceData);
        setSelectedService(parsedService);
        console.log("Serviço carregado:", parsedService);
      } catch (error) {
        console.error("Erro ao carregar serviço:", error);
      }
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
    // Usando um debounce para evitar múltiplas chamadas
    const timer = setTimeout(async () => {
      if (name.trim().length > 3) {
        try {
          console.log("useEffect checkClientPlan para:", name);
          const plan = await getClientPlan(name);
          console.log("Plano retornado no useEffect:", plan);
          
          setClientPlan(plan);
          
          if (plan && plan.type === PLANS.MONTHLY) {
            setPlanType(PLANS.MONTHLY);
            setMessage(''); // Não mostrar mensagem para manter a interface limpa
          } else {
            setMessage('');
          }
        } catch (error) {
          console.error('Erro ao verificar plano do cliente:', error);
          setClientPlan(null);
          setMessage('');
        }
      } else {
        setClientPlan(null);
        setMessage('');
      }
    }, 1000); // Espera 1 segundo após a última digitação
    
    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [name]);

  // Função para verificar se um horário já está agendado
  const checkTimeAvailability = async (selectedDate, selectedTime) => {
    try {
      // Importa a função de verificação de disponibilidade
      const { checkTimeAvailability } = await import('../lib/database');
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
          // Obter o dia da semana de forma confiável
          const dayOfWeek = getDayOfWeek(date);
          
          // Obter configurações de dias de trabalho do localStorage
          const workingDaysConfig = JSON.parse(localStorage.getItem('workingDays') || JSON.stringify(workingDays));
          
          // Verificar se o dia está disponível
          if (workingDaysConfig[dayOfWeek] !== true) {
            setAvailableTimes([]);
            // Obter o nome do dia da semana
            const dayName = getDayName(dayOfWeek);
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
          
          // Verifica cada horário individualmente para garantir disponibilidade
          const available = [];
          
          // Verifica cada horário individualmente para garantir disponibilidade
          for (const time of timeSlots) {
            // Verifica a disponibilidade usando a função robusta
            const isAvailable = await checkTimeAvailability(date, time);
            if (isAvailable) {
              available.push(time);
            }
          }
          
          // Organiza os horários em ordem crescente
          available.sort((a, b) => {
            const timeA = a.split(':').map(Number);
            const timeB = b.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
          });
          
          setAvailableTimes(available);
          if (available.length === 0) {
            setMessage('Não há horários disponíveis nesta data.');
          } else {
            setMessage('');
          }
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
    
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone válido é obrigatório';
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
        phone,
        service: selectedService?.title || 'Serviço não especificado',
        price: selectedService?.price || 'Preço não especificado',
        date,
        time,
        planType,
      };
      
      console.log('Preparando agendamento:', appointment);
      
      // Importa a função para adicionar agendamento
      const { addAppointment } = await import('../lib/appointments');
      
      // Variável para armazenar o resultado
      let result = null;
      
      // Criar modal de confirmação
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm';
      modalOverlay.innerHTML = `
        <div class="bg-white rounded-xl p-6 shadow-2xl border-t-4 border-amber-500 animate-fadeIn modal-content">
          <div class="flex flex-col items-center mb-6 text-center">
            <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-amber-800">Confirmar Agendamento</h3>
            <p class="text-amber-600 font-medium mt-2">Deseja confirmar este agendamento?</p>
          </div>
          
          <div class="mb-6 p-5 bg-gradient-to-r from-amber-50 to-zinc-50 border border-amber-200 rounded-lg shadow-sm">
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-zinc-500 font-medium">Serviço</p>
                  <p class="text-zinc-800 font-bold">${selectedService?.title || 'Serviço não especificado'}</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-zinc-500 font-medium">Data</p>
                  <p class="text-zinc-800 font-bold">${new Date(date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-zinc-500 font-medium">Horário</p>
                  <p class="text-zinc-800 font-bold">${time}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between">
            <button id="cancel-appointment" class="modal-button px-6 py-3 bg-zinc-200 hover:bg-zinc-300 rounded-lg text-zinc-700 font-bold transition-all shadow-md">
              Cancelar
            </button>
            <button id="confirm-appointment" class="modal-button px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg text-white font-bold transition-all shadow-md">
              Confirmar Agendamento
            </button>
          </div>
        </div>
      `;
      
      // Adicionar modal ao DOM
      document.body.appendChild(modalOverlay);
      
      // Adicionar event listeners aos botões
      document.getElementById('cancel-appointment').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
        setIsLoading(false);
      });
      
      document.getElementById('confirm-appointment').addEventListener('click', async () => {
        try {
          // Salvar agendamento no Supabase quando o botão de confirmar for clicado
          result = await addAppointment(appointment);
          console.log('Agendamento salvo com sucesso no Supabase:', result);
          
          if (!result || !result.id) {
            throw new Error('Falha ao salvar o agendamento no banco de dados');
          }
          
          // Remover modal de confirmação
          document.body.removeChild(modalOverlay);
          
          // Mostrar mensagem de sucesso
          const successMessage = clientPlan && clientPlan.type === PLANS.MONTHLY 
            ? `Agendamento realizado com sucesso! Você já utilizou ${PLAN_CONFIG[PLANS.MONTHLY].maxAppointments - clientPlan.remainingAppointments + 1} de ${PLAN_CONFIG[PLANS.MONTHLY].maxAppointments} cortes do seu plano mensal.`
            : 'Agendamento realizado com sucesso!';
      
          // Criar modal de sucesso
          const successModalOverlay = document.createElement('div');
          successModalOverlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm';
          successModalOverlay.innerHTML = `
            <div class="bg-white rounded-xl p-6 shadow-2xl border-t-4 border-amber-500 animate-fadeIn modal-content">
              <div class="flex flex-col items-center mb-6 text-center">
                <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-amber-800">Agendamento Confirmado</h3>
                <p class="text-amber-600 font-medium mt-2">${successMessage}</p>
              </div>
              
              <div class="mb-6 p-5 bg-gradient-to-r from-amber-50 to-zinc-50 border border-amber-200 rounded-lg shadow-sm">
                <div class="space-y-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-zinc-500 font-medium">Serviço</p>
                      <p class="text-zinc-800 font-bold">${selectedService?.title || 'Serviço não especificado'}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-zinc-500 font-medium">Data</p>
                      <p class="text-zinc-800 font-bold">${new Date(date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-zinc-500 font-medium">Horário</p>
                      <p class="text-zinc-800 font-bold">${time}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center">
                <button id="confirm-success" class="modal-button px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg text-white font-bold transition-all shadow-md">
                  Voltar para a página inicial
                </button>
              </div>
            </div>
          `;
          
          // Adicionar modal ao DOM
          document.body.appendChild(successModalOverlay);
          
          // Adicionar event listener ao botão
          document.getElementById('confirm-success').addEventListener('click', () => {
            window.location.href = '/';
          });
          
          // Limpar formulário
          setName('');
          setPhone('');
          setDate('');
          setTime('');
          setPlanType(PLANS.SINGLE);
        } catch (error) {
          console.error('Erro ao adicionar agendamento no Supabase:', error);
          // Mostra um alerta com o erro
          alert(`Erro ao salvar agendamento: ${error.message}. Por favor, tente novamente.`);
          document.body.removeChild(modalOverlay);
        } finally {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Erro ao preparar agendamento:', error);
      
      // Mostrar mensagem de erro ao usuário
      setMessage('Erro ao preparar agendamento. Por favor, tente novamente.');
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
                  onChange={(e) => {
                    // Só atualiza o estado quando o usuário terminar de digitar
                    setName(e.target.value);
                  }}
                  onBlur={(e) => {
                    // Verifica o plano quando o usuário sair do campo
                    setName(e.target.value);
                  }}
                  placeholder="Digite seu nome completo"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Telefone (WhatsApp)</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  value={phone}
                  onChange={(e) => {
                    // Aplicando a máscara (XX) XXXXX-XXXX
                    const value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
                    let formattedValue = '';
                    
                    if (value.length <= 2) {
                      formattedValue = value;
                    } else if (value.length <= 7) {
                      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    } else {
                      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                    }
                    
                    setPhone(formattedValue);
                  }}
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength="16"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
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
                      {PLAN_CONFIG[PLANS.MONTHLY].maxAppointments - clientPlan.remainingAppointments} / {PLAN_CONFIG[PLANS.MONTHLY].maxAppointments}
                    </span>
                  </div>
                  <div className="plan-progress">
                    <div 
                      className="plan-progress-bar" 
                      style={{ width: `${((PLAN_CONFIG[PLANS.MONTHLY].maxAppointments - clientPlan.remainingAppointments) / PLAN_CONFIG[PLANS.MONTHLY].maxAppointments) * 100}%` }}
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
                >
                  {getPlanOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
undefined
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
              
              {message && message.trim() !== '' && !message.includes('plano mensal') && (
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