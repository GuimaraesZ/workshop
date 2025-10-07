# Sistema de Permissões e Usuários

## 📋 Visão Geral

O sistema possui dois níveis de permissão distintos: **ADMIN** e **USER**. Cada nível tem acesso a funcionalidades específicas do sistema.

---

## 👥 Tipos de Usuário

### � ADMIN (Administrador)
**Acesso Total ao Sistema e Gerenciamento de Lojas**

#### Permissões:
- ✅ Acesso total ao sistema
- ✅ Gerenciar todos os usuários (criar, editar, excluir, ativar/desativar)
- ✅ Definir permissões de outros usuários (promover/rebaixar)
- ✅ Gerenciar todas as lojas (criar, editar, excluir)
- ✅ Gerenciar todos os produtos (criar, editar, excluir)
- ✅ Ser atribuído como responsável por lojas específicas
- ✅ Upload de fotos de produtos
- ✅ Alterar preços de qualquer produto
- ✅ Ver relatórios completos do sistema
- ✅ Acesso ao painel de administração (/manager)
- ✅ Ver dashboard com estatísticas gerais
- ✅ Configurar sistema

#### Características:
- Pode acessar `/manager/dashboard`, `/manager/lojas`, `/manager/produtos`, `/manager/usuarios`
- Tem controle total sobre o ecossistema de lojas
- Único que pode criar/editar/excluir usuários ADMIN
- **Pode ser responsável por uma ou mais lojas específicas**
- Gerencia produtos das lojas que foi atribuído

---

### 🔵 USER (Usuário)
**Cliente Final**

#### Permissões:
- ✅ Fazer pedidos no sistema
- ✅ Ver histórico de compras
- ✅ Gerenciar favoritos
- ✅ Atualizar perfil pessoal
- ✅ Adicionar produtos ao carrinho
- ✅ Finalizar checkout
- ✅ Ver detalhes de produtos
- ✅ Navegar pela loja
- ❌ Não pode acessar painel administrativo
- ❌ Não pode fazer upload de fotos
- ❌ Não pode alterar preços
- ❌ Não pode gerenciar produtos/lojas
- ❌ Não pode criar outros usuários

#### Características:
- Experiência de compra padrão
- Acesso apenas às áreas públicas e perfil
- Proteção de rotas administrativas

---

## 🏪 Sistema de Lojas

### Conceito:
Cada loja deve ter um **Administrador responsável** atribuído. Apenas usuários com role **ADMIN** podem ser responsáveis por lojas.

### Atribuição de Lojas:
1. Ao criar uma nova loja, é obrigatório selecionar um administrador responsável
2. O dropdown mostra apenas usuários com role ADMIN
3. Um administrador pode ser responsável por múltiplas lojas
4. O administrador responsável tem acesso total à gestão daquela loja

### Exemplo de Estrutura:
```
Admin Geral → Loja Principal (45 produtos)
João Silva → Perfumaria Elite (28 produtos)
Maria Santos → Cosméticos Premium (35 produtos)
João Silva → Beauty Store (7 produtos)  // Mesmo admin em 2 lojas
```

---

## 🛡️ Controle de Acesso

### Rotas Protegidas

#### Públicas (sem autenticação):
- `/shop` - Visualizar produtos
- `/products/:id` - Detalhes de produto
- `/login` - Login
- `/login/manager` - Login administrativo

#### Protegidas (USER ou superior):
- `/` (Dashboard)
- `/cart` - Carrinho
- `/checkout` - Finalizar compra
- `/profile` - Perfil
- `/favorites` - Favoritos
- `/orders` - Pedidos

#### Administrativas (ADMIN apenas):
- `/manager/dashboard` - Dashboard admin
- `/manager/lojas` - Gerenciar lojas
- `/manager/produtos` - Gerenciar produtos
- `/manager/usuarios` - Gerenciar usuários

---

## 🔐 Implementação no Backend

### Model de Usuário (Java)
```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String email;
    private String senha; // BCrypt hash
    
    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, USER
    
    private Boolean ativo = true;
    
    @OneToMany(mappedBy = "administrador")
    private List<Loja> lojasResponsaveis; // Lojas que o admin gerencia
    
    private LocalDateTime dataCriacao;
    private LocalDateTime ultimoAcesso;
}

public enum Role {
    ADMIN,    // Acesso total e pode gerenciar lojas
    USER      // Cliente
}
```

### Model de Loja
```java
@Entity
public class Loja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String descricao;
    
    @ManyToOne
    @JoinColumn(name = "administrador_id", nullable = false)
    private User administrador; // ADMIN responsável
    
    @OneToMany(mappedBy = "loja")
    private List<Product> produtos;
}
```

### Anotações de Segurança
```java
// Apenas ADMIN pode criar usuários
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/api/usuarios")
public ResponseEntity<User> createUser(@RequestBody User user) { }

// Apenas ADMIN pode criar lojas
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/api/lojas")
public ResponseEntity<Loja> createLoja(@RequestBody Loja loja) { }

// ADMIN responsável pela loja pode editar produtos
@PreAuthorize("hasRole('ADMIN') and @lojaService.isResponsavel(principal.id, #lojaId)")
@PutMapping("/api/produtos/{id}")
public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) { }

// Qualquer usuário autenticado
@PreAuthorize("isAuthenticated()")
@GetMapping("/api/profile")
public ResponseEntity<User> getProfile() { }
```

