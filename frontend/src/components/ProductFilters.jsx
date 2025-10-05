import PropTypes from 'prop-types'

function ProductFilters({ sortBy, onSortChange, totalProducts }) {
  return (
    <div className="card">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Ordenar por:
          </label>
          <select 
            className="input max-w-xs"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="relevance">Relevância</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="name">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {totalProducts} {totalProducts === 1 ? 'produto' : 'produtos'}
        </div>
      </div>
    </div>
  )
}

ProductFilters.propTypes = {
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  totalProducts: PropTypes.number.isRequired,
}

export default ProductFilters
