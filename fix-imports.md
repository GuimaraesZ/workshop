# Correções de Imports Necessárias

## Resumo dos Erros
- **100 erros de compilação** causados por imports incorretos após reorganização por domínio
- Principais problemas: Models, Repositories, Services e Config não encontram classes após mudança de pacote

## Arquivos com Problemas Críticos (precisam correção manual)

### 1. Models (referências circulares entre domínios)
- `CategoryModel.java` - referencia `ProductModel`
- `OrderItemPk.java` - referencia `OrderModel` e `ProductModel`
- `OrderModel.java` - referencia `OrderStatus` (Enums), `UserModel`, `PaymentsModel`
- `OrderItemModel.java` - referencia `ProductModel`  
- `PaymentsModel.java` - referencia `OrderModel`
- `ProductModel.java` - referencia `CategoryModel`, `OrderItemModel`
- `UserModel.java` - referencia `OrderModel`

### 2. Repositories (imports antigos)
Todos os repositories estão importando de pacote antigo:
- `import com.educandofe.course.Model.ProductModel` → `import com.educandofe.course.Model.product.ProductModel`
- Similar para User, Category, Order, OrderItem

### 3. Services (imports antigos)
- `AuthService.java` - Model.UserModel, repositorys.UserRepository
- `CategoryService.java` - Model.CategoryModel, repositorys.CategoryRepository  
- `OrderService.java` - Model.Enums.OrderStatus, dto.*, repositorys.*
- `ProductService.java` - Model.ProductModel, repositorys.ProductRepository

### 4. Config
- `TesteConfig.java` - importa todos Models e Repositories do pacote antigo

## Estratégia de Correção

1. ✅ Controllers - JÁ CORRIG

IDOS (auth, category, order, product, user, upload)
2. ❌ **Models** - Corrigir imports entre domínios (product ↔ category ↔ order ↔ user)
3. ❌ **Repositories** - Atualizar imports de Models
4. ❌ **Services** - Atualizar imports de Models, DTOs e Repositories
5. ❌ **Config** - Atualizar imports de Models e Repositories