---

## 📊 Fluxo de Gerenciamento

### Criação de Usuários (ADMIN)
1. ADMIN acessa `/manager/usuarios`
2. Clica em "Novo Usuário"
3. Preenche dados: nome, email, senha, role
4. Seleciona permissão (ADMIN ou USER)
5. Sistema cria usuário com BCrypt hash
6. Email de boas-vindas é enviado

### Criação de Lojas (ADMIN)
1. ADMIN acessa `/manager/lojas`
2. Clica em "Nova Loja"
3. Preenche nome e descrição da loja
4. **Seleciona um administrador responsável no dropdown**
   - Dropdown mostra apenas usuários com role ADMIN
   - Seleção obrigatória
5. Sistema cria loja associada ao administrador
6. Administrador recebe acesso à gestão da loja

### Atribuição de Produtos
1. Ao criar/editar produto, seleciona a loja
2. Produto fica vinculado à loja
3. Administrador responsável pela loja pode gerenciar o produto

---

## 🚀 Próximas Implementações

### Backend (Java + Spring Boot)
- [ ] Criar entity `User` com role (ADMIN, USER)
- [ ] Criar entity `Loja` com relacionamento para User (administrador)
- [ ] Implementar Spring Security
- [ ] Criar endpoints CRUD para usuários (apenas ADMIN)
- [ ] Criar endpoints CRUD para lojas (apenas ADMIN)
- [ ] Implementar @PreAuthorize nas rotas
- [ ] Criar serviço de autenticação JWT
- [ ] Validar que apenas ADMIN pode ser responsável por loja
- [ ] Endpoint para listar apenas usuários ADMIN (para dropdown)

### Frontend (React)
- [x] Página de gerenciamento de usuários
- [x] Sistema de permissões no UI (ADMIN e USER)
- [x] Badges de role visuais
- [x] Dropdown de administradores em criar loja
- [ ] Implementar UserContext
- [ ] Proteger rotas baseado em role
- [ ] Criar HOC `withPermission`
- [ ] Validação de permissões em componentes
- [ ] Serviço para buscar apenas ADMINs

### Melhorias
- [ ] Logs de ações administrativas
- [ ] Histórico de alterações de permissões
- [ ] Sistema de convites por email
- [ ] Recuperação de senha
- [ ] 2FA para admins
- [ ] Auditoria de acesso
- [ ] Dashboard específico por loja para o ADMIN responsável

---

## 💡 Exemplos de Uso

### Verificar Permissão no Frontend
```jsx
import { useAuth } from '../contexts/AuthContext'

function ProductForm() {
  const { user } = useAuth()
  
  const canUploadPhoto = user.role === 'ADMIN'
  const canChangePrice = user.role === 'ADMIN'
  
  return (
    <form>
      {canUploadPhoto && (
        <input type="file" name="foto" />
      )}
      {canChangePrice && (
        <input type="number" name="preco" />
      )}
    </form>
  )
}
```

### Proteger Rota por Role
```jsx
function AdminRoute({ children }) {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login/manager" />
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" />
  }
  
  return children
}
```

### Buscar Apenas Administradores (API)
```java
@GetMapping("/api/usuarios/admins")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<User>> getAdministradores() {
    List<User> admins = userService.findByRole(Role.ADMIN);
    return ResponseEntity.ok(admins);
}
```

---

## 📝 Notas Importantes

1. **Segurança**: Todas as verificações de permissão devem ser feitas no backend
2. **Frontend**: Apenas esconde elementos, não garante segurança
3. **Token JWT**: Deve incluir role do usuário no payload
4. **Cascata**: ADMIN pode tudo, USER só cliente
5. **Logs**: Registrar todas as ações administrativas
6. **Backup**: Sempre ter pelo menos 1 ADMIN ativo no sistema
7. **Lojas**: Toda loja DEVE ter um administrador responsável
8. **Dropdown**: Ao criar loja, mostrar apenas usuários com role ADMIN

---

## 🔄 Estados de Usuário

- **Ativo**: Pode fazer login e usar o sistema
- **Inativo**: Não pode fazer login (soft delete)
- **Bloqueado**: Temporariamente suspenso (tentativas de login falhas)
- **Pendente**: Aguardando confirmação de email

---

## 📧 Notificações

### Quando criar usuário:
- Email de boas-vindas
- Credenciais temporárias (primeira senha)
- Link para ativar conta

### Quando alterar permissão:
- Notificar usuário sobre nova role
- Explicar novas permissões
- Atualizar cache do frontend

### Quando atribuir loja a administrador:
- Notificar administrador sobre nova responsabilidade
- Enviar detalhes da loja
- Instruções de gestão

---

**Última atualização**: 07/10/2025  
**Versão**: 2.0.0  
**Mudanças**: Removido role MANAGER, sistema simplificado para ADMIN e USER apenas
