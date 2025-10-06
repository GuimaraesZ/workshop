import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, MapPin, CreditCard, Check } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useEffect } from 'react'

export default function CheckoutLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems } = useCart()

  // Verificar se o carrinho está vazio
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  const steps = [
    {
      number: 1,
      title: 'Carrinho',
      path: '/checkout/cart',
      icon: ShoppingCart
    },
    {
      number: 2,
      title: 'Endereço',
      path: '/checkout/address',
      icon: MapPin
    },
    {
      number: 3,
      title: 'Pagamento',
      path: '/checkout/payment',
      icon: CreditCard
    }
  ]

  const currentStepIndex = steps.findIndex(step => location.pathname.startsWith(step.path))
  const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 1

  return (
    <div className="min-h-screen">
      {/* Steps Indicator */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-700 mb-6 sticky top-14 z-40">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              const isClickable = currentStep >= step.number

              return (
                <div key={step.number} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <button
                    onClick={() => isClickable && navigate(step.path)}
                    disabled={!isClickable}
                    className={`
                      relative flex flex-col items-center gap-2 flex-shrink-0
                      ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        transition-all duration-300 border-2
                        ${isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : isActive
                          ? 'bg-primary-500 border-primary-500 text-white scale-110'
                          : 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-500'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check size={24} />
                      ) : (
                        <StepIcon size={20} />
                      )}
                    </div>
                    
                    {/* Step Label */}
                    <span
                      className={`
                        text-xs md:text-sm font-medium
                        ${isActive 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : isCompleted
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-neutral-500 dark:text-neutral-500'
                        }
                      `}
                    >
                      {step.title}
                    </span>
                  </button>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-4">
                      <div
                        className={`
                          h-full transition-all duration-300
                          ${currentStep > step.number
                            ? 'bg-green-500'
                            : 'bg-neutral-300 dark:bg-neutral-700'
                          }
                        `}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container-custom pb-8">
        <Outlet />
      </div>
    </div>
  )
}
