import React from 'react';
import './ServiceCard.css';

export default function ServiceCard({ 
  title, 
  description, 
  price, 
  imageSrc, 
  additionalInfo, 
  benefits = [], 
  featured = false 
}) {
  console.log('Renderizando card com imagem:', imageSrc);
  const handleClick = () => {
    // Salva o serviço selecionado no localStorage
    const serviceData = {
      title,
      price,
      description
    };
    
    localStorage.setItem('selectedService', JSON.stringify(serviceData));
    console.log('Serviço salvo no localStorage:', serviceData);
    
    // Navega para a página de agendamento usando o caminho correto
    window.location.href = '/agendamento';
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        featured ? 'border-2 border-amber-500 transform hover:-translate-y-2 featured-card' : 'hover:-translate-y-1'
      }`}
    >
      {/* Imagem do serviço */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden service-card-image">
        <img 
          src={imageSrc || `/images/${title.toLowerCase().replace(/\s+/g, '-')}.png`} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`Erro ao carregar imagem: ${e.target.src}`);
            e.target.src = '/images/barbershop.png'; // Imagem de fallback
          }}
        />
        {featured && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 rounded-bl-lg font-medium featured-badge">
            Mais Popular
          </div>
        )}
      </div>
      
      {/* Conteúdo do card */}
      <div className="p-5 service-card-content">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 service-card-title">{title}</h3>
          <p className="text-zinc-600 mb-2 service-card-description">{description}</p>
          
          <p className="text-2xl font-bold text-amber-600 mb-3 service-card-price">{price}</p>
          
          <p className="text-zinc-700 mb-4 text-sm service-card-info">{additionalInfo}</p>
          
          {/* Lista de benefícios */}
          <ul className="space-y-2 mb-5 service-benefits">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-700 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto">
          {/* Versículo */}
          <p className="text-xs text-zinc-500 italic mb-5 service-card-verse text-center">
            "Porque o Senhor dá a sabedoria." - Provérbios 2:6
          </p>
          
          {/* Botão de agendamento */}
          <button 
            onClick={handleClick}
            className="w-full py-3 rounded-lg font-bold text-white transition-all service-card-button bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 shadow-md"
          >
            Agendar Agora
          </button>
        </div>
      </div>
    </div>
  );
}