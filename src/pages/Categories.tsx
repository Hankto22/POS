import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory, mockCategories } from '../services/api';
import type { Category } from '../types/components';

export default function Categories()
  {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCategories();
      // Show API data if available, otherwise show mock data for demo
      setCategories(response.data && response.data.length > 0 ? response.data : mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories from server. Showing demo data.');
      // Fall back to mock data for demo purposes
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createCategory(newCategory.trim());
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Style Categories</h2>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory((e.target as HTMLInputElement).value)}
          placeholder="New category name"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
          onKeyPress={e => e.key === 'Enter' && addCategory()}
          disabled={loading}
        />
        <button
          onClick={addCategory}
          disabled={!newCategory.trim() || loading}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(cat => (
          <div key={cat.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
            <button
              onClick={() => removeCategory(cat.id)}
              disabled={loading}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
              title="Remove Category"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No categories yet. Add your first category above!</p>
      )}
    </div>
  );
}
