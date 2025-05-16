import ServiceCard from "./ServiceCard"

export default function Services() {
  const whatsappNumber = "5585996988973"

  return (
    <section id="servicos" className="w-full py-16 bg-gradient-to-b from-white to-zinc-100">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full"></div>
          <p className="mt-4 text-zinc-600 max-w-2xl mx-auto text-lg">
            Oferecemos os melhores serviços de barbearia com profissionais qualificados e ambiente aconchegante.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="transform hover:scale-105 transition-all duration-300">
            <ServiceCard
              title="Corte de Cabelo"
              description="Estilo personalizado para você"
              price="R$ 25,00"
              imageSrc="./images/corte.png"
              whatsappNumber={whatsappNumber}
              additionalInfo="Inclui lavagem, corte e finalização com produtos de qualidade. Atendimento personalizado para valorizar seu estilo."
              benefits={[
                "Profissionais experientes",
                "Ambiente climatizado",
                "Produtos de qualidade"
              ]}
            />
          </div>

          <div className="transform hover:scale-105 transition-all duration-300">
            <ServiceCard
              title="Barba"
              description="Acabamento perfeito"
              price="R$ 15,00"
              imageSrc="./images/barba.png"
              whatsappNumber={whatsappNumber}
              additionalInfo="Modelagem completa com toalha quente, óleo essencial e finalização com balm para barba."
              benefits={[
                "Navalha profissional",
                "Hidratação completa",
                "Acabamento impecável"
              ]}
            />
          </div>

          <div className="featured-card animate-pulse-slow transform hover:scale-105 transition-all duration-300 lg:translate-y-[-20px]">
            <div className="relative">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-gradient-to-r from-amber-600 to-amber-800 text-white px-4 py-1 rounded-full font-bold shadow-lg z-10">
                MELHOR OPÇÃO
              </div>
              <ServiceCard
                title="Plano Mensal"
                description="Nosso melhor custo-benefício"
                price="R$ 100,00"
                imageSrc="./images/plano.png"
                featured={true}
                additionalInfo="Assinatura mensal com serviços ilimitados para você estar sempre impecável."
                benefits={[
                  "4 cortes de cabelo",
                  "4 serviços de barba",
                  "Economia de R$ 60,00",
                  "Atendimento prioritário",
                  "Produtos exclusivos"
                ]}
                whatsappNumber={whatsappNumber}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-zinc-600 italic">"Apresente-se com excelência, pois sua aparência reflete o cuidado divino com sua vida."</p>
        </div>
      </div>
    </section>
  )
}