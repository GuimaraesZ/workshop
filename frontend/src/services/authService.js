import api from './api'

/**
 * Serviço de Autenticação
 * Gerencia login, cadastro e operações relacionadas
 */

/**
 * Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} Token e dados do usuário
 */
export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    })

    return {
      token: response.token,
      user: response.user,
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw new Error(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
  }
}

/**
 * Realiza cadastro de novo usuário
 * @param {Object} userData - Dados do usuário
 * @param {string} userData.name - Nome completo
 * @param {string} userData.email - Email
 * @param {string} userData.password - Senha
 * @returns {Promise<Object>} Token e dados do usuário
 */
export async function signup(userData) {
  try {
    const response = await api.post('/auth/signup', userData)

    return {
      token: response.token,
      user: response.user,
    }
  } catch (error) {
    console.error('Erro ao fazer cadastro:', error)
    throw new Error(error.message || 'Erro ao criar conta. Tente novamente.')
  }
}

/**
 * Realiza logout do usuário (invalida token no backend se necessário)
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    // Opcional: Invalidar token no backend
    // await api.post('/auth/logout')
    return Promise.resolve()
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    // Não precisa lançar erro, apenas logar
  }
}

/**
 * Atualiza o token de acesso usando refresh token
 * @param {string} refreshToken - Token de refresh
 * @returns {Promise<Object>} Novo token de acesso
 */
export async function refreshToken(refreshToken) {
  try {
    const response = await api.post('/auth/refresh', {
      refreshToken,
    })

    return {
      token: response.token,
      refreshToken: response.refreshToken,
    }
  } catch (error) {
    console.error('Erro ao renovar token:', error)
    throw new Error('Sessão expirada. Faça login novamente.')
  }
}

/**
 * Verifica se o token JWT é válido
 * @param {string} token - Token JWT
 * @returns {Promise<boolean>} True se válido
 */
export async function verifyToken(token) {
  try {
    const response = await api.post('/auth/verify', { token })
    return response.valid === true
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return false
  }
}

/**
 * Solicita recuperação de senha
 * @param {string} email - Email do usuário
 * @returns {Promise<void>}
 */
export async function requestPasswordReset(email) {
  try {
    await api.post('/auth/forgot-password', { email })
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error)
    throw new Error('Erro ao solicitar recuperação de senha.')
  }
}

/**
 * Redefine a senha do usuário
 * @param {string} token - Token de recuperação
 * @param {string} newPassword - Nova senha
 * @returns {Promise<void>}
 */
export async function resetPassword(token, newPassword) {
  try {
    await api.post('/auth/reset-password', {
      token,
      password: newPassword,
    })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    throw new Error('Erro ao redefinir senha.')
  }
}

/**
 * Obtém dados do usuário autenticado
 * @returns {Promise<Object>} Dados do usuário
 */
export async function getCurrentUser() {
  try {
    return await api.get('/auth/me')
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    throw new Error('Erro ao buscar dados do usuário.')
  }
}

export default {
  login,
  signup,
  logout,
  refreshToken,
  verifyToken,
  requestPasswordReset,
  resetPassword,
  getCurrentUser,
}
