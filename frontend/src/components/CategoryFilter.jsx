import { Link, useSearchParams } from 'react-router-dom'
import PropTypes from 'prop-types'

function CategoryFilter({ categories, activeCategory }) {
  const [searchParams] = useSearchParams()
  const currentCategory = searchParams.get('category') || activeCategory

  return (
    <div className="card">
      <h3 className="font-semibold text-lg mb-4">📂 Categorias</h3>
      
      <div className="space-y-2">
        {/* Todas as Categorias */}
        <Link
          to="/"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            !currentCategory
              ? 'bg-primary-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span className="flex items-center justify-between">
            <span>Todas as Categorias</span>
            {!currentCategory && <span className="text-sm">✓</span>}
          </span>
        </Link>

        {/* Lista de Categorias */}
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/?category=${category.id}`}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              currentCategory === String(category.id)
                ? 'bg-primary-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="flex items-center justify-between">
              <span>{category.name}</span>
              {currentCategory === String(category.id) && (
                <span className="text-sm">✓</span>
              )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeCategory: PropTypes.string,
}

export default CategoryFilter
