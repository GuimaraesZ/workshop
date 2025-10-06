import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { formatCurrency } from '../../utils/helpers'
import { CreditCard, ArrowLeft, Check, Lock } from 'lucide-react'
import { createOrder } from '../../services/orderService'

export default function PaymentStep() {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  const handleFinishOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      // Recuperar endereço do localStorage
      const addressData = JSON.parse(localStorage.getItem('checkoutAddress') || '{}')

      // Preparar dados do pedido
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        payment: {
          method: paymentMethod
        },
        delivery: {
          address: addressData.street,
          number: addressData.number,
          complement: addressData.complement,
          neighborhood: addressData.neighborhood,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode
        }
      }

      // Fazer pedido
      const order = await createOrder(orderData)

      // Limpar carrinho
      clearCart()

      // Limpar endereço do localStorage
      localStorage.removeItem('checkoutAddress')

      // Redirecionar para confirmação
      navigate(`/order-confirmation/${order.id}`)
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err)
      setError(err.response?.data?.message || 'Erro ao processar o pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = [
    {
      id: 'CREDIT_CARD',
      name: 'Cartão de Crédito',
      description: 'Visa, Mastercard, Elo',
      icon: '💳'
    },
    {
      id: 'DEBIT_CARD',
      name: 'Cartão de Débito',
      description: 'Débito online',
      icon: '💳'
    },
    {
      id: 'PIX',
      name: 'PIX',
      description: 'Pagamento instantâneo',
      icon: '📱'
    },
    {
      id: 'BOLETO',
      name: 'Boleto Bancário',
      description: 'Vencimento em 3 dias',
      icon: '📄'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Method Selection */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 flex items-center gap-2">
              <Lock size={24} className="text-primary-600" />
              Pagamento Seguro
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Payment Methods */}
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`
                    p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${paymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{method.icon}</span>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                          {method.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Form (Simplified for demo) */}
            {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
              <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                  <CreditCard size={20} />
                  Dados do Cartão
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="Como está no cartão"
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Validade
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="000"
                        maxLength="4"
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'PIX' && (
              <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-center">
                <p className="text-neutral-700 dark:text-neutral-300">
                  Após confirmar o pedido, você receberá o código PIX para pagamento.
                </p>
              </div>
            )}

            {paymentMethod === 'BOLETO' && (
              <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-center">
                <p className="text-neutral-700 dark:text-neutral-300">
                  O boleto será gerado após a confirmação do pedido.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-32">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              Resumo do Pedido
            </h3>

            <div className="space-y-2 mb-4">
              {cartItems && cartItems.slice(0, 3).map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-neutral-700 dark:text-neutral-300 truncate flex-1">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-50 font-medium ml-2">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
              {cartItems && cartItems.length > 3 && (
                <p className="text-xs text-neutral-500 text-center pt-2">
                  +{cartItems.length - 3} {cartItems.length - 3 === 1 ? 'item' : 'itens'}
                </p>
              )}
            </div>

            <div className="divider my-4"></div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-neutral-700 dark:text-neutral-300">
                <span>Subtotal</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-700 dark:text-neutral-300">
                <span>Frete</span>
                <span className="text-green-600 dark:text-green-400">Grátis</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-neutral-50 pt-2">
                <span>Total</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {formatCurrency(getCartTotal())}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinishOrder}
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 mb-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Finalizar Pedido
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/checkout/address')}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
