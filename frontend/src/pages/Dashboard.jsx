import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ArrowRight,
  Tag,
  Heart
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { getUserOrders } from '../services/orderService'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function Dashboard() {
  const { user } = useAuth()
  const { cartItems, getCartTotal, getTotalItems } = useCart()
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const orders = await getUserOrders()
      
      // Verificar se orders é válido
      if (!orders || !Array.isArray(orders)) {
        setRecentOrders([])
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalSpent: 0
        })
        return
      }
      
      // Pegar apenas os 3 pedidos mais recentes
      const recent = orders.slice(0, 3)
      setRecentOrders(recent)

      // Calcular estatísticas
      const completed = orders.filter(o => o.status === 'DELIVERED').length
      const pending = orders.filter(o => 
        o.status === 'WAITING_PAYMENT' || 
        o.status === 'PAID' || 
        o.status === 'SHIPPED'
      ).length
      const totalSpent = orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.total, 0)

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        completedOrders: completed,
        totalSpent
      })
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      WAITING_PAYMENT: {
        label: 'Aguardando Pagamento',
        color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
        icon: Clock
      },
      PAID: {
        label: 'Pago',
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
        icon: CheckCircle
      },
      SHIPPED: {
        label: 'Enviado',
        color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
        icon: Truck
      },
      DELIVERED: {
        label: 'Entregue',
        color: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
        icon: CheckCircle
      },
      CANCELED: {
        label: 'Cancelado',
        color: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
        icon: AlertCircle
      }
    }
    return configs[status] || configs.WAITING_PAYMENT
  }

  // Promoções fictícias (em produção, viriam da API)
  const promotions = [
    {
      id: 1,
      title: 'Black Friday Antecipada',
      description: 'Até 50% OFF em eletrônicos',
      discount: '50%',
      validUntil: '2025-11-30',
      image: '🎮'
    },
    {
      id: 2,
      title: 'Frete Grátis',
      description: 'Em compras acima de R$ 200',
      discount: 'Grátis',
      validUntil: '2025-12-31',
      image: '🚚'
    },
    {
      id: 3,
      title: 'Cupom de Boas-Vindas',
      description: 'R$ 50 OFF na primeira compra',
      discount: 'R$ 50',
      validUntil: '2025-10-31',
      image: '🎁'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Olá, {user?.name?.split(' ')[0] || 'Cliente'}! 👋
        </h1>
        <p className="text-primary-100">
          Bem-vindo ao seu painel. Aqui está um resumo das suas atividades.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Pedidos */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
            {stats.totalOrders}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Total de Pedidos
          </p>
        </div>

        {/* Pedidos Pendentes */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
            {stats.pendingOrders}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Em Andamento
          </p>
        </div>

        {/* Pedidos Concluídos */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
            {stats.completedOrders}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Concluídos
          </p>
        </div>

        {/* Total Gasto */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
            {formatCurrency(stats.totalSpent)}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Total Gasto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos Recentes */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Pedidos Recentes
            </h2>
            <Link 
              to="/profile" 
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Você ainda não fez nenhum pedido
              </p>
              <Link to="/" className="btn btn-primary">
                Começar a Comprar
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status)
                const StatusIcon = statusConfig.icon

                return (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="block p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                          Pedido #{order.id}
                        </span>
                        <span className={`badge ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(order.moment)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </span>
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Status do Carrinho */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-6">
            <ShoppingCart className="w-5 h-5" />
            Seu Carrinho
          </h2>

          {!cartItems || cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                Seu carrinho está vazio
              </p>
              <Link to="/products" className="btn btn-primary btn-sm">
                Adicionar Produtos
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Total de itens:
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                    {getTotalItems()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Valor total:
                  </span>
                  <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                    {formatCurrency(getCartTotal())}
                  </span>
                </div>
              </div>

              <div className="divider my-4"></div>

              {/* Primeiros 3 itens do carrinho */}
              <div className="space-y-2 mb-4">
                {cartItems && cartItems.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img 
                      src={item.product.imgUrl} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {item.quantity}x {formatCurrency(item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}
                {cartItems && cartItems.length > 3 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center">
                    +{cartItems.length - 3} {cartItems.length - 3 === 1 ? 'item' : 'itens'}
                  </p>
                )}
              </div>

              <Link to="/cart" className="btn btn-primary w-full">
                Ver Carrinho Completo
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Promoções Recomendadas */}
      <div className="card">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-6">
          <Tag className="w-5 h-5" />
          Promoções para Você
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative p-6 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 rounded-xl border-2 border-accent-200 dark:border-accent-800 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Emoji Background */}
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">
                {promo.image}
              </div>

              {/* Discount Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent-500 text-neutral-900 rounded-full text-sm font-bold mb-3">
                <Tag className="w-4 h-4" />
                {promo.discount}
              </div>

              <h3 className="font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                {promo.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                {promo.description}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                Válido até {new Date(promo.validUntil).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/shop"
          className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <ShoppingCart className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p className="font-medium text-neutral-900 dark:text-neutral-50 text-sm">
            Continuar Comprando
          </p>
        </Link>

        <Link
          to="/orders"
          className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Package className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p className="font-medium text-neutral-900 dark:text-neutral-50 text-sm">
            Meus Pedidos
          </p>
        </Link>

        <Link
          to="/favorites"
          className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Heart className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p className="font-medium text-neutral-900 dark:text-neutral-50 text-sm">
            Favoritos
          </p>
        </Link>

        <Link
          to="/support"
          className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <AlertCircle className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p className="font-medium text-neutral-900 dark:text-neutral-50 text-sm">
            Suporte
          </p>
        </Link>
      </div>
    </div>
  )
}
