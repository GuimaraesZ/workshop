# Sistema de Perfil e Histórico de Pedidos - Documentação Completa

## 📋 Visão Geral

Sistema completo de perfil do usuário com exibição de dados pessoais, histórico de pedidos e detalhes completos de cada pedido.

---

## 🎯 Funcionalidades Implementadas

### Frontend

✅ **Página de Perfil (`/profile`)**
- Exibição de dados do usuário (nome, email)
- Abas: "Informações" e "Meus Pedidos"
- Sidebar com resumo do usuário
- Estatísticas de pedidos (total, entregues, em andamento)
- Lista completa de pedidos com:
  - Número do pedido
  - Data e hora
  - Status com badge colorido
  - Preview dos itens (até 2 itens)
  - Total do pedido
  - Botão "Ver Detalhes"
- Estado vazio (nenhum pedido)
- Loading e tratamento de erros
- Botão de logout

✅ **Página de Detalhes do Pedido (`/orders/:id`)**
- Header com número do pedido e data
- Banner de status com ícone e descrição
- Timeline de acompanhamento (4 etapas)
- Lista completa de itens com imagens
- Endereço de entrega completo
- Método de pagamento
- Resumo financeiro (subtotal, frete, total)
- Informações do cliente
- Botão "Voltar para Meus Pedidos"
- Página de erro se pedido não encontrado

✅ **Integração com Backend**
- `getUserOrders()` - Busca pedidos do usuário
- `getOrderById(id)` - Busca detalhes do pedido
- Auto-inject de JWT em todas as requisições

✅ **Rotas Protegidas**
- `/profile` - Requer autenticação
- `/orders/:id` - Requer autenticação

### Backend

✅ **Repository**
- `OrderRepository.findByClientId(Long clientId)` - Query method JPA

✅ **Service**
- `OrderService.findByClientId(Long clientId)` - Busca pedidos do usuário

✅ **Endpoints Existentes**
- `GET /orders` - Lista pedidos (filtrado por X-User-Id header)
- `GET /orders/{id}` - Busca pedido específico

---

## 🛠️ Estrutura de Arquivos

### Frontend
```
frontend/src/
├── pages/
│   ├── Profile.jsx                  # Página de perfil (500+ linhas)
│   └── OrderDetails.jsx             # Detalhes do pedido (400+ linhas)
├── services/
│   └── orderService.js              # getUserOrders(), getOrderById()
└── routes/
    └── AppRoutes.jsx                # Rota /orders/:id adicionada
```

### Backend
```
src/main/java/com/educandofe/course/
├── repositorys/
│   └── OrderRepository.java         # findByClientId() method
└── services/
    └── OrderService.java            # findByClientId() implementation
```

---

## 📄 Profile.jsx - Estrutura Detalhada

### **Abas**

#### **1. Informações Pessoais**
```jsx
- Nome (read-only)
- E-mail (read-only)
- Nota: "Para editar, entre em contato com suporte"
- Estatísticas:
  - Pedidos Realizados (card azul)
  - Pedidos Entregues (card verde)
  - Pedidos em Andamento (card roxo)
```

#### **2. Meus Pedidos**
```jsx
- Header: "Histórico de Pedidos" + Total
- Loading state
- Error message
- Empty state: "Nenhum pedido encontrado"
- Lista de pedidos:
  - Card por pedido com:
    - Header: Número + Data + Status Badge
    - Items: Preview (até 2 itens + contador de restantes)
    - Footer: Total + Botão "Ver Detalhes"
```

### **Sidebar**
```jsx
- Botões de navegação:
  - Informações (ícone User)
  - Meus Pedidos (ícone Package + badge com contador)
  
- Card de resumo do usuário:
  - Avatar (círculo com ícone)
  - Nome + Role ("Cliente")
  - E-mail (com ícone)
  - Membro desde (com ícone Calendar)
```

### **Estados**

```javascript
const [activeTab, setActiveTab] = useState('orders') // 'info' ou 'orders'
const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
```

### **Funções Principais**

```javascript
// Buscar pedidos ao carregar aba
useEffect(() => {
  if (activeTab === 'orders') {
    fetchOrders()
  }
}, [activeTab])

// Buscar pedidos da API
const fetchOrders = async () => {
  setLoading(true)
  try {
    const data = await getUserOrders()
    setOrders(data)
  } catch (err) {
    setError('Não foi possível carregar seus pedidos')
  } finally {
    setLoading(false)
  }
}

// Badges de status
const getStatusBadge = (status) => {
  const statusConfig = {
    WAITING_PAYMENT: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800' },
    PAID: { label: 'Pago', color: 'bg-blue-100 text-blue-800' },
    SHIPPED: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
    DELIVERED: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
    CANCELED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  }
  // ...
}

// Formatar data
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Contar total de itens
const getItemsCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0)
}
```

