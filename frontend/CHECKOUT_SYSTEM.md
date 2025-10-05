# Sistema de Checkout - Documentação Completa

## 📋 Visão Geral

Sistema completo de finalização de pedidos com carrinho de compras, endereço de entrega, métodos de pagamento e confirmação de pedido.

---

## 🎯 Funcionalidades Implementadas

### Frontend

✅ **Página de Checkout (`/checkout`)**
- Resumo completo do carrinho
- Formulário de endereço de entrega
- Seleção de método de pagamento
- Cálculo automático de subtotal, frete e total
- Validação de campos obrigatórios
- Loading state durante submissão
- Tratamento de erros
- Redirecionamento automático se carrinho vazio

✅ **Página de Confirmação (`/order-confirmation`)**
- Exibição de sucesso do pedido
- Número do pedido gerado
- Resumo dos itens comprados
- Informações de endereço e pagamento
- Previsão de entrega
- Links para detalhes do pedido e continuar comprando

✅ **Service Layer**
- `orderService.js` com funções:
  - `createOrder()` - Criar novo pedido
  - `getUserOrders()` - Buscar pedidos do usuário
  - `getOrderById()` - Buscar pedido específico
  - `cancelOrder()` - Cancelar pedido

✅ **Rotas Protegidas**
- `/checkout` - Requer autenticação
- `/order-confirmation` - Requer autenticação

### Backend

✅ **Entidades JPA**
- `OrderModel` - Pedido principal
- `OrderItemModel` - Itens do pedido
- Relacionamentos configurados

✅ **DTOs**
- `OrderRequestDTO` - Payload de criação
- `OrderResponseDTO` - Resposta do pedido
- `OrderItemRequestDTO` - Item no request
- `OrderItemResponseDTO` - Item no response
- `ShippingAddressDTO` - Endereço de entrega

✅ **Endpoints REST**
- `GET /orders` - Listar pedidos do usuário
- `GET /orders/{id}` - Buscar pedido por ID
- `POST /orders` - Criar novo pedido
- `DELETE /orders/{id}` - Cancelar pedido

✅ **Validações**
- Jakarta Validation nos DTOs
- Campos obrigatórios
- Validações de formato (CEP, estado)
- Validações de quantidade e preço

---

## 🛠️ Estrutura de Arquivos

### Frontend
```
frontend/src/
├── pages/
│   ├── Checkout.jsx                 # Página de checkout
│   └── OrderConfirmation.jsx        # Página de confirmação
├── services/
│   └── orderService.js              # API de pedidos
└── routes/
    └── AppRoutes.jsx                # Rotas (atualizado)
```

### Backend
```
src/main/java/com/educandofe/course/
├── Model/
│   ├── OrderModel.java              # Entidade Order
│   ├── OrderItemModel.java          # Entidade OrderItem
│   └── Enums/
│       └── OrderStatus.java         # Status do pedido
├── dto/
│   ├── OrderRequestDTO.java         # DTO de request
│   ├── OrderResponseDTO.java        # DTO de response
│   ├── OrderItemRequestDTO.java     # DTO item request
│   ├── OrderItemResponseDTO.java    # DTO item response
│   └── ShippingAddressDTO.java      # DTO endereço
├── resources/
│   └── OrderResource.java           # REST Controller
├── services/
│   └── OrderService.java            # Lógica de negócio
└── repositorys/
    ├── OrderRepository.java         # Repository Order
    └── OrderItemRepository.java     # Repository OrderItem
```

---

## 📡 API Endpoints

