import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchAllProducts } from '../services/productService'
import { fetchAllCategories } from '../services/categoryService'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import ProductFilters from '../components/ProductFilters'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function Home() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('relevance')

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Buscar produtos e categorias em paralelo
      const [productsData, categoriesData] = await Promise.all([
        fetchAllProducts(),
        fetchAllCategories()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtrar produtos por categoria
  const filteredProducts = categoryFilter
    ? products.filter(product => 
        product.categories.some(cat => cat.id === parseInt(categoryFilter))
      )
    : products

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  // Obter nome da categoria ativa
  const activeCategoryName = categoryFilter
    ? categories.find(cat => cat.id === parseInt(categoryFilter))?.name
    : null

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <ErrorMessage message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Hero Section */}
      {!categoryFilter && (
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo à Nossa Loja
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Encontre os melhores produtos com os melhores preços
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#products" className="btn btn-primary">
              Ver Todos os Produtos
            </a>
            <a href="#categories" className="btn btn-secondary">
              Explorar Categorias
            </a>
          </div>
        </div>
      )}

      {/* Breadcrumb quando há filtro */}
      {categoryFilter && (
        <div className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{activeCategoryName || 'Categoria'}</span>
        </div>
      )}

      {/* Layout com Sidebar de Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filtros de Categoria */}
        <aside className="lg:col-span-1">
          <CategoryFilter 
            categories={categories} 
            activeCategory={categoryFilter}
          />
        </aside>

        {/* Conteúdo Principal - Produtos */}
        <main className="lg:col-span-3">
          {/* Título e Filtros */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4">
              {activeCategoryName || 'Todos os Produtos'}
            </h2>
            
            <ProductFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalProducts={sortedProducts.length}
            />
          </div>

          {/* Grid de Produtos */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                {categoryFilter 
                  ? 'Não há produtos disponíveis nesta categoria no momento.'
                  : 'Não há produtos disponíveis no momento.'}
              </p>
              {categoryFilter && (
                <a href="/" className="btn btn-primary">
                  Ver Todos os Produtos
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Seção de Categorias (apenas quando não há filtro) */}
      {!categoryFilter && categories.length > 0 && (
        <section className="mt-16" id="categories">
          <h2 className="text-3xl font-bold mb-6">
            Categorias Populares
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <a 
                key={category.id}
                href={`/?category=${category.id}`}
                className="card text-center hover:shadow-xl transition-shadow group"
              >
                <div className="text-4xl mb-2">
                  {/* Ícones baseados no nome da categoria */}
                  {category.name.toLowerCase().includes('electronic') && '📱'}
                  {category.name.toLowerCase().includes('book') && '📚'}
                  {category.name.toLowerCase().includes('computer') && '💻'}
                  {!['electronic', 'book', 'computer'].some(word => 
                    category.name.toLowerCase().includes(word)) && '📦'}
                </div>
                <h3 className="font-semibold group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