---

## 📄 OrderDetails.jsx - Estrutura Detalhada

### **Seções**

#### **1. Header**
```jsx
- Botão "Voltar para Meus Pedidos"
- Título: "Pedido #ORD-00001"
- Data/hora do pedido
```

#### **2. Banner de Status**
```jsx
- Cor de fundo baseada no status
- Ícone grande (Clock, CheckCircle, Truck, Home, XCircle)
- Label do status
- Descrição do status
```

#### **3. Timeline de Acompanhamento** (se não cancelado)
```jsx
4 etapas:
1. Pedido Realizado (Package)
2. Pagamento Confirmado (CheckCircle)
3. Pedido Enviado (Truck)
4. Pedido Entregue (Home)

Cada etapa:
- Ícone circular (verde se completo, cinza se pendente)
- Linha conectora
- Label
- "Status atual" se for a etapa ativa
```

#### **4. Itens do Pedido**
```jsx
- Header com ícone Package
- Lista de itens:
  - Imagem do produto (20x20)
  - Nome do produto
  - Quantidade
  - Preço unitário
  - Subtotal (destaque)
```

#### **5. Endereço de Entrega**
```jsx
- Header com ícone MapPin
- Nome do destinatário (destaque)
- Rua, número, complemento
- Bairro
- Cidade - Estado
- CEP
- Telefone
```

#### **6. Sidebar**

**Método de Pagamento:**
```jsx
- Ícone CreditCard
- Label do método
- Descrição específica por método
```

**Resumo do Pedido:**
```jsx
- Subtotal
- Frete
- Total (grande, destaque)
```

**Informações do Cliente:**
```jsx
- Nome
- E-mail
```

**Ajuda:**
```jsx
- Box com contato de suporte
```

### **Configurações de Status**

```javascript
const getStatusConfig = (status) => {
  return {
    WAITING_PAYMENT: {
      label: 'Aguardando Pagamento',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      description: 'Seu pedido está aguardando a confirmação do pagamento.',
    },
    PAID: {
      label: 'Pago',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle,
      description: 'Pagamento confirmado! Seu pedido está sendo preparado.',
    },
    SHIPPED: {
      label: 'Enviado',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Truck,
      description: 'Seu pedido foi enviado e está a caminho!',
    },
    DELIVERED: {
      label: 'Entregue',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: HomeIcon,
      description: 'Pedido entregue com sucesso!',
    },
    CANCELED: {
      label: 'Cancelado',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      description: 'Este pedido foi cancelado.',
    },
  }
}
```

### **Timeline Logic**

```javascript
const getOrderTimeline = (status) => {
  const steps = [
    { key: 'WAITING_PAYMENT', label: 'Pedido Realizado', icon: Package },
    { key: 'PAID', label: 'Pagamento Confirmado', icon: CheckCircle },
    { key: 'SHIPPED', label: 'Pedido Enviado', icon: Truck },
    { key: 'DELIVERED', label: 'Pedido Entregue', icon: HomeIcon },
  ]

  const statusOrder = ['WAITING_PAYMENT', 'PAID', 'SHIPPED', 'DELIVERED']
  const currentIndex = statusOrder.indexOf(status)

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,  // Etapas anteriores + atual
    active: index === currentIndex,    // Etapa atual
  }))
}
```

---

## 🎨 UI/UX Features

### **Status Badges**
```css
WAITING_PAYMENT: Amarelo (bg-yellow-100 text-yellow-800)
PAID:            Azul (bg-blue-100 text-blue-800)
SHIPPED:         Roxo (bg-purple-100 text-purple-800)
DELIVERED:       Verde (bg-green-100 text-green-800)
CANCELED:        Vermelho (bg-red-100 text-red-800)
```

### **Ícones (lucide-react)**
```jsx
- User: Perfil
- Package: Pedidos
- Calendar: Data
- Mail: E-mail
- LogOut: Sair
- ChevronRight: Ver detalhes
- AlertCircle: Erros
- Clock: Aguardando
- CheckCircle: Confirmado
- Truck: Enviado
- Home: Entregue
- XCircle: Cancelado
- ArrowLeft: Voltar
- MapPin: Endereço
- CreditCard: Pagamento
```

### **Cards com Hover**
```jsx
className="card hover:shadow-lg transition-shadow"
```

### **Empty States**
```jsx
Profile (sem pedidos):
  - Ícone Package grande (64px)
  - Mensagem: "Nenhum pedido encontrado"
  - Descrição: "Você ainda não realizou nenhuma compra"
  - Botão: "Começar a Comprar" → /

OrderDetails (não encontrado):
  - Ícone AlertCircle vermelho
  - Mensagem: "Pedido não encontrado"
  - Botão: "Voltar para Meus Pedidos" → /profile
```

