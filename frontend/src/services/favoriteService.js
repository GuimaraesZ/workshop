import api from './api'

/**
 * Serviço para gerenciar favoritos
 * Atualmente usa localStorage, mas preparado para integração com backend
 */

// Obter todos os favoritos do usuário
export const getFavorites = async () => {
  try {
    // TODO: Implementar chamada à API quando o backend estiver pronto
    // const response = await api.get('/favorites')
    // return response.data
    
    // Por enquanto, retorna do localStorage
    const storedFavorites = localStorage.getItem('favorites')
    return storedFavorites ? JSON.parse(storedFavorites) : []
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error)
    throw error
  }
}

// Adicionar produto aos favoritos
export const addFavorite = async (productId) => {
  try {
    // TODO: Implementar chamada à API quando o backend estiver pronto
    // const response = await api.post('/favorites', { productId })
    // return response.data
    
    console.log('Produto adicionado aos favoritos:', productId)
    return { success: true, productId }
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error)
    throw error
  }
}

// Remover produto dos favoritos
export const removeFavorite = async (productId) => {
  try {
    // TODO: Implementar chamada à API quando o backend estiver pronto
    // const response = await api.delete(`/favorites/${productId}`)
    // return response.data
    
    console.log('Produto removido dos favoritos:', productId)
    return { success: true, productId }
  } catch (error) {
    console.error('Erro ao remover favorito:', error)
    throw error
  }
}

// Verificar se produto está nos favoritos
export const isFavorite = async (productId) => {
  try {
    // TODO: Implementar chamada à API quando o backend estiver pronto
    // const response = await api.get(`/favorites/check/${productId}`)
    // return response.data.isFavorite
    
    const favorites = await getFavorites()
    return favorites.some(fav => fav.id === productId)
  } catch (error) {
    console.error('Erro ao verificar favorito:', error)
    throw error
  }
}

// Limpar todos os favoritos
export const clearFavorites = async () => {
  try {
    // TODO: Implementar chamada à API quando o backend estiver pronto
    // const response = await api.delete('/favorites/all')
    // return response.data
    
    localStorage.removeItem('favorites')
    return { success: true }
  } catch (error) {
    console.error('Erro ao limpar favoritos:', error)
    throw error
  }
}
