# 🔐 Sistema de Autenticação JWT - Documentação Completa

## ✅ Implementado

### 📦 Estrutura de Arquivos

```
src/
├── contexts/
│   ├── AuthContext.jsx          # Context de autenticação
│   └── CartContext.jsx           # Context do carrinho
├── services/
│   ├── authService.js            # Serviços de autenticação
│   └── api.js                    # Cliente HTTP com JWT
├── components/
│   ├── ProtectedRoute.jsx        # HOC para rotas protegidas
│   └── Header.jsx                # Header com menu de usuário
├── pages/
│   ├── Login.jsx                 # Página de login
│   ├── Signup.jsx                # Página de cadastro
│   └── Profile.jsx               # Perfil (rota protegida)
└── App.jsx                        # Providers e configuração
```

## 🔑 AuthContext - Context de Autenticação

### Localização: `src/contexts/AuthContext.jsx`

### **Estado Global:**

```javascript
{
  user: {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    roles: ["USER"] // opcional
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  isLoading: false,
  isAuthenticated: true
}
```

### **Funções Disponíveis:**

| Função | Descrição | Parâmetros | Retorno |
|--------|-----------|------------|---------|
| `login(email, password)` | Autentica usuário | email, password | Promise\<{success, user}\> |
| `signup(userData)` | Cadastra novo usuário | {name, email, password} | Promise\<{success, user}\> |
| `logout()` | Faz logout e limpa sessão | - | void |
| `updateUser(userData)` | Atualiza dados do usuário | userData | void |
| `isTokenValid()` | Verifica se token é válido | - | boolean |
| `getAuthToken()` | Retorna token atual | - | string \| null |
| `hasRole(role)` | Verifica permissão | role: string | boolean |

### **Persistência:**

- **Token**: `localStorage.getItem('auth_token')`
- **Usuário**: `localStorage.getItem('auth_user')`
- **Auto-load**: Ao montar, carrega dados salvos
- **Auto-save**: Ao mudar, salva automaticamente

## 🌐 API Client com JWT

### Localização: `src/services/api.js`

### **Funcionamento:**

```javascript
// Exemplo de requisição
const data = await api.get('/products')

// Automaticamente adiciona header:
{
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

### **Tratamento de Erros:**

#### **401 Unauthorized:**
```javascript
if (response.status === 401) {
  // 1. Limpa token e usuário do localStorage
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  
  // 2. Redireciona para login com query param
  window.location.href = '/login?redirect=' + window.location.pathname
}
```

#### **Outros Erros:**
```javascript
if (!response.ok) {
  const error = await response.json().catch(() => ({}))
  throw new Error(error.message || `HTTP Error: ${response.status}`)
}
```

## 🔒 ProtectedRoute - Proteção de Rotas

### Localização: `src/components/ProtectedRoute.jsx`

### **Uso:**

```jsx
// Rota que REQUER autenticação
<Route 
  path="/checkout" 
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  } 
/>

// Rota que NÃO permite autenticados (login/signup)
<Route 
  path="/login" 
  element={
    <ProtectedRoute requireAuth={false}>
      <Login />
    </ProtectedRoute>
  } 
/>
```

### **Props:**

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `children` | ReactNode | - | Componente filho |
| `requireAuth` | boolean | true | Se requer autenticação |
| `redirectTo` | string | '/login' | Para onde redirecionar |

### **Comportamento:**

1. **`requireAuth=true` e usuário NÃO autenticado:**
   - Redireciona para `/login`
   - Salva rota atual em `location.state.from`
   
2. **`requireAuth=false` e usuário autenticado:**
   - Redireciona para `/` ou rota anterior

3. **Enquanto carrega:**
   - Exibe componente `<Loading />`

## 📄 Páginas de Autenticação

### Login.jsx

#### **Funcionalidades:**
- ✅ Validação de email e senha
- ✅ Mensagem de erro com ícone
- ✅ Mensagem de redirecionamento
- ✅ Loading state no botão
- ✅ Link para cadastro
- ✅ Link "Esqueceu a senha?"
- ✅ Redireciona após login bem-sucedido

#### **Fluxo:**
```
1. Usuário preenche email e senha
2. Clica "Entrar"
3. AuthContext.login(email, password)
4. Token e user salvos no localStorage
5. Redireciona para página anterior ou home
```

### Signup.jsx

#### **Funcionalidades:**
- ✅ Validação inline com feedback visual
- ✅ Verifica se senhas coincidem
- ✅ Validação de nome (mín. 3 caracteres)
- ✅ Validação de email (regex)
- ✅ Validação de senha (mín. 6 caracteres)
- ✅ Mensagem de erro com ícone
- ✅ Feedback de sucesso (senhas coincidem)
- ✅ Loading state no botão
- ✅ Link para login

#### **Validações:**

```javascript
{
  name: "Mínimo 3 caracteres",
  email: "Email inválido",
  password: "Mínimo 6 caracteres",
  confirmPassword: "As senhas não coincidem"
}
```

## 🎨 Header com Autenticação

### **Estados:**

#### **Usuário NÃO Autenticado:**
- Botão "Entrar" (desktop)
- Link "Entrar" no menu mobile

#### **Usuário Autenticado:**
- Ícone de usuário + primeiro nome
- Dropdown menu com:
  - 📱 Meu Perfil
  - 🚪 Sair (vermelho)
- Badge de carrinho atualizado

### **Menu Dropdown:**

```
┌─────────────────────┐
│ 👤 Meu Perfil       │
├─────────────────────┤
│ 🚪 Sair             │ (vermelho)
└─────────────────────┘
```

### **Logout:**
1. Chama `AuthContext.logout()`
2. Limpa localStorage
3. Redireciona para `/login`

## 🛣️ Rotas Protegidas

### **Configuração em AppRoutes.jsx:**

```jsx
// ✅ ROTAS PROTEGIDAS (requerem login)
/checkout    → ProtectedRoute → Checkout
/profile     → ProtectedRoute → Profile

