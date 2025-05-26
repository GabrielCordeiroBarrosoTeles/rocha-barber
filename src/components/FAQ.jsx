import { useState } from 'react';

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqItems = [
    {
      question: "Como funciona o agendamento?",
      answer: "Para agendar, basta clicar no botão 'Agende seu horário' e preencher o formulário com seu nome, escolher a data e horário disponíveis. Você receberá uma confirmação após concluir o agendamento."
    },
    {
      question: "O que é o plano mensal?",
      answer: "O plano mensal dá direito a 4 cortes por mês por R$ 120,00. É ideal para quem deseja manter o visual sempre em dia com economia. Importante: ao usar o plano mensal, digite seu nome EXATAMENTE da mesma forma em todos os agendamentos para que o sistema reconheça seu plano."
    },
    {
      question: "Posso cancelar ou remarcar meu agendamento?",
      answer: "Sim, para cancelar ou remarcar, entre em contato conosco pelo WhatsApp com pelo menos 2 horas de antecedência. Para clientes com plano mensal, o agendamento cancelado será devolvido ao seu saldo de cortes disponíveis."
    },
    {
      question: "Quais são os dias e horários de funcionamento?",
      answer: "Estamos abertos de segunda a sexta-feira, das 8h às 18h. Não abrimos aos sábados e domingos. Os horários disponíveis para agendamento são exibidos no momento da reserva."
    },
    {
      question: "Como funciona a renovação do plano mensal?",
      answer: "O plano mensal é renovado automaticamente a cada mês. Os cortes não utilizados não acumulam para o mês seguinte, mas o sistema mantém seu histórico de uso por até 12 meses."
    },
    {
      question: "Preciso levar algo no dia do corte?",
      answer: "Apenas sua presença no horário agendado. Recomendamos chegar com 5 minutos de antecedência. Se tiver alguma referência de corte, pode trazer uma foto para mostrar ao barbeiro."
    }
  ];

  return (
    <section id="faq" className="w-full py-16 bg-gradient-to-b from-zinc-100 to-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full"></div>
          <p className="mt-4 text-zinc-600 max-w-2xl mx-auto text-lg">
            Tire suas dúvidas sobre nossos serviços e funcionamento
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`mb-5 border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${openItem === index ? 'shadow-md' : ''}`}
            >
              <button
                className={`w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none ${openItem === index ? 'bg-amber-50' : ''}`}
                onClick={() => toggleItem(index)}
              >
                <span className={`font-medium ${openItem === index ? 'text-amber-800' : 'text-zinc-900'}`}>{item.question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openItem === index ? 'bg-amber-100' : 'bg-zinc-100'}`}>
                  <svg 
                    className={`w-5 h-5 ${openItem === index ? 'text-amber-600' : 'text-zinc-500'} transform transition-transform duration-300 ${openItem === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 py-4 text-zinc-600 border-t border-zinc-100">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}