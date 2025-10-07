import { useState, useEffect } from 'react'
import { Package, Plus, Pencil, Trash2, Search, Store, DollarSign } from 'lucide-react'

export default function ManagerProdutos() {
  const [produtos, setProdutos] = useState([])
  const [lojas, setLojas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLoja, setSelectedLoja] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    lojaId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // TODO: Implementar chamadas à API
      // Por enquanto, dados mock
      setLojas([
        { id: 1, nome: 'Loja Principal' },
        { id: 2, nome: 'Perfumaria Elite' },
        { id: 3, nome: 'Cosméticos Premium' }
      ])

      setProdutos([
        { id: 1, nome: 'Glamour Secrets Black', descricao: 'Perfume feminino 100ml', preco: 149.90, categoria: 'Perfumes', loja: 'Loja Principal', lojaId: 1, imagem: '/api/placeholder/100/100' },
        { id: 2, nome: 'Essence Gold', descricao: 'Perfume masculino 100ml', preco: 189.90, categoria: 'Perfumes', loja: 'Perfumaria Elite', lojaId: 2, imagem: '/api/placeholder/100/100' },
        { id: 3, nome: 'Rose Paradise', descricao: 'Perfume feminino 75ml', preco: 129.90, categoria: 'Perfumes', loja: 'Loja Principal', lojaId: 1, imagem: '/api/placeholder/100/100' },
        { id: 4, nome: 'Night Essence', descricao: 'Perfume masculino 100ml', preco: 169.90, categoria: 'Perfumes', loja: 'Cosméticos Premium', lojaId: 3, imagem: '/api/placeholder/100/100' },
        { id: 5, nome: 'Ocean Blue', descricao: 'Perfume unissex 100ml', preco: 159.90, categoria: 'Perfumes', loja: 'Perfumaria Elite', lojaId: 2, imagem: '/api/placeholder/100/100' }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (produto = null) => {
    if (produto) {
      setEditingProduto(produto)
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco.toString(),
        categoria: produto.categoria,
        lojaId: produto.lojaId.toString()
      })
    } else {
      setEditingProduto(null)
      setFormData({ nome: '', descricao: '', preco: '', categoria: '', lojaId: '' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduto(null)
    setFormData({ nome: '', descricao: '', preco: '', categoria: '', lojaId: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // TODO: Implementar criação/edição via API
      console.log('Salvando produto:', formData)
      await loadData()
      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        // TODO: Implementar exclusão via API
        console.log('Excluindo produto:', id)
        await loadData()
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
      }
    }
  }

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLoja = selectedLoja === 'all' || produto.lojaId.toString() === selectedLoja
    return matchesSearch && matchesLoja
  })

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
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
            Gerenciar Produtos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Controle todos os produtos do sistema
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative">
          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <select
            value={selectedLoja}
            onChange={(e) => setSelectedLoja(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todas as Lojas</option>
            {lojas.map(loja => (
              <option key={loja.id} value={loja.id}>{loja.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Produtos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProdutos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
              <Package className="w-16 h-16 text-neutral-400" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {produto.nome}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    {produto.descricao}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                <Store className="w-4 h-4" />
                <span>{produto.loja}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-lg font-bold text-purple-600">
                  <DollarSign className="w-5 h-5" />
                  <span>{produto.preco.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(produto)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum produto encontrado</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nome do Produto
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
                  Preço
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Perfumes, Cosméticos"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Loja
                </label>
                <select
                  value={formData.lojaId}
                  onChange={(e) => setFormData({ ...formData, lojaId: e.target.value })}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione uma loja</option>
                  {lojas.map(loja => (
                    <option key={loja.id} value={loja.id}>{loja.nome}</option>
                  ))}
                </select>
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
