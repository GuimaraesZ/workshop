import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AlertCircle, CheckCircle, LogIn, UserPlus } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup } = useAuth()
  
  const [activeTab, setActiveTab] = useState('login') // 'login' ou 'signup'
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validateSignupForm = () => {
    const errors = {}
    if (signupData.name.trim().length < 3) errors.name = 'Nome deve ter pelo menos 3 caracteres'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupData.email)) errors.email = 'Email inválido'
    if (signupData.password.length < 6) errors.password = 'Senha deve ter pelo menos 6 caracteres'
    if (signupData.password !== signupData.confirmPassword) errors.confirmPassword = 'As senhas não coincidem'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    try {
      await login(loginData.email, loginData.password)
      setSuccess('Login realizado com sucesso!')
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      }, 500)
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!validateSignupForm()) return
    setIsLoading(true)
    try {
      const userData = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
      }
      await signup(userData)
      setSuccess('Conta criada com sucesso! Agora você já pode fazer login.')
      
      // Limpar formulário de cadastro
      setSignupData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      })
      
      // Mudar para aba de login após 2 segundos
      setTimeout(() => {
        setActiveTab('login')
        setSuccess('') // Limpar mensagem de sucesso
      }, 2000)
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData({ ...signupData, [name]: value })
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-900 flex items-center justify-center py-12 px-4 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/revendedora)' }}
      >
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="animate-fade-in bg-green-100/90 dark:bg-green-800/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden p-8">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🛍️</div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-500 to-green-300 dark:from-green-300 dark:via-green-200 dark:to-green-100 mb-3 drop-shadow-lg">
              Bem vindo à loja da Rosy
            </h1>

            <p className="text-green-800 dark:text-green-300">
              Acesse sua conta ou crie uma nova senha
            </p>
          </div>

          {/* Mensagem de redirecionamento */}
          {location.state?.from && (
            <div className="mb-6 bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg text-sm shadow-sm">
              Você precisa fazer login para acessar esta página.
            </div>
          )}

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 animate-scale-in">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Mensagem de sucesso */}
          {success && (
            <div className="mb-6 bg-green-200 border border-green-600 text-green-900 px-4 py-3 rounded-lg flex items-start gap-2 animate-scale-in">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess('') }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-green-900 text-white border-2 border-white'
                  : 'bg-green-100 text-green-900 border-2 border-green-700 hover:bg-green-200/50'
              }`}
            >
              <LogIn className="w-5 h-5" /> Login
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); setSuccess('') }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'signup'
                  ? 'bg-green-900 text-white border-2 border-white'
                  : 'bg-green-100 text-green-900 border-2 border-green-700 hover:bg-green-200/50'
              }`}
            >
              <UserPlus className="w-5 h-5" /> Cadastro
            </button>
          </div>

          {/* Formulário de Login */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 bg-green-50 border border-green-700 text-green-900 placeholder-green-500 rounded-md focus:border-green-800 focus:ring-2 focus:ring-green-200 transition-all"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 bg-green-50 border border-green-700 text-green-900 placeholder-green-500 rounded-md focus:border-green-800 focus:ring-2 focus:ring-green-200 transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-green-900 hover:bg-green-800 text-white font-semibold rounded-md border-2 border-white hover:border-green-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {/* Formulário de Cadastro */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-semibold text-green-900 dark:text-green-200 mb-2">Nome Completo</label>
                <input
                  type="text"
                  id="signup-name"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className={`w-full px-4 py-3 bg-green-50 border rounded-md text-green-900 placeholder-green-500 focus:border-green-800 focus:ring-2 focus:ring-green-200 transition-all ${validationErrors.name ? 'border-red-500' : 'border-green-700'}`}
                  placeholder="João Silva"
                  required
                  disabled={isLoading}
                />
                {validationErrors.name && <p className="mt-1 text-sm text-red-600 font-medium">{validationErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-semibold text-green-900 dark:text-green-200 mb-2">E-mail</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className={`w-full px-4 py-3 bg-green-50 border rounded-md text-green-900 placeholder-green-500 focus:border-green-800 focus:ring-2 focus:ring-green-200 transition-all ${validationErrors.email ? 'border-red-500' : 'border-green-700'}`}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
                {validationErrors.email && <p className="mt-1 text-sm text-red-600 font-medium">{validationErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="signup-phone" className="block text-sm font-semibold text-green-900 dark:text-green-200 mb-2">Telefone (opcional)</label>
                <input
                  type="tel"
                  id="signup-phone"
                  name="phone"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-3 bg-green-50 border border-green-700 text-green-900 placeholder-green-500 rounded-md focus:border-green-800 focus:ring-2 focus:ring-green-200 transition-all"
                  placeholder="(11) 99999-9999"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-semibold text-green-900 dark:text-green-200 mb-2">Senha</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className={`w-full px-4 py-3 bg-green-50 border rounded-md text-green-900 placeholder-green-500 focus:border-green-800 focus:ring-2 focus:ring-green-200 transition-all ${validationErrors.password ? 'border-red-500' : 'border-green-700'}`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                {validationErrors.password && <p className="mt-1 text-sm text-red-600 font-medium">{validationErrors.password}</p>}
                <p className="mt-1 text-xs text-green-800">Mínimo de 6 caracteres</p>
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-semibold text-green-900 dark:text-green-200 mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  id="signup-confirm-password"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  className={`w-full px-4 py-3 bg-green-50 border rounded-md text-green-900 placeholder-green-500 focus:border-green-800 focus:ring-2 focus:ring-green-200 transition-all ${validationErrors.confirmPassword ? 'border-red-500' : 'border-green-700'}`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                {/* Espaço reservado para mensagens de validação - evita o "pulo" do layout */}
                <div className="mt-1 min-h-[20px]">
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-600 font-medium">{validationErrors.confirmPassword}</p>
                  )}
                  {!validationErrors.confirmPassword && signupData.confirmPassword && signupData.password === signupData.confirmPassword && (
                    <p className="text-sm text-green-900 flex items-center gap-1 font-medium">
                      <CheckCircle size={14} /> As senhas coincidem
                    </p>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-green-900 hover:bg-green-800 text-white font-semibold rounded-md border-2 border-white hover:border-green-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Cadastrar'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-green-900 dark:text-green-200 font-semibold mt-6 bg-green-100/80 dark:bg-green-800/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-md">
          Ao continuar, você concorda com nossos{' '}
          <a href="#" className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 underline">
            Termos de Uso
          </a>
        </p>

        {/* Link para Admin */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/login/manager')}
            className="text-sm text-white/80 hover:text-white transition-colors underline"
          >
            Acesso Administrativo
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
