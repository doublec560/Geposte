# Gepost - Gestão Inteligente de Redes Sociais

## Sobre o Projeto

O **Gepost** é um sistema SaaS completo para gestão de redes sociais com inteligência artificial integrada. A plataforma permite criar, agendar e gerenciar conteúdo para múltiplas redes sociais de forma eficiente e inteligente.

### 🚀 Funcionalidades Principais

- **Gerador de Imagens com IA**: Criação de imagens usando DALL-E 3 da OpenAI
- **Gerador de Copys Inteligente**: Criação de conteúdo otimizado para cada rede social
- **Suporte Multi-Plataforma**: Instagram, Facebook, LinkedIn, Twitter, YouTube
- **Interface Responsiva**: Design adaptativo para desktop e mobile
- **Temas Claro/Escuro**: Alternância entre modos de visualização
- **Calendário de Publicações**: Organização e agendamento de conteúdo

### 🎯 Redes Sociais Suportadas

- **Instagram**: Posts, Stories, Reels
- **Facebook**: Posts e páginas empresariais
- **LinkedIn**: Conteúdo profissional e networking
- **Twitter**: Tweets e threads
- **YouTube**: Descrições e conteúdo para vídeos

## 🛠️ Como Desenvolver

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Chave da API OpenAI (para funcionalidades de IA)

### Configuração do Ambiente

1. **Clone o repositório**:
```bash
git clone <URL_DO_REPOSITORIO>
cd gepost
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_OPENAI_KEY=sua_chave_openai_aqui
VITE_COPY_GENERATION_SYSTEM=prompt_personalizado_opcional
VITE_IMAGE_ENHANCE_PROMPT=prompt_personalizado_opcional
```

4. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
```

5. **Acesse a aplicação**:
Abra seu navegador em `http://localhost:8080`

### 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run build:dev` - Gera build de desenvolvimento
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter ESLint

## 🏗️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI reutilizáveis
- **Lucide React** - Ícones SVG

### Integrações
- **OpenAI API** - Geração de imagens (DALL-E 3) e texto (GPT-4)
- **React Router** - Roteamento da aplicação
- **React Hook Form** - Gerenciamento de formulários
- **Sonner** - Sistema de notificações toast

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para qualidade de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Plataformas Recomendadas
- **Vercel** - Deploy automático com integração Git
- **Netlify** - Hospedagem estática com CI/CD
- **GitHub Pages** - Hospedagem gratuita para projetos públicos

### Configuração de Produção
1. Configure as variáveis de ambiente na plataforma escolhida
2. Faça o build do projeto
3. Deploy da pasta `dist` gerada

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── layout/         # Componentes de layout
├── pages/              # Páginas da aplicação
├── services/           # Serviços e integrações
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
└── index.css          # Estilos globais
```

## 🔧 Configuração da API OpenAI

1. Crie uma conta na [OpenAI](https://platform.openai.com/)
2. Gere uma chave de API
3. Adicione a chave no arquivo `.env`:
```env
VITE_OPENAI_KEY=sk-...
```

⚠️ **Importante**: Nunca commite chaves de API no repositório!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas, entre em contato através dos issues do GitHub.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
