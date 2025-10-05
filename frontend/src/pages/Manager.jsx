import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Edit, Trash2, Plus, ImageIcon, LogOut, User, X, Save } from 'lucide-react'

export default function Manager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [creatingProduct, setCreatingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    imgUrl: ''
  })
  const [newProductImage, setNewProductImage] = useState(null)
  const [newProductImagePreview, setNewProductImagePreview] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('user')
    navigate('/login/manager')
  }

  const handleImageUpload = async (productId, file) => {
    if (!file) return

    setUploadingId(productId)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`http://localhost:8080/manager/products/${productId}/upload-image`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        // Atualizar produto específico no estado com a nova imagem
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, imgUrl: data.imageUrl }
              : product
          )
        )
        
        // Mensagem de sucesso com o caminho da imagem
        alert(`✅ Imagem carregada com sucesso!\n\n📁 Caminho no banco: ${data.imageUrl}\n🌐 URL: http://localhost:8080${data.imageUrl}`)
      } else {
        const errorData = await response.json()
        alert(`❌ Erro ao enviar imagem: ${errorData.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('❌ Erro ao enviar imagem. Verifique a conexão com o servidor.')
    } finally {
      setUploadingId(null)
    }
  }

  const handleFileSelect = (productId, event) => {
    const file = event.target.files[0]
    if (file) {
      handleImageUpload(productId, file)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl
    })
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`http://localhost:8080/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          imgUrl: editingProduct.imgUrl
        })
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(prevProducts =>
          prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        )
        setEditingProduct(null)
        alert('✅ Produto atualizado com sucesso!')
      } else {
        alert('❌ Erro ao atualizar produto')
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      alert('❌ Erro ao atualizar produto. Verifique a conexão.')
    }
  }

  const handleDelete = (product) => {
    setDeletingProduct(product)
  }

  const confirmDelete = async () => {
    if (!deletingProduct) return

    try {
      const response = await fetch(`http://localhost:8080/products/${deletingProduct.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(prevProducts => 
          prevProducts.filter(p => p.id !== deletingProduct.id)
        )
        setDeletingProduct(null)
        alert('✅ Produto excluído com sucesso!')
      } else {
        alert('❌ Erro ao excluir produto')
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('❌ Erro ao excluir produto. Verifique a conexão.')
    }
  }

  const handleCreateProduct = () => {
    setCreatingProduct(true)
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      imgUrl: ''
    })
    setNewProductImage(null)
    setNewProductImagePreview(null)
  }

  const handleNewProductImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setNewProductImage(file)
      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProductImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveNewProduct = async () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      alert('⚠️ Preencha todos os campos obrigatórios!')
      return
    }

    try {
      // 1. Criar o produto primeiro
      const response = await fetch('http://localhost:8080/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      })

      if (response.ok) {
        const createdProduct = await response.json()
        
        // 2. Se houver imagem, fazer upload
        if (newProductImage) {
          const formData = new FormData()
          formData.append('file', newProductImage)
          
          const uploadResponse = await fetch(`http://localhost:8080/manager/products/${createdProduct.id}/upload-image`, {
            method: 'POST',
            body: formData
          })
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            createdProduct.imgUrl = uploadData.imageUrl
          }
        }
        
        setProducts(prevProducts => [...prevProducts, createdProduct])
        setCreatingProduct(false)
        setNewProduct({ name: '', description: '', price: 0, imgUrl: '' })
        setNewProductImage(null)
        setNewProductImagePreview(null)
        alert('✅ Produto criado com sucesso!' + (newProductImage ? ' Imagem carregada!' : ''))
      } else {
        alert('❌ Erro ao criar produto')
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      alert('❌ Erro ao criar produto. Verifique a conexão.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciador de Produtos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie produtos e faça upload de imagens
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Administrador
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
              <button 
                onClick={handleCreateProduct}
                className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Novo Produto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              {/* Imagem do Produto */}
              <div className="relative h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {product.imgUrl ? (
                  <img
                    src={`http://localhost:8080${product.imgUrl}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    key={product.imgUrl} // Force re-render quando imgUrl mudar
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>Sem imagem</p>
                  </div>
                )}

                {/* Badge de Imagem Carregada */}
                {product.imgUrl && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Imagem OK
                  </div>
                )}

                {/* Botão de Upload */}
                <label
                  className={`absolute bottom-4 right-4 bg-pink-600 text-white p-3 rounded-full cursor-pointer hover:bg-pink-700 transition shadow-lg ${
                    uploadingId === product.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingId === product.id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(product.id, e)}
                    disabled={uploadingId === product.id}
                  />
                </label>
              </div>

              {/* Informações do Produto */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">
                    R$ {product.price?.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                      title="Editar produto"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                      title="Excluir produto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-xl">
              Nenhum produto cadastrado
            </p>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-600" />
                Editar Produto
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nome do produto"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Descrição do produto"
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              {/* Preview da Imagem */}
              {editingProduct.imgUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagem Atual
                  </label>
                  <img
                    src={`http://localhost:8080${editingProduct.imgUrl}`}
                    alt={editingProduct.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-red-600" />
                Confirmar Exclusão
              </h2>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Tem certeza que deseja excluir o produto:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  {deletingProduct.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  R$ {deletingProduct.price?.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                ⚠️ Esta ação não pode ser desfeita!
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-5 h-5" />
                Excluir Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Novo Produto */}
      {creatingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-pink-600" />
                Criar Novo Produto
              </h2>
              <button
                onClick={() => setCreatingProduct(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Malbec Intense"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Descreva as características do produto..."
                  required
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imagem do Produto
                </label>
                <div className="space-y-3">
                  {/* Botão de Upload */}
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {newProductImage ? newProductImage.name : 'Selecionar imagem...'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleNewProductImageSelect}
                    />
                  </label>

                  {/* Preview da Imagem */}
                  {newProductImagePreview && (
                    <div className="relative">
                      <img
                        src={newProductImagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        onClick={() => {
                          setNewProductImage(null)
                          setNewProductImagePreview(null)
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 <strong>Dica:</strong> {newProductImage ? 'A imagem será carregada automaticamente ao criar o produto.' : 'Você pode adicionar a imagem agora ou depois usando o botão de upload.'}
                </p>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCreatingProduct(false)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewProduct}
                className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
              >
                <Save className="w-5 h-5" />
                Criar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
