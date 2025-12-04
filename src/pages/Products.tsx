import { useEffect, useState } from 'react';
import { getProducts, getCategories, getWholesalers, getVariants, createVariant, updateVariant, deleteVariant, getBatches, createBatch, updateBatch, deleteBatch, createProduct, updateProduct, deleteProduct, getLowStockProducts, createWholesaler, mockProducts, mockCategories, mockWholesalers } from '../services/api';
import type { Product, Category, Wholesaler, Variant, Batch } from '../types/components';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>([]);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [apiWholesalers, setApiWholesalers] = useState<Wholesaler[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sellingPrice: '',
    buyingCost: '',
    brand: '',
    wholesalerId: '',
    stock: '',
    imageUrl: '',
  });

  // Variants state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [variantFormData, setVariantFormData] = useState({
    size: '',
    color: '',
    style: '',
    stock: '',
  });

  // Batches state
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [showBatchesModal, setShowBatchesModal] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [batchFormData, setBatchFormData] = useState({
    batchNumber: '',
    serialNumber: '',
    expirationDate: '',
    stock: '',
  });

  // Wholesaler modal state
  const [showWholesalerModal, setShowWholesalerModal] = useState(false);
  const [wholesalerFormData, setWholesalerFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
  });

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, wholesalersRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getWholesalers(),
      ]);

      // Store API data separately
      const apiCategoriesData = categoriesRes.data || [];
      const apiWholesalersData = wholesalersRes.data || [];

      setApiCategories(apiCategoriesData);
      setApiWholesalers(apiWholesalersData);

      // Show API data if available, otherwise show mock data for demo
      setProducts(productsRes.data && productsRes.data.length > 0 ? productsRes.data : mockProducts);

      // Combine static mock categories with dynamic API categories for display
      const combinedCategories = [...mockCategories];

      // Add API categories that don't already exist in mock data
      apiCategoriesData.forEach(apiCategory => {
        if (!combinedCategories.some(mockCategory => mockCategory.id === apiCategory.id)) {
          combinedCategories.push(apiCategory);
        }
      });

      setCategories(combinedCategories);

      // Combine static mock wholesalers with dynamic API wholesalers for display
      const combinedWholesalers = [...mockWholesalers];

      // Add API wholesalers that don't already exist in mock data
      apiWholesalersData.forEach(apiWholesaler => {
        if (!combinedWholesalers.some(mockWholesaler => mockWholesaler.id === apiWholesaler.id)) {
          combinedWholesalers.push(apiWholesaler);
        }
      });

      setWholesalers(combinedWholesalers);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fall back to mock data for demo purposes
      setProducts(mockProducts);
      setCategories(mockCategories);
      setWholesalers(mockWholesalers);
      setApiCategories([]);
      setApiWholesalers([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      sellingPrice: '',
      buyingCost: '',
      brand: '',
      wholesalerId: '',
      stock: '',
      imageUrl: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        sellingPrice: parseFloat(formData.sellingPrice),
        buyingCost: parseFloat(formData.buyingCost),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, productData);
      } else {
        // Create new product
        await createProduct(productData);
      }

      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      sellingPrice: product.sellingPrice.toString(),
      buyingCost: product.buyingCost.toString(),
      brand: product.brand || '',
      wholesalerId: product.wholesalerId,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const calculateMargin = (sellingPrice: number, buyingCost: number) => {
    if (buyingCost === 0) return 0;
    return ((sellingPrice - buyingCost) / buyingCost * 100).toFixed(2);
  };

  // Variant functions
  const handleManageVariants = async (product: Product) => {
    setSelectedProduct(product);
    try {
      const response = await getVariants(product.id);
      setVariants(response.data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    }
    setShowVariantsModal(true);
  };

  const resetVariantForm = () => {
    setVariantFormData({
      size: '',
      color: '',
      style: '',
      stock: '',
    });
    setEditingVariant(null);
  };

  const resetBatchForm = () => {
    setBatchFormData({
      batchNumber: '',
      serialNumber: '',
      expirationDate: '',
      stock: '',
    });
    setEditingBatch(null);
  };

  const resetWholesalerForm = () => {
    setWholesalerFormData({
      name: '',
      contact: '',
      email: '',
      address: '',
    });
  };

  const handleVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const variantData = {
        ...variantFormData,
        productId: selectedProduct.id,
        stock: parseInt(variantFormData.stock),
      };

      if (editingVariant) {
        await updateVariant(editingVariant.id, variantData);
      } else {
        await createVariant(variantData);
      }

      // Refresh variants
      const response = await getVariants(selectedProduct.id);
      setVariants(response.data || []);
      resetVariantForm();
    } catch (error) {
      console.error('Error saving variant:', error);
      alert('Failed to save variant');
    }
  };

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant);
    setVariantFormData({
      size: variant.size || '',
      color: variant.color || '',
      style: variant.style || '',
      stock: variant.stock.toString(),
    });
  };

  const handleDeleteVariant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    try {
      await deleteVariant(id);
      if (selectedProduct) {
        const response = await getVariants(selectedProduct.id);
        setVariants(response.data || []);
      }
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert('Failed to delete variant');
    }
  };

  // Batch functions
  const handleManageBatches = async (variant: Variant) => {
    setSelectedVariant(variant);
    try {
      const response = await getBatches(variant.id);
      setBatches(response.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
    }
    setShowBatchesModal(true);
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;
    try {
      const batchData = {
        ...batchFormData,
        variantId: selectedVariant.id,
        stock: parseInt(batchFormData.stock),
      };

      if (editingBatch) {
        await updateBatch(editingBatch.id, batchData);
      } else {
        await createBatch(batchData);
      }

      // Refresh batches
      const response = await getBatches(selectedVariant.id);
      setBatches(response.data || []);
      resetBatchForm();
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('Failed to save batch');
    }
  };

  const handleWholesalerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWholesaler = await createWholesaler(wholesalerFormData);
      // Refresh wholesalers list
      const wholesalersRes = await getWholesalers();
      const apiWholesalersData = wholesalersRes.data || [];
      setApiWholesalers(apiWholesalersData);

      // Update combined list for display
      const combinedWholesalers = [...mockWholesalers];
      apiWholesalersData.forEach(apiWholesaler => {
        if (!combinedWholesalers.some(mockWholesaler => mockWholesaler.id === apiWholesaler.id)) {
          combinedWholesalers.push(apiWholesaler);
        }
      });
      setWholesalers(combinedWholesalers);

      // Set the new wholesaler as selected
      setFormData({ ...formData, wholesalerId: newWholesaler.data.id });
      resetWholesalerForm();
      setShowWholesalerModal(false);
    } catch (error) {
      console.error('Error creating wholesaler:', error);
      alert('Failed to create wholesaler');
    }
  };

  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setBatchFormData({
      batchNumber: batch.batchNumber || '',
      serialNumber: batch.serialNumber || '',
      expirationDate: batch.expirationDate || '',
      stock: batch.stock.toString(),
    });
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      await deleteBatch(id);
      if (selectedVariant) {
        const response = await getBatches(selectedVariant.id);
        setBatches(response.data || []);
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Failed to delete batch');
    }
  };

  const handleShowLowStock = async () => {
    try {
      const response = await getLowStockProducts();
      setProducts(response.data && response.data.length > 0 ? response.data : []);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      alert('Failed to fetch low stock products');
    }
  };

  const handleRefresh = async () => {
    await fetchData();
  };

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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Products Management</h2>
        <div className="flex gap-2">
          <button
            onClick={handleShowLowStock}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Low Stock
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name, brand, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="">Select Category</option>
                {apiCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selling Price (KES)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buying Cost (KES)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.buyingCost}
                onChange={(e) => setFormData({ ...formData, buyingCost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wholesaler
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.wholesalerId}
                  onChange={(e) => setFormData({ ...formData, wholesalerId: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                  required
                >
                  <option value="">Select Wholesaler</option>
                  {apiWholesalers.map((wholesaler) => (
                    <option key={wholesaler.id} value={wholesaler.id}>
                      {wholesaler.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowWholesalerModal(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  title="Add new wholesaler"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Buying Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Wholesaler
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product.category?.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      KES {product.sellingPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      KES {product.buyingCost.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 dark:text-green-400">
                      {calculateMargin(product.sellingPrice, product.buyingCost)}%
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product.brand || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product.wholesaler?.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleManageVariants(product)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                    >
                      Variants
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No products found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Variants Modal */}
      {showVariantsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Manage Variants for {selectedProduct.name}
              </h3>
              <button
                onClick={() => setShowVariantsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Variant Form */}
            <form onSubmit={handleVariantSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  value={variantFormData.size}
                  onChange={(e) => setVariantFormData({ ...variantFormData, size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={variantFormData.color}
                  onChange={(e) => setVariantFormData({ ...variantFormData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Style
                </label>
                <input
                  type="text"
                  value={variantFormData.style}
                  onChange={(e) => setVariantFormData({ ...variantFormData, style: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={variantFormData.stock}
                  onChange={(e) => setVariantFormData({ ...variantFormData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingVariant ? 'Update Variant' : 'Add Variant'}
                </button>
                <button
                  type="button"
                  onClick={resetVariantForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Variants Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Style
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {variant.size || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {variant.color || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {variant.style || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {variant.stock}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditVariant(variant)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleManageBatches(variant)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                        >
                          Batches
                        </button>
                        <button
                          onClick={() => handleDeleteVariant(variant.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Batches Modal */}
      {showBatchesModal && selectedVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Manage Batches for {selectedVariant.size || selectedVariant.color || selectedVariant.style || 'Variant'}
              </h3>
              <button
                onClick={() => setShowBatchesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Batch Form */}
            <form onSubmit={handleBatchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Batch Number
                </label>
                <input
                  type="text"
                  value={batchFormData.batchNumber}
                  onChange={(e) => setBatchFormData({ ...batchFormData, batchNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={batchFormData.serialNumber}
                  onChange={(e) => setBatchFormData({ ...batchFormData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={batchFormData.expirationDate}
                  onChange={(e) => setBatchFormData({ ...batchFormData, expirationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={batchFormData.stock}
                  onChange={(e) => setBatchFormData({ ...batchFormData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-600 dark:text-gray-200"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingBatch ? 'Update Batch' : 'Add Batch'}
                </button>
                <button
                  type="button"
                  onClick={resetBatchForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Batches Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Batch Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Expiration Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {batch.batchNumber || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {batch.serialNumber || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {batch.expirationDate || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {batch.stock}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditBatch(batch)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(batch.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Wholesaler Modal */}
      {showWholesalerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Add New Wholesaler
              </h3>
              <button
                onClick={() => setShowWholesalerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWholesalerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={wholesalerFormData.name}
                  onChange={(e) => setWholesalerFormData({ ...wholesalerFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={wholesalerFormData.contact}
                  onChange={(e) => setWholesalerFormData({ ...wholesalerFormData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={wholesalerFormData.email}
                  onChange={(e) => setWholesalerFormData({ ...wholesalerFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={wholesalerFormData.address}
                  onChange={(e) => setWholesalerFormData({ ...wholesalerFormData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Add Wholesaler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetWholesalerForm();
                    setShowWholesalerModal(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}