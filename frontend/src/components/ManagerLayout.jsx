import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { Store, Package, LayoutDashboard, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function ManagerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    navigate('/manager')
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/manager/dashboard'
    },
    {
      icon: Store,
      label: 'Lojas',
      path: '/manager/lojas'
    },
    {
      icon: Package,
      label: 'Produtos',
      path: '/manager/produtos'
    },
    {
      icon: Users,
      label: 'Usuários',
      path: '/manager/usuarios'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Painel Admin
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Painel Admin
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Gerenciamento do Sistema
              </p>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
