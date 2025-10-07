import { useState, useEffect } from 'react'
import { Store, Plus, Pencil, Trash2, Search, User } from 'lucide-react'

export default function ManagerLojas() {
  const [lojas, setLojas] = useState([])
  const [administradores, setAdministradores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingLoja, setEditingLoja] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    usuarioId: ''
  })

  useEffect(() => {
    loadLojas()
    loadAdministradores()
  }, [])

  const loadAdministradores = async () => {
    try {
      // TODO: Implementar chamada à API para buscar apenas usuários ADMIN
      // Por enquanto, dados mock
      setAdministradores([
        { id: 1, nome: 'Admin Geral' },
        { id: 2, nome: 'João Silva' },
        { id: 3, nome: 'Maria Santos' }
      ])
    } catch (error) {
      console.error('Erro ao carregar administradores:', error)
    }
  }

  const loadLojas = async () => {
    try {
      // TODO: Implementar chamada à API
      // Por enquanto, dados mock
      setLojas([
        { id: 1, nome: 'Loja Principal', descricao: 'Loja oficial da marca', usuario: 'Admin Geral', usuarioId: 1, produtos: 45 },
        { id: 2, nome: 'Perfumaria Elite', descricao: 'Perfumes importados', usuario: 'João Silva', usuarioId: 2, produtos: 28 },
        { id: 3, nome: 'Cosméticos Premium', descricao: 'Linha de cosméticos', usuario: 'Maria Santos', usuarioId: 3, produtos: 35 }
      ])
    } catch (error) {
      console.error('Erro ao carregar lojas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (loja = null) => {
    if (loja) {
      setEditingLoja(loja)
      setFormData({
        nome: loja.nome,
        descricao: loja.descricao,
        usuarioId: loja.usuarioId.toString()
      })
    } else {
      setEditingLoja(null)
      setFormData({ nome: '', descricao: '', usuarioId: '' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLoja(null)
    setFormData({ nome: '', descricao: '', usuarioId: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // TODO: Implementar criação/edição via API
      console.log('Salvando loja:', formData)
      await loadLojas()
      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar loja:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        // TODO: Implementar exclusão via API
        console.log('Excluindo loja:', id)
        await loadLojas()
      } catch (error) {
        console.error('Erro ao excluir loja:', error)
      }
    }
  }

  const filteredLojas = lojas.filter(loja =>
    loja.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loja.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
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
            Gerenciar Lojas
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Controle todas as lojas do sistema
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nova Loja
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar lojas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Lojas List */}
      <div className="space-y-4">
        {filteredLojas.map((loja) => (
          <div
            key={loja.id}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                    {loja.nome}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    {loja.descricao}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{loja.usuario}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Store className="w-4 h-4" />
                      <span>{loja.produtos} produtos</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(loja)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(loja.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLojas.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma loja encontrada</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              {editingLoja ? 'Editar Loja' : 'Nova Loja'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nome da Loja
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
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Administrador Responsável
                </label>
                <select
                  value={formData.usuarioId}
                  onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione um administrador</option>
                  {administradores.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.nome}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Apenas administradores podem gerenciar lojas
                </p>
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