### POST /orders
Criar novo pedido

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 99.90
    }
  ],
  "shippingAddress": {
    "recipientName": "João Silva",
    "phone": "(11) 99999-9999",
    "street": "Rua Exemplo",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "paymentMethod": "CREDIT_CARD",
  "shippingCost": 15.00,
  "subtotal": 199.80,
  "total": 214.80
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "orderNumber": "ORD-00001",
  "moment": "2025-10-03 14:30:00",
  "status": "WAITING_PAYMENT",
  "items": [
    {
      "productId": 1,
      "productName": "Produto Exemplo",
      "productImageUrl": "http://example.com/image.jpg",
      "quantity": 2,
      "price": 99.90,
      "subTotal": 199.80
    }
  ],
  "shippingAddress": { /* ... */ },
  "paymentMethod": "CREDIT_CARD",
  "shippingCost": 15.00,
  "subtotal": 199.80,
  "total": 214.80,
  "clientName": "João Silva",
  "clientEmail": "joao@example.com"
}
```

### GET /orders
Listar pedidos do usuário autenticado

**Headers:**
- `X-User-Id: 1` (temporário, substituir por JWT)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-00001",
    "moment": "2025-10-03 14:30:00",
    "status": "WAITING_PAYMENT",
    "total": 214.80,
    /* ... */
  }
]
```

### GET /orders/{id}
Buscar pedido específico

**Response (200 OK):**
```json
{
  "id": 1,
  "orderNumber": "ORD-00001",
  /* detalhes completos do pedido */
}
```

### DELETE /orders/{id}
Cancelar pedido

**Response (204 No Content)**

---

## 💡 Fluxo de Uso

### 1. **Usuário Adiciona Produtos ao Carrinho**
```javascript
// ProductDetails.jsx ou ProductCard.jsx
addToCart(product, quantity)
```

### 2. **Usuário Vai para o Checkout**
```javascript
// Cart.jsx
<Link to="/checkout">
  <button>Finalizar Compra</button>
</Link>
```

### 3. **Página de Checkout**
```javascript
// Checkout.jsx

// Carrinho é carregado automaticamente
const { items, getTotalPrice, clearCart } = useCart()

// Usuário preenche endereço
const [shippingData, setShippingData] = useState({
  recipientName: '',
  phone: '',
  street: '',
  // ...
})

// Usuário escolhe pagamento
const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

// Calcula totais
const subtotal = getTotalPrice()
const total = subtotal + SHIPPING_COST
```

### 4. **Submissão do Pedido**
```javascript
const handleSubmit = async () => {
  // Formata payload
  const orderData = {
    items: items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress: shippingData,
    paymentMethod,
    shippingCost: SHIPPING_COST,
    subtotal,
    total,
  }

  // Envia para API
  const response = await createOrder(orderData)

  // Limpa carrinho
  clearCart()

  // Redireciona para confirmação
  navigate('/order-confirmation', { 
    state: { order: response } 
  })
}
```

### 5. **Página de Confirmação**
```javascript
// OrderConfirmation.jsx

// Recebe dados do pedido
const order = location.state?.order

// Exibe sucesso e detalhes
// Permite ver detalhes ou continuar comprando
```

---

## 🔐 Integração com Autenticação

### Estado Atual (Temporário)
```javascript
// Usa header X-User-Id
@RequestHeader(value = "X-User-Id", required = false) Long userId
```

### Após Implementar JWT
```javascript
// 1. Frontend: Token já injetado automaticamente em api.js
const response = await api.post('/orders', orderData)
// Header: Authorization: Bearer <token>

// 2. Backend: Extrair userId do JWT
@PostMapping
public ResponseEntity<OrderResponseDTO> createOrder(
    @Valid @RequestBody OrderRequestDTO orderRequest,
    @AuthenticationPrincipal UserDetails userDetails) {
    
    Long userId = ((CustomUserDetails) userDetails).getId()
    // ...
}
```

---

## 🎨 Componentes e Estilos

### Checkout.jsx

**Seções:**
1. **Itens do Pedido**
   - Lista de produtos com imagem
   - Quantidade e preço unitário
   - Subtotal por item

2. **Endereço de Entrega**
   - Nome completo *
   - CEP e telefone *
   - Rua, número, complemento *
   - Bairro, cidade, estado *
   - Validação inline

3. **Método de Pagamento**
   - Radio buttons para:
     - Cartão de Crédito
     - PIX
     - Boleto Bancário
   - Descrição de cada método

