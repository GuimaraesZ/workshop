import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    getItemSubtotal,
    getCartTotal,
    getTotalItems 
  } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Seu Carrinho está Vazio</h1>
        <p className="text-gray-600 mb-8">
          Adicione produtos ao carrinho para continuar comprando
        </p>
        <Link to="/" className="btn btn-primary">
          Ver Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">
        Carrinho de Compras
        <span className="text-lg font-normal text-gray-600 ml-3">
          ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product.id} className="card">
              <div className="flex gap-4">
                {/* Imagem do Produto */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {item.product.imgUrl ? (
                    <img 
                      src={item.product.imgUrl} 
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 text-3xl">📦</span>
                  )}
                </div>

                {/* Informações do Produto */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link 
                        to={`/products/${item.product.id}`}
                        className="text-lg font-semibold hover:text-primary-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      {item.product.categories && item.product.categories.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {item.product.categories.map(cat => cat.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      title="Remover item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrementQuantity(item.product.id)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Diminuir quantidade"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.product.id)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Aumentar quantidade"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Preços */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.product.price)} cada
                      </p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatPrice(getItemSubtotal(item))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-green-600 font-semibold">Grátis</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 mb-3"
            >
              <ShoppingBag size={20} />
              Finalizar Compra
            </Link>

            <Link 
              to="/"
              className="btn btn-secondary w-full py-3 text-center block"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
