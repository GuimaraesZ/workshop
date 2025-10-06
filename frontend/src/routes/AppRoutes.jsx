import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import ProductDetails from '../pages/ProductDetails'
import CategoryProducts from '../pages/CategoryProducts'
import Cart from '../pages/Cart'
import CheckoutLayout from '../pages/checkout/CheckoutLayout'
import CartStep from '../pages/checkout/CartStep'
import AddressStep from '../pages/checkout/AddressStep'
import PaymentStep from '../pages/checkout/PaymentStep'
import OrderConfirmation from '../pages/OrderConfirmation'
import OrderDetails from '../pages/OrderDetails'
import Orders from '../pages/Orders'
import Login from '../pages/Login'
import AdminLogin from '../pages/AdminLogin'
import Profile from '../pages/Profile'
import Favorites from '../pages/Favorites'
import Manager from '../pages/Manager'
import NotFound from '../pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      {/* ROTAS PÚBLICAS SEM LAYOUT (Login isolado - inclui cadastro em tabs) */}
      <Route 
        path="/login" 
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } 
      />

      {/* Login de Administrador */}
      <Route 
        path="/login/manager" 
        element={<AdminLogin />} 
      />

      {/* ROTAS COM LAYOUT (Header + Sidebar) */}
      <Route path="/" element={<Layout />}>
        {/* Dashboard - Área do cliente (PROTEGIDA) */}
        <Route 
          index 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Loja - Todos os produtos com carousel */}
        <Route path="/shop" element={<Shop />} />
        
        {/* Página de produtos - Loja */}
        <Route path="/products" element={<Home />} />
        
        {/* Detalhes do produto */}
        <Route path="/products/:id" element={<ProductDetails />} />
        
        {/* Produtos por categoria */}
        <Route path="/categories/:id" element={<CategoryProducts />} />
        
        {/* Carrinho de compras */}
        <Route path="/cart" element={<Cart />} />
        
        {/* Checkout - Multi-step - ROTA PROTEGIDA */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CartStep />} />
          <Route path="cart" element={<CartStep />} />
          <Route path="address" element={<AddressStep />} />
          <Route path="payment" element={<PaymentStep />} />
        </Route>
        
        {/* Confirmação de pedido - ROTA PROTEGIDA */}
        <Route 
          path="/order-confirmation/:orderId" 
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } 
        />
        
        {/* Detalhes do pedido - ROTA PROTEGIDA */}
        <Route 
          path="/orders/:id" 
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } 
        />
        
        {/* Perfil e histórico de pedidos - ROTA PROTEGIDA */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Favoritos - ROTA PROTEGIDA */}
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } 
        />

        {/* Lista de pedidos - ROTA PROTEGIDA */}
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        
        {/* Gerenciador de Produtos - ROTA PROTEGIDA ADMIN */}
        <Route 
          path="/manager" 
          element={
            <AdminRoute>
              <Manager />
            </AdminRoute>
          } 
        />
        
        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
