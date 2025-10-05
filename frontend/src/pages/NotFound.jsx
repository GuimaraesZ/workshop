import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

function NotFound() {
  return (
    <div className="container-custom py-16 text-center">
      <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Página Não Encontrada
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Desculpe, a página que você está procurando não existe ou foi removida.
      </p>
      <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
        <Home size={20} />
        Voltar para Home
      </Link>
    </div>
  )
}

export default NotFound
