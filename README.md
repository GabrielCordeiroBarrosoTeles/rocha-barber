# Rocha Barber - Site Institucional

![Rocha Barber Logo](./public/images/logo.png)

<!-- Header Image -->

![Header](https://raw.githubusercontent.com/GabrielCordeiroBarrosoTeles/Imgs_repositorios/main/rocha-barber/header.png)

## 📋 Visão Geral

Este é um site institucional responsivo para a barbearia Rocha Barber, desenvolvido com React e Vite. O site segue o conceito de Mobile First, garantindo uma experiência otimizada em dispositivos móveis e desktops.

## 🚀 Instalação e Execução

### Pré-requisitos

* Node.js 18.17.0 ou superior
* npm ou yarn

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/GabrielCordeiroBarrosoTeles/rocha-barber.git
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

* **React**: Biblioteca JavaScript para construção de interfaces
* **Vite**: Build tool e servidor de desenvolvimento
* **Tailwind CSS**: Framework CSS para design responsivo
* **React Icons**: Biblioteca de ícones para React

## 📱 Recursos e Funcionalidades

### Seção de Serviços

<!-- Card Services Image -->

![Serviços](https://raw.githubusercontent.com/GabrielCordeiroBarrosoTeles/Imgs_repositorios/main/rocha-barber/cardServices.png)

* **Design Responsivo**: Adaptação perfeita para todos os tamanhos de tela
* **Seção de Serviços**: Apresentação dos serviços oferecidos pela barbearia
* **Galeria de Fotos**: Mostra do ambiente e trabalhos realizados
* **Formulário de Contato**: Facilidade para clientes entrarem em contato
* **Depoimentos**: Feedback de clientes satisfeitos
* **Informações de Localização**: Endereço e mapa para fácil localização

### Sobre Mim

<!-- About Me Image -->

![Sobre Mim](https://raw.githubusercontent.com/GabrielCordeiroBarrosoTeles/Imgs_repositorios/main/rocha-barber/aboutMe.png)

Aqui você encontra nossa história, missão e valores.

### Depoimentos

<!-- Feedback Image -->

![Depoimentos](https://raw.githubusercontent.com/GabrielCordeiroBarrosoTeles/Imgs_repositorios/main/rocha-barber/feedback.png)

Nossos clientes satisfeitos compartilham suas experiências.

## 📤 Deploy na Vercel

### Método Automático (Recomendado)

1. Faça um fork deste repositório ou crie um novo repositório no GitHub
2. Clone o repositório para sua máquina local
3. Faça suas alterações
4. Commit e push para o repositório remoto
5. O GitHub Actions automaticamente fará o deploy para o GitHub Pages

### Método Manual

#### Passo 1: Configurar o arquivo vite.config.js

O arquivo já está configurado com `base: "/rocha-barber/"` para funcionar com GitHub Pages.

#### Passo 2: Criar um repositório no GitHub

Crie um novo repositório no GitHub com o nome "rocha-barber".

#### Passo 3: Inicializar Git e fazer o primeiro commit

```bash
git init
git add .
git commit -m "Primeiro commit"
git branch -M main
git remote add origin https://github.com/GabrielCordeiroBarrosoTeles/rocha-barber.git
git push -u origin main
```

#### Passo 4: Deploy para GitHub Pages

```bash
npm run deploy
```

Isso irá construir o projeto e publicá-lo na branch gh-pages do seu repositório.

#### Passo 5: Configurar GitHub Pages

1. Vá para as configurações do seu repositório no GitHub
2. Navegue até a seção "Pages"
3. Selecione a branch "gh-pages" como fonte
4. Clique em "Save"

Seu site estará disponível em `https://GabrielCordeiroBarrosoTeles.github.io/rocha-barber/`

## 🧩 Estrutura do Projeto

```
rocha-barber/
├── public/
│   └── images/         # Imagens estáticas
│       └── header.png
│       └── cardServices.png
│       └── aboutMe.png
│       └── feedback.png
│       └── footer.png
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

<!-- Footer Image -->

![Footer](https://raw.githubusercontent.com/GabrielCordeiroBarrosoTeles/Imgs_repositorios/main/rocha-barber/footer.png)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por [Gabriel Cordeiro](https://github.com/GabrielCordeiroBarrosoTeles)

---

© 2023 Rocha Barber. Todos os direitos reservados.
