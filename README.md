# 🛍️ E-Commerce API - Spring Boot

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.6-blue)
![Maven](https://img.shields.io/badge/Maven-3.9.11-red)

API RESTful completa para sistema de e-commerce desenvolvida com Spring Boot, implementando gerenciamento de usuários, produtos, categorias, pedidos e pagamentos.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Endpoints da API](#endpoints-da-api)
- [Modelo de Dados](#modelo-de-dados)
- [Tratamento de Exceções](#tratamento-de-exceções)
- [Testes](#testes)

## 🎯 Sobre o Projeto

Sistema de e-commerce completo que oferece uma API REST para gerenciar todas as operações de uma loja online, incluindo cadastro de usuários, catálogo de produtos, processamento de pedidos e controle de pagamentos.

### Características Principais

- ✅ CRUD completo para todas as entidades
- ✅ Relacionamentos JPA complexos (OneToMany, ManyToMany, OneToOne)
- ✅ Tratamento de exceções personalizado
- ✅ Validação de integridade de dados
- ✅ Formatação de respostas JSON
- ✅ Perfis de desenvolvimento (dev/test/prod)
- ✅ Dados de teste pré-carregados

## 🚀 Funcionalidades

### Usuários
- Listar todos os usuários
- Buscar usuário por ID
- Criar novo usuário
- Atualizar dados do usuário
- Deletar usuário (com validação de integridade)

### Produtos
- Listar todos os produtos com categorias
- Buscar produto por ID
- Associação com múltiplas categorias

### Categorias
- Listar todas as categorias
- Buscar categoria por ID
- Produtos por categoria

### Pedidos
- Listar todos os pedidos
- Buscar pedido por ID
- Visualizar itens do pedido
- Calcular total do pedido
- Status do pedido (Aguardando Pagamento, Pago, Enviado, Entregue, Cancelado)

### Pagamentos
- Registro de pagamento associado ao pedido
- Timestamp de confirmação

## 🛠️ Tecnologias

### Backend
- **Java 21** - Linguagem de programação
- **Spring Boot 3.5.6** - Framework principal
- **Spring Data JPA** - Persistência de dados
- **Hibernate ORM 6.6.29** - Mapeamento objeto-relacional
- **Maven** - Gerenciador de dependências

### Banco de Dados
- **PostgreSQL 17.6** - Banco de dados principal (produção)
- **H2 Database** - Banco de dados em memória (testes)

### Ferramentas
- **Spring DevTools** - Hot reload em desenvolvimento
- **Jackson** - Serialização/deserialização JSON

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/main/java/com/educandofe/course/
├── Model/                          # Entidades JPA
│   ├── UserModel.java
│   ├── OrderModel.java
│   ├── ProductModel.java
│   ├── CategoryModel.java
│   ├── OrderItemModel.java
│   ├── PaymentsModel.java
│   ├── Enums/
│   │   └── OrderStatus.java
│   └── pk/
│       └── OrderItemPk.java        # Chave composta
├── resources/                      # Controllers REST
│   ├── UserResource.java
│   ├── OrderResource.java
│   ├── ProductResource.java
│   ├── CategoryResource.java
│   └── exception/
│       ├── ResourceExceptionHandler.java
│       └── StandardError.java
├── services/                       # Lógica de negócio
│   ├── UserService.java
│   ├── OrderService.java
│   ├── ProductService.java
│   ├── CategoryService.java
│   └── exception/
│       ├── ResourceNotFoundException.java
│       └── DatabaseException.java
├── repositorys/                    # Camada de dados
│   ├── UserRepository.java
│   ├── OrderRepository.java
│   ├── ProductRepository.java
│   ├── CategoryRepository.java
│   └── OrderItemRepository.java
├── config/
│   └── TesteConfig.java           # Dados de teste
└── Main.java                       # Classe principal
```

## 📦 Instalação

### Pré-requisitos

- Java 21 ou superior
- Maven 3.9+
- PostgreSQL 17.6
- Git

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/GuimaraesZ/workshop.git
cd workshop
```

2. **Configure o banco de dados PostgreSQL**
```sql
CREATE DATABASE educandofe;
```

3. **Configure as credenciais** (edite `application.properties`)
```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

4. **Compile o projeto**
```bash
./mvnw clean install
```

5. **Execute a aplicação**
```bash
./mvnw spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

## ⚙️ Configuração

### Perfis Spring

#### Produção (PostgreSQL)
```properties
spring.profiles.active=prod
```

#### Teste (H2 Database)
```properties
spring.profiles.active=test
```

### Propriedades Principais

| Propriedade | Valor | Descrição |
|------------|-------|-----------|
| `server.port` | 8080 | Porta do servidor |
| `spring.jpa.hibernate.ddl-auto` | update | Atualização automática do schema |
| `spring.jpa.show-sql` | true | Exibir SQL no console |

## 🔌 Endpoints da API

### Base URL
```
http://localhost:8080
```

### Users

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista todos os usuários |
| GET | `/users/{id}` | Busca usuário por ID |
| POST | `/users` | Cria novo usuário |
| PUT | `/users/{id}` | Atualiza usuário |
| DELETE | `/users/{id}` | Deleta usuário |

#### Exemplo: Criar Usuário
```bash
POST http://localhost:8080/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "password": "senha123"
}
```

### Products

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products` | Lista todos os produtos |
| GET | `/products/{id}` | Busca produto por ID |

### Categories

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/categories` | Lista todas as categorias |
| GET | `/categories/{id}` | Busca categoria por ID |

### Orders

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/orders` | Lista todos os pedidos |
| GET | `/orders/{id}` | Busca pedido por ID |

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
- email: String
- phone: String
- password: String
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

#### OrderItemModel (Tabela Associativa)
```java
- id: OrderItemPk (Chave Composta)
- quantity: Integer
- price: Double
+ getSubTotal(): Double
```

### Status do Pedido (Enum)

```java
WAITING_PAYMENT(1)  // Aguardando Pagamento
PAID(2)             // Pago
SHIPPED(3)          // Enviado
DELIVERED(4)        // Entregue
CANCELED(5)         // Cancelado
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

- ✅ Separação de camadas (Controller, Service, Repository)
- ✅ DTOs implícitos através das entidades JPA
- ✅ Tratamento centralizado de exceções (@ControllerAdvice)
- ✅ Uso de ResponseEntity para respostas HTTP padronizadas
- ✅ Anotações Jackson para controle de serialização JSON
- ✅ Chaves compostas para relacionamentos N:N
- ✅ Cascade operations apropriadas
- ✅ @JsonIgnore para evitar recursão infinita

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Felipe Guimarães**
- GitHub: [@GuimaraesZ](https://github.com/GuimaraesZ)
- Repository: [workshop](https://github.com/GuimaraesZ/workshop)

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do repositório.

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
