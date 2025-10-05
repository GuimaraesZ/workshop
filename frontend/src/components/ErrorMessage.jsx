import PropTypes from 'prop-types'

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message text-center max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">❌ Erro ao carregar dados</h3>
      <p className="mb-4">{message || 'Ocorreu um erro inesperado'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          Tentar Novamente
        </button>
      )}
    </div>
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
}

export default ErrorMessage
