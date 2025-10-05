import { Check } from 'lucide-react'
import PropTypes from 'prop-types'

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Carrinho' },
    { number: 2, label: 'Entrega' },
    { number: 3, label: 'Pagamento' },
    { number: 4, label: 'Confirmação' }
  ]

  return (
    <div className="w-full py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number
                      ? 'text-gray-800'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Line connector */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

CheckoutSteps.propTypes = {
  currentStep: PropTypes.number.isRequired,
}

export default CheckoutSteps
