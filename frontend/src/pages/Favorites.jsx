import { useState, useEffect } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Trash2 } from 'lucide-react'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function Favorites() {
  const { favorites, removeFromFavorites, loading: favLoading } = useFavorites()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleAddToCart = (product) => {
    try {
      addToCart(product)
    } catch (err) {
      setError('Erro ao adicionar ao carrinho')
    }
  }

  const handleRemoveFavorite = (productId) => {
    removeFromFavorites(productId)
  }

  if (favLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meus Favoritos
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length === 0
              ? 'Você ainda não tem produtos favoritos'
              : `${favorites.length} ${favorites.length === 1 ? 'produto' : 'produtos'} favorito${favorites.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Lista de Favoritos */}
        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <Heart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explore nossos produtos e adicione seus favoritos clicando no ícone de coração
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
            >
              Ir para a Loja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Imagem do Produto */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={product.imgUrl 
                      ? (product.imgUrl.startsWith('http') ? product.imgUrl : `http://localhost:8080${product.imgUrl}`)
                      : 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', product.imgUrl);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto';
                    }}
                  />
                  
                  {/* Botão Remover Favorito */}
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform group"
                    title="Remover dos favoritos"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                  </button>

                  {/* Badge de Desconto */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discountPercentage}%
                    </div>
                  )}
                </div>

                {/* Informações do Produto */}
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-yellow-600 dark:hover:text-yellow-500 cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    {product.discountPercentage > 0 ? (
                      <>
                        <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                          R$ {product.discountedPrice?.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        R$ {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Botão Adicionar ao Carrinho */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all shadow-md overflow-hidden ${
                      product.stock === 0
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {product.stock === 0 ? 'Sem Estoque' : 'Adicionar ao Carrinho'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
