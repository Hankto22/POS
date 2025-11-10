import { useEffect, useState } from 'react';
import { exportReceiptPDF } from '../components/Receipt';
import type { ReceiptData } from '../types/components';

export default function ReceiptHistory() {
  const [history, setHistory] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('receiptHistory') || '[]');
      setHistory(saved);
    } catch (error) {
      console.error('Error loading receipt history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Receipt History</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Receipt History</h2>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📜</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No receipts found.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Your completed sales will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.map((receipt, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {receipt.date}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {receipt.customer || 'Walk-in Customer'}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-1 mb-3">
                {receipt.items.slice(0, 3).map((item, j) => (
                  <div key={j} className="text-xs text-gray-600 dark:text-gray-400">
                    {item.name} × {item.quantity}
                  </div>
                ))}
                {receipt.items.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    +{receipt.items.length - 3} more items
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  KES {receipt.total?.toLocaleString() || receipt.total}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => exportReceiptPDF(receipt)}
                className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
                📄 Export PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
