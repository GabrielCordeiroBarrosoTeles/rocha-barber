// api.js - Funções para integração com API e sincronização de dados
import { loadFromIndexedDB, saveToIndexedDB, exportAllData as exportData } from './database';

// Função para inicializar o banco de dados
export async function initializeDatabase() {
  if (typeof window !== 'undefined') {
    console.log('Inicializando banco de dados...');
    
    // Valores padrão para inicialização
    const defaultData = {
      workingDays: {
        0: false, // Domingo
        1: true,  // Segunda
        2: true,  // Terça
        3: true,  // Quarta
        4: true,  // Quinta
        5: true,  // Sexta
        6: true   // Sábado
      },
      timeSlots: [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30"
      ],
      appointments: [],
      clientPlans: {}
    };
    
    // Inicializa cada chave se não existir
    for (const [key, value] of Object.entries(defaultData)) {
      try {
        const existingData = await loadFromIndexedDB(key);
        if (!existingData) {
          // Se não existir no IndexedDB, inicializa com o valor padrão
          await saveToIndexedDB(key, value);
          
          // Também salva no localStorage para acesso rápido
          if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        }
      } catch (error) {
        console.error(`Erro ao inicializar ${key}:`, error);
      }
    }
  }
}

// Função para exportar todos os dados como JSON
export async function exportAllData() {
  return await exportData();
}

// Função para importar dados de um arquivo JSON
export async function importDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const jsonData = event.target.result;
        const data = JSON.parse(jsonData);
        
        // Verifica se o formato é válido
        if (!data.appointments || !data.clientPlans || !data.workingDays || !data.timeSlots) {
          reject(new Error('Formato de dados inválido'));
          return;
        }
        
        // Importa cada conjunto de dados
        for (const [key, value] of Object.entries(data)) {
          if (key !== 'exportDate') {
            // Salva no IndexedDB
            await saveToIndexedDB(key, value);
            
            // Atualiza o localStorage
            localStorage.setItem(key, JSON.stringify(value));
          }
        }
        
        resolve(true);
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    reader.readAsText(file);
  });
}

// Função para adicionar botões de exportação e importação ao painel administrativo
export function addDataManagementButtons(container) {
  if (!container || typeof window === 'undefined') return;
  
  // Cria o contêiner para os botões
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'flex gap-4 mt-6';
  
  // Botão de exportação
  const exportButton = document.createElement('button');
  exportButton.className = 'px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md flex items-center gap-2';
  exportButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
    Exportar Dados
  `;
  exportButton.addEventListener('click', async () => {
    try {
      await exportAllData();
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Verifique o console para mais detalhes.');
    }
  });
  
  // Botão de importação
  const importButton = document.createElement('button');
  importButton.className = 'px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-md flex items-center gap-2';
  importButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
    Importar Dados
  `;
  
  // Input de arquivo oculto
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', async (event) => {
    if (event.target.files.length > 0) {
      try {
        const file = event.target.files[0];
        await importDataFromFile(file);
        alert('Dados importados com sucesso! A página será recarregada.');
        window.location.reload();
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        alert('Erro ao importar dados. Verifique o console para mais detalhes.');
      }
    }
  });
  
  importButton.addEventListener('click', () => {
    fileInput.click();
  });
  
  // Adiciona os botões ao contêiner
  buttonsContainer.appendChild(exportButton);
  buttonsContainer.appendChild(importButton);
  buttonsContainer.appendChild(fileInput);
  
  // Adiciona o contêiner à página
  container.appendChild(buttonsContainer);
}