# Rocha Barber - Site Institucional

![Rocha Barber Logo](./public/images/logo.png)

## 📋 Visão Geral

Este é um site institucional responsivo para a barbearia Rocha Barber, desenvolvido com React e Vite. O site segue o conceito de Mobile First, garantindo uma experiência otimizada em dispositivos móveis e desktops.

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18.17.0 ou superior
- npm ou yarn

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/seu-usuario/rocha-barber.git
cd rocha-barber
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Executar o projeto em ambiente de desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:5173`.

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces
- **Vite**: Build tool e servidor de desenvolvimento
- **Tailwind CSS**: Framework CSS para design responsivo
- **React Icons**: Biblioteca de ícones para React

## 📱 Recursos e Funcionalidades

- **Design Responsivo**: Adaptação perfeita para todos os tamanhos de tela
- **Seção de Serviços**: Apresentação dos serviços oferecidos pela barbearia
- **Galeria de Fotos**: Mostra do ambiente e trabalhos realizados
- **Formulário de Contato**: Facilidade para clientes entrarem em contato
- **Depoimentos**: Feedback de clientes satisfeitos
- **Informações de Localização**: Endereço e mapa para fácil localização

## 📤 Deploy na Vercel

### Método Automático (Recomendado)

1. Faça um fork deste repositório ou crie um novo repositório no GitHub
2. Importe o repositório na Vercel (https://vercel.com/import)
3. A Vercel detectará automaticamente que é um projeto React + Vite
4. Clique em "Deploy" e aguarde a conclusão do processo

O site estará disponível em `https://rocha-barber.vercel.app` ou em um domínio personalizado que você configurar.

### Configurações Importantes para Vercel

- Certifique-se de que o arquivo `vite.config.js` **não** tenha a configuração `base` definida
- Verifique se todos os caminhos de imagens e recursos estão usando caminhos relativos (começando com `./`)
- Se encontrar problemas com tela branca, verifique os logs de build na Vercel para identificar possíveis erros

## 🧩 Estrutura do Projeto

```
rocha-barber/
├── public/
│   └── images/         # Imagens estáticas
├── src/
│   ├── components/     # Componentes React
│   │   ├── ui/         # Componentes de UI reutilizáveis
│   │   └── ...         # Outros componentes específicos
│   ├── lib/            # Funções utilitárias
│   ├── App.jsx         # Componente principal
│   ├── index.css       # Estilos globais
│   └── main.jsx        # Ponto de entrada
├── index.html          # Template HTML
├── package.json        # Dependências e scripts
├── vite.config.js      # Configuração do Vite
└── README.md           # Documentação
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por [Seu Nome](https://github.com/seu-usuario)

---

© 2023 Rocha Barber. Todos os direitos reservados.