### **Loading States**
```jsx
- Profile: <Loading /> component
- OrderDetails: <Loading /> na tela inteira
```

### **Responsive Design**
```jsx
Profile:
  - Desktop: Sidebar (1 col) + Content (3 cols)
  - Mobile: Stack vertical

OrderDetails:
  - Desktop: Content (2 cols) + Sidebar (1 col)
  - Mobile: Stack vertical
```

---

## 💡 Fluxo de Uso

### **1. Usuário Acessa Perfil**
```
1. Clica no dropdown do header
2. Clica em "Meu Perfil"
3. Rota: /profile (protegida)
4. Aba padrão: "Meus Pedidos"
5. Carrega pedidos automaticamente
```

### **2. Visualizar Histórico**
```
Profile.jsx:
  ↓
useEffect detecta activeTab='orders'
  ↓
Chama fetchOrders()
  ↓
getUserOrders() → GET /orders (header: X-User-Id)
  ↓
Backend: OrderService.findByClientId(userId)
  ↓
Retorna lista de OrderResponseDTO
  ↓
Exibe cards de pedidos
```

### **3. Ver Detalhes do Pedido**
```
Clica em "Ver Detalhes" no card
  ↓
Navigate para /orders/{id}
  ↓
OrderDetails.jsx carrega
  ↓
useEffect detecta parâmetro :id
  ↓
Chama fetchOrderDetails()
  ↓
getOrderById(id) → GET /orders/{id}
  ↓
Backend: OrderService.findById(id)
  ↓
Retorna OrderResponseDTO completo
  ↓
Exibe detalhes, timeline, endereço, etc.
```

### **4. Navegação**
```
OrderDetails → Botão "Voltar" → /profile (aba "Meus Pedidos")
Profile → Botão "Começar a Comprar" → / (se sem pedidos)
Profile → Botão "Sair" → logout() → /login
```

---

## 🔐 Segurança e Autenticação

### **Estado Atual (Temporário)**
```javascript
// Backend usa header X-User-Id
@GetMapping
public ResponseEntity<List<OrderResponseDTO>> findAll(
    @RequestHeader(value = "X-User-Id", required = false) Long userId
) {
    if (userId != null) {
        orders = orderService.findByClientId(userId);
    }
    // ...
}
```

### **Após Implementar JWT**
```java
// Extrair userId do token JWT
@GetMapping
public ResponseEntity<List<OrderResponseDTO>> findAll(
    @AuthenticationPrincipal UserDetails userDetails
) {
    Long userId = ((CustomUserDetails) userDetails).getId();
    List<OrderModel> orders = orderService.findByClientId(userId);
    // ...
}
```

**Frontend já está pronto:**
```javascript
// api.js já injeta "Authorization: Bearer <token>" automaticamente
const response = await api.get('/orders')
// Não precisa passar X-User-Id manualmente
```

---

## 🚀 Como Testar

### **1. Testar Perfil**
```powershell
# Backend rodando em :8080
# Frontend rodando em :3000

1. Fazer login
2. Clicar no menu do usuário (header)
3. Clicar em "Meu Perfil"
4. Verificar:
   - Nome e email corretos
   - Estatísticas atualizadas
   - Lista de pedidos (ou empty state)
```

### **2. Testar Detalhes do Pedido**
```powershell
1. Na página de perfil (aba "Meus Pedidos")
2. Clicar em "Ver Detalhes" em um pedido
3. Verificar:
   - Número do pedido
   - Status correto
   - Timeline com etapa ativa
   - Lista completa de itens
   - Endereço de entrega
   - Método de pagamento
   - Totais corretos
```

### **3. Testar Backend Direto**

**GET /orders (todos do usuário):**
```bash
GET http://localhost:8080/orders
Headers:
  X-User-Id: 1
```

**GET /orders/{id} (específico):**
```bash
GET http://localhost:8080/orders/1
```

---

## 📊 Dados de Exemplo

### **OrderResponseDTO**
```json
{
  "id": 1,
  "orderNumber": "ORD-00001",
  "moment": "2025-10-03 14:30:00",
  "status": "SHIPPED",
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
  "total": 214.80,
  "clientName": "João Silva",
  "clientEmail": "joao@example.com"
}
```

---

## 🐛 Troubleshooting

### **"Nenhum pedido encontrado" mesmo tendo pedidos**
**Causa:** X-User-Id header não está sendo enviado ou está errado  
**Solução:** Verificar se `api.js` está configurado para enviar o header (ou JWT)

