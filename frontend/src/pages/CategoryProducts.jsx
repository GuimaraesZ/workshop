import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProductsByCategory } from '../services/productService'
import { fetchCategoryById } from '../services/categoryService'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function CategoryProducts() {
  const { id } = useParams()
  
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('relevance')

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [productsData, categoryData] = await Promise.all([
        fetchProductsByCategory(id),
        fetchCategoryById(id)
      ])
      
      setProducts(productsData)
      setCategory(categoryData)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  // Ordenar produtos
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

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
      <h1 className="text-3xl font-bold mb-2">
        {category ? category.name : 'Categoria'}
      </h1>
      <p className="text-gray-600 mb-8">
        {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>

      {/* Filtros */}
      <div className="card mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">
            Ordenar por:
          </label>
          <select 
            className="input max-w-xs"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Relevância</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="name">Nome (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid de Produtos */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 card">
          <h2 className="text-2xl font-bold mb-2">Nenhum produto encontrado</h2>
          <p className="text-gray-600">
            Não há produtos disponíveis nesta categoria no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryProducts
