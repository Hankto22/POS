import { useEffect, useState } from 'react';
import { exportReceiptPDF } from '../components/Receipt';
import type { ReceiptData } from '../types/components';

export default function LastReceipt() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lastReceipt');
      if (saved) {
        setReceipt(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading last receipt:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Last Receipt</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Last Receipt</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🧾</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No recent receipt found.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Complete a sale to see your last receipt here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Last Receipt</h2>

      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 font-mono text-sm">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">ThriftPOS</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{receipt.date}</p>
          </div>

          {/* Customer Info */}
          {receipt.customer && (
            <div className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
              <p className="text-gray-700 dark:text-gray-300">
                Customer: <span className="font-semibold text-gray-900 dark:text-gray-100">{receipt.customer}</span>
              </p>
            </div>
          )}

          {/* Items */}
          <div className="space-y-2 mb-4">
            {receipt.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-gray-700 dark:text-gray-300">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  KES {item.total?.toLocaleString() || item.total}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 dark:text-gray-100">Total:</span>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                KES {receipt.total?.toLocaleString() || receipt.total}
              </span>
            </div>
          </div>

          {/* Thank you message */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            Thank you for shopping with us!
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={() => exportReceiptPDF(receipt)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
