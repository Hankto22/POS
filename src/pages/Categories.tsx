import { useEffect, useState } from 'react';
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
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please check your connection.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      if (!res.ok) throw new Error(`Failed to add category: ${res.status} ${res.statusText}`);
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
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
          <div key={cat.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No categories yet. Add your first category above!</p>
      )}
    </div>
  );
}
