"use client"

import { Button } from "./ui/button"

export default function ServiceCard({
  title,
  description,
  price,
  imageSrc,
  featured = false,
  benefits = [],
  whatsappNumber,
  additionalInfo = "",
}) {
  const handleSchedule = () => {
    const message = `Olá! Gostaria de agendar um ${title} por ${price}.`
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div
      className={`overflow-hidden rounded-lg shadow-lg h-full flex flex-col transition-shadow duration-300 hover:shadow-2xl ${
        featured 
          ? "border-2 border-amber-600 bg-gradient-to-br from-zinc-50 to-amber-50" 
          : "border border-zinc-200 hover:border-amber-600 bg-white"
      }`}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageSrc || "./placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
        {featured && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-700 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg shadow-md">
            Mais Popular
          </div>
        )}
      </div>
      
      <div className={`p-5 ${featured ? "bg-gradient-to-r from-amber-600 to-amber-700" : ""}`}>
        <h3 className={`text-xl font-bold ${featured ? "text-white" : "text-zinc-900"}`}>{title}</h3>
        <p className={`text-sm ${featured ? "text-amber-100" : "text-zinc-600"}`}>{description}</p>
      </div>
      
      <div className="p-5 pt-6 flex-grow">
        <p className="text-3xl font-bold text-amber-600">{price}</p>
        {additionalInfo && (
          <p className="mt-3 text-zinc-700 italic">{additionalInfo}</p>
        )}
        {benefits.length > 0 && (
          <ul className="mt-4 space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <svg className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-800" style={{ color: 'black' }}>{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Versículo bíblico coladinho com o botão */}
      <div className="px-5 border-t border-zinc-200">
        <p className="text-xs text-center text-zinc-500 italic py-2">
          {featured 
            ? '"Tudo posso naquele que me fortalece." - Filipenses 4:13' 
            : '"Porque o Senhor dá a sabedoria." - Provérbios 2:6'}
        </p>
      </div>

      <div className="px-5 pb-5">
        <Button 
          variant={featured ? "gradient" : "primary"} 
          className="w-full py-3 text-lg"
          onClick={handleSchedule}
        >
          Agendar Agora
        </Button>
      </div>
    </div>
  )
}
