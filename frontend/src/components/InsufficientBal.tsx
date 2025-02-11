import { X, AlertCircle } from "lucide-react"

interface InsufficientBalanceProps {
  isOpen: boolean
  onClose: () => void
}

export const InsufficientBalance = ({ isOpen, onClose }: InsufficientBalanceProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4">
        <div className="p-6 flex flex-col items-center">
          <div className="mb-4 text-red-500">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Insufficient Balance</h2>
          <p className="text-gray-600 text-center mb-6">
            Oops! It looks like you don't have enough funds to complete this transaction.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  )
}

