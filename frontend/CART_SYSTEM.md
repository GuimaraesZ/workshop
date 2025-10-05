# 🛒 Sistema de Carrinho - Documentação Completa

## ✅ Implementado

### 📦 Context API - CartContext

#### Localização: `src/contexts/CartContext.jsx`

**Estrutura do Estado:**
```javascript
cartItems = [
  {
    product: {
      id: 1,
      name: "Smart TV",
      price: 2190.0,
      imgUrl: "...",
      categories: [...]
    },
    quantity: 2
  }
]
```

**Funções Disponíveis:**

| Função | Descrição | Parâmetros |
|--------|-----------|------------|
| `addToCart(product, quantity)` | Adiciona produto ao carrinho | product: Object, quantity: number |
| `removeFromCart(productId)` | Remove produto do carrinho | productId: number |
| `updateQuantity(productId, quantity)` | Atualiza quantidade específica | productId: number, quantity: number |
| `incrementQuantity(productId)` | Incrementa quantidade em +1 | productId: number |
| `decrementQuantity(productId)` | Decrementa quantidade em -1 | productId: number |
| `clearCart()` | Limpa todo o carrinho | - |
| `isInCart(productId)` | Verifica se produto está no carrinho | productId: number |
| `getItemQuantity(productId)` | Obtém quantidade de um produto | productId: number |
| `getTotalItems()` | Total de itens no carrinho | - |
| `getItemSubtotal(item)` | Subtotal de um item | item: Object |
| `getCartTotal()` | Total geral do carrinho | - |

**Estados:**
- `cartItems`: Array com todos os itens
- `isLoading`: Boolean indicando carregamento do localStorage

### 💾 Persistência em localStorage

**Como Funciona:**

1. **Ao Montar o Contexto:**
   ```javascript
   useEffect(() => {
     const savedCart = localStorage.getItem('shopping_cart')
     if (savedCart) {
       setCartItems(JSON.parse(savedCart))
     }
   }, [])
   ```

2. **Ao Modificar o Carrinho:**
   ```javascript
   useEffect(() => {
     if (!isLoading) {
       localStorage.setItem('shopping_cart', JSON.stringify(cartItems))
     }
   }, [cartItems, isLoading])
   ```

**Chave do localStorage:** `shopping_cart`

**Dados Salvos:**
```json
[
  {
    "product": {
      "id": 1,
      "name": "Smart TV",
      "price": 2190.0,
      "imgUrl": "https://...",
      "categories": [...]
    },
    "quantity": 2
  }
]
```

### 🎯 Integração com App

#### `App.jsx`
```jsx
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* rotas */}
      </BrowserRouter>
    </CartProvider>
  )
}
```

**IMPORTANTE:** CartProvider envolve BrowserRouter para que o contexto esteja disponível em toda a aplicação.

### 🔢 Header com Contador

#### `Header.jsx`
```jsx
import { useCart } from '../contexts/CartContext'

const { getTotalItems } = useCart()
const totalItems = getTotalItems()

<span className="badge">{totalItems > 99 ? '99+' : totalItems}</span>
```

**Features:**
- ✅ Badge com contador dinâmico
- ✅ Exibe "99+" quando > 99 itens
- ✅ Badge oculta quando carrinho vazio
- ✅ Atualização em tempo real

### 🛍️ Página de Detalhes do Produto

#### `ProductDetails.jsx`

**Funcionalidades Adicionadas:**
- ✅ Botão "Adicionar ao Carrinho"
- ✅ Mensagem de sucesso ao adicionar
- ✅ Exibe quantidade no carrinho
- ✅ Botão "Ver Carrinho" quando item já está no carrinho

**Exemplo de Uso:**
```jsx
const { addToCart, isInCart, getItemQuantity } = useCart()

const handleAddToCart = () => {
  addToCart(product, 1)
  setShowSuccess(true)
  setTimeout(() => setShowSuccess(false), 3000)
}
```

### 🛒 Página do Carrinho

