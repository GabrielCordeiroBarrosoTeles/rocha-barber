import { useState } from "react"
import { Menu, X } from "./icons"
import { Button } from "./ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center group">
            <div className="relative w-10 h-10 mr-2 transform group-hover:scale-110 transition-transform duration-300">
              <img src="/images/logo.png" alt="Rocha Barber Logo" className="object-contain w-full h-full" />
            </div>
            <span className="font-bold text-xl group-hover:text-amber-400 transition-colors">Rocha Barber</span>
          </a>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors" 
            onClick={toggleMenu} 
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" onClick={(e) => {
                e.preventDefault();
                document.getElementById('inicio')?.scrollIntoView({behavior: 'smooth'});
              }} className="hover:text-amber-400 transition-colors relative group">
              Início
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/" onClick={(e) => {
                e.preventDefault();
                document.getElementById('servicos')?.scrollIntoView({behavior: 'smooth'});
              }} className="hover:text-amber-400 transition-colors relative group">
              Serviços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/" onClick={(e) => {
                e.preventDefault();
                document.getElementById('sobre')?.scrollIntoView({behavior: 'smooth'});
              }} className="hover:text-amber-400 transition-colors relative group">
              Sobre
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/" onClick={(e) => {
                e.preventDefault();
                document.getElementById('contato')?.scrollIntoView({behavior: 'smooth'});
              }} className="hover:text-amber-400 transition-colors relative group">
              Contato
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/" onClick={(e) => {
                e.preventDefault();
                document.getElementById('servicos')?.scrollIntoView({behavior: 'smooth'});
              }}>
              <Button variant="gradient" className="transform hover:scale-105 transition-transform duration-300">Agendar</Button>
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-zinc-800 py-4 animate-fadeIn">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <a href="/" className="py-2 hover:text-amber-400 transition-colors" onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                document.getElementById('inicio')?.scrollIntoView({behavior: 'smooth'});
              }}>
              Início
            </a>
            <a href="/" className="py-2 hover:text-amber-400 transition-colors" onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                document.getElementById('servicos')?.scrollIntoView({behavior: 'smooth'});
              }}>
              Serviços
            </a>
            <a href="/" className="py-2 hover:text-amber-400 transition-colors" onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                document.getElementById('sobre')?.scrollIntoView({behavior: 'smooth'});
              }}>
              Sobre
            </a>
            <a href="/" className="py-2 hover:text-amber-400 transition-colors" onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                document.getElementById('contato')?.scrollIntoView({behavior: 'smooth'});
              }}>
              Contato
            </a>
            <a href="/" className="w-full" onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                document.getElementById('servicos')?.scrollIntoView({behavior: 'smooth'});
              }}>
              <Button variant="gradient" className="w-full">
                Agendar
              </Button>
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}