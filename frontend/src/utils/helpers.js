/**
 * Ordena um array de produtos baseado no critério especificado
 * @param {Array} products - Array de produtos
 * @param {string} sortBy - Critério de ordenação
 * @returns {Array} Array ordenado
 */
export function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
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
}

/**
 * Filtra produtos por categoria
 * @param {Array} products - Array de produtos
 * @param {number|string} categoryId - ID da categoria
 * @returns {Array} Array filtrado
 */
export function filterProductsByCategory(products, categoryId) {
  if (!categoryId) return products
  
  return products.filter(product => 
    product.categories.some(cat => cat.id === parseInt(categoryId))
  )
}

/**
 * Formata preço para Real brasileiro
 * @param {number} price - Preço
 * @returns {string} Preço formatado
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

// Alias para compatibilidade
export const formatCurrency = formatPrice

/**
 * Formata data para padrão brasileiro
 * @param {string} date - Data no formato ISO
 * @returns {string} Data formatada
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Trunca texto longo
 * @param {string} text - Texto
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Debounce para inputs
 * @param {Function} func - Função a ser executada
 * @param {number} delay - Delay em ms
 * @returns {Function} Função com debounce
 */
export function debounce(func, delay = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

export default {
  sortProducts,
  filterProductsByCategory,
  formatPrice,
  formatCurrency,
  formatDate,
  truncateText,
  debounce,
}