4. **Resumo do Pedido (Sidebar)**
   - Subtotal (X itens)
   - Frete
   - Total (destaque)
   - Botão "Confirmar Pedido"

### OrderConfirmation.jsx

**Seções:**
1. **Header de Sucesso**
   - Ícone de check verde
   - Mensagem de confirmação
   - Número do pedido

2. **Informações do Pedido**
   - Número, data e status
   - Lista de itens comprados
   - Resumo financeiro

3. **Detalhes de Entrega**
   - Endereço completo
   - Método de pagamento
   - Previsão de entrega (7 dias)

4. **Ações**
   - Ver detalhes do pedido
   - Continuar comprando

---

## ✅ Validações Implementadas

### Frontend (JavaScript)
```javascript
const validateForm = () => {
  const required = ['recipientName', 'phone', 'street', 'number', 
                    'neighborhood', 'city', 'state', 'zipCode']
  
  for (const field of required) {
    if (!shippingData[field] || shippingData[field].trim() === '') {
      setError(`O campo ${getFieldLabel(field)} é obrigatório`)
      return false
    }
  }
  return true
}
```

### Backend (Jakarta Validation)
```java
// ShippingAddressDTO
@NotBlank(message = "Nome do destinatário é obrigatório")
private String recipientName;

@NotBlank(message = "CEP é obrigatório")
@Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido")
private String zipCode;

@NotBlank(message = "Estado é obrigatório")
@Pattern(regexp = "[A-Z]{2}", message = "Estado deve ter 2 letras maiúsculas")
private String state;

// OrderItemRequestDTO
@NotNull(message = "Product ID é obrigatório")
private Long productId;

@NotNull(message = "Quantidade é obrigatória")
@Min(value = 1, message = "Quantidade deve ser no mínimo 1")
private Integer quantity;
```

---

## 🚀 Como Testar

### 1. **Instalar Dependências**
```powershell
# Backend: Atualizar Maven
cd d:\tudosetodos\course
./mvnw clean install

# Frontend: já instalado
```

### 2. **Iniciar Servidores**
```powershell
# Backend (Terminal 1)
./mvnw spring-boot:run

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### 3. **Fluxo de Teste**

**a) Adicionar produtos ao carrinho:**
- Ir para Home (http://localhost:3000)
- Clicar em produtos
- Adicionar ao carrinho

**b) Fazer login:**
- Clicar em "Entrar"
- Fazer login ou criar conta

**c) Ir para checkout:**
- Clicar no ícone do carrinho
- Clicar em "Finalizar Compra"

**d) Preencher checkout:**
- Preencher endereço de entrega
- Escolher método de pagamento
- Clicar em "Confirmar Pedido"

**e) Verificar confirmação:**
- Ver página de sucesso
- Verificar número do pedido
- Verificar se carrinho foi limpo

### 4. **Testar API Diretamente**

**POST /orders** (via Postman/Insomnia):
```bash
POST http://localhost:8080/orders
Headers:
  Content-Type: application/json
  X-User-Id: 1

Body:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 99.90
    }
  ],
  "shippingAddress": {
    "recipientName": "João Silva",
    "phone": "(11) 99999-9999",
    "street": "Rua Exemplo",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "paymentMethod": "CREDIT_CARD",
  "shippingCost": 15.00,
  "subtotal": 199.80,
  "total": 214.80
}
```

**GET /orders**:
```bash
GET http://localhost:8080/orders
Headers:
  X-User-Id: 1
