# 🔌 Integração com API - Documentação

## ✅ Serviços Criados

### 📁 `services/api.js`
Cliente HTTP base usando **Fetch API nativa** com:
- Configuração de base URL (`/api` - proxy configurado)
- Headers automáticos (Content-Type: application/json)
- Tratamento de erros HTTP
- Métodos: GET, POST, PUT, DELETE

### 📁 `services/productService.js`
```javascript
fetchAllProducts()          // GET /products
fetchProductById(id)        // GET /products/:id
fetchProductsByCategory(id) // Filtra produtos por categoria
```

### 📁 `services/categoryService.js`
```javascript
fetchAllCategories()    // GET /categories
fetchCategoryById(id)   // GET /categories/:id
```

### 📁 `services/userService.js`
```javascript
fetchAllUsers()         // GET /users
fetchUserById(id)       // GET /users/:id
createUser(userData)    // POST /users
updateUser(id, data)    // PUT /users/:id
deleteUser(id)          // DELETE /users/:id
```

### 📁 `services/orderService.js`
```javascript
fetchAllOrders()        // GET /orders
fetchOrderById(id)      // GET /orders/:id
createOrder(orderData)  // POST /orders
```

## 🎨 Componentes Criados

### ProductCard
- Exibe card de produto com imagem, nome, descrição, categorias e preço
- Formatação automática de preço (R$)
- Hover effects e animações
- Link para página de detalhes

### Loading
- Spinner de carregamento centralizado
- Mensagem "Carregando..."

### ErrorMessage
- Exibe mensagens de erro
- Botão "Tentar Novamente" opcional
- Estilo consistente com design system

## 📄 Páginas Atualizadas

### Home (`pages/Home.jsx`)
✅ **Implementado:**
- Busca todos os produtos da API
- Busca todas as categorias da API
- Loading state durante carregamento
- Error state com retry
- Exibe produtos em grid usando ProductCard
- Exibe categorias em grid com ícones dinâmicos
- Contador de produtos e categorias
- Scroll suave para seções (#products, #categories)

### ProductDetails (`pages/ProductDetails.jsx`)
✅ **Implementado:**
- Busca produto por ID da URL
- Loading state
- Error state com retry
- Exibe imagem, nome, descrição, categorias e preço
- Formatação de preço
- Botão "Adicionar ao Carrinho" (alert temporário)
- Botão "Comprar Agora" (adiciona + redireciona)
- Botão voltar
- Estado "produto não encontrado"
- Informações adicionais (frete, estoque, segurança)

### CategoryProducts (`pages/CategoryProducts.jsx`)
✅ **Implementado:**
- Busca produtos por categoria
- Busca informações da categoria
- Loading e error states
- Filtro de ordenação:
  - Relevância
  - Menor Preço
  - Maior Preço
  - Nome (A-Z)
- Grid de produtos usando ProductCard
- Contador de produtos
- Estado vazio

## 🔄 Fluxo de Dados

```
1. Página carrega
2. useEffect dispara
3. setLoading(true)
4. Chama service (ex: fetchAllProducts())
5. Service usa api.get('/products')
6. Fetch faz requisição para http://localhost:8080/products
7. Vite proxy redireciona para backend
8. Resposta volta
9. setProducts(data)
10. setLoading(false)
11. Componente renderiza dados
```

## 🎯 Formatação de Dados

### Preço
```javascript
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}
```

### Exemplo de Produto
```json
{
  "id": 1,
  "name": "The Lord of the Rings",
  "description": "Lorem ipsum dolor sit amet...",
  "price": 90.5,
  "imgUrl": "",
  "categories": [
    { "id": 2, "name": "Books" }
  ]
}
```

## 🚀 Para Testar

1. **Certifique-se que o backend está rodando:**
   ```
   http://localhost:8080
   ```

2. **Instale os ícones lucide-react:**
   ```bash
   npm install lucide-react
   ```

3. **Acesse as páginas:**
   - Home: http://localhost:3000/
   - Produto: http://localhost:3000/products/1
   - Categoria: http://localhost:3000/categories/2

## 📋 Próximos Passos

1. ✅ Services implementados
2. ✅ Páginas consumindo API
3. ⏳ Context API (Cart + Auth)
4. ⏳ Custom Hooks
5. ⏳ Funcionalidade de carrinho completa
6. ⏳ Sistema de autenticação

## 🐛 Troubleshooting

**Erro CORS:**
- Verifique se o proxy está configurado no `vite.config.js`
- Backend deve estar rodando em http://localhost:8080

**Produtos não aparecem:**
- Verifique console do navegador (F12)
- Verifique se backend tem dados (TesteConfig.java)
- Teste endpoint direto: http://localhost:8080/products

**Loading infinito:**
- Verifique se backend está respondendo
- Verifique network tab no DevTools
