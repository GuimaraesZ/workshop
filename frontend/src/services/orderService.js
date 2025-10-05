import { api } from './api'

/**
 * Cria um novo pedido
 * @param {Object} orderData - Dados do pedido
 * @param {Array} orderData.items - Lista de itens do pedido [{productId, quantity, price}]
 * @param {Object} orderData.shippingAddress - Endereço de entrega
 * @param {string} orderData.paymentMethod - Método de pagamento
 * @returns {Promise<Object>} Pedido criado com id, orderNumber, status, total, etc
 */
export async function createOrder(orderData) {
  try {
    const response = await api.post('/orders', orderData)
    return response
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    throw error
  }
}

/**
 * Busca todos os pedidos do usuário autenticado
 * @returns {Promise<Array>} Lista de pedidos do usuário
 */
export async function getUserOrders() {
  try {
    const response = await api.get('/orders')
    return response
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    throw error
  }
}

/**
 * Busca um pedido específico por ID
 * @param {number|string} orderId - ID do pedido
 * @returns {Promise<Object>} Dados completos do pedido
 */
export async function getOrderById(orderId) {
  try {
    const response = await api.get(`/orders/${orderId}`)
    return response
  } catch (error) {
    console.error(`Erro ao buscar pedido ${orderId}:`, error)
    throw error
  }
}

/**
 * Cancela um pedido
 * @param {number|string} orderId - ID do pedido
 * @returns {Promise<Object>} Pedido cancelado
 */
export async function cancelOrder(orderId) {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`)
    return response
  } catch (error) {
    console.error(`Erro ao cancelar pedido ${orderId}:`, error)
    throw error
  }
}

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
}
