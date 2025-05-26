// database.js - Gerenciamento de dados persistentes

// Função para sincronizar dados entre localStorage e IndexedDB
export async function syncData(key, defaultValue = {}) {
  // Em ambiente de navegador, usa localStorage e IndexedDB
  if (typeof window !== 'undefined') {
    // Tenta carregar do localStorage primeiro
    const localData = localStorage.getItem(key);
    
    if (localData) {
      try {
        // Se temos dados no localStorage, salvamos no IndexedDB também
        const parsedData = JSON.parse(localData);
        await saveToIndexedDB(key, parsedData);
        return parsedData;
      } catch (e) {
        console.error(`Erro ao processar dados do localStorage para ${key}:`, e);
      }
    }
    
    // Se não temos dados no localStorage, tentamos carregar do IndexedDB
    try {
      const dbData = await loadFromIndexedDB(key);
      if (dbData) {
        // Atualiza o localStorage com os dados do IndexedDB
        localStorage.setItem(key, JSON.stringify(dbData));
        return dbData;
      }
    } catch (e) {
      console.error(`Erro ao carregar dados do IndexedDB para ${key}:`, e);
    }
    
    // Se não encontrou em nenhum lugar, usa o valor padrão
    return defaultValue;
  } else {
    // Em ambiente de servidor (SSR), retorna o valor padrão
    return defaultValue;
  }
}

// Função para salvar dados tanto no localStorage quanto no IndexedDB
export async function saveAndSync(key, data) {
  // Salva no localStorage (cliente)
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
    // Salva no IndexedDB (persistência)
    await saveToIndexedDB(key, data);
  }
  
  return true;
}

// Função para salvar dados no IndexedDB
export function saveToIndexedDB(key, data) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB não disponível'));
      return;
    }
    
    const request = window.indexedDB.open('barberShopDB', 1);
    
    request.onerror = (event) => {
      console.error('Erro ao abrir IndexedDB:', event);
      reject(new Error('Erro ao abrir IndexedDB'));
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data');
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['data'], 'readwrite');
      const store = transaction.objectStore('data');
      
      const storeRequest = store.put(data, key);
      
      storeRequest.onsuccess = () => {
        resolve(true);
      };
      
      storeRequest.onerror = (event) => {
        console.error('Erro ao salvar no IndexedDB:', event);
        reject(new Error('Erro ao salvar no IndexedDB'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

// Função para carregar dados do IndexedDB
export function loadFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB não disponível'));
      return;
    }
    
    const request = window.indexedDB.open('barberShopDB', 1);
    
    request.onerror = (event) => {
      console.error('Erro ao abrir IndexedDB:', event);
      reject(new Error('Erro ao abrir IndexedDB'));
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data');
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['data'], 'readonly');
      const store = transaction.objectStore('data');
      
      const storeRequest = store.get(key);
      
      storeRequest.onsuccess = () => {
        resolve(storeRequest.result || null);
      };
      
      storeRequest.onerror = (event) => {
        console.error('Erro ao carregar do IndexedDB:', event);
        reject(new Error('Erro ao carregar do IndexedDB'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

// Função para exportar todos os dados
export async function exportAllData() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Lista de chaves para exportar
    const keysToExport = ['appointments', 'clientPlans', 'workingDays', 'timeSlots'];
    const exportData = {};
    
    // Coleta dados de cada chave
    for (const key of keysToExport) {
      const localData = localStorage.getItem(key);
      if (localData) {
        exportData[key] = JSON.parse(localData);
      } else {
        try {
          const dbData = await loadFromIndexedDB(key);
          if (dbData) {
            exportData[key] = dbData;
          }
        } catch (e) {
          console.error(`Erro ao exportar ${key}:`, e);
        }
      }
    }
    
    // Adiciona data de exportação
    exportData.exportDate = new Date().toISOString();
    
    // Converte para string JSON
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Cria um arquivo para download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barbearia_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return jsonData;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return null;
  }
}

// Função para importar dados de um arquivo JSON
export async function importData(jsonData) {
  try {
    // Converte a string JSON para objeto
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Verifica se o formato é válido
    if (!data.appointments || !data.clientPlans || !data.workingDays || !data.timeSlots) {
      throw new Error('Formato de dados inválido');
    }
    
    // Salva cada conjunto de dados
    await saveAndSync('appointments', data.appointments);
    await saveAndSync('clientPlans', data.clientPlans);
    await saveAndSync('workingDays', data.workingDays);
    await saveAndSync('timeSlots', data.timeSlots);
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
}