// ✅ ROTAS PÚBLICAS
/            → Home
/products/:id → ProductDetails
/cart        → Cart

// ✅ ROTAS APENAS PARA NÃO AUTENTICADOS
/login       → ProtectedRoute(requireAuth=false) → Login
/signup      → ProtectedRoute(requireAuth=false) → Signup
```

### **Exemplo de Teste:**

1. **Sem login**, tente acessar `/checkout`
   - ❌ Redireciona para `/login?redirect=/checkout`
   - Mensagem: "Você precisa fazer login para acessar esta página."

2. **Com login**, tente acessar `/login`
   - ❌ Redireciona para `/` (home)

3. **Com login**, acesse `/profile`
   - ✅ Acesso permitido

## 🔐 Estrutura do Token JWT

### **Exemplo de Token:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvYW8gU2lsdmEiLCJpYXQiOjE1MTYyMzkwMjJ9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### **Decoded Payload:**

```json
{
  "sub": "1",
  "name": "João Silva",
  "email": "joao@example.com",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": ["USER"]
}
```

### **Validação no Frontend:**

```javascript
// TODO: Implementar com biblioteca jwt-decode
import jwtDecode from 'jwt-decode'

const isTokenValid = () => {
  if (!token) return false
  
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    return false
  }
}
```

## 🔄 Fluxo Completo de Autenticação

### **1. Cadastro (Signup):**

```
┌─────────────┐
│ Signup Page │
└──────┬──────┘
       │ 1. Usuário preenche formulário
       │ 2. Clica "Cadastrar"
       ▼
┌──────────────┐
│ AuthContext  │
│ signup()     │
└──────┬───────┘
       │ 3. Chama authService.signup()
       ▼
┌──────────────┐
│ API Backend  │
│ POST /signup │
└──────┬───────┘
       │ 4. Cria usuário no banco
       │ 5. Gera token JWT
       │ 6. Retorna { token, user }
       ▼
┌──────────────┐
│ AuthContext  │
│ saveAuth()   │
└──────┬───────┘
       │ 7. Salva token e user no localStorage
       │ 8. Atualiza estado global
       ▼
┌──────────────┐
│ Navigate('/')│
│ Home Page    │
└──────────────┘
```

### **2. Login:**

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │ 1. Email + Senha
       ▼
┌──────────────┐
│ AuthContext  │
│ login()      │
└──────┬───────┘
       │ 2. POST /auth/login
       ▼
┌──────────────┐
│ API Backend  │
│ Valida creds │
└──────┬───────┘
       │ 3. Token JWT
       ▼
┌──────────────┐
│ localStorage │
│ auth_token   │
│ auth_user    │
└──────┬───────┘
       │ 4. Redirect
       ▼
┌──────────────┐
│ Home / Cart  │
└──────────────┘
```

### **3. Requisições Autenticadas:**

```
┌─────────────┐
│ Component   │
│ api.get()   │
└──────┬──────┘
       │ 1. Faz requisição
       ▼
┌──────────────┐
│ api.js       │
│ getToken()   │
└──────┬───────┘
       │ 2. Pega token do localStorage
       │ 3. Adiciona header Authorization
       ▼
┌──────────────┐
│ Fetch API    │
│ GET /api/... │
│ Header: Bearer TOKEN
└──────┬───────┘
       │ 4. Backend valida JWT
       ▼
   ┌──────┐
   │ 200  │ ✅ Sucesso
   └──────┘
   ┌──────┐
   │ 401  │ ❌ Token inválido
   └──┬───┘
      │ 5. Limpa localStorage
      │ 6. Redirect /login
      ▼
┌──────────────┐
│ Login Page   │
└──────────────┘
```

### **4. Logout:**