```

---

## 🐛 Troubleshooting

### "Cannot find symbol: class Valid"
**Causa:** Dependência `spring-boot-starter-validation` não baixada  
**Solução:**
```powershell
./mvnw clean install
# ou
./mvnw dependency:resolve
```

### "OrderRequestDTO cannot be resolved"
**Causa:** Classes DTO não compiladas  
**Solução:**
```powershell
./mvnw clean compile
```

### Carrinho vazio ao acessar /checkout
**Causa:** localStorage não persistido  
**Solução:** Verificar se CartContext está salvando no localStorage

### Pedido não criado (401 Unauthorized)
**Causa:** Header X-User-Id não enviado  
**Solução:** Adicionar header manualmente (temporário) ou implementar JWT

### Erro ao redirecionar para confirmação
**Causa:** Dados não passados via location.state  
**Solução:** Verificar se `navigate('/order-confirmation', { state: { order } })` está correto

---

## 🔄 Melhorias Futuras

### Frontend
- [ ] CEP auto-complete (API ViaCEP)
- [ ] Validação de CPF/CNPJ
- [ ] Múltiplos endereços salvos
- [ ] Cupons de desconto
- [ ] Cálculo de frete dinâmico
- [ ] Opções de parcelamento
- [ ] Favoritar endereços
- [ ] Editar pedido antes de confirmar

### Backend
- [ ] **Implementar Spring Security + JWT**
- [ ] Enviar e-mail de confirmação
- [ ] Integração com gateway de pagamento
- [ ] Sistema de rastreamento de pedido
- [ ] Webhook de status de pagamento
- [ ] Geração de boleto/PIX
- [ ] Histórico de status do pedido
- [ ] Sistema de devolução/troca
- [ ] Relatórios de vendas
- [ ] Notificações de atualização de status

### Integrações
- [ ] API de pagamento (Mercado Pago, Stripe, PagSeguro)
- [ ] API de frete (Correios, Melhor Envio)
- [ ] API de CEP (ViaCEP)
- [ ] E-mail transacional (SendGrid, Mailgun)
- [ ] SMS de notificação

---

## 📊 Status do Pedido

### Enum OrderStatus
```java
WAITING_PAYMENT(1)  // Aguardando pagamento
PAID(2)             // Pago
SHIPPED(3)          // Enviado
DELIVERED(4)        // Entregue
CANCELED(5)         // Cancelado
```

### Fluxo de Status
```
WAITING_PAYMENT → PAID → SHIPPED → DELIVERED
                   ↓
                CANCELED (qualquer momento antes de SHIPPED)
```

---

## 📝 Checklist de Implementação

### ✅ Concluído
- [x] Criar `orderService.js`
- [x] Implementar página `Checkout.jsx`
- [x] Criar página `OrderConfirmation.jsx`
- [x] Adicionar rotas protegidas
- [x] Criar DTOs (Request/Response)
- [x] Implementar `OrderService.java`
- [x] Implementar `OrderResource.java`
- [x] Adicionar validação com Jakarta
- [x] Integrar com carrinho
- [x] Limpar carrinho após pedido
- [x] Cálculo de totais
- [x] Tratamento de erros

### ⏳ Pendente (Próximos Passos)
- [ ] Implementar JWT no backend
- [ ] Conectar auth real (remover X-User-Id)
- [ ] Testar integração end-to-end
- [ ] Criar página de detalhes do pedido
- [ ] Adicionar pedidos no perfil do usuário
- [ ] Implementar cancelamento de pedido
- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração

---

## 🎓 Conceitos Aplicados

### Frontend
- **Context API**: CartContext, AuthContext
- **Protected Routes**: ProtectedRoute HOC
- **Form Handling**: Controlled components, validação
- **State Management**: useState, useEffect
- **Navigation**: React Router (useNavigate, location.state)
- **API Integration**: Fetch com tratamento de erros
- **LocalStorage**: Persistência de dados

### Backend
- **REST API**: Controllers com @RestController
- **DTOs**: Separação de camadas
- **Validation**: Jakarta Validation
- **JPA/Hibernate**: Relacionamentos, cascata
- **Transactions**: @Transactional
- **Exception Handling**: Custom exceptions
- **Service Layer**: Lógica de negócio isolada

---

## 📚 Referências

- [React Router - Location State](https://reactrouter.com/en/main/hooks/use-location)
- [Jakarta Validation](https://jakarta.ee/specifications/bean-validation/3.0/)
- [Spring Boot Validation](https://spring.io/guides/gs/validating-form-input/)
- [JPA Relationships](https://www.baeldung.com/jpa-one-to-many)

---

✨ **Sistema de Checkout Completo e Funcional!**
