import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getOrderById } from '../services/orderService'
import { formatCurrency } from '../utils/helpers'
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  Home as HomeIcon,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import Loading from '../components/Loading'

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getOrderById(id)
      setOrder(data)
    } catch (err) {
      console.error('Erro ao buscar detalhes do pedido:', err)
      setError('Não foi possível carregar os detalhes do pedido.')
    } finally {
      setLoading(false)
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
      minute: '2-digit',
    })
  }

  const getStatusConfig = (status) => {
    const configs = {
      WAITING_PAYMENT: {
        label: 'Aguardando Pagamento',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        description: 'Seu pedido está aguardando a confirmação do pagamento.',
      },
      PAID: {
        label: 'Pago',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
        description: 'Pagamento confirmado! Seu pedido está sendo preparado.',
      },
      SHIPPED: {
        label: 'Enviado',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
        description: 'Seu pedido foi enviado e está a caminho!',
      },
      DELIVERED: {
        label: 'Entregue',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: HomeIcon,
        description: 'Pedido entregue com sucesso!',
      },
      CANCELED: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        description: 'Este pedido foi cancelado.',
      },
    }
    return configs[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: Package,
      description: '',
    }
  }

  const getPaymentMethodLabel = (method) => {
    const labels = {
      CREDIT_CARD: 'Cartão de Crédito',
      PIX: 'PIX',
      BOLETO: 'Boleto Bancário',
    }
    return labels[method] || method
  }

  const getOrderTimeline = (status) => {
    const steps = [
      { key: 'WAITING_PAYMENT', label: 'Pedido Realizado', icon: Package },
      { key: 'PAID', label: 'Pagamento Confirmado', icon: CheckCircle },
      { key: 'SHIPPED', label: 'Pedido Enviado', icon: Truck },
      { key: 'DELIVERED', label: 'Pedido Entregue', icon: HomeIcon },
    ]

    const statusOrder = ['WAITING_PAYMENT', 'PAID', 'SHIPPED', 'DELIVERED']
    const currentIndex = statusOrder.indexOf(status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <Loading />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pedido não encontrado</h1>
          <p className="text-gray-600 mb-6">
            {error || 'Não conseguimos encontrar este pedido.'}
          </p>
          <Link to="/orders" className="btn btn-primary">
            Voltar para Meus Pedidos
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon
  const timeline = getOrderTimeline(order.status)

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Meus Pedidos
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Pedido #{order.orderNumber || order.id}
        </h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.moment)}</span>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`card border-2 ${statusConfig.color} mb-6`}>
        <div className="flex items-center gap-4">
          <StatusIcon className="w-10 h-10 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{statusConfig.label}</h2>
            <p className="text-sm">{statusConfig.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          {order.status !== 'CANCELED' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Acompanhamento do Pedido</h2>
              <div className="space-y-4">
                {timeline.map((step, index) => {
                  const StepIcon = step.icon
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`absolute top-10 left-5 w-0.5 h-8 ${
                              step.completed ? 'bg-primary-600' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3
                          className={`font-semibold ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {step.active && (
                          <p className="text-sm text-primary-600 mt-1">Status atual</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  Produtos do Pedido
                </h2>
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700"
                >
                  {/* Imagem do Produto */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={
                        item.productImageUrl
                          ? (item.productImageUrl.startsWith('http') 
                              ? item.productImageUrl 
                              : `http://localhost:8080${item.productImageUrl}`)
                          : item.product?.imgUrl
                            ? (item.product.imgUrl.startsWith('http')
                                ? item.product.imgUrl
                                : `http://localhost:8080${item.product.imgUrl}`)
                            : 'https://via.placeholder.com/150/e5e7eb/6b7280?text=Produto'
                      }
                      alt={item.productName || item.product?.name}
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                    {/* Badge de Quantidade */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {item.quantity}
                    </div>
                  </div>

                  {/* Informações do Produto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50 mb-2 line-clamp-2">
                      {item.productName || item.product?.name || 'Produto'}
                    </h3>
                    
                    <div className="space-y-1 text-sm">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        <span className="font-medium">Quantidade:</span> {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        <span className="font-medium">Preço unitário:</span> {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Valor Total do Item */}
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Subtotal
                    </p>
                    <p className="font-bold text-2xl text-primary-600 dark:text-primary-400">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total dos Itens */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                  Total dos Produtos
                </span>
                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  {formatCurrency(order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  Endereço de Entrega
                </h2>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md">
                <div className="space-y-3">
                  {/* Nome do Destinatário */}
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Destinatário
                    </p>
                    <p className="font-bold text-xl text-neutral-900 dark:text-neutral-50">
                      {order.shippingAddress.recipientName}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-200 dark:border-neutral-700 my-4"></div>

                  {/* Endereço Completo */}
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                      Endereço Completo
                    </p>
                    <div className="space-y-1 text-neutral-700 dark:text-neutral-300">
                      <p className="font-medium">
                        {order.shippingAddress.street}, {order.shippingAddress.number}
                        {order.shippingAddress.complement &&
                          ` - ${order.shippingAddress.complement}`}
                      </p>
                      <p>{order.shippingAddress.neighborhood}</p>
                      <p className="font-semibold">
                        {order.shippingAddress.city} - {order.shippingAddress.state}
                      </p>
                      <p className="text-sm">
                        CEP: <span className="font-mono font-semibold">{order.shippingAddress.zipCode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-200 dark:border-neutral-700 my-4"></div>

                  {/* Telefone */}
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      Telefone para Contato
                    </p>
                    <p className="font-semibold text-lg text-neutral-900 dark:text-neutral-50">
                      📞 {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Method */}
          <div className="card bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 border-2 border-accent-200 dark:border-accent-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-neutral-900" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                Método de Pagamento
              </h2>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                {order.paymentMethod === 'PIX' && (
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    π
                  </div>
                )}
                {order.paymentMethod === 'CREDIT_CARD' && (
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                )}
                {order.paymentMethod === 'BOLETO' && (
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    ■
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg text-neutral-900 dark:text-neutral-50">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {order.paymentMethod === 'PIX' && 'Pagamento instantâneo via PIX'}
                    {order.paymentMethod === 'BOLETO' && 'Aguardando compensação bancária'}
                    {order.paymentMethod === 'CREDIT_CARD' && 'Parcelamento disponível'}
                  </p>
                </div>
              </div>

              {/* Informações Adicionais do Pagamento */}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                {order.paymentMethod === 'PIX' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">QR Code enviado por e-mail</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      O código expira em 24 horas após a criação do pedido
                    </p>
                  </div>
                )}
                {order.paymentMethod === 'BOLETO' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Boleto enviado por e-mail</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Pagamento pode levar até 3 dias úteis para compensar
                    </p>
                  </div>
                )}
                {order.paymentMethod === 'CREDIT_CARD' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Cartão de crédito aprovado</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      O valor será cobrado na fatura do cartão
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete</span>
                <span>{formatCurrency(order.shippingCost || 0)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-primary-600 text-2xl">
                  {formatCurrency(order.total || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {order.clientName && (
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Informações do Cliente</h2>
              <p className="font-semibold">{order.clientName}</p>
              <p className="text-sm text-gray-600">{order.clientEmail}</p>
            </div>
          )}

          {/* Help */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Precisa de ajuda?</strong>
              <br />
              Entre em contato pelo e-mail{' '}
              <a
                href="mailto:contato@example.com"
                className="text-primary-600 hover:underline"
              >
                contato@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
