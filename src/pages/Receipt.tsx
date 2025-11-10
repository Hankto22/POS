import type { ReceiptProps } from '../types/components';

export default function Receipt({ cart = [], total = 0, customer }: ReceiptProps = {}) {
  const now = new Date().toLocaleString();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 w-full max-w-sm mx-auto text-sm font-mono border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">ThriftPOS</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">{now}</p>
      </div>

      {/* Customer Info */}
      {customer && (
        <div className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          <p className="text-gray-700 dark:text-gray-300">
            Customer: <span className="font-semibold text-gray-900 dark:text-gray-100">
              {typeof customer === 'string' ? customer : customer.name}
            </span>
          </p>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2 mb-4">
        {cart.map((item) => (
          <div key={item.name} className="flex justify-between items-center py-1">
            <span className="text-gray-700 dark:text-gray-300">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              KES {item.total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900 dark:text-gray-100">Total:</span>
          <span className="font-bold text-lg text-green-600 dark:text-green-400">
            KES {total?.toLocaleString() || total}
          </span>
        </div>
      </div>

      {/* Thank you message */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        Thank you for shopping with us!
      </div>
    </div>
  );
}
