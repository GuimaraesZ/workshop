import { useContext } from 'react'
import CartContext from '../contexts/CartContext'

/**
 * Hook customizado para acessar o contexto do carrinho
 * 
 * @returns {Object} Objeto com todas as funções e estados do carrinho
 * 
 * @example
 * const { cartItems, addToCart, removeFromCart } = useCart()
 */
export function useCart() {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  
  return context
}

export default useCart
