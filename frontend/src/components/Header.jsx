import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { getTotalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  
  const totalItems = getTotalItems()

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-700 sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            🛍️ {user?.storeName || 'E-Commerce'}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/products" className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
              Loja
            </Link>
            <Link to="/categories/1" className="text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
              Categorias
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
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
                className="hidden md:block btn btn-primary text-sm py-2"
              >
                Entrar
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 dark:text-neutral-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-neutral-300 dark:border-neutral-700 animate-fade-in">
            <Link
              to="/"
              className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              to="/categories/1"
              className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categorias
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
