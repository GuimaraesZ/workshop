import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const CartContext = createContext()

const CART_STORAGE_KEY = 'shopping_cart'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar carrinho do localStorage ao montar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salvar carrinho no localStorage quando houver mudanças
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
      } catch (error) {
        console.error('Erro ao salvar carrinho no localStorage:', error)
      }
    }
  }, [cartItems, isLoading])

  // Adicionar item ao carrinho
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id
      )

      if (existingItemIndex > -1) {
        // Se já existe, atualizar quantidade
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        }
        return updatedItems
      } else {
        // Se não existe, adicionar novo item
        return [...prevItems, { product, quantity }]
      }
    })
  }

  // Remover item do carrinho
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    )
  }

  // Atualizar quantidade de um item
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Incrementar quantidade
  const incrementQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  // Decrementar quantidade
  const decrementQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity - 1
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    )
  }

  // Limpar carrinho
  const clearCart = () => {
    setCartItems([])
  }

  // Verificar se produto está no carrinho
  const isInCart = (productId) => {
    return cartItems.some(item => item.product.id === productId)
  }

  // Obter quantidade de um produto no carrinho
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  // Calcular total de itens no carrinho
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Calcular subtotal de um item
  const getItemSubtotal = (item) => {
    return item.product.price * item.quantity
  }

  // Calcular total do carrinho
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + getItemSubtotal(item),
      0
    )
  }

  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    getTotalItems,
    getItemSubtotal,
    getCartTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Hook customizado para usar o carrinho
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}

export default CartContext
