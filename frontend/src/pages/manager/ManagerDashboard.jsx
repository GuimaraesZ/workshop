import { useState, useEffect } from 'react'
import { Store, Package, Users, TrendingUp, ShoppingBag } from 'lucide-react'

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    totalLojas: 0,
    totalProdutos: 0,
    totalUsuarios: 0,
    totalPedidos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // TODO: Implementar chamadas à API para obter estatísticas reais
      // Por enquanto, dados mock
      setStats({
        totalLojas: 3,
        totalProdutos: 127,
        totalUsuarios: 48,
        totalPedidos: 234
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: Store,
      label: 'Total de Lojas',
      value: stats.totalLojas,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Package,
      label: 'Total de Produtos',
      value: stats.totalProdutos,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Users,
      label: 'Total de Usuários',
      value: stats.totalUsuarios,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: ShoppingBag,
      label: 'Total de Pedidos',
      value: stats.totalPedidos,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    }
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Visão geral do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ strokeWidth: 2.5 }} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Atividade Recente
        </h2>
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <p>Nenhuma atividade recente para mostrar</p>
        </div>
      </div>
    </div>
  )
}
