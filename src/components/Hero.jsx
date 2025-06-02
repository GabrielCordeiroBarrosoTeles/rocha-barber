import { Button } from "./ui/button"

export default function Hero() {
  return (
    <section id="inicio" className="w-full bg-zinc-900 text-white relative overflow-hidden">
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 to-zinc-900/70 z-10"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          //src="./images/barbershop.png"
          src="https://i.pinimg.com/736x/09/64/58/096458c2b6e3d338fbbd6a4bd6dd3cfb.jpg"   
          alt="Barbershop Background" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="container px-4 py-20 mx-auto flex flex-col items-center text-center md:py-32 relative z-20">
        <div className="w-48 h-48 relative mb-6 animate-fade-in">
          <img src="./images/logo.png" alt="Rocha Barber Logo" className="object-contain w-full h-full drop-shadow-lg" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-2 drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
            Rocha Barber
          </span>
        </h1>
        <p className="mt-4 text-xl text-zinc-100 max-w-md drop-shadow-md">
          Estilo e precisão em cada corte. Sua melhor versão começa aqui.
        </p>
        <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
          <a
            href="#servicos"
            className="block sm:inline-block transform hover:scale-105 transition-transform duration-300"
          >
            <Button variant="gradient" className="w-full sm:w-auto text-lg px-8 py-3 h-auto">
              Agende seu horário
            </Button>
          </a>
          <a
            href="#servicos"
            className="block sm:inline-block transform hover:scale-105 transition-transform duration-300"
          >
            <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 h-auto bg-zinc-800/50 text-white border-zinc-600 hover:bg-zinc-700">
              Nossos serviços
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}