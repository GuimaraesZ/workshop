# 🛍️ E-Commerce Frontend

Frontend React para o sistema de e-commerce.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **React Router DOM 6** - Roteamento
- **Tailwind CSS** - Framework CSS utility-first
- **Fetch API** - Requisições HTTP nativas

## 📦 Instalação

1. **Instale as dependências**
```bash
cd frontend
npm install
```

2. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── pages/           # Páginas da aplicação
├── services/        # Chamadas à API
├── contexts/        # Context API (estado global)
├── hooks/           # Custom hooks
├── utils/           # Funções utilitárias
├── styles/          # Estilos adicionais
├── assets/          # Imagens, ícones
├── routes/          # Configuração de rotas
├── App.jsx          # Componente principal
├── main.jsx         # Entry point
└── index.css        # Estilos globais (Tailwind)
```

## 🔌 API Proxy

O Vite está configurado para fazer proxy das requisições `/api` para o backend Spring Boot em `http://localhost:8080`.

Exemplo:
```javascript
// Faz requisição para http://localhost:8080/users
fetch('/api/users')
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🎨 Tailwind CSS

O projeto usa Tailwind CSS com classes utilitárias customizadas:

### Classes Customizadas

- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- **Cards**: `.card`
- **Inputs**: `.input`
- **Container**: `.container-custom`

### Exemplo de Uso

```jsx
<button className="btn btn-primary">
  Clique Aqui
</button>

<div className="card">
  <h2 className="text-xl font-bold">Título</h2>
  <p className="text-gray-600">Descrição</p>
</div>
```

## 🔗 Integração com Backend

Certifique-se de que o backend Spring Boot está rodando em `http://localhost:8080` antes de iniciar o frontend.
