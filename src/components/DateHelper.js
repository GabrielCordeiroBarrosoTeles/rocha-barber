/**
 * Utilitário para lidar com datas de forma confiável
 */

/**
 * Obtém o dia da semana de uma data no formato YYYY-MM-DD
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {number} - Dia da semana (0 = Domingo, 6 = Sábado)
 */
export function getDayOfWeek(dateString) {
  try {
    // Dividir a string de data em partes
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      console.error('Formato de data inválido:', dateString);
      return -1;
    }
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês em JavaScript é 0-indexed
    const day = parseInt(parts[2], 10);
    
    // Criar a data usando os componentes individuais
    const date = new Date(year, month, day);
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.error('Data inválida:', dateString);
      return -1;
    }
    
    // Log para debug
    console.log(`Data: ${dateString}, dia da semana: ${date.getDay()}`);
    
    return date.getDay();
  } catch (error) {
    console.error('Erro ao obter dia da semana:', error);
    return -1;
  }
}

/**
 * Formata uma data para exibição
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {string} - Data formatada
 */
export function formatDate(dateString) {
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString;
  }
}

/**
 * Verifica se uma data é um dia de funcionamento
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @param {Object} workingDaysConfig - Configuração de dias de funcionamento
 * @returns {boolean} - true se for um dia de funcionamento, false caso contrário
 */
export function isWorkingDay(dateString, workingDaysConfig) {
  const dayOfWeek = getDayOfWeek(dateString);
  if (dayOfWeek === -1) return false;
  
  // Log para debug
  console.log(`Verificando dia de trabalho: ${dateString}, dia da semana: ${dayOfWeek}, configuração:`, workingDaysConfig);
  
  return workingDaysConfig[dayOfWeek] === true;
}

/**
 * Obtém o nome do dia da semana
 * @param {number} dayOfWeek - Dia da semana (0-6)
 * @returns {string} - Nome do dia da semana
 */
export function getDayName(dayOfWeek) {
  const diasSemana = [
    'Domingo', 
    'Segunda-feira', 
    'Terça-feira', 
    'Quarta-feira', 
    'Quinta-feira', 
    'Sexta-feira', 
    'Sábado'
  ];
  
  return diasSemana[dayOfWeek] || 'Dia inválido';
}