#### `Cart.jsx`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Carrinho de Compras (3 itens)              │
├────────────────────────┬────────────────────┤
│                        │                    │
│  Lista de Itens        │  Resumo do Pedido  │
│  (2 colunas)           │  (sticky sidebar)  │
│                        │                    │
│  [Produto 1]           │  Subtotal: R$      │
│  [- 2 +]  R$ XX,XX     │  Frete: Grátis     │
│                        │  Total: R$ XXX,XX  │
│  [Produto 2]           │                    │
│  [- 1 +]  R$ XX,XX     │  [Finalizar]       │
│                        │  [Continuar]       │
└────────────────────────┴────────────────────┘
```

**Funcionalidades:**

1. **Lista de Itens:**
   - ✅ Imagem do produto
   - ✅ Nome e categorias
   - ✅ Controles de quantidade (-, +)
   - ✅ Preço unitário e subtotal
   - ✅ Botão remover (lixeira)
   - ✅ Link para detalhes do produto

2. **Controles de Quantidade:**
   - ✅ Botão `-`: decrementa (remove se chegar a 0)
   - ✅ Exibição da quantidade atual
   - ✅ Botão `+`: incrementa
   - ✅ Visual com bordas e hover

3. **Sidebar - Resumo:**
   - ✅ Subtotal com contador de itens
   - ✅ Frete (Grátis)
   - ✅ Total geral destacado
   - ✅ Botão "Finalizar Compra" → `/checkout`
   - ✅ Botão "Continuar Comprando" → `/`
   - ✅ Sticky (fixa ao rolar)

4. **Estado Vazio:**
   - ✅ Ícone de carrinho vazio
   - ✅ Mensagem explicativa
   - ✅ Botão para continuar comprando

### 🪝 Custom Hook

#### `src/hooks/useCart.js`

```javascript
import { useCart } from '../hooks/useCart'

// ou

import { useCart } from '../contexts/CartContext'
```

**Ambas as formas funcionam!**

## 🎨 Componentes Visuais

### Badge do Carrinho (Header)
```jsx
<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
  {totalItems > 99 ? '99+' : totalItems}
</span>
```

### Mensagem de Sucesso (ProductDetails)
```jsx
<div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
  <Check size={20} />
  <span>Produto adicionado ao carrinho com sucesso!</span>
</div>
```

### Card de Item no Carrinho
```jsx
<div className="card">
  <div className="flex gap-4">
    <div className="w-24 h-24 bg-gray-100">
      {/* imagem */}
    </div>
    <div className="flex-grow">
      {/* info e controles */}
    </div>
  </div>
</div>
```

## 🚀 Fluxo de Uso

### 1. Adicionar ao Carrinho
```
Página de Produto
     ↓
Clica "Adicionar ao Carrinho"
     ↓
addToCart(product, 1)
     ↓
CartContext atualiza estado
     ↓
localStorage salva automaticamente
     ↓
Badge do header atualiza
     ↓
Mensagem de sucesso aparece
```

### 2. Modificar Quantidade
```
Página do Carrinho
     ↓
Clica botão [+] ou [-]
     ↓
incrementQuantity() ou decrementQuantity()
     ↓
Estado atualiza
     ↓
localStorage sincroniza
     ↓
Subtotal e total recalculam
```

### 3. Remover Item
```
Clica botão lixeira 🗑️
     ↓
removeFromCart(productId)
     ↓
Item removido do estado
     ↓
localStorage atualiza
     ↓
Se carrinho vazio → exibe mensagem
```

### 4. Persistência
```
Usuário adiciona itens
     ↓
Fecha o navegador
     ↓
localStorage mantém dados
     ↓
Reabre o site
     ↓
CartContext carrega do localStorage
     ↓
