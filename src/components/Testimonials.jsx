import TestimonialCard from "./TestimonialCard"

export default function Testimonials() {
const testimonials = [
  {
    name: "Hudson",
    content: "A barbearia do lugar é um lugar de paz, onde assim que você pisa, sabe que está sendo muito bem-vindo. Fora o ambiente climatizado, tenho certeza de que quem for não vai se arrepender. Além disso, o Lucas é um excelente barbeiro, uma pessoa de coração puro, que trata muito bem seus clientes — e ainda te deixa bonito.",
    avatar: "/images/userWhite.svg",
  },
  {
    name: "Adriel Maia",
    content: "Começando pelo atendimento excelente, muito atencioso às exigências do cliente, no conforto de um ambiente climatizado, equipado e preparado para atender às nossas expectativas.",
    avatar: "/images/userWhite.svg",
  },
  {
    name: "Gabriel Cordeiro",
    content: "Lugar top demais! Sempre que vou sou bem recebido, o ambiente é massa, bem cuidado, climatizado, dá até vontade de ficar lá trocando ideia. E o Lucas é brabo no que faz, além de ser gente boa demais!",
    avatar: "/images/userWhite.svg",
  },
];



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