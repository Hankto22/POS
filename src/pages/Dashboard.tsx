import { useEffect, useState } from 'react';
import { getDashboardStats, getProducts } from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { DashboardStats, Product } from '../types/components';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    customerCount: 0,
    topProducts: [],
    revenueTrend: [],
  });

  const [filter, setFilter] = useState<string>('month');
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes] = await Promise.all([
          getDashboardStats(),
          getProducts()
        ]);

        setStats(statsRes.data || {});

        // Check for low stock products (less than 5 items)
        const lowStock = productsRes.data.filter((product: Product) => product.stock < 5);
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({
          totalRevenue: 0,
          customerCount: 0,
          topProducts: [],
          revenueTrend: [],
        });
        setLowStockProducts([]);
      }
    };
    fetchData();
  }, [filter]);

  const lineData = {
    labels: (stats.revenueTrend || []).map((r) => r.label),
    datasets: [
      {
        label: 'Revenue',
        data: (stats.revenueTrend || []).map((r) => r.total),
        borderColor: '#10b981',
        backgroundColor: '#d1fae5',
      },
    ],
  };

  const barData = {
    labels: (stats.topProducts || []).map((p) => p.name),
    datasets: [
      {
        label: 'Stock Remaining',
        data: (stats.topProducts || []).map((p) => p.stock),
        backgroundColor: '#6366f1',
      },
    ],
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h2>
        {lowStockProducts.length > 0 && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg">
            <span className="font-semibold">⚠️ Low Stock Alert:</span> {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} need{lowStockProducts.length === 1 ? 's' : ''} restocking
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'week'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setFilter('month')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'month'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setFilter('year')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'year'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          This Year
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            KES {stats.totalRevenue?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.customerCount || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {lowStockProducts.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Top Product Stock</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.topProducts?.[0]?.stock || 0}
          </p>
        </div>
      </div>

      {/* Low Stock Alert Details */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">⚠️ Low Stock Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-red-200 dark:border-red-700">
                <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                <div className="text-sm text-red-600 dark:text-red-400">Only {product.stock} left in stock</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Supplier: {product.wholesaler?.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      color: 'rgb(156, 163, 175)',
                      callback: function(value) {
                        return 'KES ' + value;
                      }
                    }
                  },
                  x: {
                    ticks: {
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Top Products by Stock</h3>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      color: 'rgb(156, 163, 175)'
                    }
                  },
                  x: {
                    ticks: {
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
