import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, Truck, MapPin, CreditCard, Home, Calendar, ArrowRight } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import Loading from '../components/Loading'
import { formatCurrency } from '../utils/helpers'

function OrderConfirmation() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // Funções auxiliares
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      PROCESSING: 'Em Processamento',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
    }
    return labels[status] || 'Desconhecido'
  }

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentMethodLabel = (method) => {
    const labels = {
      CREDIT_CARD: 'Cartão de Crédito',
      PIX: 'PIX',
      BOLETO: 'Boleto Bancário',
    }
    return labels[method] || method
  }

  const getDeliveryEstimate = () => {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7)
    return deliveryDate.toLocaleDateString('pt-BR')
  }

  // Simular carregamento do pedido
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Mock data - substituir por chamada real à API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockOrder = {
          id: orderId,
          createdAt: new Date().toISOString(),
          status: 'CONFIRMED',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'CREDIT_CARD',
          shippingAddress: {
            recipientName: user?.name || 'Cliente',
            street: user?.address || 'Rua Exemplo, 123',
            city: user?.city || 'São Paulo',
            state: user?.state || 'SP',
            zipCode: user?.zipCode || '01234-567',
            phone: user?.phone || '(11) 99999-9999',
            complement: user?.complement || '',
          },
          delivery: {
            fullName: user?.name || 'Cliente',
            address: user?.address || 'Rua Exemplo, 123',
            city: user?.city || 'São Paulo',
            state: user?.state || 'SP',
            zipCode: user?.zipCode || '01234-567',
          },
          items: [
            {
              id: 1,
              name: 'Produto Exemplo',
              quantity: 2,
              price: 99.9,
              imgUrl: '/uploads/products/example.jpg',
            },
          ],
          subtotal: 199.8,
          shippingPrice: 0,
          total: 199.8,
        }
        setOrder(mockOrder)
      } catch (error) {
        console.error('Erro ao carregar pedido:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, user])

  if (loading) return <Loading />
  if (!order) return <p>Pedido não encontrado</p>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <CheckCircle className="text-white" size={48} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600 text-lg">
            Obrigado por comprar conosco, {user?.name || 'Cliente'}! Seu pedido foi recebido com sucesso.
          </p>
          <p className="text-gray-500 mt-2">Número do Pedido: <span className="font-mono font-bold">#{order.id}</span></p>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Status do Pedido</h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Itens do Pedido</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <img src={item.imgUrl || '/placeholder.png'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  <p className="text-lg font-bold text-primary-600 mt-1">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-primary-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-3">Resumo Financeiro</h3>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span>{order.shippingPrice === 0 ? 'Grátis' : formatCurrency(order.shippingPrice)}</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="py-3 px-6 bg-primary-600 text-white rounded-lg font-semibold text-center hover:bg-primary-700 transition-colors"
          >
            Ver Meus Pedidos
          </Link>
          <Link
            to="/"
            className="py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Voltar para Home
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Precisa de ajuda?</p>
          <Link to="/support" className="text-primary-600 hover:text-primary-700 font-medium">
            Entre em contato com o suporte
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
