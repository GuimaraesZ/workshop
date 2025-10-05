import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react'
import { fetchProductById } from '../services/productService'
import { useCart } from '../contexts/CartContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { addToCart, isInCart, getItemQuantity } = useCart()

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProductById(id)
      setProduct(data)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar produto:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <ErrorMessage message={error} onRetry={loadProduct} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <p className="text-gray-600 mb-6">O produto que você procura não existe ou foi removido.</p>
        </div>
      </div>
    )
  }

  const inCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <Check size={20} />
          <span>Produto adicionado ao carrinho com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem do Produto */}
        <div className="card">
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center overflow-hidden">
            {product.imgUrl ? (
              <img 
                src={product.imgUrl.startsWith('http') ? product.imgUrl : `http://localhost:8080${product.imgUrl}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-lg">📦 Sem imagem disponível</span>
            )}
          </div>
        </div>

        {/* Informações do Produto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-4xl font-bold text-primary-600 mb-6">
            {formatPrice(product.price)}
          </p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'Sem descrição disponível'}
            </p>
          </div>

          {/* Categorias */}
          {product.categories && product.categories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Categorias</h2>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span 
                    key={category.id}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cart Status */}
          {inCart && (
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{cartQuantity}</span> {cartQuantity === 1 ? 'unidade' : 'unidades'} no carrinho
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary flex items-center gap-2 flex-1"
            >
              <ShoppingCart size={20} />
              Adicionar ao Carrinho
            </button>
            {inCart && (
              <button 
                onClick={() => navigate('/cart')}
                className="btn btn-secondary"
              >
                Ver Carrinho
              </button>
            )}
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 pt-8 border-t">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">🚚</span>
                <span className="text-gray-700">Frete calculado no checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">✅</span>
                <span className="text-gray-700">Produto em estoque</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">🔒</span>
                <span className="text-gray-700">Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
