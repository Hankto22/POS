import { useEffect, useState } from 'react';
import { getSales } from '../services/api';
import type { Sale } from '../types/components';

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await getSales();
        setSales(res.data || []);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setSales([]);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Sales History</h2>

      {sales.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No sales recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{s.product?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{s.customer?.name || 'Walk-in'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{s.quantity}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">KES {s.total}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