Carrinho restaurado com todos os itens
```

## 📊 Cálculos

### Subtotal de Item
```javascript
const getItemSubtotal = (item) => {
  return item.product.price * item.quantity
}
```

**Exemplo:**
- Produto: R$ 100,00
- Quantidade: 3
- Subtotal: R$ 300,00

### Total do Carrinho
```javascript
const getCartTotal = () => {
  return cartItems.reduce(
    (total, item) => total + getItemSubtotal(item),
    0
  )
}
```

**Exemplo:**
- Item 1: R$ 300,00 (100 x 3)
- Item 2: R$ 150,00 (50 x 3)
- Total: R$ 450,00

### Total de Itens
```javascript
const getTotalItems = () => {
  return cartItems.reduce((total, item) => total + item.quantity, 0)
}
```

**Exemplo:**
- Produto A: 3 unidades
- Produto B: 2 unidades
- Total: 5 itens

## 🧪 Testes

### Teste 1: Adicionar Produto
1. Acesse produto: `/products/1`
2. Clique "Adicionar ao Carrinho"
3. ✅ Badge do header deve mostrar "1"
4. ✅ Mensagem de sucesso aparece
5. ✅ Aparece "1 unidade no carrinho"

### Teste 2: Adicionar Mesmo Produto Múltiplas Vezes
1. Na página do produto, clique "Adicionar" 3 vezes
2. ✅ Badge mostra "3"
3. ✅ No carrinho, deve ter 1 item com quantidade 3

### Teste 3: Modificar Quantidade no Carrinho
1. Vá para `/cart`
2. Clique no botão [+]
3. ✅ Quantidade incrementa
4. ✅ Subtotal recalcula
5. ✅ Total atualiza
6. Clique [-] até 0
7. ✅ Item é removido

### Teste 4: Persistência
1. Adicione 2 produtos ao carrinho
2. **Feche o navegador completamente**
3. Reabra o site
4. ✅ Carrinho deve ter os 2 produtos
5. ✅ Badge mostra quantidade correta

### Teste 5: Remover Item
1. No carrinho, clique na lixeira 🗑️
2. ✅ Item some imediatamente
3. ✅ Total recalcula
4. Se era o último item:
5. ✅ Mensagem "Carrinho vazio" aparece

### Teste 6: Finalizar Compra
1. Com itens no carrinho
2. Clique "Finalizar Compra"
3. ✅ Navega para `/checkout`
4. (Funcionalidade de checkout a implementar)

## 🔧 Dados do localStorage

### Inspecionar no DevTools

**Chrome/Edge:**
1. F12 → Application tab
2. Storage → Local Storage
3. Procurar chave: `shopping_cart`

**Exemplo de Dados:**
```json
[
  {
    "product": {
      "id": 1,
      "name": "Smart TV",
      "price": 2190.0,
      "imgUrl": "https://...",
      "description": "...",
      "categories": [
        {"id": 1, "name": "Electronics"}
      ]
    },
    "quantity": 2
  }
]
```

### Limpar Carrinho Manualmente
```javascript
// No console do DevTools:
localStorage.removeItem('shopping_cart')
// ou
localStorage.clear()
```

## 🎯 Próximas Implementações

- [ ] Checkout: processar pedido
- [ ] Validar estoque antes de adicionar
- [ ] Cupons de desconto
- [ ] Calcular frete por CEP
- [ ] Limites de quantidade por produto
- [ ] Adicionar múltiplas unidades de uma vez
- [ ] Lista de desejos
- [ ] Histórico de compras

## 🐛 Troubleshooting

**Carrinho não persiste:**
- Verifique se localStorage está habilitado no navegador
- Verifique console para erros de JSON
- Certifique-se que CartProvider envolve BrowserRouter

**Badge não atualiza:**
- Verifique se Header está usando `useCart()`
- Certifique-se que Header está dentro do CartProvider

**Produto duplicado no carrinho:**
- Verifique se a lógica de `existingItemIndex` está correta
- Confirme que `product.id` é consistente

**Total não calcula corretamente:**
- Verifique se `product.price` é um número
- Certifique-se que `quantity` é um número
- Use `console.log` para debugar cálculos

## 📚 Referências

- [React Context API](https://react.dev/reference/react/useContext)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
