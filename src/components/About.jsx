export default function About() {
  return (
    <section id="sobre" className="w-full py-20 bg-zinc-100">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-8">
          <div className="w-full md:w-1/2 relative rounded-lg overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-500" style={{ aspectRatio: '4/3', maxHeight: 500 }}>
            <img
              src="./images/barbershop.jpg"
              alt="Barbearia Rocha"
              className="object-cover w-full h-full"
              style={{ objectPosition: 'center 40%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="font-semibold italic">"Servindo com excelência desde 2022"</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-zinc-900">Sobre a Rocha Barber</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-700 mb-6 rounded-full"></div>
            <p className="text-zinc-700 mb-4">
              Fundada com a paixão por transformar estilos e elevar a autoestima dos nossos clientes, a Rocha Barber se
              destaca pela qualidade no atendimento e excelência nos serviços.
            </p>
            <p className="text-zinc-700 mb-4">
              Como uma barbearia cristã, trazemos valores de integridade, respeito e excelência para cada atendimento.
              Nosso ambiente é acolhedor e familiar, onde você pode relaxar enquanto cuidamos do seu visual.
            </p>
            <p className="text-zinc-700 mb-4">
              Acreditamos que cada cliente é único e merece um atendimento personalizado, com atenção aos detalhes e
              compromisso com a qualidade.
            </p>
            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-600 rounded-r-lg">
              <p className="text-zinc-700 italic">
                "Nosso propósito é valorizar a imagem que Deus criou em cada pessoa, realçando sua beleza única com profissionalismo e dedicação."
              </p>
              <p className="text-right text-sm text-amber-700 mt-2">— Lucas Leonidas, Fundador da Rocha Barber</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-zinc-900">Nossa Missão</h3>
            <p className="text-zinc-700">
              Proporcionar serviços de barbearia de alta qualidade, valorizando cada cliente como uma criação única de Deus, em um ambiente acolhedor e respeitoso.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-zinc-900">Nossa Visão</h3>
            <p className="text-zinc-700">
              Ser reconhecida como referência em barbearia cristã, expandindo nossa influência positiva e valores para toda a comunidade.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-zinc-900">Nossos Valores</h3>
            <p className="text-zinc-700">
              Integridade, excelência, respeito, honestidade e fé são os pilares que sustentam todas as nossas ações e relacionamentos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}