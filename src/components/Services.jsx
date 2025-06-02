import ServiceCard from "./ServiceCard"


export default function Services() {

  return (
    <section id="servicos" className="w-full py-12 sm:py-16 bg-gradient-to-b from-white to-zinc-100">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 sm:mb-12 animate-slideUp">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full"></div>
          <p className="mt-4 text-zinc-600 max-w-2xl mx-auto text-base sm:text-lg">
            Oferecemos os melhores serviços de barbearia com profissionais qualificados e ambiente aconchegante.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr">
          {/* Corte de Cabelo */}
          <ServiceCard
            title="Corte de Cabelo"
            description="Estilo personalizado para você"
            price="R$ 25,00"
            imageSrc="https://apolobarbearia.com.br/wp-content/uploads/2022/12/Foto-1-1-1024x683.jpg"
            additionalInfo="Inclui corte e finalização com produtos de qualidade. Atendimento personalizado para valorizar seu estilo."
            benefits={[
              "Profissionais experientes",
              "Ambiente climatizado",
              "Produtos de qualidade"
            ]}
          />

          {/* Barba */}
          <ServiceCard
            title="Barba"
            description="Acabamento perfeito"
            price="R$ 15,00"
            imageSrc="https://i.pinimg.com/736x/1e/ff/35/1eff3521dc4833bcaabbcb7faee1468e.jpg"
            additionalInfo="Modelagem completa com óleo essencial e finalização com balm para barba."
            benefits={[
              "Navalha profissional",
              "Hidratação completa",
              "Acabamento impecável"
            ]}
          />

          {/* Plano Mensal (Destacado) */}
          <div className="relative mt-8 md:mt-0 h-full">
            <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-gradient-to-r from-amber-600 to-amber-800 text-white px-4 py-1 rounded-full font-bold shadow-lg z-10">
              MELHOR OPÇÃO
            </div>
            <ServiceCard
              title="Plano Mensal"
              description="Nosso melhor custo-benefício"
              price="R$ 100,00"
              imageSrc="https://st2.depositphotos.com/2931363/9695/i/450/depositphotos_96952024-stock-photo-young-handsome-man-in-barbershop.jpg"
              featured={true}
              additionalInfo="Assinatura mensal com serviços ilimitados para você estar sempre impecável."
              benefits={[
                "4 cortes de cabelo",
                "4 serviços de barba",
                "Economia de R$ 60,00",
                "Atendimento prioritário",
                "Produtos exclusivos"
              ]}
            />
          </div>
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-zinc-600 italic text-sm sm:text-base">
            "Apresente-se com excelência, pois sua aparência reflete o cuidado divino com sua vida."
          </p>
        </div>
      </div>
    </section>
  )
}