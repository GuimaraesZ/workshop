# 🛍️ E-Commerce Full Stack

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.13-06B6D4)
![Maven](https://img.shields.io/badge/Maven-3.9.11-red)

Sistema de e-commerce completo com **backend Spring Boot** e **frontend React**, implementando autenticação JWT, gerenciamento de produtos, carrinho de compras, checkout, upload de imagens e painel administrativo.

## 📋 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#️-tecnologias)
- [Arquitetura](#️-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Páginas e Rotas Frontend](#-páginas-e-rotas-frontend)
- [Modelo de Dados](#-modelo-de-dados)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Upload de Imagens](#-upload-de-imagens)
- [Tratamento de Exceções](#-tratamento-de-exceções)
- [Testes](#-testes)

## 🎯 Sobre o Projeto

**Loja da Rosy** é um sistema de e-commerce completo desenvolvido com arquitetura full stack moderna. O projeto oferece uma experiência de compra completa desde o catálogo de produtos até a finalização do pedido, com gerenciamento de perfil, upload de imagens e painel de pedidos.

### 🌟 Características Principais

#### Backend
- ✅ API REST com Spring Boot 3.5.6
- ✅ Autenticação JWT com refresh tokens
- ✅ Upload de imagens (usuários e produtos)
- ✅ CRUD completo para todas as entidades
- ✅ Relacionamentos JPA complexos
- ✅ Tratamento de exceções personalizado
- ✅ Validação de integridade de dados
- ✅ CORS configurado para frontend
- ✅ Perfis de desenvolvimento (dev/test/prod)

#### Frontend
- ✅ Interface moderna e responsiva com React 18 + Tailwind CSS
- ✅ Autenticação completa (Login, Signup, Logout)
- ✅ Proteção de rotas com React Router
- ✅ Sistema de carrinho de compras persistente
- ✅ Checkout em 3 etapas (Entrega, Pagamento, Revisão)
- ✅ Gerenciamento de perfil com upload de foto
- ✅ Dashboard com estatísticas de pedidos
- ✅ Catálogo de produtos com filtros e busca
- ✅ Sistema de favoritos
- ✅ Tema claro/escuro
- ✅ Design responsivo mobile-first

## 🚀 Funcionalidades

### 🔐 Autenticação e Autorização
- **Login/Signup**: Sistema completo de registro e autenticação
- **JWT Tokens**: Autenticação stateless com tokens de acesso
- **Proteção de Rotas**: Rotas privadas no frontend e backend
- **Gerenciamento de Sessão**: Persistência de autenticação com localStorage

### 👤 Gerenciamento de Usuários
- **Perfil Completo**: Dados pessoais, endereço completo (CEP, rua, número, bairro, complemento)
- **Upload de Foto**: Avatar personalizado com preview
- **Edição de Dados**: Atualização de informações em tempo real
- **Alteração de Senha**: Segurança com confirmação
- **Exclusão de Conta**: Remoção completa com confirmação

### 🛒 Sistema de Compras
- **Catálogo de Produtos**: Grid responsivo com imagens, preços e avaliações
- **Carrinho de Compras**: 
  - Adicionar/remover produtos
  - Ajustar quantidades
  - Cálculo automático de totais
  - Persistência em localStorage
- **Sistema de Checkout**:
  - 📦 **Etapa 1 - Entrega**: Formulário pré-preenchido com dados do usuário
  - 💳 **Etapa 2 - Pagamento**: Cartão de crédito, PIX ou Boleto
  - ✅ **Etapa 3 - Revisão**: Confirmação antes de finalizar
  - 3 opções de frete (Padrão, Express, Mesmo dia)
- **Página de Confirmação**: Detalhes do pedido e código de rastreamento

### 📦 Gerenciamento de Pedidos
- **Meus Pedidos**: Histórico completo de compras
- **Status dos Pedidos**: Aguardando Pagamento, Pago, Enviado, Entregue, Cancelado
- **Detalhes do Pedido**: Produtos, quantidades, valores e pagamento
- **Dashboard**: Estatísticas (Total de pedidos, Em andamento, Concluídos, Total gasto)

### 📸 Upload de Imagens
- **Foto de Perfil**: Upload de avatar do usuário
- **Imagens de Produtos**: Upload de fotos dos produtos
- **Preview em Tempo Real**: Visualização antes de salvar
- **Armazenamento**: Sistema de arquivos local (uploads/users/, uploads/products/)

### 🎨 Interface e UX
- **Design Moderno**: Interface clean com Tailwind CSS
- **Tema Claro/Escuro**: Toggle de tema persistente
- **Responsivo**: Layout adaptável para mobile, tablet e desktop
- **Sidebar Colapsável**: Navegação otimizada para espaço
- **Feedback Visual**: Loading states, toasts e notificações
- **Sistema de Favoritos**: Salvar produtos preferidos

## 🛠️ Tecnologias

### Backend
- **Java 21** - Linguagem de programação
- **Spring Boot 3.5.6** - Framework principal
- **Spring Data JPA** - Persistência de dados
- **Spring Security** - Autenticação e autorização
- **JWT (JSON Web Tokens)** - Autenticação stateless
- **Hibernate ORM 6.6.29** - Mapeamento objeto-relacional
- **Maven** - Gerenciador de dependências
- **PostgreSQL 17.6** - Banco de dados principal
- **H2 Database** - Banco de dados em memória (testes)

### Frontend
- **React 18.3.1** - Biblioteca JavaScript
- **Vite 5.4.20** - Build tool e dev server
- **React Router DOM 7.1.1** - Roteamento SPA
- **Tailwind CSS 3.4.13** - Framework CSS utility-first
- **Lucide React** - Ícones modernos
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado global

### Ferramentas de Desenvolvimento
- **Spring DevTools** - Hot reload em desenvolvimento
- **ESLint** - Linter para JavaScript/React
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 🏗️ Arquitetura

### Estrutura do Projeto

```
workshop/
├── backend/                        # Spring Boot Application
│   ├── src/main/java/com/educandofe/course/
│   │   ├── Model/                  # Entidades JPA
│   │   │   ├── UserModel.java
│   │   │   ├── OrderModel.java
│   │   │   ├── ProductModel.java
│   │   │   ├── CategoryModel.java
│   │   │   ├── OrderItemModel.java
│   │   │   ├── PaymentsModel.java
│   │   │   └── Enums/
│   │   │       └── OrderStatus.java
│   │   ├── resources/              # Controllers REST
│   │   │   ├── UserResource.java
│   │   │   ├── OrderResource.java
│   │   │   ├── ProductResource.java
│   │   │   ├── CategoryResource.java
│   │   │   └── exception/
│   │   ├── services/               # Lógica de negócio
│   │   │   ├── UserService.java
│   │   │   ├── OrderService.java
│   │   │   ├── ProductService.java
│   │   │   ├── CategoryService.java
│   │   │   └── AuthService.java    # JWT Authentication
│   │   ├── repositorys/            # Camada de dados
│   │   │   ├── UserRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   └── CategoryRepository.java
│   │   ├── config/
│   │   │   ├── CorsConfig.java     # Configuração CORS
│   │   │   ├── WebConfig.java      # Upload de arquivos
│   │   │   └── TesteConfig.java    # Dados de teste
│   │   ├── controllers/
│   │   │   ├── AuthController.java              # Login/Signup
│   │   │   ├── ImageUploadController.java       # Upload de produtos
│   │   │   └── UserImageUploadController.java   # Upload de usuários
│   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── LoginRequest.java
│   │   │   ├── SignupRequest.java
│   │   │   ├── JwtResponse.java
│   │   │   └── UserDTO.java
│   │   └── Main.java               # Classe principal
│   └── src/main/resources/
│       ├── application.properties
│       ├── static/
│       └── uploads/                # Imagens enviadas
│           ├── users/
│           └── products/
│
└── frontend/                       # React Application
    ├── src/
    │   ├── components/             # Componentes reutilizáveis
    │   │   ├── Sidebar.jsx         # Menu lateral
    │   │   ├── Header.jsx          # Cabeçalho
    │   │   ├── ProductCard.jsx     # Card de produto
    │   │   └── ProtectedRoute.jsx  # Proteção de rotas
    │   ├── pages/                  # Páginas principais
    │   │   ├── Login.jsx           # Autenticação
    │   │   ├── Signup.jsx          # Registro
    │   │   ├── Dashboard.jsx       # Painel principal
    │   │   ├── Shop.jsx            # Catálogo
    │   │   ├── Cart.jsx            # Carrinho
    │   │   ├── Checkout.jsx        # Finalizar compra
    │   │   ├── OrderConfirmation.jsx
    │   │   ├── Profile.jsx         # Gerenciamento de perfil
    │   │   ├── Orders.jsx          # Meus pedidos
    │   │   └── Favorites.jsx       # Favoritos
    │   ├── contexts/               # Context API
    │   │   ├── AuthContext.jsx     # Autenticação global
    │   │   └── CartContext.jsx     # Carrinho global
    │   ├── services/               # Integração com API
    │   │   └── api.js              # Axios configuration
    │   ├── routes/
    │   │   └── AppRoutes.jsx       # Configuração de rotas
    │   ├── App.jsx                 # Componente raiz
    │   └── main.jsx                # Entry point
    ├── public/
    │   └── placeholder.svg         # Imagem padrão
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 📦 Instalação

### Pré-requisitos

- **Java 21** ou superior ([Download](https://adoptium.net/))
- **Node.js 18+** e npm ([Download](https://nodejs.org/))
- **Maven 3.9+** ([Download](https://maven.apache.org/))
- **PostgreSQL 17.6** ([Download](https://www.postgresql.org/))
- **Git** ([Download](https://git-scm.com/))

### Passos para Instalação

#### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/GuimaraesZ/workshop.git
cd workshop
```

#### 2️⃣ Configure o Banco de Dados PostgreSQL
```sql
CREATE DATABASE educandofe;
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE educandofe TO seu_usuario;
```

#### 3️⃣ Configure o Backend
Edite o arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/educandofe
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

#### 4️⃣ Compile e Execute o Backend
```bash
# Compile o projeto
./mvnw clean install

# Execute a aplicação
./mvnw spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

#### 5️⃣ Configure e Execute o Frontend
```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

## ⚙️ Como Rodar o Projeto

### Desenvolvimento Local

#### Backend (Terminal 1)
```bash
cd workshop
./mvnw spring-boot:run
```

#### Frontend (Terminal 2)
```bash
cd workshop/frontend
npm run dev
```

### Build para Produção

#### Backend
```bash
./mvnw clean package
java -jar target/course-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm run build
# Os arquivos otimizados estarão em frontend/dist/
```

### Variáveis de Ambiente

#### Backend (`application.properties`)
```properties
# Servidor
server.port=8080

# Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/educandofe
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Upload de Arquivos
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS
cors.allowed-origins=http://localhost:5173
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8080
```

## 🔌 Endpoints da API

### Base URL
```
http://localhost:8080
```

### 🔐 Autenticação

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/auth/login` | Login de usuário | `{ "email": "user@email.com", "password": "123" }` |
| POST | `/auth/signup` | Registro de novo usuário | `{ "name": "User", "email": "user@email.com", "password": "123" }` |

#### Exemplo de Resposta (Login)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com"
}
```

### 👤 Users

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/users` | Lista todos os usuários | ✅ Required |
| GET | `/users/{id}` | Busca usuário por ID | ✅ Required |
| POST | `/users` | Cria novo usuário | ❌ Public |
| PUT | `/users/{id}` | Atualiza usuário | ✅ Required |
| DELETE | `/users/{id}` | Deleta usuário | ✅ Required |

#### Exemplo: Criar Usuário
```bash
POST http://localhost:8080/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "password": "senha123",
  "birthDate": "1990-05-15",
  "address": "Rua das Flores",
  "houseNumber": "123",
  "neighborhood": "Centro",
  "complement": "Apto 45",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01310-100"
}
```

### 📦 Products

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products` | Lista todos os produtos |
| GET | `/products/{id}` | Busca produto por ID |

### 📁 Categories

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/categories` | Lista todas as categorias |
| GET | `/categories/{id}` | Busca categoria por ID |

### 🛒 Orders

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/orders` | Lista todos os pedidos |
| GET | `/orders/{id}` | Busca pedido por ID |

### 📸 Upload de Imagens

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/users/{userId}/upload-image` | Upload de foto do usuário | `multipart/form-data: image` |
| POST | `/products/upload-image` | Upload de foto do produto | `multipart/form-data: image` |

#### Exemplo: Upload de Imagem
```bash
POST http://localhost:8080/users/1/upload-image
Content-Type: multipart/form-data
Authorization: Bearer {token}

image: [arquivo.jpg]
```

## 🌐 Páginas e Rotas Frontend

### Rotas Públicas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/login` | Login.jsx | Página de autenticação |
| `/signup` | Signup.jsx | Cadastro de novos usuários |

### Rotas Protegidas (Requer Autenticação)

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Dashboard.jsx | Painel principal com estatísticas |
| `/shop` | Shop.jsx | Catálogo de produtos (Loja) |
| `/categories` | Categories.jsx | Navegação por categorias |
| `/cart` | Cart.jsx | Carrinho de compras |
| `/checkout` | Checkout.jsx | Finalização de compra (3 etapas) |
| `/order-confirmation/:orderId` | OrderConfirmation.jsx | Confirmação do pedido |
| `/orders` | Orders.jsx | Histórico de pedidos |
| `/profile` | Profile.jsx | Gerenciamento de perfil |
| `/addresses` | Addresses.jsx | Gerenciamento de endereços |
| `/favorites` | Favorites.jsx | Produtos favoritos |

### Navegação Principal (Sidebar)

- 🏠 **Dashboard** - Visão geral da conta
- 🛍️ **Loja** - Catálogo completo de produtos
- 📦 **Meus Pedidos** - Histórico e status
- 🛒 **Carrinho** - Produtos selecionados (com badge de quantidade)
- 👤 **Perfil** - Dados pessoais e configurações
- 📍 **Endereços** - Gerenciamento de entrega
- ❤️ **Favoritos** - Produtos salvos

## 📊 Modelo de Dados

### Diagrama de Relacionamentos

```
User (1) ─────< (N) Order
                    │
                    │ (1)
                    ▼
                 Payment (1)
                    
Order (N) ─────< OrderItem >───── (N) Product
                                      │
                                      │
                              Category (N)
```

### Entidades Principais

#### UserModel
```java
- id: Long
- name: String
- email: String (unique)
- phone: String
- password: String (encrypted)
- storeName: String
- profileImage: String
- birthDate: LocalDate
- address: String
- houseNumber: String
- neighborhood: String
- complement: String
- city: String
- state: String
- zipCode: String
- orders: List<OrderModel>
```

#### OrderModel
```java
- id: Long
- moment: LocalDateTime
- orderStatus: OrderStatus (ENUM)
- client: UserModel
- items: Set<OrderItemModel>
- payment: PaymentsModel
+ getTotal(): Double
```

#### ProductModel
```java
- id: Long
- name: String
- description: String
- price: Double
- imgUrl: String
- categories: Set<CategoryModel>
```

#### CategoryModel
```java
- id: Long
- name: String
- products: Set<ProductModel>
```

#### OrderItemModel (Tabela Associativa)
```java
- id: OrderItemPk (Chave Composta)
- order: OrderModel
- product: ProductModel
- quantity: Integer
- price: Double
+ getSubTotal(): Double
```

#### PaymentsModel
```java
- id: Long
- moment: LocalDateTime
- order: OrderModel (OneToOne)
```

### Status do Pedido (Enum)

```java
WAITING_PAYMENT(1)  // Aguardando Pagamento - Amarelo
PAID(2)             // Pago - Verde
SHIPPED(3)          // Enviado - Azul
DELIVERED(4)        // Entregue - Verde escuro
CANCELED(5)         // Cancelado - Vermelho
```

## 🔐 Autenticação e Segurança

### Sistema JWT

O projeto utiliza **JSON Web Tokens (JWT)** para autenticação stateless.

#### Fluxo de Autenticação

1. **Login**: Usuário envia email e senha
2. **Validação**: Backend verifica credenciais
3. **Token**: Backend gera JWT com informações do usuário
4. **Armazenamento**: Frontend salva token no localStorage
5. **Requisições**: Token é enviado no header `Authorization: Bearer {token}`
6. **Validação**: Backend valida token em rotas protegidas

#### Estrutura do Token JWT

```json
{
  "sub": "user@email.com",
  "userId": 1,
  "name": "João Silva",
  "iat": 1696348800,
  "exp": 1696435200
}
```

### Proteção de Rotas

#### Backend
- Todas as rotas `/auth/*` são públicas
- Demais endpoints requerem token JWT válido
- Middleware valida token antes de processar requisição

#### Frontend
- Componente `ProtectedRoute` verifica autenticação
- Redireciona para `/login` se não autenticado
- `AuthContext` gerencia estado global de autenticação

### Senhas
- **Hash**: Senhas são criptografadas antes de salvar no banco
- **Validação**: Nunca são retornadas em respostas da API
- **Alteração**: Requer confirmação da senha atual

## 📸 Upload de Imagens

### Sistema de Upload

#### Usuários
- **Endpoint**: `POST /users/{userId}/upload-image`
- **Destino**: `src/main/resources/uploads/users/`
- **Formato**: `user_{userId}_{timestamp}.{ext}`
- **Limite**: 10MB
- **Formatos**: JPG, PNG, JPEG, GIF

#### Produtos
- **Endpoint**: `POST /products/upload-image`
- **Destino**: `src/main/resources/uploads/products/`
- **Formato**: `product_{productId}_{timestamp}.{ext}`
- **Limite**: 10MB
- **Formatos**: JPG, PNG, JPEG, GIF

### Fluxo de Upload

1. **Frontend**: Usuário seleciona imagem
2. **Preview**: Visualização antes de enviar
3. **Upload**: Envio via FormData (multipart/form-data)
4. **Backend**: Salva arquivo e atualiza banco
5. **Resposta**: Retorna URL da imagem
6. **Exibição**: Frontend exibe nova imagem

### Configuração

```properties
# application.properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Acesso às Imagens

```
# Usuários
http://localhost:8080/uploads/users/user_1_1696348800.jpg

# Produtos
http://localhost:8080/uploads/products/product_5_1696348800.jpg
```

## 🚨 Tratamento de Exceções

### Exceções Personalizadas

#### ResourceNotFoundException (404)
Lançada quando um recurso não é encontrado.

```json
{
  "timestamp": "2025-10-03T14:30:00Z",
  "status": 404,
  "error": "Resource not found",
  "message": "No user record found with Id 999",
  "path": "/users/999"
}
```

#### DatabaseException (400)
Lançada em violações de integridade de dados.

```json
{
  "timestamp": "2025-10-03T14:30:00Z",
  "status": 400,
  "error": "Database error",
  "message": "Cannot delete user because there are related records",
  "path": "/users/1"
}
```

### Validações Implementadas

- ✅ Verificação de existência antes de deletar
- ✅ Validação de integridade referencial
- ✅ Tratamento de EntityNotFoundException no update
- ✅ Mensagens de erro personalizadas e descritivas

## 🧪 Testes

### Executar Testes

```bash
./mvnw test
```

### Perfil de Teste

O projeto utiliza H2 Database em memória para testes, com dados pré-carregados através do `TesteConfig.java`.

#### Dados de Teste Incluídos

- **4 Usuários** (John Doe, Maria Silva, Pedro Santos, Ana Costa)
- **5 Produtos** (The Lord of the Rings, Smart TV, Macbook Pro, PC Gamer, Rails for Dummies)
- **3 Categorias** (Electronics, Books, Computers)
- **4 Pedidos** com diferentes status
- **5 Itens de Pedido**
- **1 Pagamento** confirmado

### Console H2 (Modo Teste)

Acesse: `http://localhost:8081/h2-console`

```
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: (vazio)
```

## 📝 Boas Práticas Implementadas

### Backend
- ✅ Separação de camadas (Controller, Service, Repository)
- ✅ DTOs para requisições de autenticação
- ✅ Tratamento centralizado de exceções (@ControllerAdvice)
- ✅ Uso de ResponseEntity para respostas HTTP padronizadas
- ✅ Anotações Jackson para controle de serialização JSON
- ✅ Chaves compostas para relacionamentos N:N
- ✅ Cascade operations apropriadas
- ✅ @JsonIgnore para evitar recursão infinita
- ✅ Configuração CORS adequada
- ✅ Validação de dados com Bean Validation
- ✅ Criptografia de senhas
- ✅ Autenticação stateless com JWT

### Frontend
- ✅ Componentização com React
- ✅ Context API para estado global (Auth, Cart)
- ✅ Hooks personalizados (useAuth, useCart)
- ✅ Proteção de rotas com Higher Order Components
- ✅ Lazy loading de componentes
- ✅ Tratamento de erros com try-catch
- ✅ Loading states e feedback visual
- ✅ Validação de formulários
- ✅ Persistência de dados com localStorage
- ✅ Interceptors Axios para autenticação automática
- ✅ Responsividade mobile-first
- ✅ Acessibilidade (ARIA labels, semantic HTML)

## 🎨 Design System

### Cores Principais (Tailwind)

```css
/* Tema Claro */
--background: #ffffff
--foreground: #1f2937
--primary: #3b82f6
--secondary: #6b7280
--accent: #10b981

/* Tema Escuro */
--background: #1f2937
--foreground: #f9fafb
--primary: #60a5fa
--secondary: #9ca3af
--accent: #34d399
```

### Componentes de UI

- **Cards**: Shadow, rounded corners, hover effects
- **Buttons**: Primary (blue), Secondary (gray), Danger (red)
- **Forms**: Labels, inputs, validação visual
- **Badges**: Status de pedidos coloridos
- **Modals**: Confirmações e alertas
- **Toasts**: Notificações temporárias
- **Loading**: Spinners e skeleton screens

## 🚀 Roadmap e Melhorias Futuras

### Em Desenvolvimento
- [ ] Sistema de avaliações de produtos
- [ ] Filtros avançados no catálogo
- [ ] Busca com autocomplete
- [ ] Notificações em tempo real
- [ ] Chat de suporte

### Planejado
- [ ] Integração com gateway de pagamento real
- [ ] Sistema de cupons de desconto
- [ ] Programa de fidelidade
- [ ] Modo admin completo
- [ ] Relatórios e analytics
- [ ] API GraphQL
- [ ] PWA (Progressive Web App)
- [ ] Testes E2E com Cypress
- [ ] Docker containers
- [ ] CI/CD com GitHub Actions

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature
   ```bash
   git checkout -b feature/MinhaNovaFuncionalidade
   ```
3. **Commit** suas mudanças
   ```bash
   git commit -m 'Add: nova funcionalidade X'
   ```
4. **Push** para a branch
   ```bash
   git push origin feature/MinhaNovaFuncionalidade
   ```
5. Abra um **Pull Request**

### Padrões de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas de build/config

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Felipe Guimarães**
- GitHub: [@GuimaraesZ](https://github.com/GuimaraesZ)
- Repository: [workshop](https://github.com/GuimaraesZ/workshop)
- LinkedIn: [felipe-guimaraes](https://linkedin.com/in/felipe-guimaraes)

## 📞 Suporte

Para suporte, você pode:
- Abrir uma **issue** no GitHub
- Enviar um email para: suporte@lojdarosy.com
- Consultar a **documentação** do projeto

## 🙏 Agradecimentos

- [Spring Boot](https://spring.io/projects/spring-boot) - Framework backend
- [React](https://react.dev/) - Biblioteca frontend
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vite](https://vitejs.dev/) - Build tool
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- [Lucide Icons](https://lucide.dev/) - Ícones

---

<div align="center">

⭐ **Se este projeto te ajudou, considere dar uma estrela no GitHub!** ⭐

**Loja da Rosy** © 2025 - Desenvolvido com ❤️ por Felipe Guimarães

</div>
