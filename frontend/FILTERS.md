# 🔍 Sistema de Filtros - Documentação

## ✅ Implementado

### 📁 Novos Componentes

#### `CategoryFilter.jsx`
Sidebar de filtros por categoria com:
- ✅ Lista todas as categorias da API
- ✅ Opção "Todas as Categorias"
- ✅ Destaque visual da categoria ativa
- ✅ Checkmark (✓) na categoria selecionada
- ✅ Navegação via query params (`?category=id`)
- ✅ Hover effects
- ✅ Responsivo

#### `ProductFilters.jsx`
Barra de filtros e ordenação com:
- ✅ Dropdown de ordenação
- ✅ Contador de produtos
- ✅ Layout responsivo
- ✅ Opções de ordenação:
  - Relevância
  - Menor Preço
  - Maior Preço
  - Nome (A-Z)
  - Nome (Z-A)

### 📄 Página Home Atualizada

#### Funcionalidades Adicionadas:
- ✅ **Query Params**: Usa `?category=id` na URL
- ✅ **Filtro por Categoria**: Filtra produtos em tempo real
- ✅ **Ordenação**: 5 critérios diferentes
- ✅ **Layout com Sidebar**: Grid responsivo com filtros laterais
- ✅ **Breadcrumb**: Navegação quando há filtro ativo
- ✅ **Hero Section Condicional**: Exibe apenas sem filtro
- ✅ **Estado Vazio**: Mensagem quando não há produtos
- ✅ **Título Dinâmico**: Mostra nome da categoria ativa

### 📁 Utils

#### `helpers.js`
Funções utilitárias:
- `sortProducts()` - Ordena array de produtos
- `filterProductsByCategory()` - Filtra por categoria
- `formatPrice()` - Formata para R$
- `formatDate()` - Formata data brasileira
- `truncateText()` - Trunca textos longos
- `debounce()` - Debounce para inputs

## 🎯 Como Funciona

### 1. **Filtro por Categoria**

```javascript
// URL: http://localhost:3000/?category=2

const [searchParams] = useSearchParams()
const categoryFilter = searchParams.get('category') // "2"

// Filtra produtos
const filteredProducts = categoryFilter
  ? products.filter(product => 
      product.categories.some(cat => cat.id === parseInt(categoryFilter))
    )
  : products
```

### 2. **Ordenação**

```javascript
const sortedProducts = [...filteredProducts].sort((a, b) => {
  switch (sortBy) {
    case 'price-asc': return a.price - b.price
    case 'price-desc': return b.price - a.price
    case 'name': return a.name.localeCompare(b.name)
    case 'name-desc': return b.name.localeCompare(a.name)
    default: return 0
  }
})
```

### 3. **Fluxo Completo**

```
1. Usuário clica em categoria
2. URL atualiza: /?category=2
3. React Router detecta mudança
4. useSearchParams pega o valor
5. Produtos são filtrados
6. Produtos filtrados são ordenados
7. Grid re-renderiza com resultados
```

## 📱 Interface

### Layout Desktop
```
┌────────────────────────────────────────┐
│           Breadcrumb                   │
├───────────┬────────────────────────────┤
│           │  Título + Filtros          │
│ Sidebar   ├────────────────────────────┤
│ Categorias│                            │
│  - Todas  │     Grid de Produtos       │
│  - Elect  │     (3 colunas)            │
│  - Books  │                            │
│  - Comp   │                            │
└───────────┴────────────────────────────┘
```

### Layout Mobile
```
┌────────────────────┐
│   Breadcrumb       │
├────────────────────┤
│   Categorias       │
│   (colapsável)     │
├────────────────────┤
│  Filtros           │
├────────────────────┤
│  Grid Produtos     │
│  (1 coluna)        │
└────────────────────┘
```

## 🔗 URLs de Exemplo

### Sem Filtro
```
http://localhost:3000/
```
- Exibe todos os produtos
- Hero section visível
- Seção de categorias no final

### Com Filtro por Categoria
```
http://localhost:3000/?category=1
http://localhost:3000/?category=2
http://localhost:3000/?category=3
```
- Filtra produtos da categoria
- Hero section oculto
- Breadcrumb visível
- Sidebar com categoria marcada

## 🎨 Componentes Visuais

### CategoryFilter
```jsx
<CategoryFilter 
  categories={categories} 
  activeCategory={categoryFilter}
/>
```

**Props:**
- `categories`: Array de categorias da API
- `activeCategory`: ID da categoria ativa (string)

**Features:**
- Link para cada categoria
- Opção "Todas as Categorias"
- Visual ativo/inativo
- Checkmark na seleção

### ProductFilters
```jsx
<ProductFilters
  sortBy={sortBy}
  onSortChange={setSortBy}
  totalProducts={sortedProducts.length}
/>
```

**Props:**
- `sortBy`: Critério de ordenação atual
- `onSortChange`: Callback para mudar ordenação
- `totalProducts`: Total de produtos (para contador)

## 🚀 Testes

### Testar Filtros

1. **Acesse a home:**
   ```
   http://localhost:3000/
   ```

2. **Clique em uma categoria no sidebar**
   - URL muda para `?category=X`
   - Produtos filtram instantaneamente
   - Breadcrumb aparece
   - Sidebar marca categoria

3. **Teste ordenação:**
   - Menor Preço → produtos mais baratos primeiro
   - Maior Preço → produtos mais caros primeiro
   - Nome A-Z → ordem alfabética

4. **Clique em "Todas as Categorias"**
   - Volta para `/` (sem query params)
   - Exibe todos os produtos
   - Hero section reaparece

### Casos de Teste

| Ação | Resultado Esperado |
|------|-------------------|
| Clicar categoria Books | URL: `?category=2`, só livros aparecem |
| Ordenar por menor preço | Produtos em ordem crescente de preço |
| Clicar "Todas" | Remove filtro, mostra todos |
| Categoria sem produtos | Mensagem "Nenhum produto encontrado" |
| Combinar filtro + ordem | Filtra E ordena corretamente |

## 📊 Dados de Teste (Backend)

Categorias disponíveis (TesteConfig.java):
1. **Electronics** (ID: 1)
2. **Books** (ID: 2)
3. **Computers** (ID: 3)

Produtos por categoria:
- Electronics: Smart TV
- Books: The Lord of the Rings, Rails for Dummies
- Computers: Smart TV, Macbook Pro, PC Gamer

## 🔧 Próximas Melhorias

- [ ] Filtro por faixa de preço
- [ ] Busca por nome/descrição
- [ ] Filtro múltiplo (várias categorias)
- [ ] Paginação de resultados
- [ ] Filtros persistentes (localStorage)
- [ ] Contador de produtos por categoria
- [ ] Mobile: categorias em dropdown/modal

## 🐛 Troubleshooting

**Filtro não funciona:**
- Verifique se `useSearchParams` está importado
- Verifique console para erros
- Certifique-se que produtos têm array `categories`

**Produtos não aparecem:**
- Verifique se backend está rodando
- Teste endpoint: `http://localhost:8080/products`
- Verifique estrutura do JSON (tem `categories`?)

**URL não muda:**
- Use `<Link to>` ou `<a href>` (não `<button>`)
- Verifique se está dentro do `<BrowserRouter>`
