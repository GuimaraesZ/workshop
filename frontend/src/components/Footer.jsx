import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container-custom py-6 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Loja da Rosy - O Boticário. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
