import { api } from './api'

/**
 * Busca todos os produtos
 * @returns {Promise<Array>} Lista de produtos
 */
export async function fetchAllProducts() {
  return await api.get('/products')
}

/**
 * Busca um produto específico por ID
 * @param {number} id - ID do produto
 * @returns {Promise<Object>} Dados do produto
 */
export async function fetchProductById(id) {
  return await api.get(`/products/${id}`)
}

/**
 * Busca produtos por categoria
 * @param {number} categoryId - ID da categoria
 * @returns {Promise<Array>} Lista de produtos da categoria
 */
export async function fetchProductsByCategory(categoryId) {
  // A API não tem endpoint específico, então filtramos depois
  const allProducts = await fetchAllProducts()
  return allProducts.filter(product => 
    product.categories.some(cat => cat.id === parseInt(categoryId))
  )
}

// Aliases para compatibilidade
export const getProducts = fetchAllProducts
export const getProductById = fetchProductById
export const getProductsByCategory = fetchProductsByCategory

export default {
  fetchAllProducts,
  fetchProductById,
  fetchProductsByCategory,
  getProducts,
  getProductById,
  getProductsByCategory,
}
