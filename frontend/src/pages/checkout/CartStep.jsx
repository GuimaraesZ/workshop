import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/helpers'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'

export default function CartStep() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()

  const handleContinue = () => {
    navigate('/checkout/address')
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="card max-w-2xl mx-auto text-center py-12">
        <ShoppingBag className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Seu carrinho está vazio
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Adicione produtos ao carrinho para continuar com a compra
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="btn btn-primary"
        >
          Ir para a Loja
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              Itens do Carrinho ({cartItems.length})
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                >
                  {/* Product Image */}
                  <img
                    src={item.product.imgUrl.startsWith('http') ? item.product.imgUrl : `http://localhost:8080${item.product.imgUrl}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', item.product.imgUrl);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto';
                    }}
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {formatCurrency(item.product.price)} cada
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={18} />
                    </button>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-32">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                <span>Subtotal</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                <span>Frete</span>
                <span className="text-green-600 dark:text-green-400">Grátis</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-neutral-50">
                <span>Total</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {formatCurrency(getCartTotal())}
                </span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              Continuar
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="btn btn-secondary w-full mt-3"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
