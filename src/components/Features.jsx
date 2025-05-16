import { Scissors, Calendar, MapPin } from "./icons"

export default function Features() {
  return (
    <section className="w-full py-16 bg-zinc-900 text-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 border border-zinc-700 rounded-lg hover:border-amber-600 transition-colors transform hover:scale-105 hover:shadow-xl duration-300">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Profissional Qualificado</h3>
            <p className="text-zinc-400">
              Atendimento personalizado com técnicas modernas e atenção aos detalhes para um resultado perfeito.
            </p>
          </div>

          <div className="text-center p-6 border border-zinc-700 rounded-lg hover:border-amber-600 transition-colors transform hover:scale-105 hover:shadow-xl duration-300">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Agendamento Fácil</h3>
            <p className="text-zinc-400">Agende seu horário pelo WhatsApp e evite filas de espera.</p>
          </div>

          <div className="text-center p-6 border border-zinc-700 rounded-lg hover:border-amber-600 transition-colors transform hover:scale-105 hover:shadow-xl duration-300">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ambiente Aconchegante</h3>
            <p className="text-zinc-400">Um espaço pensado para seu conforto, com bebidas e boa música.</p>
          </div>
        </div>
      </div>
    </section>
  )
}