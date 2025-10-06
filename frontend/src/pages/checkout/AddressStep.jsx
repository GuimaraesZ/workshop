import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { MapPin, Plus, Check, ArrowRight, ArrowLeft } from 'lucide-react'

export default function AddressStep() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedAddress, setSelectedAddress] = useState('user')
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  })

  // Endereço do usuário (do perfil)
  const userAddress = {
    id: 'user',
    street: user?.address || '',
    number: user?.houseNumber || '',
    complement: user?.complement || '',
    neighborhood: user?.neighborhood || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    isDefault: true
  }

  const hasUserAddress = userAddress.street && userAddress.city

  const handleContinue = () => {
    if (selectedAddress || showNewAddressForm) {
      // Salvar endereço selecionado no localStorage ou contexto
      const addressToUse = selectedAddress === 'user' ? userAddress : newAddress
      localStorage.setItem('checkoutAddress', JSON.stringify(addressToUse))
      navigate('/checkout/payment')
    }
  }

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const isNewAddressValid = () => {
    return newAddress.street && newAddress.number && newAddress.city && newAddress.state && newAddress.zipCode
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
          Endereço de Entrega
        </h2>

        <div className="space-y-4">
          {/* User's Default Address */}
          {hasUserAddress && (
            <div
              onClick={() => {
                setSelectedAddress('user')
                setShowNewAddressForm(false)
              }}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedAddress === 'user'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className={`${selectedAddress === 'user' ? 'text-primary-600' : 'text-neutral-500'} mt-1`} size={20} />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                        Endereço Principal
                      </h3>
                      {selectedAddress === 'user' && (
                        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                          Selecionado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {userAddress.street}, {userAddress.number}
                      {userAddress.complement && ` - ${userAddress.complement}`}
                    </p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {userAddress.neighborhood} - {userAddress.city}/{userAddress.state}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      CEP: {userAddress.zipCode}
                    </p>
                  </div>
                </div>
                {selectedAddress === 'user' && (
                  <Check className="text-primary-600" size={24} />
                )}
              </div>
            </div>
          )}

          {/* Add New Address Button */}
          {!showNewAddressForm && (
            <button
              onClick={() => {
                setShowNewAddressForm(true)
                setSelectedAddress('new')
              }}
              className="w-full p-4 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Plus size={20} />
              <span className="font-medium">Adicionar Novo Endereço</span>
            </button>
          )}

          {/* New Address Form */}
          {showNewAddressForm && (
            <div className="p-4 rounded-xl border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary-600" />
                Novo Endereço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={newAddress.zipCode}
                    onChange={handleNewAddressChange}
                    placeholder="00000-000"
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Rua/Avenida *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleNewAddressChange}
                    placeholder="Nome da rua"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Número *
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={newAddress.number}
                    onChange={handleNewAddressChange}
                    placeholder="Nº"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complement"
                    value={newAddress.complement}
                    onChange={handleNewAddressChange}
                    placeholder="Apto, bloco, etc"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={newAddress.neighborhood}
                    onChange={handleNewAddressChange}
                    placeholder="Bairro"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    placeholder="Cidade"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    placeholder="UF"
                    maxLength="2"
                    className="input"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setShowNewAddressForm(false)
                  setSelectedAddress('user')
                }}
                className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/checkout/cart')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedAddress && !isNewAddressValid()}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            Continuar
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
