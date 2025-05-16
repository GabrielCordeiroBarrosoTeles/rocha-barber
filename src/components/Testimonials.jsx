import TestimonialCard from "./TestimonialCard"

export default function Testimonials() {
  const testimonials = [
    {
      name: "João Silva",
      role: "Cliente desde 2020",
      content:
        "Excelente atendimento e ambiente muito agradável. O corte ficou perfeito e o barbeiro deu ótimas dicas de como manter o visual. Recomendo a todos!",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Pedro Oliveira",
      role: "Cliente desde 2021",
      content:
        "Ambiente familiar e acolhedor. Além do profissionalismo, o que me faz voltar sempre é o respeito e os valores cristãos que encontro aqui.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Carlos Mendes",
      role: "Cliente desde 2022",
      content:
        "Atendimento de primeira qualidade! O plano mensal vale muito a pena para quem, como eu, gosta de manter o visual sempre impecável.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ]

  return (
    <section className="w-full py-16 bg-zinc-900 text-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full"></div>
          <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">
            A satisfação dos nossos clientes é o nosso maior orgulho. Confira alguns depoimentos de quem já experimentou nossos serviços.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="transform hover:scale-105 transition-all duration-300">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-zinc-400 italic">
            "Servir com excelência é nossa forma de honrar a Deus e valorizar cada cliente."
          </p>
        </div>
      </div>
    </section>
  )
}