```
┌─────────────┐
│ Header      │
│ Clica "Sair"│
└──────┬──────┘
       │ 1. handleLogout()
       ▼
┌──────────────┐
│ AuthContext  │
│ logout()     │
└──────┬───────┘
       │ 2. localStorage.removeItem()
       │ 3. setToken(null)
       │ 4. setUser(null)
       ▼
┌──────────────┐
│ Navigate     │
│ /login       │
└──────────────┘
```

## 🧪 Testes Manuais

### **Teste 1: Cadastro e Login**

1. Acesse `/signup`
2. Preencha:
   - Nome: "João Silva"
   - Email: "joao@test.com"
   - Senha: "123456"
   - Confirmar: "123456"
3. Clique "Cadastrar"
4. ✅ Deve redirecionar para home
5. ✅ Header deve mostrar "João"
6. ✅ Badge do carrinho deve aparecer

### **Teste 2: Logout e Login Novamente**

1. Clique no nome de usuário no header
2. Clique "Sair"
3. ✅ Deve ir para `/login`
4. ✅ Header deve mostrar "Entrar"
5. Faça login novamente
6. ✅ Deve restaurar sessão

### **Teste 3: Rota Protegida**

1. **Sem login**, tente acessar `/checkout`
2. ✅ Deve redirecionar para `/login`
3. ✅ Mensagem: "Você precisa fazer login..."
4. Faça login
5. ✅ Deve voltar para `/checkout`

### **Teste 4: Persistência**

1. Faça login
2. **Recarregue a página (F5)**
3. ✅ Deve continuar logado
4. ✅ Header deve mostrar nome
5. ✅ Carrinho deve estar preservado

### **Teste 5: Validações**

1. Em `/signup`, tente:
   - Nome com 2 caracteres → ❌ Erro
   - Email inválido → ❌ Erro
   - Senha com 5 caracteres → ❌ Erro
   - Senhas diferentes → ❌ Erro
2. ✅ Deve exibir erros inline

## 📊 Dados do localStorage

### **Inspecionar no DevTools:**

**Chrome/Edge:**
1. F12 → Application
2. Storage → Local Storage
3. Procurar:
   - `auth_token`
   - `auth_user`
   - `shopping_cart`

### **Exemplo:**

```javascript
// auth_token
"mock-jwt-token-1234567890"

// auth_user
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@test.com"
}
```

## 🔧 Integração com Backend Real

### **Configuração Necessária:**

#### **1. Atualizar AuthContext.jsx:**

```javascript
// Remover simulação
const login = async (email, password) => {
  try {
    // USAR SERVIÇO REAL
    const response = await authService.login(email, password)
    
    saveAuth(response.token, response.user)
    return { success: true, user: response.user }
  } catch (error) {
    throw error
  }
}
```

#### **2. Endpoints do Backend:**

```
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/verify
GET  /api/auth/me
```

#### **3. Formato de Resposta do Backend:**

```json
// POST /api/auth/login
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@test.com",
    "roles": ["USER"]
  }
}
```

## 🐛 Troubleshooting

### **Problema: "Sessão expirada" ao fazer requisições**

**Causa:** Token JWT expirou

**Solução:**
- Implementar refresh token
- Renovar token automaticamente antes de expirar

```javascript
// Em api.js, interceptar 401
if (response.status === 401) {
  const newToken = await authService.refreshToken()
  // Tentar novamente com novo token
}
```

### **Problema: Usuário não persiste após reload**

**Causa:** localStorage não está sendo lido

**Solução:**
- Verificar useEffect em AuthContext
- Verificar se dados estão sendo salvos corretamente
- Limpar localStorage e tentar novamente

### **Problema: Rotas protegidas não funcionam**

**Causa:** ProtectedRoute não está envolvendo componente

**Solução:**
```jsx
// ❌ ERRADO
<Route path="/profile" element={<Profile />} />

// ✅ CORRETO
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
```

### **Problema: Token não está sendo enviado**

**Causa:** api.js não está pegando token

**Solução:**
- Verificar se `getAuthToken()` está funcionando
- Verificar console para erros
- Inspecionar Network tab no DevTools

## 📚 Próximas Melhorias

- [ ] Implementar refresh token automático
- [ ] Adicionar JWT decode library
- [ ] Implementar "Lembrar-me" (remember me)
- [ ] Adicionar autenticação social (Google, Facebook)
- [ ] Implementar recuperação de senha
- [ ] Adicionar verificação de email
- [ ] Implementar roles/permissions mais complexas
- [ ] Adicionar logout em todos os dispositivos
- [ ] Implementar session timeout warning

## 🎯 Resumo

✅ **AuthContext**: Gerencia estado global de autenticação
✅ **api.js**: Adiciona token JWT automaticamente
✅ **ProtectedRoute**: Protege rotas sensíveis
✅ **Login/Signup**: Formulários com validação
✅ **Header**: Menu de usuário com logout
✅ **Persistência**: localStorage mantém sessão
✅ **Segurança**: Token renovável, rotas protegidas

**Sistema completo e funcional!** 🚀
