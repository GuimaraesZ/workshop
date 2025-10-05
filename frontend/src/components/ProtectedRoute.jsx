import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../contexts/AuthContext'
import Loading from '../components/Loading'

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para login se usuário não estiver autenticado
 */
function ProtectedRoute({ children, requireAuth = true, redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <Loading />
  }

  // Se requer autenticação e usuário não está autenticado
  if (requireAuth && !isAuthenticated) {
    // Salvar a rota atual para redirecionar após login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Se não requer autenticação e usuário está autenticado (ex: página de login)
  if (!requireAuth && isAuthenticated) {
    // Redirecionar para home ou página anterior
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAuth: PropTypes.bool,
  redirectTo: PropTypes.string,
}

export default ProtectedRoute
