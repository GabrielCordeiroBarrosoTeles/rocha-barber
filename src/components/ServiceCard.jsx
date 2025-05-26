import { Button } from "./ui/button"

export default function ServiceCard({ title, description, price, image, imageSrc, featured, additionalInfo, benefits, whatsappNumber }) {
  // Função para selecionar o serviço e redirecionar para a página de agendamento
  const handleSelectService = () => {
    // Salvar o serviço selecionado no localStorage
    localStorage.setItem('selectedService', JSON.stringify({
      title,
      description,
      price
    }));
    
    // Redirecionar para a página de agendamento
    window.location.href = '/agendamento';
  };

  // Determinar se este é o card do plano mensal (para adicionar a tag "Mais Popular")
  const isPlanCard = title === "Plano Mensal";

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-lg border border-zinc-100 transition-all hover:shadow-xl h-full flex flex-col ${featured ? 'ring-2 ring-amber-500' : ''}`}>
      <div className="h-48 overflow-hidden">
        <img 
          src={imageSrc || image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {isPlanCard && (
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
            Mais Popular
          </span>
        )}
        <h3 className="text-xl font-bold text-zinc-900 mb-1">{title}</h3>
        <p className="text-zinc-600 mb-4">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-amber-600 font-bold text-lg">{price}</span>
        </div>
        
        {additionalInfo && (
          <p className="text-zinc-600 text-sm mb-4 border-t border-zinc-100 pt-4">
            {additionalInfo}
          </p>
        )}
        
        {benefits && benefits.length > 0 && (
          <ul className="space-y-2 mb-4 flex-grow">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-700 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        )}
        
        <div className="text-center text-xs text-zinc-500 italic mb-4">
          {isPlanCard ? 
            '"Tudo posso naquele que me fortalece." - Filipenses 4:13' : 
            '"Porque o Senhor dá a sabedoria." - Provérbios 2:6'}
        </div>
        
        <Button 
          variant="primary" 
          onClick={handleSelectService}
          className="w-full bg-amber-600 hover:bg-amber-700 py-2.5 mt-auto"
        >
          Agendar Agora
        </Button>
      </div>
    </div>
  )
}