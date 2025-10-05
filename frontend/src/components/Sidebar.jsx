import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard,
  Package, 
  ShoppingCart, 
  User, 
  Heart,
  MapPin,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Carregar estado do localStorage
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })
  
  const location = useLocation()
  const navigate = useNavigate()
  const { getTotalItems } = useCart()
  const { isAuthenticated, logout, user } = useAuth()

  const cartItemsCount = getTotalItems()

  // Salvar estado no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  // Menu principal - área do cliente
  const mainMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/',
      description: 'Visão geral'
    },
    { 
      icon: Store, 
      label: 'Loja', 
      path: '/shop',
      description: 'Ver todos os produtos'
    },
    { 
      icon: Package, 
      label: 'Meus Pedidos', 
      path: '/orders',
      description: 'Histórico de compras',
      badge: null // Pode adicionar badge com pedidos pendentes
    },
    { 
      icon: ShoppingCart, 
      label: 'Carrinho', 
      path: '/cart',
      description: 'Itens no carrinho',
      badge: cartItemsCount > 0 ? cartItemsCount : null
    },
    { 
      icon: User, 
      label: 'Perfil', 
      path: '/profile',
      description: 'Meus dados'
    },
    { 
      icon: MapPin, 
      label: 'Endereços', 
      path: '/addresses',
      description: 'Locais de entrega'
    },
    { 
      icon: Heart, 
      label: 'Favoritos', 
      path: '/favorites',
      description: 'Lista de desejos'
    },
  ]

  // Menu secundário - suporte e logout
  const secondaryMenuItems = [
    { 
      icon: MessageCircle, 
      label: 'Suporte', 
      path: '/support',
      description: 'Central de ajuda'
    },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderMenuItem = (item) => {
    const Icon = item.icon
    const active = isActive(item.path)
    
    return (
      <li key={item.path}>
        <Link
          to={item.path}
          className={`
            sidebar-item relative
            ${active ? 'sidebar-item-active' : ''}
            ${isCollapsed ? 'justify-center px-0' : ''}
          `}
          title={isCollapsed ? item.label : item.description}
        >
          <Icon size={22} className={isCollapsed ? '' : 'flex-shrink-0'} />
          
          {!isCollapsed && (
            <span className="animate-fade-in flex-1">{item.label}</span>
          )}
          
          {/* Badge */}
          {item.badge && (
            <span className={`
              flex items-center justify-center min-w-[20px] h-5 px-1.5
              rounded-full text-xs font-bold
              bg-accent-500 text-neutral-900
              ${isCollapsed ? 'absolute -top-1 -right-1' : ''}
            `}>
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </Link>
      </li>
    )
  }

  return (
    <>
      {/* Sidebar Desktop */}
      <aside 
        className={`
          hidden lg:flex flex-col
          fixed left-0 top-0 h-screen
          bg-white dark:bg-neutral-900
          border-r border-neutral-300 dark:border-neutral-700
          shadow-lg
          transition-all duration-300 ease-in-out z-40
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-300 dark:border-neutral-700">
          {!isCollapsed && (
            <Link to="/" className="text-2xl font-bold text-primary-500 animate-fade-in">
              🛍️ {user?.storeName || 'E-Commerce'}
            </Link>
          )}
          {isCollapsed && (
            <Link to="/" className="text-2xl animate-fade-in mx-auto">
              🛍️
            </Link>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
          {/* Menu Principal */}
          <div className="px-3 mb-2">
            {!isCollapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Menu Principal
              </h3>
            )}
            <ul className="space-y-1">
              {mainMenuItems.map(renderMenuItem)}
            </ul>
          </div>

          {/* Divider */}
          <div className="my-6 mx-3">
            <div className="divider"></div>
          </div>

          {/* Menu Secundário */}
          <div className="px-3">
            {!isCollapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Ajuda
              </h3>
            )}
            <ul className="space-y-1">
              {secondaryMenuItems.map(renderMenuItem)}
            </ul>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-300 dark:border-neutral-700 space-y-2">
          {/* Logout Button */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? 'Sair' : 'Sair da conta'}
            >
              <LogOut size={20} />
              {!isCollapsed && (
                <span className="text-sm font-medium animate-fade-in">Sair</span>
              )}
            </button>
          )}
        </div>

        {/* Toggle Button - Posicionado no meio da lateral direita */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute top-1/2 -translate-y-1/2 -right-3
            w-6 h-12 flex items-center justify-center
            bg-white dark:bg-neutral-800
            border border-neutral-300 dark:border-neutral-700
            rounded-r-lg shadow-md
            hover:bg-neutral-100 dark:hover:bg-neutral-700
            transition-all duration-200
            z-50
          `}
          title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-neutral-600 dark:text-neutral-400" />
          ) : (
            <ChevronLeft size={16} className="text-neutral-600 dark:text-neutral-400" />
          )}
        </button>
      </aside>

      {/* Spacer for Desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`} />
    </>
  )
}
