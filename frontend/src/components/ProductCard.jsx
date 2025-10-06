import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

function ProductCard({ product }) {
  // Formata o preço para Real brasileiro
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="card hover:shadow-xl transition-shadow group"
    >
      {/* Imagem do Produto */}
      <div className="bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center overflow-hidden">
        {product.imgUrl ? (
          <img 
            src={product.imgUrl.startsWith('http') ? product.imgUrl : `http://localhost:8080${product.imgUrl}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Produto';
            }}
          />
        ) : (
          <span className="text-gray-400">📦 Sem imagem</span>
        )}
      </div>

      {/* Informações do Produto */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {product.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>

      {/* Categorias */}
      {product.categories && product.categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {product.categories.slice(0, 2).map((category) => (
            <span 
              key={category.id}
              className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      {/* Preço e Botão */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-2xl font-bold text-primary-600">
          {formatPrice(product.price)}
        </span>
        <button className="btn btn-primary text-sm">
          Ver Mais
        </button>
      </div>
    </Link>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    imgUrl: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }).isRequired,
}

export default ProductCard
