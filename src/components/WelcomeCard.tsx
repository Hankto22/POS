import { Link } from 'react-router-dom';
import type { WelcomeCardProps } from '../types/components';

export default function WelcomeCard({ frostedOverlay = true }: WelcomeCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in px-4">
      <div className={`${
        frostedOverlay
          ? 'backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border-white/30 dark:border-gray-700/30'
          : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700'
      } shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-2xl text-center border transition-all duration-300 hover:shadow-3xl`}>
        <div className="flex justify-center mb-6">
          <span className="text-6xl md:text-7xl animate-bounce">🛍️</span>
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight">
          Welcome to <span className="text-amber-600 dark:text-amber-400">ThriftPOS</span>
        </h1>

        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
          Manage your boutique's products, customers & sales with ease — fast, simple, and beautiful.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/pos"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white font-semibold rounded-full shadow-lg hover:bg-amber-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>💰</span>
            <span>Sell Mode</span>
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>🛍️</span>
            <span>Buy Mode</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 dark:bg-gray-700/50 text-gray-900 dark:text-white font-semibold rounded-full shadow-lg hover:bg-white/30 dark:hover:bg-gray-600/50 transition-all duration-300 border border-white/30 dark:border-gray-600/50"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl mb-1">📦</div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Products</div>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Customers</div>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Sales</div>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
}