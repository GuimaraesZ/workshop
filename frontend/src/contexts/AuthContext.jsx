import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import * as authService from '../services/authService'

const AuthContext = createContext()

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Carregar dados de autenticação do localStorage ao montar
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY)
      const savedUser = localStorage.getItem(USER_KEY)

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error)
      logout() // Limpar dados corrompidos
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salvar token e usuário
  const saveAuth = (authToken, userData) => {
    try {
      localStorage.setItem(TOKEN_KEY, authToken)
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      setToken(authToken)
      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Erro ao salvar autenticação:', error)
      throw new Error('Não foi possível salvar os dados de autenticação')
    }
  }

  // Login
  const login = async (email, password) => {
    try {
      console.log('Tentando fazer login...', email)
      
      // Chamar API real de autenticação
      const response = await authService.login(email, password)
      
      if (!response || !response.token || !response.user) {
        throw new Error('Resposta inválida do servidor')
      }
      
      console.log('Login bem-sucedido:', response.user)
      saveAuth(response.token, response.user)
      
      return { success: true, user: response.user }
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  // Signup (Cadastro)
  const signup = async (userData) => {
    try {
      console.log('Tentando criar conta...', userData.email)
      
      // Chamar API real de cadastro
      const response = await authService.signup(userData)
      
      if (!response || !response.token || !response.user) {
        throw new Error('Resposta inválida do servidor')
      }
      
      console.log('Cadastro bem-sucedido:', response.user)
      saveAuth(response.token, response.user)
      
      return { success: true, user: response.user }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      throw error
    }
  }

  // Logout
  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  // Atualizar dados do usuário
  const updateUser = (userData) => {
    try {
      const updatedUser = { ...user, ...userData }
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw new Error('Não foi possível atualizar os dados do usuário')
    }
  }

  // Recarregar dados do usuário do backend
  const refreshUser = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`)
      if (response.ok) {
        const userData = await response.json()
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        setUser(userData)
        return userData
      }
    } catch (error) {
      console.error('Erro ao recarregar dados do usuário:', error)
    }
  }

  // Verificar se token é válido (decodificar JWT)
  const isTokenValid = () => {
    if (!token) return false

    try {
      // TODO: Implementar validação real de JWT
      // const decoded = jwtDecode(token)
      // const currentTime = Date.now() / 1000
      // return decoded.exp > currentTime
      
      // Simulação temporária
      return true
    } catch (error) {
      console.error('Erro ao validar token:', error)
      return false
    }
  }

  // Obter token para requisições
  const getAuthToken = () => token

  // Verificar se usuário tem permissão (role-based)
  const hasRole = (role) => {
    if (!user || !user.roles) return false
    return user.roles.includes(role)
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
    isTokenValid,
    getAuthToken,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Hook customizado para usar autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export default AuthContext
