import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  // Carregar favoritos do localStorage ao iniciar
  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `favorites_${user.id}`
      const storedFavorites = localStorage.getItem(storageKey)
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites))
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error)
          setFavorites([])
        }
      }
    } else {
      setFavorites([])
    }
    setLoading(false)
  }, [isAuthenticated, user])

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `favorites_${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    }
  }, [favorites, isAuthenticated, user])

  // Verificar se um produto está nos favoritos
  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId)
  }

  // Adicionar aos favoritos
  const addToFavorites = (product) => {
    if (!isFavorite(product.id)) {
      setFavorites(prev => [...prev, product])
      return true
    }
    return false
  }

  // Remover dos favoritos
  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== productId))
  }

  // Toggle favorito
  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
      return false // removido
    } else {
      addToFavorites(product)
      return true // adicionado
    }
  }

  // Limpar todos os favoritos
  const clearFavorites = () => {
    setFavorites([])
  }

  // Obter total de favoritos
  const getFavoritesCount = () => {
    return favorites.length
  }

  const value = {
    favorites,
    loading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    getFavoritesCount
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
