// Arquivo para funções de debug e diagnóstico

// Função para testar a conexão com o Supabase
export async function testSupabaseConnection(supabase) {
  try {
    console.log('Testando conexão com Supabase...');
    
    // Tenta fazer uma consulta simples
    const { data, error } = await supabase
      .from('clients')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erro ao testar conexão com Supabase:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('Conexão com Supabase testada com sucesso');
    return {
      success: true,
      message: 'Conexão com Supabase estabelecida com sucesso'
    };
  } catch (error) {
    console.error('Exceção ao testar conexão com Supabase:', error);
    return {
      success: false,
      error: error.message,
      details: error
    };
  }
}

// Função para verificar se as tabelas necessárias existem
export async function checkTables(supabase) {
  try {
    console.log('Verificando tabelas no Supabase...');
    
    const tables = [
      'clients',
      'appointments',
      'client_plans',
      'working_days',
      'time_slots'
    ];
    
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
        
        results[table] = {
          exists: !error,
          error: error ? error.message : null
        };
      } catch (e) {
        results[table] = {
          exists: false,
          error: e.message
        };
      }
    }
    
    return results;
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para criar um agendamento de teste
export async function createTestAppointment(supabase) {
  try {
    console.log('Criando agendamento de teste...');
    
    // Primeiro cria um cliente de teste
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({ name: 'Cliente Teste' })
      .select()
      .single();
    
    if (clientError) {
      console.error('Erro ao criar cliente de teste:', clientError);
      return {
        success: false,
        error: clientError.message
      };
    }
    
    // Cria um agendamento de teste
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        client_id: client.id,
        date: dateStr,
        time: '10:00',
        service: 'Serviço de Teste',
        plan_type: 'single',
        phone: '(00) 00000-0000'
      })
      .select()
      .single();
    
    if (appointmentError) {
      console.error('Erro ao criar agendamento de teste:', appointmentError);
      return {
        success: false,
        error: appointmentError.message
      };
    }
    
    console.log('Agendamento de teste criado com sucesso:', appointment);
    return {
      success: true,
      client,
      appointment
    };
  } catch (error) {
    console.error('Exceção ao criar agendamento de teste:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para executar todos os testes de diagnóstico
export async function runDiagnostics(supabase) {
  console.log('Iniciando diagnóstico do Supabase...');
  
  const results = {
    connection: await testSupabaseConnection(supabase),
    tables: await checkTables(supabase)
  };
  
  if (results.connection.success) {
    results.testAppointment = await createTestAppointment(supabase);
  }
  
  console.log('Diagnóstico concluído:', results);
  return results;
}