### **Erro 404 ao abrir detalhes**
**Causa:** Pedido não existe ou ID incorreto  
**Solução:** Verificar se ID do pedido é válido no banco de dados

### **Timeline não aparece**
**Causa:** Status é "CANCELED"  
**Solução:** Timeline é ocultada para pedidos cancelados (comportamento esperado)

### **Estatísticas zeradas**
**Causa:** Array `orders` está vazio ou não carregado  
**Solução:** Verificar se `fetchOrders()` está sendo chamado e retornando dados

### **OrderDetails em loop de loading**
**Causa:** Erro na API ou ID inválido  
**Solução:** Abrir DevTools > Network e verificar resposta da API

---

## 🔄 Melhorias Futuras

### **Profile.jsx**
- [ ] Edição de dados pessoais (modal)
- [ ] Upload de foto de perfil
- [ ] Filtros de pedidos (status, data)
- [ ] Ordenação de pedidos
- [ ] Paginação (se muitos pedidos)
- [ ] Exportar histórico (PDF/CSV)
- [ ] Gráfico de gastos por mês

### **OrderDetails.jsx**
- [ ] Botão "Rastrear Pedido" (integração com Correios)
- [ ] Botão "Cancelar Pedido" (se WAITING_PAYMENT)
- [ ] Botão "Reportar Problema"
- [ ] Avaliação do pedido (após entrega)
- [ ] Chat de suporte
- [ ] Nota fiscal (download PDF)
- [ ] Histórico de atualizações de status com timestamps
- [ ] Compartilhar pedido (link)

### **Backend**
- [ ] Paginação em `GET /orders`
- [ ] Filtros: status, data inicial, data final
- [ ] Ordenação: data (desc/asc), valor (desc/asc)
- [ ] Endpoint `PUT /orders/{id}/cancel`
- [ ] Endpoint `PUT /orders/{id}/status` (admin)
- [ ] Notificações de mudança de status
- [ ] Tracking code (código de rastreamento)
- [ ] Webhook de atualização de status

---

## 📝 Checklist de Implementação

### ✅ Concluído
- [x] Criar página Profile.jsx
- [x] Implementar abas (Info + Pedidos)
- [x] Integrar getUserOrders()
- [x] Exibir lista de pedidos com cards
- [x] Status badges coloridos
- [x] Empty state (sem pedidos)
- [x] Loading e error states
- [x] Estatísticas de pedidos
- [x] Sidebar com resumo do usuário
- [x] Criar página OrderDetails.jsx
- [x] Banner de status
- [x] Timeline de acompanhamento
- [x] Lista de itens com imagens
- [x] Endereço de entrega
- [x] Resumo financeiro
- [x] Adicionar rota /orders/:id
- [x] Proteger rotas
- [x] Backend: findByClientId() no repository
- [x] Backend: findByClientId() no service
- [x] Documentação completa

### ⏳ Pendente
- [ ] Implementar JWT no backend
- [ ] Remover X-User-Id header
- [ ] Testes end-to-end
- [ ] Adicionar filtros de pedidos
- [ ] Implementar paginação
- [ ] Adicionar cancelamento de pedidos
- [ ] Sistema de rastreamento
- [ ] Notificações de status

---

## 📚 Estrutura de Componentes

```
Profile
├── Header (título + botão logout)
├── Grid Layout
│   ├── Sidebar (col-1)
│   │   ├── Navigation Buttons
│   │   │   ├── Informações
│   │   │   └── Meus Pedidos (+ badge contador)
│   │   └── User Summary Card
│   │       ├── Avatar
│   │       ├── Nome + Role
│   │       ├── Email (icon)
│   │       └── Membro desde (icon)
│   └── Content (col-3)
│       ├── Tab: Informações
│       │   ├── Form (read-only)
│       │   └── Statistics Cards (3 cols)
│       │       ├── Pedidos Realizados
│       │       ├── Pedidos Entregues
│       │       └── Pedidos em Andamento
│       └── Tab: Meus Pedidos
│           ├── Header (+ total contador)
│           ├── Loading | Error | Empty | Orders List
│           └── Order Cards
│               ├── Header (número + data + badge)
│               ├── Items Preview (2 + counter)
│               └── Footer (total + button)

OrderDetails
├── Back Button
├── Header (título + data)
├── Status Banner
├── Grid Layout
│   ├── Main Content (col-2)
│   │   ├── Timeline (se não cancelado)
│   │   ├── Items List
│   │   └── Shipping Address
│   └── Sidebar (col-1)
│       ├── Payment Method
│       ├── Order Summary
│       ├── Customer Info
│       └── Help Box
```

---

✨ **Sistema de Perfil e Histórico de Pedidos Completo e Funcional!**
