import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../services/api';
import type { Product, Category } from '../types/components';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.categoryId === selectedCategory);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Shop Our Collection</h2>
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Cart: {cart.length} items - KES {getTotal().toFixed(2)}
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h3>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
              KES {product.sellingPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Brand: {product.brand || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Stock: {product.stock}
            </p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No products found in this category.
        </p>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Cart</h3>
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 dark:text-gray-100">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded text-sm hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded text-sm hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  KES {(item.sellingPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total:</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                KES {getTotal().toFixed(2)}
              </span>
            </div>
            <button
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}