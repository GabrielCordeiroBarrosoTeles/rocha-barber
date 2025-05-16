import { Calendar, MapPin, Phone } from "./icons"
import { Button } from "./ui/button"

export default function Contact() {
  const whatsappNumber = "558596988973"

  return (
    <section id="contato" className="w-full py-16 bg-zinc-900 text-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Onde nos encontrar</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-lg h-full shadow-lg hover:shadow-xl transition-all duration-300 border border-zinc-700 hover:border-amber-600">
              <div className="mb-6">
                <h3 className="font-semibold text-xl mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                  Endereço
                </h3>
                <p className="text-zinc-300">Rua Floro Bartolomeu, 305</p>
                <p className="text-zinc-300">São João do Tauape - Fortaleza</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-xl mb-2 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                  Horário de Funcionamento
                </h3>
                <p className="text-zinc-300">Segunda a Sábado: 9h às 20h</p>
                <p className="text-zinc-300">Domingos e Feriados: Fechado</p>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-amber-500" />
                  Contato
                </h3>
                <p className="text-zinc-300">Telefone: (85) 9698-8973</p>
                <p className="text-zinc-300">Email: contato@rochabarber.com</p>
              </div>
              <div className="mt-8">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Fale conosco no WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-auto rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            {/* Mapa interativo com localização real */}
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center p-0">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.1536383557424!2d-38.51290792414866!3d-3.7626382430614166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74f1a7c1c7c9d%3A0x9c0f3f49d8f8c4a0!2sR.%20Floro%20Bartolomeu%2C%20305%20-%20S%C3%A3o%20Jo%C3%A3o%20do%20Tauape%2C%20Fortaleza%20-%20CE%2C%2060120-080!5e0!3m2!1spt-BR!2sbr!4v1625097721306!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Localização da Rocha Barber"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}