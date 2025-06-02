import { Button } from "./ui/button"

export default function CTA() {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para um novo visual?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Agende seu horário agora mesmo e experimente o melhor serviço de barbearia da região.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#servicos">
            <Button 
              variant="secondary" 
              className="bg-white text-amber-600 hover:bg-zinc-100 border-white px-8 py-3 h-auto text-lg"
            >
              Agendar agora
            </Button>
          </a>
          <a href="#servicos">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-3 h-auto text-lg"
            >
              Ver serviços
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}