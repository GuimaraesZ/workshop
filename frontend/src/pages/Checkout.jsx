import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { Truck, CreditCard, Package, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, MapPin, DollarSign } from 'lucide-react'
import CheckoutSteps from '../components/CheckoutSteps'

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()

  // Estados locais para o controle do fluxo do checkout
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dados do formulário de endereço de entrega (pré-preenchidos com dados do usuário)
  const [shippingData, setShippingData] = useState({
    recipientName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address || '',
    number: user?.houseNumber || '',
    complement: user?.complement || '',
    neighborhood: user?.neighborhood || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
  });

  // Método de pagamento e dados do cartão
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    cpf: '',
  });

  // Opções de envio (os dados de preço e dias úteis devem ser consistentes)
  const shippingOptions = [
    { id: 'standard', name: 'Entrega Padrão', days: '5-7 dias úteis', price: 15.00, icon: Package },
    { id: 'express', name: 'Entrega Expressa', days: '2-3 dias úteis', price: 35.00, icon: Truck },
    { id: 'same-day', name: 'Entrega no Mesmo Dia', days: 'Até 23:59 de hoje', price: 50.00, icon: CheckCircle },
  ];

  // Efeito para redirecionar se o carrinho estiver vazio
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  // Efeito para atualizar dados de entrega quando o usuário for carregado
  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        recipientName: user.name || prev.recipientName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        street: user.address || prev.street,
        number: user.houseNumber || prev.number,
        complement: user.complement || prev.complement,
        neighborhood: user.neighborhood || prev.neighborhood,
        city: user.city || prev.city,
        state: user.state || prev.state,
        zipCode: user.zipCode || prev.zipCode,
      }))
    }
  }, [user])

  // Calcula os totais do pedido
  const selectedShipping = shippingOptions.find(opt => opt.id === 'standard')
  const subtotal = getCartTotal()
  const shippingPrice = selectedShipping?.price || 0
  const total = subtotal + shippingPrice

  // Handlers
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (step) => {
    setError(null);
    let requiredFields = [];
    let dataToValidate = {};

    switch (step) {
      case 1:
        requiredFields = ['recipientName', 'email', 'phone', 'street', 'number', 'neighborhood', 'city', 'state', 'zipCode'];
        dataToValidate = shippingData;
        break;
      case 2:
        return true; // A seleção do método de envio não tem validação de campos
      case 3:
        requiredFields = ['cpf'];
        dataToValidate = paymentData;
        if (paymentMethod === 'CREDIT_CARD') {
          requiredFields = [...requiredFields, 'cardNumber', 'cardName', 'cardExpiry', 'cardCVV'];
        }
        break;
      default:
        return false;
    }

    for (const field of requiredFields) {
      if (!dataToValidate[field] || dataToValidate[field].trim() === '') {
        setError(`O campo ${field} é obrigatório.`);
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateForm(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleFinishOrder();
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        shippingPrice,
        subtotal,
        total,
      };

      const response = await createOrder(orderData);
      clearCart();
      navigate('/order-confirmation', {
        state: { order: response },
        replace: true
      });
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      setError(err.message || 'Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Se o carrinho estiver vazio, não renderiza nada e espera o redirecionamento
  if (cartItems.length === 0) {
    return null
  }

  // Renderização do componente
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao carrinho
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Finalizar Compra
          </h1>
        </div>

        {/* Progresso do Checkout */}
        <CheckoutSteps currentStep={currentStep} />
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mt-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Etapa 1: Informações de Entrega */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Informações de Entrega</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo *</label>
                      <input type="text" name="recipientName" value={shippingData.recipientName} onChange={handleShippingChange} className="input-field" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                        <input type="email" name="email" value={shippingData.email} onChange={handleShippingChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone *</label>
                        <input type="tel" name="phone" value={shippingData.phone} onChange={handleShippingChange} className="input-field" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP *</label>
                      <input type="text" name="zipCode" value={shippingData.zipCode} onChange={handleShippingChange} placeholder="00000-000" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rua *</label>
                      <input type="text" name="street" value={shippingData.street} onChange={handleShippingChange} placeholder="Rua, Avenida, etc." className="input-field" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número *</label>
                        <input type="text" name="number" value={shippingData.number} onChange={handleShippingChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro *</label>
                        <input type="text" name="neighborhood" value={shippingData.neighborhood} onChange={handleShippingChange} className="input-field" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complemento</label>
                      <input type="text" name="complement" value={shippingData.complement} onChange={handleShippingChange} placeholder="Apto, bloco, etc (opcional)" className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade *</label>
                        <input type="text" name="city" value={shippingData.city} onChange={handleShippingChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado *</label>
                        <input type="text" name="state" value={shippingData.state} onChange={handleShippingChange} placeholder="Ex: SP" maxLength="2" className="input-field uppercase" required />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Etapa 2: Método de Envio */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Método de Envio</h2>
                  </div>
                  <div className="space-y-4">
                    {shippingOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.id}
                          onClick={() => setShippingData(prev => ({ ...prev, shippingMethod: option.id }))}
                          className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            shippingData.shippingMethod === option.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-6 h-6 ${shippingData.shippingMethod === option.id ? 'text-blue-500' : 'text-gray-400'}`} />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{option.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{option.days}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">R$ {option.price.toFixed(2)}</p>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Etapa 3: Pagamento */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pagamento</h2>
                  </div>
                  <div className="space-y-6">
                    {/* Método de Pagamento */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[{ id: 'CREDIT_CARD', name: 'Cartão de Crédito', icon: CreditCard }, { id: 'PIX', name: 'PIX', icon: DollarSign }, { id: 'BOLETO', name: 'Boleto Bancário', icon: Package }].map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-4 border-2 rounded-lg transition-all ${
                              paymentMethod === method.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{method.name}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Formulário de Cartão */}
                    {paymentMethod === 'CREDIT_CARD' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número do Cartão *</label>
                          <input type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} placeholder="0000 0000 0000 0000" maxLength="19" className="input-field" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome no Cartão *</label>
                          <input type="text" name="cardName" value={paymentData.cardName} onChange={handlePaymentChange} placeholder="COMO ESTÁ NO CARTÃO" className="input-field uppercase" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validade *</label>
                            <input type="text" name="cardExpiry" value={paymentData.cardExpiry} onChange={handlePaymentChange} placeholder="MM/AA" maxLength="5" className="input-field" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV *</label>
                            <input type="text" name="cardCVV" value={paymentData.cardCVV} onChange={handlePaymentChange} placeholder="123" maxLength="4" className="input-field" required />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informação PIX/Boleto */}
                    {paymentMethod === 'PIX' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-gray-700 dark:text-gray-300">
                        <p className="text-sm">Após confirmar o pedido, você receberá o código PIX para pagamento.</p>
                      </div>
                    )}
                    {paymentMethod === 'BOLETO' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-gray-700 dark:text-gray-300">
                        <p className="text-sm">Após confirmar o pedido, você receberá o boleto para pagamento.</p>
                      </div>
                    )}

                    {/* CPF para todos os métodos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF *</label>
                      <input type="text" name="cpf" value={paymentData.cpf} onChange={handlePaymentChange} placeholder="123.456.789-00" maxLength="14" className="input-field" required />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo do Pedido</h3>

              {/* Itens */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => {
                  const imageUrl = item.product.imgUrl 
                    ? item.product.imgUrl 
                    : '/placeholder.png'
                  
                  return (
                    <div key={item.product.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          onError={(e) => {
                            console.error('Erro ao carregar imagem:', imageUrl)
                            e.target.src = '/placeholder.png'
                          }}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {item.product.category?.name || 'Produto'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            R$ {item.product.price.toFixed(2)} x {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totais */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Frete</span>
                  <span className="text-gray-900 dark:text-white">R$ {shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-blue-600 dark:text-blue-400">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botões de navegação */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : (
                    currentStep === 3 ? (
                      <>
                        Finalizar Pedido <CheckCircle className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Continuar <ArrowRight className="w-5 h-5" />
                      </>
                    )
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;