import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-direct';
import { runDiagnostics } from '../lib/debug';

export default function SupabaseTest() {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await runDiagnostics(supabase);
      setTestResults(results);
    } catch (err) {
      console.error('Erro ao executar testes:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Executa os testes automaticamente ao montar o componente
    runTests();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-amber-800 mb-6">Teste de Conexão com Supabase</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <span className="ml-3 text-amber-600">Testando conexão...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Erro ao testar conexão: {error}
              </p>
            </div>
          </div>
        </div>
      ) : testResults && (
        <div>
          <div className={`mb-6 p-4 rounded-lg ${testResults.connection.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} border-l-4`}>
            <h2 className="text-lg font-semibold mb-2">Teste de Conexão</h2>
            {testResults.connection.success ? (
              <p className="text-green-700">✅ Conexão estabelecida com sucesso</p>
            ) : (
              <p className="text-red-700">❌ Falha na conexão: {testResults.connection.error}</p>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Verificação de Tabelas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(testResults.tables).map(([table, result]) => (
                <div 
                  key={table}
                  className={`p-3 rounded-lg ${result.exists ? 'bg-green-50' : 'bg-red-50'} border ${result.exists ? 'border-green-200' : 'border-red-200'}`}
                >
                  <div className="flex items-center">
                    {result.exists ? (
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="font-medium">{table}</span>
                  </div>
                  {result.error && (
                    <p className="text-sm text-red-600 mt-1">{result.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {testResults.testAppointment && (
            <div className={`mb-6 p-4 rounded-lg ${testResults.testAppointment.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} border-l-4`}>
              <h2 className="text-lg font-semibold mb-2">Teste de Agendamento</h2>
              {testResults.testAppointment.success ? (
                <div>
                  <p className="text-green-700 mb-2">✅ Agendamento de teste criado com sucesso</p>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p><strong>Cliente:</strong> {testResults.testAppointment.client.name}</p>
                    <p><strong>Serviço:</strong> {testResults.testAppointment.appointment.service}</p>
                    <p><strong>Data:</strong> {testResults.testAppointment.appointment.date}</p>
                    <p><strong>Hora:</strong> {testResults.testAppointment.appointment.time}</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-700">❌ Falha ao criar agendamento de teste: {testResults.testAppointment.error}</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6">
        <button
          onClick={runTests}
          disabled={isLoading}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
        >
          {isLoading ? 'Testando...' : 'Executar Testes Novamente'}
        </button>
      </div>
    </div>
  );
}