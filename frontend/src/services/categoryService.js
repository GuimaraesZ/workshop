import { api } from './api'

/**
 * Busca todas as categorias
 * @returns {Promise<Array>} Lista de categorias
 */
export async function fetchAllCategories() {
  return await api.get('/categories')
}

/**
 * Busca uma categoria específica por ID
 * @param {number} id - ID da categoria
 * @returns {Promise<Object>} Dados da categoria
 */
export async function fetchCategoryById(id) {
  return await api.get(`/categories/${id}`)
}

export default {
  fetchAllCategories,
  fetchCategoryById,
}
