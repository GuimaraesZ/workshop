import { api } from './api'

/**
 * Busca todos os usuários (admin)
 * @returns {Promise<Array>} Lista de usuários
 */
export async function fetchAllUsers() {
  return await api.get('/users')
}

/**
 * Busca um usuário específico por ID
 * @param {number} id - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
export async function fetchUserById(id) {
  return await api.get(`/users/${id}`)
}

/**
 * Cria um novo usuário
 * @param {Object} userData - Dados do usuário
 * @returns {Promise<Object>} Usuário criado
 */
export async function createUser(userData) {
  return await api.post('/users', userData)
}

/**
 * Atualiza um usuário existente
 * @param {number} id - ID do usuário
 * @param {Object} userData - Dados atualizados
 * @returns {Promise<Object>} Usuário atualizado
 */
export async function updateUser(id, userData) {
  return await api.put(`/users/${id}`, userData)
}

/**
 * Deleta um usuário
 * @param {number} id - ID do usuário
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
  return await api.delete(`/users/${id}`)
}

/**
 * Altera a senha do usuário
 * @param {number} id - ID do usuário
 * @param {string} currentPassword - Senha atual
 * @param {string} newPassword - Nova senha
 * @returns {Promise<void>}
 */
export async function changePassword(id, currentPassword, newPassword) {
  return await api.post(`/users/${id}/change-password`, {
    currentPassword,
    newPassword
  })
}

export default {
  fetchAllUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
}
