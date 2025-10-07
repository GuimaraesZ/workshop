import { useState, useEffect } from 'react'
import { Users, Plus, Pencil, Trash2, Search, Shield, ShieldCheck, User } from 'lucide-react'

export default function ManagerUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    dataNascimento: '',
    cpf: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    role: 'USER',
    ativo: true
  })

  // Funções de formatação
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      // TODO: Implementar chamada à API
      // Por enquanto, dados mock
      setUsuarios([
        { 
          id: 1, 
          nome: 'Admin Geral', 
          email: 'admin@workshop.com', 
          role: 'ADMIN', 
          ativo: true,
          dataCriacao: '2024-01-15',
          ultimoAcesso: '2024-03-20'
        },
        { 
          id: 2, 
          nome: 'João Silva', 
          email: 'joao@email.com', 
          role: 'ADMIN', 
          ativo: true,
          dataCriacao: '2024-02-10',
          ultimoAcesso: '2024-03-19'
        },
        { 
          id: 3, 
          nome: 'Maria Santos', 
          email: 'maria@email.com', 
          role: 'ADMIN', 
          ativo: true,
          dataCriacao: '2024-02-15',
          ultimoAcesso: '2024-03-18'
        },
        { 
          id: 4, 
          nome: 'Pedro Costa', 
          email: 'pedro@email.com', 
          role: 'USER', 
          ativo: true,
          dataCriacao: '2024-03-01',
          ultimoAcesso: '2024-03-20'
        },
        { 
          id: 5, 
          nome: 'Ana Lima', 
          email: 'ana@email.com', 
          role: 'USER', 
          ativo: false,
          dataCriacao: '2024-03-05',
          ultimoAcesso: '2024-03-10'
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario)
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '',
        dataNascimento: usuario.dataNascimento || '',
        cpf: usuario.cpf || '',
        endereco: usuario.endereco || {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: ''
        },
        role: usuario.role,
        ativo: usuario.ativo
      })
    } else {
      setEditingUsuario(null)
      setFormData({
        nome: '',
        email: '',
        senha: '',
        dataNascimento: '',
        cpf: '',
        endereco: {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: ''
        },
        role: 'USER',
        ativo: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUsuario(null)
    setFormData({
      nome: '',
      email: '',
      senha: '',
      dataNascimento: '',
      cpf: '',
      endereco: {
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      role: 'USER',
      ativo: true
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // TODO: Implementar criação/edição via API
      console.log('Salvando usuário:', formData)
      await loadUsuarios()
      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        // TODO: Implementar exclusão via API
        console.log('Excluindo usuário:', id)
        await loadUsuarios()
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      // TODO: Implementar alteração de status via API
      console.log('Alterando status do usuário:', id, !currentStatus)
      await loadUsuarios()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const getRoleBadge = (role) => {
    const roles = {
      ADMIN: { 
        label: 'Administrador', 
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: ShieldCheck
      },
      USER: { 
        label: 'Usuário', 
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        icon: User
      }
    }
    return roles[role] || roles.USER
  }

  const getRolePermissions = (role) => {
    const permissions = {
      ADMIN: [
        'Acesso total ao sistema',
        'Gerenciar todos os usuários',
        'Gerenciar lojas e produtos',
        'Upload de fotos',
        'Alterar preços',
        'Ver relatórios completos',
        'Gerenciar lojas atribuídas'
      ],
      USER: [
        'Fazer pedidos',
        'Ver histórico de compras',
        'Gerenciar favoritos',
        'Atualizar perfil'
      ]
    }
    return permissions[role] || permissions.USER
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || usuario.role === filterRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Gerenciar Usuários
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Controle de usuários e permissões do sistema
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todas as Funções</option>
            <option value="ADMIN">Administrador</option>
            <option value="USER">Usuário</option>
          </select>
        </div>
      </div>

      {/* Usuarios List */}
      <div className="space-y-4">
        {filteredUsuarios.map((usuario) => {
          const roleBadge = getRoleBadge(usuario.role)
          const RoleIcon = roleBadge.icon

          return (
            <div
              key={usuario.id}
              className={`bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-all ${
                !usuario.ativo ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 ${roleBadge.color} rounded-lg`}>
                    <RoleIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {usuario.nome}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                      {!usuario.ativo && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {usuario.email}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>Criado em: {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</span>
                      <span>Último acesso: {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(usuario.id, usuario.ativo)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      usuario.ativo
                        ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {usuario.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleOpenModal(usuario)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredUsuarios.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum usuário encontrado</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              {editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome e Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Data de Nascimento e CPF */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="000.000.000-00"
                    maxLength="14"
                    required
                  />
                </div>
              </div>

              {/* Endereço - Seção */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Endereço
                </h3>
                
                {/* CEP e Rua */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.cep}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, cep: formatCEP(e.target.value) }
                      })}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="00000-000"
                      maxLength="9"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Rua *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.rua}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, rua: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Número e Complemento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.numero}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, numero: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.complemento}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, complemento: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Apto, bloco, etc"
                    />
                  </div>
                </div>

                {/* Bairro, Cidade e Estado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.bairro}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, bairro: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.endereco.cidade}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, cidade: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.endereco.estado}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, estado: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Senha {editingUsuario && '(deixe em branco para não alterar)'}
                </label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={!editingUsuario}
                  placeholder={editingUsuario ? 'Deixe em branco para não alterar' : ''}
                />
              </div>

              {/* Função/Permissão */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Função / Permissão *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {/* Permissões por Role */}
              <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Permissões da função selecionada:
                </h3>
                <ul className="space-y-2">
                  {getRolePermissions(formData.role).map((permission, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-4 h-4 text-purple-600 bg-neutral-100 border-neutral-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="ativo" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Usuário Ativo
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
