import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { updateUser, changePassword } from '../services/userService'
import { 
  User, 
  Mail, 
  Phone,
  Calendar,
  MapPin,
  Lock,
  Camera,
  Save,
  X,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  ArrowLeft,
  Shield
} from 'lucide-react'
import Loading from '../components/Loading'

function Profile() {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    address: user?.address || '',
    houseNumber: user?.houseNumber || '',
    neighborhood: user?.neighborhood || '',
    complement: user?.complement || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    storeName: user?.storeName || 'E-Commerce'
  })
  
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.profileImage ? `http://localhost:8080${user.profileImage}` : null
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        address: user.address || '',
        houseNumber: user.houseNumber || '',
        neighborhood: user.neighborhood || '',
        complement: user.complement || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        storeName: user.storeName || 'E-Commerce'
      })
      if (user.profileImage) {
        setProfileImagePreview(
          user.profileImage.startsWith('http') 
            ? user.profileImage 
            : `http://localhost:8080${user.profileImage}`
        )
      }
    }
  }, [user])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSavePersonalInfo = async () => {
    setError(null)
    setSuccess(null)
    setIsSaving(true)

    try {
      await updateUser(user.id, formData)
      setSuccess('Informações atualizadas com sucesso!')
      setIsEditing(false)
      
      // Recarregar dados do usuário sem recarregar a página
      await refreshUser()
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar informações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB')
        return
      }
      
      setProfileImage(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadImage = async () => {
    if (!profileImage) {
      setError('Selecione uma imagem primeiro')
      return
    }

    setError(null)
    setSuccess(null)
    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', profileImage)

      const response = await fetch(`http://localhost:8080/users/${user.id}/upload-profile-image`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Erro ao fazer upload')

      setSuccess('Foto atualizada com sucesso!')
      setProfileImage(null)
      
      await refreshUser()
    } catch (err) {
      setError('Erro ao fazer upload da imagem')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleChangePassword = async () => {
    setError(null)
    setSuccess(null)

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Preencha todos os campos de senha')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsSaving(true)
    try {
      await changePassword(user.id, passwordData.currentPassword, passwordData.newPassword)
      setSuccess('Senha alterada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      console.error('Erro ao alterar senha:', err)
      setError(err.response?.data?.message || 'Erro ao alterar senha. Verifique se a senha atual está correta.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      setError('Erro ao excluir conta')
    }
  }

  if (!user) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e configurações</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-medium">Erro</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={20} className="text-red-600 hover:text-red-800" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-green-800 font-medium">Sucesso</p>
              <p className="text-green-700 text-sm mt-1">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X size={20} className="text-green-600 hover:text-green-800" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={20} />
              Informações Pessoais
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'security'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield size={20} />
              Segurança
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'danger'
                  ? 'bg-red-50 text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AlertCircle size={20} />
              Zona de Perigo
            </button>
          </div>
        </div>

        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Camera size={24} className="text-primary-600" />
                Foto de Perfil
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Perfil"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-primary-100 shadow-lg">
                      <span className="text-4xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Alterar foto de perfil</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                  {profileImage && (
                    <button
                      onClick={handleUploadImage}
                      disabled={isUploadingImage}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Salvar Foto
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User size={24} className="text-primary-600" />
                  Dados Pessoais
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                    Editar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.name || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.email || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.phone || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                      {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Loja
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      placeholder="Ex: 🛍️ Loja da Maria"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.storeName || '-'}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary-600" />
                  Endereço
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="00000-000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.zipCode || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua/Avenida
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nome da rua"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.address || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="houseNumber"
                        value={formData.houseNumber}
                        onChange={handleInputChange}
                        placeholder="Nº"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.houseNumber || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        placeholder="Bairro"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.neighborhood || '-'}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        placeholder="Apto, bloco, etc (opcional)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.complement || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.city || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="UF"
                        maxLength="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{formData.state || '-'}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSavePersonalInfo}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        birthDate: user.birthDate || '',
                        address: user.address || '',
                        city: user.city || '',
                        state: user.state || '',
                        zipCode: user.zipCode || '',
                        storeName: user.storeName || 'E-Commerce'
                      })
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                  >
                    <X size={18} />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lock size={24} className="text-primary-600" />
              Alterar Senha
            </h2>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Alterando...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Alterar Senha
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle size={24} />
              Zona de Perigo
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Desativar Conta</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sua conta será temporariamente desativada. Você pode reativá-la fazendo login novamente.
                </p>
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                  Desativar Conta
                </button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Excluir Conta Permanentemente</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos e não poderão ser recuperados.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                  Excluir Conta
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Excluir Conta</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita e todos os seus dados serão perdidos.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Sim, Excluir
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
