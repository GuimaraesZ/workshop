import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserOrders } from '../services/orderService'
import { formatCurrency } from '../utils/helpers'
import { 
  Package, 
  Calendar,
  ChevronRight,
  AlertCircle,
  Receipt,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  Search,
  Filter,
  X
} from 'lucide-react'
import Loading from '../components/Loading'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, delivered, canceled
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all') // all, 30days, 6months, 1year
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUserOrders()
      setOrders(data)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
      setError('Não foi possível carregar seus pedidos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      WAITING_PAYMENT: {
        label: 'Aguardando Pagamento',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      },
      PAID: {
        label: 'Pago',
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      },
      SHIPPED: {
        label: 'Enviado',
        icon: Truck,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      },
      DELIVERED: {
        label: 'Entregue',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
      },
      CANCELED: {
        label: 'Cancelado',
        icon: XCircle,
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
      },
    }
    return configs[status] || {
      label: status,
      icon: Package,
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatOrderNumber = (orderNumber) => {
    if (!orderNumber) return '#01'
    // Remove o prefixo #ORD- se existir e extrai apenas o número
    const numStr = orderNumber.toString().replace(/^#?ORD-?/i, '')
    // Converte para número e formata com zero à esquerda
    const num = parseInt(numStr) || 1
    return `#${num.toString().padStart(2, '0')}`
  }

  const getItemsCount = (items) => {
    if (!items || items.length === 0) return 0
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const filterByDate = (order) => {
    if (dateFilter === 'all') return true
    
    const orderDate = new Date(order.moment)
    const now = new Date()
    const diffTime = Math.abs(now - orderDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    switch (dateFilter) {
      case '30days':
        return diffDays <= 30
      case '6months':
        return diffDays <= 180
      case '1year':
        return diffDays <= 365
      default:
        return true
    }
  }

  const filterBySearch = (order) => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    const orderNumber = (order.orderNumber || order.id).toString().toLowerCase()
    
    return orderNumber.includes(searchLower)
  }

  const filteredOrders = orders
    .filter(order => {
      // Filtro por status
      if (filter === 'all') return true
      if (filter === 'pending') return ['WAITING_PAYMENT', 'PAID', 'SHIPPED'].includes(order.status)
      if (filter === 'delivered') return order.status === 'DELIVERED'
      if (filter === 'canceled') return order.status === 'CANCELED'
      return true
    })
    .filter(filterByDate)
    .filter(filterBySearch)

  const clearFilters = () => {
    setFilter('all')
    setSearchTerm('')
    setDateFilter('all')
  }

  const hasActiveFilters = filter !== 'all' || searchTerm !== '' || dateFilter !== 'all'

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 flex items-center gap-3">
            <Receipt className="w-10 h-10 text-primary-500" />
            Meus Pedidos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Acompanhe todos os seus pedidos e histórico de compras
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="card mb-6">
          <div className="space-y-4">
            {/* Busca e Toggle de Filtros */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Campo de Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar por número do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Botão Toggle Filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn flex items-center justify-center gap-2 whitespace-nowrap ${
                  showFilters || hasActiveFilters
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="bg-accent-500 text-neutral-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    •
                  </span>
                )}
              </button>

              {/* Botão Limpar Filtros */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary flex items-center gap-2"
                  title="Limpar todos os filtros"
                >
                  <X className="w-4 h-4" />
                  Limpar
                </button>
              )}
            </div>

            {/* Painel de Filtros Expansível */}
            {showFilters && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 animate-fade-in space-y-4">
                {/* Filtro por Status */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                    Status do Pedido
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'all'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Todos ({orders.length})
                    </button>
                    <button
                      onClick={() => setFilter('pending')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'pending'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Em Andamento ({orders.filter(o => ['WAITING_PAYMENT', 'PAID', 'SHIPPED'].includes(o.status)).length})
                    </button>
                    <button
                      onClick={() => setFilter('delivered')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'delivered'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Entregues ({orders.filter(o => o.status === 'DELIVERED').length})
                    </button>
                    <button
                      onClick={() => setFilter('canceled')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'canceled'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Cancelados ({orders.filter(o => o.status === 'CANCELED').length})
                    </button>
                  </div>
                </div>

                {/* Filtro por Data */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                    Período
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDateFilter('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        dateFilter === 'all'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Todos os períodos
                    </button>
                    <button
                      onClick={() => setDateFilter('30days')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        dateFilter === '30days'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Últimos 30 dias
                    </button>
                    <button
                      onClick={() => setDateFilter('6months')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        dateFilter === '6months'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Últimos 6 meses
                    </button>
                    <button
                      onClick={() => setDateFilter('1year')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        dateFilter === '1year'
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                      }`}
                    >
                      Último ano
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Resumo dos Filtros Ativos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Filtros ativos:
                </span>
                {filter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 text-sm font-medium rounded-full">
                    Status: {filter === 'pending' ? 'Em Andamento' : filter === 'delivered' ? 'Entregues' : 'Cancelados'}
                    <button onClick={() => setFilter('all')} className="hover:text-primary-600 dark:hover:text-primary-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {dateFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 text-sm font-medium rounded-full">
                    Período: {dateFilter === '30days' ? 'Últimos 30 dias' : dateFilter === '6months' ? 'Últimos 6 meses' : 'Último ano'}
                    <button onClick={() => setDateFilter('all')} className="hover:text-primary-600 dark:hover:text-primary-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 text-sm font-medium rounded-full">
                    Busca: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-primary-600 dark:hover:text-primary-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Resultado da Busca */}
        {!loading && !error && hasActiveFilters && (
          <div className="mb-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Encontrados <strong className="text-neutral-900 dark:text-neutral-50">{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
              {orders.length !== filteredOrders.length && ` de ${orders.length} totais`}
            </p>
          </div>
        )}

        {/* Filtros (versão antiga - remover) */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              Em Andamento ({orders.filter(o => ['WAITING_PAYMENT', 'PAID', 'SHIPPED'].includes(o.status)).length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'delivered'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              Entregues ({orders.filter(o => o.status === 'DELIVERED').length})
            </button>
            <button
              onClick={() => setFilter('canceled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'canceled'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              Cancelados ({orders.filter(o => o.status === 'CANCELED').length})
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="card text-center py-16">
            <Package size={64} className="mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              {filter === 'all' ? 'Nenhum pedido encontrado' : 'Nenhum pedido nesta categoria'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {filter === 'all' 
                ? 'Você ainda não realizou nenhuma compra'
                : 'Não há pedidos com este status no momento'
              }
            </p>
            {filter === 'all' && (
              <Link to="/shop" className="btn btn-primary">
                <ShoppingBag className="w-4 h-4" />
                Começar a Comprar
              </Link>
            )}
          </div>
        )}

        {/* Lista de Pedidos */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status)
              const StatusIcon = statusConfig.icon

              return (
                <div 
                  key={order.id} 
                  className="card hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Header do Card */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    {/* Info Básica */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50">
                          Pedido {formatOrderNumber(order.orderNumber || order.id)}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.moment)}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold border ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Corpo do Card */}
                  <div className="py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Valor Total */}
                      <div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Valor Total
                        </p>
                        <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                          {formatCurrency(order.total)}
                        </p>
                      </div>

                      {/* Quantidade de Itens */}
                      <div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Itens
                        </p>
                        <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                          {getItemsCount(order.items)}
                        </p>
                      </div>

                      {/* Data do Pedido */}
                      <div className="hidden md:block">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Data da Compra
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {new Date(order.moment).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      {/* Produtos */}
                      <div className="hidden md:block">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Produtos
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {order.items?.length || 0} {order.items?.length === 1 ? 'produto' : 'produtos'}
                        </p>
                      </div>
                    </div>

                    {/* Preview dos Produtos (Primeiros 3) */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-4">
                          {/* Imagens dos Produtos */}
                          <div className="flex -space-x-4">
                            {order.items.slice(0, 3).map((item, index) => {
                              const imageUrl = item.productImageUrl || item.product?.imgUrl
                              const fullImageUrl = imageUrl
                                ? (imageUrl.startsWith('http') 
                                    ? imageUrl 
                                    : `http://localhost:8080${imageUrl}`)
                                : null
                              
                              return (
                                <div 
                                  key={index}
                                  className="w-20 h-20 rounded-xl overflow-hidden border-3 border-white dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-700 shadow-lg hover:scale-110 hover:z-10 transition-transform"
                                  title={item.productName || item.product?.name}
                                >
                                  {fullImageUrl ? (
                                    <img
                                      src={fullImageUrl}
                                      alt={item.productName || item.product?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                      <Package className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                          
                          {/* Contador de Itens Adicionais */}
                          {order.items.length > 3 && (
                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                              +{order.items.length - 3}
                            </span>
                          )}
                          
                          {/* Valor Total */}
                          <div className="ml-auto">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Total</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer do Card */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn btn-secondary w-full flex items-center justify-center gap-2 group-hover:bg-primary-500 group-hover:text-white transition-colors"
                    >
                      Ver Detalhes
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Informação Extra */}
        {!loading && !error && orders.length > 0 && (
          <div className="card mt-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-primary-900 dark:text-primary-50 mb-1">
                  Precisa de ajuda?
                </h4>
                <p className="text-sm text-primary-800 dark:text-primary-300">
                  Caso tenha alguma dúvida sobre seus pedidos, entre em contato com nosso suporte.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
