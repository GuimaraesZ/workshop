import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { getTotalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  
  const totalItems = getTotalItems()

  // Mapeamento de rotas para títulos
  const pageTitle = useMemo(() => {
    const path = location.pathname
    const titles = {
      '/': 'Dashboard',
      '/shop': 'Loja',
      '/products': 'Produtos',
      '/cart': 'Carrinho',
      '/checkout': 'Finalizar Compra',
      '/checkout/cart': 'Carrinho',
      '/checkout/address': 'Endereço de Entrega',
      '/checkout/payment': 'Pagamento',
      '/orders': 'Meus Pedidos',
      '/profile': 'Meu Perfil',
      '/addresses': 'Endereços',
      '/favorites': 'Favoritos',
      '/support': 'Suporte',
      '/admin': 'Administração',
      '/admin/products': 'Gerenciar Produtos',
      '/admin/categories': 'Gerenciar Categorias',
      '/admin/users': 'Gerenciar Usuários',
    }

    // Rotas dinâmicas
    if (path.startsWith('/product/')) return 'Detalhes do Produto'
    if (path.startsWith('/categories/')) return 'Categoria'
    if (path.startsWith('/orders/')) return 'Detalhes do Pedido'
    if (path.startsWith('/order-confirmation/')) return 'Pedido Confirmado'

    return titles[path] || 'Página'
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-700 sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-center relative h-[3.93rem]">
          {/* Page Title - Slightly left of center with gradient */}
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-500 dark:to-primary-300 bg-clip-text text-transparent mr-32">
            {pageTitle}
          </h1>

          {/* Actions - Absolute positioned to the right */}
          <div className="absolute right-0 flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              title="Carrinho"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-neutral-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  title="Menu do usuário"
                >
                  {user?.profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-400">
                      <img 
                        src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:8080${user.profileImage}`}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium">
                    {user?.name?.split(' ')[0] || 'Usuário'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl py-2 z-20 animate-scale-in shadow-lg border border-neutral-300 dark:border-neutral-700">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors rounded-lg mx-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>Meu Perfil</span>
                        </div>
                      </Link>
                      
                      <div className="border-t border-neutral-300 dark:border-neutral-700 my-1 mx-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg mx-2"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          <span>Sair</span>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary text-sm py-2"
              >
                Entrar
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 dark:text-neutral-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 space-y-2 border-t border-neutral-300 dark:border-neutral-700 animate-fade-in">
            <Link
              to="/"
              className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/shop"
              className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Loja
            </Link>
            <Link
              to="/orders"
              className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Meus Pedidos
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="block w-full text-left py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
