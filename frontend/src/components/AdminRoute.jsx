import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!isAdmin || user.role !== 'ADMIN') {
    // Redireciona para login de admin se não estiver autenticado como admin
    return <Navigate to="/login/manager" replace />
  }

  return children
}
