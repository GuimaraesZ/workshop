// Base URL da API - configurada via proxy no Vite
const API_BASE_URL = '/api'

/**
 * Obtém o token de autenticação do localStorage
 * @returns {string|null} Token JWT ou null
 */
function getAuthToken() {
  try {
    return localStorage.getItem('auth_token')
  } catch (error) {
    console.error('Erro ao obter token:', error)
    return null
  }
}

/**
 * Função auxiliar para fazer requisições HTTP
 * @param {string} endpoint - Endpoint da API
 * @param {object} options - Opções do fetch
 * @returns {Promise} - Promise com os dados da resposta
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Obter token e adicionar ao header se existir
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    // Se for 401 (não autorizado), limpar token e redirecionar para login
    if (response.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      
      // Redirecionar para login se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?redirect=' + window.location.pathname
      }
      
      throw new Error('Sessão expirada. Faça login novamente.')
    }
    
    // Se a resposta não for ok, lança erro
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP Error: ${response.status}`)
    }

    // Se não houver conteúdo (204), retorna null
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  put: (endpoint, data) => request(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}

export default api
