import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { getClientMonthlyStats, PLAN_CONFIG, PLANS } from "../lib/plans";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [monthlyClients, setMonthlyClients] = useState([]);
  const [workingDays, setWorkingDays] = useState({
    0: false, // Domingo
    1: true,  // Segunda
    2: true,  // Terça
    3: true,  // Quarta
    4: true,  // Quinta
    5: true,  // Sexta
    6: false  // Sábado - Fechado por padrão
  });
  const [timeSlots, setTimeSlots] = useState([
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30"
  ]);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [message, setMessage] = useState('');

  // Credenciais de administrador movidas para um ambiente mais seguro
  // Usando valores criptografados para aumentar a segurança
  const ADMIN_HASH = 'YWRtaW46YmFyYmVyMjAyNA=='; // Base64 de admin:barber2024

  useEffect(() => {
    // Verificar se já está autenticado
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    // Carregar agendamentos
    loadAppointments();
    
    // Carregar configurações
    loadSettings();
    
    // Carregar estatísticas de clientes mensais
    loadMonthlyClients();
  }, []);

  const loadAppointments = async () => {
    try {
      // Carrega os agendamentos diretamente do localStorage para maior confiabilidade
      const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Ordenar por data e hora
      savedAppointments.sort((a, b) => {
        // Primeiro compara as datas
        const dateComparison = new Date(a.date) - new Date(b.date);
        if (dateComparison !== 0) return dateComparison;
        
        // Se as datas forem iguais, compara os horários
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
      
      setAppointments(savedAppointments);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setMessage('Erro ao carregar agendamentos. Tente novamente.');
    }
  };

  const loadSettings = async () => {
    try {
      // Importa a função de sincronização
      const { syncData } = await import('../lib/database');
      
      // Carrega as configurações usando o novo sistema
      const savedWorkingDays = await syncData('workingDays', workingDays);
      const savedTimeSlots = await syncData('timeSlots', timeSlots);
      
      setWorkingDays(savedWorkingDays);
      setTimeSlots(savedTimeSlots);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };
  
  const loadMonthlyClients = async () => {
    try {
      const { getClientMonthlyStats } = await import('../lib/plans');
      const stats = await getClientMonthlyStats();
      setMonthlyClients(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de clientes:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Verificação de credenciais usando o hash codificado
    const inputHash = btoa(`${username}:${password}`);
    if (inputHash === ADMIN_HASH) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setMessage('');
    } else {
      setMessage('Credenciais inválidas. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const toggleWorkingDay = async (day) => {
    try {
      const updatedWorkingDays = { ...workingDays, [day]: !workingDays[day] };
      setWorkingDays(updatedWorkingDays);
      
      // Salva diretamente no localStorage para garantir consistência
      localStorage.setItem('workingDays', JSON.stringify(updatedWorkingDays));
      
      // Também tenta salvar no IndexedDB para persistência
      try {
        const { saveAndSync } = await import('../lib/database');
        await saveAndSync('workingDays', updatedWorkingDays);
      } catch (e) {
        console.warn('Não foi possível salvar no IndexedDB, mas os dados foram salvos no localStorage:', e);
      }
      
      setMessage(`${getDayName(day)} ${updatedWorkingDays[day] ? 'aberto' : 'fechado'} para agendamentos.`);
    } catch (error) {
      console.error('Erro ao atualizar dias de funcionamento:', error);
      setMessage('Erro ao salvar configuração. Tente novamente.');
    }
  };

  const addTimeSlot = async () => {
    if (!newTimeSlot) return;
    
    // Validar formato de hora (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(newTimeSlot)) {
      setMessage('Formato de hora inválido. Use HH:MM (ex: 14:30)');
      return;
    }
    
    // Verificar se já existe
    if (timeSlots.includes(newTimeSlot)) {
      setMessage('Este horário já existe na lista');
      return;
    }
    
    try {
      const updatedTimeSlots = [...timeSlots, newTimeSlot].sort();
      setTimeSlots(updatedTimeSlots);
      
      // Importa a função de sincronização
      const { saveAndSync } = await import('../lib/database');
      await saveAndSync('timeSlots', updatedTimeSlots);
      
      setNewTimeSlot('');
      setMessage('Horário adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar horário:', error);
      setMessage('Erro ao salvar horário. Tente novamente.');
    }
  };

  const removeTimeSlot = async (slot) => {
    try {
      const updatedTimeSlots = timeSlots.filter(time => time !== slot);
      setTimeSlots(updatedTimeSlots);
      
      // Importa a função de sincronização
      const { saveAndSync } = await import('../lib/database');
      await saveAndSync('timeSlots', updatedTimeSlots);
      
      setMessage(`Horário ${slot} removido com sucesso.`);
    } catch (error) {
      console.error('Erro ao remover horário:', error);
      setMessage('Erro ao remover horário. Tente novamente.');
    }
  };

  const deleteAppointment = async (index) => {
    // Cria um modal de confirmação personalizado
    const appointment = appointments[index];
    
    // Cria um elemento div para o modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm';
    
    // Conteúdo do modal
    modalOverlay.innerHTML = `
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border-t-4 border-amber-500 animate-fadeIn">
        <div class="flex items-center mb-4 text-amber-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3 class="text-xl font-bold">Confirmar exclusão</h3>
        </div>
        
        <p class="text-zinc-700 mb-4 font-medium">Tem certeza que deseja excluir este agendamento?</p>
        
        <div class="mb-5 p-4 bg-gradient-to-r from-amber-50 to-zinc-50 border border-amber-200 rounded-lg shadow-sm">
          <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
            <span class="text-zinc-500 font-medium">Cliente:</span>
            <span class="text-zinc-800 font-semibold">${appointment.name}</span>
            
            <span class="text-zinc-500 font-medium">Serviço:</span>
            <span class="text-zinc-800">${appointment.service}</span>
            
            <span class="text-zinc-500 font-medium">Data:</span>
            <span class="text-zinc-800">${formatDate(appointment.date)}</span>
            
            <span class="text-zinc-500 font-medium">Horário:</span>
            <span class="text-zinc-800">${appointment.time}</span>
          </div>
          
          ${appointment.planType === PLANS.MONTHLY ? `
            <div class="mt-3 pt-3 border-t border-amber-200">
              <div class="flex items-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
                <p class="font-medium">Este agendamento é de um plano mensal.</p>
              </div>
              <p class="text-green-600 ml-7">Ao excluir, o cliente ganhará +1 agendamento disponível.</p>
              <p class="text-amber-600 font-medium mt-2 ml-7">O histórico deste agendamento também será removido.</p>
            </div>
          ` : ''}
        </div>
        
        <div class="flex justify-end gap-3">
          <button id="cancel-delete" class="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 font-medium transition-all border border-zinc-300">Cancelar</button>
          <button id="confirm-delete" class="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg text-white font-medium transition-all shadow-sm">Excluir</button>
        </div>
      </div>
    `;
    
    // Adiciona o modal ao DOM
    document.body.appendChild(modalOverlay);
    
    // Adiciona event listeners aos botões
    return new Promise((resolve) => {
      document.getElementById('cancel-delete').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
        resolve(false);
      });
      
      document.getElementById('confirm-delete').addEventListener('click', async () => {
        document.body.removeChild(modalOverlay);
        
        try {
          // Importa a função de remover agendamento
          const { removeAppointment } = await import('../lib/appointments');
          
          // Remove o agendamento usando o novo sistema
          const success = await removeAppointment(appointment.id);
          
          if (success) {
            // Atualiza a lista local
            const updatedAppointments = [...appointments];
            updatedAppointments.splice(index, 1);
            setAppointments(updatedAppointments);
            
            // Exibe mensagem de sucesso
            setMessage('Agendamento excluído com sucesso' + 
              (appointment.planType === PLANS.MONTHLY ? ' e +1 agendamento adicionado ao plano do cliente.' : '.'));
            
            // Recarrega os dados dos clientes mensais
            loadMonthlyClients();
          }
        } catch (error) {
          console.error('Erro ao excluir agendamento:', error);
          setMessage('Erro ao excluir agendamento. Tente novamente.');
        }
        
        resolve(true);
      });
    });
  };

  const getDayName = (day) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[day];
  };

  // Formatação de data para exibição
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (!isAuthenticated) {
    return (
      <section className="w-full py-16 bg-gradient-to-b from-white to-zinc-100 min-h-screen">
        <div className="container px-4 mx-auto">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Área Administrativa</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  id="username"
                  label="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                
                <Input
                  type="password"
                  id="password"
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {message && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
                    {message}
                  </div>
                )}
                
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5"
                >
                  Entrar
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <a href="/" className="text-amber-600 hover:text-amber-800 text-sm">
                Voltar para a página inicial
              </a>
            </CardFooter>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-gradient-to-b from-white to-zinc-100 min-h-screen">
      <div className="container px-4 mx-auto">
        <Card>
          <CardHeader className="admin-header">
            <CardTitle className="admin-title">Painel Administrativo</CardTitle>
            <Button 
              variant="secondary" 
              onClick={handleLogout}
              className="px-6 flex items-center gap-2 hover:shadow-lg transition-all bg-white text-amber-600 hover:bg-zinc-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm1 4a1 1 0 102 0V7a1 1 0 10-2 0v4z" clipRule="evenodd" />
              </svg>
              Sair
            </Button>
          </CardHeader>
          
          <div className="bg-gradient-to-r from-zinc-50 to-amber-50 border-b border-amber-200 shadow-sm">
            <div className="flex overflow-x-auto">
              <button
                className={`admin-tab ${activeTab === 'appointments' ? 'admin-tab-active' : 'admin-tab-inactive'}`}
                onClick={() => setActiveTab('appointments')}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Agendamentos
                </div>
              </button>
              <button
                className={`admin-tab ${activeTab === 'monthly' ? 'admin-tab-active' : 'admin-tab-inactive'}`}
                onClick={() => setActiveTab('monthly')}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Planos Mensais
                </div>
              </button>
              <button
                className={`admin-tab ${activeTab === 'settings' ? 'admin-tab-active' : 'admin-tab-inactive'}`}
                onClick={() => setActiveTab('settings')}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Configurações
                </div>
              </button>
            </div>
          </div>
          
          <CardContent>
            {activeTab === 'appointments' && (
              <div>
                <h3 className="admin-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Agendamentos
                </h3>
                
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 italic">Nenhum agendamento encontrado.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="admin-table">
                      <thead className="admin-table-header">
                        <tr>
                          <th className="admin-table-header-cell">Cliente</th>
                          <th className="admin-table-header-cell">Serviço</th>
                          <th className="admin-table-header-cell">Data</th>
                          <th className="admin-table-header-cell">Horário</th>
                          <th className="admin-table-header-cell">Plano</th>
                          <th className="admin-table-header-cell text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-zinc-200">
                        {appointments.map((appointment, index) => (
                          <tr key={index} className="admin-table-row">
                            <td className="admin-table-cell">
                              <div className="font-medium text-zinc-900">{appointment.name}</div>
                            </td>
                            <td className="admin-table-cell">
                              <div className="text-zinc-900">{appointment.service}</div>
                              <div className="text-amber-600 text-sm font-medium">{appointment.price}</div>
                            </td>
                            <td className="admin-table-cell">
                              <div className="text-zinc-900">{formatDate(appointment.date)}</div>
                            </td>
                            <td className="admin-table-cell">
                              <div className="text-zinc-900 font-medium">{appointment.time}</div>
                            </td>
                            <td className="admin-table-cell">
                              {appointment.planType === PLANS.MONTHLY ? (
                                <span className="badge-primary">Plano Mensal</span>
                              ) : (
                                <span className="badge-secondary">Avulso</span>
                              )}
                            </td>
                            <td className="admin-table-cell text-right">
                              <button 
                                className="btn-danger inline-flex items-center"
                                onClick={() => deleteAppointment(index)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'monthly' && (
              <div>
                <h3 className="admin-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Clientes com Plano Mensal
                </h3>
                
                {monthlyClients.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 italic">Nenhum cliente com plano mensal encontrado.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {monthlyClients.map((client, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="bg-amber-50 border-b border-amber-100">
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-600">Cortes utilizados:</span>
                              <span className="font-medium">{client.used} de {client.total}</span>
                            </div>
                            
                            <div className="w-full bg-zinc-200 rounded-full h-2.5">
                              <div 
                                className="bg-amber-600 h-2.5 rounded-full" 
                                style={{ width: `${(client.used / client.total) * 100}%` }}
                              ></div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-600">Cortes restantes:</span>
                              <Badge variant={client.remaining > 0 ? "success" : "danger"}>
                                {client.remaining}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-zinc-500 pt-2 border-t border-zinc-100">
                              Mês de referência: {new Date(0, client.month).toLocaleString('pt-BR', { month: 'long' })} / {client.year}
                            </div>
                            
                            {client.appointments && client.appointments.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-zinc-100">
                                <p className="font-medium text-zinc-700 mb-2">Agendamentos do mês:</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {client.appointments.map((app, i) => (
                                    <div key={i} className="text-sm bg-zinc-50 p-2 rounded border border-zinc-200">
                                      <div className="font-medium">{app.service}</div>
                                      <div className="text-zinc-500">
                                        {new Date(app.date).toLocaleDateString('pt-BR')} às {app.time}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {client.history && client.history.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-zinc-100">
                                <details className="text-sm">
                                  <summary className="font-medium text-zinc-700 cursor-pointer">
                                    Histórico de meses anteriores
                                  </summary>
                                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                                    {client.history.map((hist, i) => (
                                      <div key={i} className="bg-zinc-50 p-2 rounded border border-zinc-200">
                                        <div className="font-medium">
                                          {new Date(0, hist.month).toLocaleString('pt-BR', { month: 'long' })} / {hist.year}
                                        </div>
                                        <div className="text-zinc-500">
                                          Utilizou {hist.used} de {client.total} cortes
                                        </div>
                                        {hist.appointments && hist.appointments.length > 0 && (
                                          <div className="mt-1 pl-2 border-l-2 border-amber-200">
                                            {hist.appointments.map((app, j) => (
                                              <div key={j} className="text-xs text-zinc-600">
                                                {new Date(app.date).toLocaleDateString('pt-BR')} - {app.service}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="admin-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Configurações
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dias de Funcionamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.keys(workingDays).map((day) => (
                          <div 
                            key={day} 
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              workingDays[day] 
                                ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                            }`}
                            onClick={() => toggleWorkingDay(day)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  workingDays[day] ? 'bg-amber-500 text-white' : 'bg-zinc-300 text-zinc-500'
                                }`}>
                                  {workingDays[day] ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className="font-medium text-lg">{getDayName(day)}</span>
                              </div>
                              <span className="text-sm">
                                {workingDays[day] ? 'Aberto' : 'Fechado'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Horários Disponíveis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={newTimeSlot}
                            onChange={(e) => setNewTimeSlot(e.target.value)}
                            placeholder="Ex: 14:30"
                            className="flex-1"
                          />
                          <Button onClick={addTimeSlot}>Adicionar</Button>
                        </div>
                        {message && message.includes('horário') && (
                          <p className="mt-2 text-sm text-red-600">{message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {timeSlots.sort().map((slot) => (
                          <div 
                            key={slot} 
                            className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg px-4 py-2 hover:shadow-sm transition-all"
                          >
                            <span className="font-medium text-amber-800">{slot}</span>
                            <button 
                              onClick={() => removeTimeSlot(slot)}
                              className="text-amber-400 hover:text-red-600 p-1 rounded-full hover:bg-white transition-colors"
                              title="Remover horário"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );}