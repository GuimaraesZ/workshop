import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import Carousel from '../components/Carousel'
import { getProducts } from '../services/productService'
import { useCart } from '../contexts/CartContext'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(24) // 24 produtos por página (6x4 grid)
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // Imagens do carousel
  const carouselImages = [
    {
      src: '/assets/carousel/magnetic__37498.jpg',
      alt: 'Banner 1',
      title: 'Bem-vindo à nossa loja',
      description: 'Descubra produtos incríveis com os melhores preços'
    },
    {
      src: '/assets/carousel/malbecblue.webp',
      alt: 'Banner 2',
      title: 'Novidades toda semana',
      description: 'Fique por dentro das últimas tendências'
    },
    {
      src: '/assets/carousel/malbectrad.webp',
      alt: 'Banner 3',
      title: 'Qualidade garantida',
      description: 'Produtos selecionados especialmente para você'
    },
    {
      src: '/assets/carousel/MALBEC_BLACK_1.webp',
      alt: 'Banner 4',
      title: 'Ofertas imperdíveis',
      description: 'Aproveite promoções exclusivas'
    }
  ]

  useEffect(() => {
    loadProducts()
  }, [currentPage]) // Recarregar quando a página mudar

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Carregar produtos do banco de dados com paginação
      const start = currentPage * pageSize
      const response = await fetch(`/api/products`)
      
      if (response.ok) {
        const allProducts = await response.json()
        
        // Aplicar paginação manual
        const paginatedProducts = allProducts.slice(start, start + pageSize)
        
        // Converter para o formato esperado
        const convertedProducts = paginatedProducts.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          imgUrl: item.imgUrl 
            ? (item.imgUrl.startsWith('http') ? item.imgUrl : `http://localhost:8080${item.imgUrl}`)
            : 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto',
          description: item.description || 'Produto O Boticário',
          rating: 4.5,
          category: 'Perfumes'
        }))
        
        setProducts(convertedProducts)
      } else {
        setError('Não foi possível carregar os produtos. Tente novamente.')
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
      setError('Não foi possível carregar os produtos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`)
  }

  const handleImageError = (e) => {
    // Se a imagem falhar, use uma imagem placeholder
    e.target.src = 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto+O+Boticário'
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Carousel */}
      <Carousel images={carouselImages} interval={7500} />

      {/* Products Section */}
      <div className="container-custom py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Produtos O Boticário
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Perfumes e cosméticos selecionados para você
            </p>
          </div>
          {/* Indicador de página */}
          {!loading && !error && products.length > 0 && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Página {currentPage + 1}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="card-elevated animate-pulse">
                <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4" />
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card-elevated bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={loadProducts}
              className="btn-primary mt-4"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product) => (
              <div
                key={product.id}
                className="card-elevated group hover:shadow-2xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={product.imgUrl || 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    aria-label="Adicionar aos favoritos"
                  >
                    <Heart size={18} className="text-neutral-600 dark:text-neutral-300" />
                  </button>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="btn-primary transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.rating || 4)
                            ? 'fill-accent-500 text-accent-500'
                            : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                      ({product.rating || 4.0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      R$ {product.price?.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through">
                        R$ {product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                  >
                    <ShoppingCart size={18} />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0 || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>←</span> Anterior
              </button>
              
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                Página {currentPage + 1}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={products.length < pageSize || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Próximo <span>→</span>
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="card-elevated text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Nenhum produto disponível no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
