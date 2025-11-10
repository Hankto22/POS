import { useEffect, useState } from 'react';
import { getCustomers, getSales } from '../services/api';
import type { Customer, Sale } from '../types/components';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerHistory, setCustomerHistory] = useState<Sale[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, salesRes] = await Promise.all([
          getCustomers(),
          getSales()
        ]);
        setCustomers(customersRes.data || []);
        setSales(salesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCustomers([]);
        setSales([]);
      }
    };
    fetchData();
  }, []);

  const viewCustomerHistory = (customer: Customer) => {
    const history = sales.filter(sale => sale.customerId === customer.id);
    setSelectedCustomer(customer);
    setCustomerHistory(history);
    setShowHistory(true);
  };

  const getCustomerStats = (customer: Customer) => {
    const customerSales = sales.filter(sale => sale.customerId === customer.id);
    const totalSpent = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = customerSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const lastVisit = customerSales.length > 0 ?
      new Date(Math.max(...customerSales.map(s => new Date(s.createdAt || '').getTime()))) : null;

    return { totalSpent, totalItems, lastVisit, visitCount: customerSales.length };
  };

  if (showHistory && selectedCustomer) {
    const stats = getCustomerStats(selectedCustomer);

    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHistory(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Customers
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {selectedCustomer.name}'s Profile
          </h2>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              KES {stats.totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Items Purchased</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalItems}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit Count</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.visitCount}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Loyalty Points</h3>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {selectedCustomer.loyaltyPoints || 0}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Membership Tier</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedCustomer.membershipTier === 'Platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                selectedCustomer.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                selectedCustomer.membershipTier === 'Silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              }`}>
                {selectedCustomer.membershipTier}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Visit</label>
              <p className="text-gray-900 dark:text-gray-100">
                {stats.lastVisit ? stats.lastVisit.toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Spent</label>
              <p className="text-gray-900 dark:text-gray-100">KES {selectedCustomer.totalSpent?.toLocaleString() || '0'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.preferences || 'None specified'}</p>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Purchase History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customerHistory.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(sale.createdAt || '').toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {sale.product?.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {sale.quantity}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        KES {sale.total.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {customerHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No purchase history found
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Customers</h2>

      {customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No customers yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Membership</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Visit Count</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Loyalty Points</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {customers.map(c => {
                const stats = getCustomerStats(c);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{c.phone}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.membershipTier === 'Platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        c.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        c.membershipTier === 'Silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {c.membershipTier || 'Bronze'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      KES {(c.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {stats.visitCount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        {c.loyaltyPoints || 0} pts
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => viewCustomerHistory(c)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View History
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
