import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Filter, X } from 'lucide-react'
import Carousel from '../components/Carousel'
import { getProducts } from '../services/productService'
import { useCart } from '../contexts/CartContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useAuth } from '../contexts/AuthContext'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(24) // 24 produtos por página (6x4 grid)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()

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
  }, []) // Carregar produtos uma vez

  useEffect(() => {
    applyFilters()
  }, [products, selectedCategory, currentPage])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Carregar produtos do banco de dados
      const response = await fetch(`/api/products`)
      
      if (response.ok) {
        const allProducts = await response.json()
        
        // Extrair categorias únicas
        const uniqueCategories = [...new Set(allProducts.flatMap(p => 
          p.categories ? p.categories.map(c => c.name) : []
        ))].filter(Boolean)
        setCategories(uniqueCategories)
        
        // Converter para o formato esperado
        const convertedProducts = allProducts.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          imgUrl: item.imgUrl 
            ? (item.imgUrl.startsWith('http') ? item.imgUrl : `http://localhost:8080${item.imgUrl}`)
            : 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto',
          description: item.description || 'Produto O Boticário',
          rating: 4.5,
          categories: item.categories || []
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

  const applyFilters = () => {
    let filtered = [...products]

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.categories.some(cat => cat.name === selectedCategory)
      )
    }

    // Aplicar paginação
    const start = currentPage * pageSize
    const paginatedProducts = filtered.slice(start, start + pageSize)
    
    setFilteredProducts(paginatedProducts)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(0) // Reset para primeira página
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setCurrentPage(0)
  }

  const getTotalFilteredProducts = () => {
    let filtered = [...products]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.categories.some(cat => cat.name === selectedCategory)
      )
    }

    return filtered.length
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

  const handleToggleFavorite = (e, product) => {
    e.stopPropagation() // Evitar que o clique abra os detalhes do produto
    
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    toggleFavorite(product)
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
      <div className="container-custom py-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Produtos O Boticário
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {getTotalFilteredProducts()} produtos encontrados
            </p>
          </div>
          
          {/* Filtros de Categoria e Indicador de Página */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Filtro de Categoria */}
            {!loading && !error && (
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-neutral-600 dark:text-neutral-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Indicador de página */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium whitespace-nowrap">
                Página {currentPage + 1}
              </div>
            )}
          </div>
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
              {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card-elevated group hover:shadow-2xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={product.imgUrl || 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                    onError={handleImageError}
                    onClick={() => handleViewDetails(product.id)}
                    loading="lazy"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, product)}
                    className={`absolute top-3 right-3 p-2.5 backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg z-10 hover:scale-110 ${
                      isFavorite(product.id)
                        ? 'bg-yellow-500 hover:bg-yellow-600 opacity-100'
                        : 'bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-900 opacity-0 group-hover:opacity-100'
                    }`}
                    aria-label={isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart 
                      size={16} 
                      className={`transition-all ${
                        isFavorite(product.id)
                          ? 'text-white fill-white'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-red-500 dark:hover:text-red-400'
                      }`}
                    />
                  </button>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform translate-y-4 group-hover:translate-y-0 pointer-events-auto text-[10px] uppercase tracking-wide"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold truncate text-neutral-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                    className="w-full flex items-center justify-center gap-1.5 mt-4 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 overflow-hidden"
                  >
                    <ShoppingCart size={16} className="flex-shrink-0" />
                    <span className="text-xs uppercase tracking-wide truncate">Adicionar</span>
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
                disabled={filteredProducts.length < pageSize || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Próximo <span>→</span>
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="card-elevated text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
