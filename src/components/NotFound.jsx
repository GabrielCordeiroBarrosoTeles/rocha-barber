import { useEffect, useState } from 'react';

export default function NotFound() {
  const [verse, setVerse] = useState(0);
  
  const verses = [
    "\"Porque eu sei os planos que tenho para vocês\", diz o Senhor, \"planos de fazê-los prosperar e não de causar dano, planos de dar-lhes esperança e um futuro.\" - Jeremias 29:11",
    "\"Tudo posso naquele que me fortalece.\" - Filipenses 4:13",
    "\"O Senhor é o meu pastor; nada me faltará.\" - Salmos 23:1"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVerse((prev) => (prev + 1) % verses.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Número 404 com cruz */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-600">
            4
            <span className="relative inline-block mx-4">
              <span className="text-transparent">0</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-20 relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-blue-600 to-amber-600 rounded-full"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-blue-600 to-amber-600 rounded-full"></div>
                </div>
              </div>
            </span>
            4
          </h1>
        </div>

        {/* Mensagem principal */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Às vezes nos perdemos no caminho, mas Deus sempre nos guia de volta.
          </p>
        </div>

        {/* Versículo bíblico rotativo */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-amber-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p className="text-gray-700 italic text-center transition-all duration-500 min-h-[3rem] flex items-center justify-center">
            {verses[verse]}
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Voltar ao Início
          </a>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>

        {/* Decoração com pombas */}
        <div className="absolute top-20 left-10 opacity-20 animate-pulse">
          <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
          </svg>
        </div>
        
        <div className="absolute bottom-20 right-10 opacity-20 animate-pulse delay-1000">
          <svg className="w-10 h-10 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}