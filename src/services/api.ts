export const mockCategories = [
  { id: 'cat-boho', name: 'Boho', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-formal', name: 'Formal', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-casual', name: 'Casual', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-evening', name: 'Evening Wear', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'cat-accessories', name: 'Accessories', createdAt: '2025-01-01T00:00:00Z' },
];

export const mockWholesalers: Wholesaler[] = [
  { id: 'wholesale-001', name: 'Fashion Wholesale Co', contact: '+254700000000', email: 'contact@fashionwholesale.com', address: 'Nairobi CBD', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'wholesale-002', name: 'Premium Accessories Ltd', contact: '+254711111111', email: 'sales@premiumacc.com', address: 'Westlands, Nairobi', createdAt: '2025-01-01T00:00:00Z' },
];

export const mockProducts = [
  {
    id: 'prod-001',
    name: 'Floral Maxi Dress',
    categoryId: 'cat-boho',
    sellingPrice: 4500,
    buyingCost: 3000,
    brand: 'Local Designer',
    wholesalerId: 'wholesale-001',
    stock: 12,
    imageUrl: '/assets/maxi.jpg',
    createdAt: '2025-01-01T00:00:00Z',
    category: { id: 'cat-boho', name: 'Boho', createdAt: '2025-01-01T00:00:00Z' },
    wholesaler: { id: 'wholesale-001', name: 'Fashion Wholesale Co', contact: '+254700000000', email: 'contact@fashionwholesale.com', createdAt: '2025-01-01T00:00:00Z' },
  },
  {
    id: 'prod-002',
    name: 'Black Blazer',
    categoryId: 'cat-formal',
    sellingPrice: 6200,
    buyingCost: 4000,
    brand: 'Premium Brand',
    wholesalerId: 'wholesale-001',
    stock: 8,
    imageUrl: '/assets/blazer.jpg',
    createdAt: '2025-01-01T00:00:00Z',
    category: { id: 'cat-formal', name: 'Formal', createdAt: '2025-01-01T00:00:00Z' },
    wholesaler: { id: 'wholesale-001', name: 'Fashion Wholesale Co', contact: '+254700000000', email: 'contact@fashionwholesale.com', createdAt: '2025-01-01T00:00:00Z' },
  },
  {
    id: 'prod-003',
    name: 'Denim Jacket',
    categoryId: 'cat-casual',
    sellingPrice: 3800,
    buyingCost: 2500,
    brand: 'Casual Wear',
    wholesalerId: 'wholesale-002',
    stock: 15,
    imageUrl: '/assets/denim.jpg',
    createdAt: '2025-01-01T00:00:00Z',
    category: { id: 'cat-casual', name: 'Casual', createdAt: '2025-01-01T00:00:00Z' },
    wholesaler: { id: 'wholesale-002', name: 'Premium Accessories Ltd', contact: '+254711111111', email: 'sales@premiumacc.com', createdAt: '2025-01-01T00:00:00Z' },
  },
  {
    id: 'prod-004',
    name: 'Gold Hoop Earrings',
    categoryId: 'cat-accessories',
    sellingPrice: 1200,
    buyingCost: 800,
    brand: 'Jewelry Co',
    wholesalerId: 'wholesale-002',
    stock: 25,
    imageUrl: '/assets/hoops.jpg',
    createdAt: '2025-01-01T00:00:00Z',
    category: { id: 'cat-accessories', name: 'Accessories', createdAt: '2025-01-01T00:00:00Z' },
    wholesaler: { id: 'wholesale-002', name: 'Premium Accessories Ltd', contact: '+254711111111', email: 'sales@premiumacc.com', createdAt: '2025-01-01T00:00:00Z' },
  },
];

export const mockCustomers = [
  {
    id: 'cust-001',
    name: 'Zawadi M.',
    phone: '+254712345678',
    email: 'zawadi@gibs.com',
    preferences: 'Boho, Accessories',
    loyaltyPoints: 150,
    membershipTier: 'Gold',
    totalSpent: 25000,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cust-002',
    name: 'Faith K.',
    phone: '+254798765432',
    email: 'faith@gibs.com',
    preferences: 'Formal, Evening Wear',
    loyaltyPoints: 200,
    membershipTier: 'Platinum',
    totalSpent: 45000,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export const mockSales = [
  {
    id: 'sale-001',
    productId: 'prod-001',
    customerId: 'cust-001',
    quantity: 1,
    total: 4500,
    createdAt: '2025-11-07T14:30:00',
  },
];

import axios from 'axios';
import type { Customer, Product, Category, Sale, DashboardStats, Wholesaler, Invoice, Variant, Batch, Campaign, Feedback, Offer } from '../types/components';

const api = axios.create({
  baseURL: '/api', // Vite proxy will forward to backend
});

// Customers
export const getCustomers = () => api.get<Customer[]>('/customers');
export const createCustomer = (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'createdAt'>) => api.post<Customer>('/customers', customer);

// Sales
export const getSales = () => api.get<Sale[]>('/sales');
export const createSale = (sale: Sale) => api.post<Sale>('/sales', sale);
export const getTransactions = () => api.get('/sales/transactions');
export const createTransaction = (transaction: any) => api.post('/sales/transaction', transaction);

// Products
export const getProducts = () => api.get<Product[]>('/products');
export const getLowStockProducts = (threshold?: number) => api.get<Product[]>(`/products/low-stock${threshold ? `?threshold=${threshold}` : ''}`);
export const createProduct = (product: Omit<Product, 'id' | 'createdAt'>) => api.post<Product>('/products', product);
export const updateProduct = (id: string, product: Partial<Product>) => api.put<Product>(`/products/${id}`, product);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Variants
export const getVariants = (productId: string) => api.get<Variant[]>(`/products/${productId}/variants`);
export const createVariant = (variant: any) => api.post<Variant>('/products/variants', variant);
export const updateVariant = (id: string, variant: any) => api.put(`/products/variants/${id}`, variant);
export const deleteVariant = (id: string) => api.delete(`/products/variants/${id}`);
export const updateVariantStock = (id: string, stock: number) => api.put(`/products/variants/${id}/stock`, { stock });

// Batches
export const getBatches = (variantId: string) => api.get<Batch[]>(`/products/${variantId}/batches`);
export const createBatch = (batch: Omit<Batch, 'id' | 'createdAt' | 'variant'>) => api.post<Batch>('/products/batches', batch);
export const updateBatch = (id: string, batch: Partial<Omit<Batch, 'id' | 'createdAt' | 'variant'>>) => api.put(`/products/batches/${id}`, batch);
export const deleteBatch = (id: string) => api.delete(`/products/batches/${id}`);
export const updateBatchStock = (id: string, stock: number) => api.put(`/products/batches/${id}/stock`, { stock });

// Categories
export const getCategories = () => api.get<Category[]>('/categories');
export const createCategory = (name: string) => api.post('/categories', { name });
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);

// Wholesalers
export const getWholesalers = () => api.get<Wholesaler[]>('/wholesalers');
export const createWholesaler = (wholesaler: Omit<Wholesaler, 'id' | 'createdAt'>) => api.post<Wholesaler>('/wholesalers', wholesaler);

// Invoices
export const getInvoices = () => api.get<Invoice[]>('/invoices');
export const createInvoice = (invoice: Invoice) => api.post<Invoice>('/invoices', invoice);

export const getDashboardStats = () => api.get<DashboardStats>('/dashboard');

// Auth
export const login = (credentials: { username: string; password: string }) => api.post('/auth/login', credentials);

// Shifts
export const getAllShifts = () => api.get('/shifts');
export const startShift = () => api.post('/shifts/start');
export const endShift = (shiftId: string, data: { customerSatisfaction?: number }) => api.put(`/shifts/${shiftId}/end`, data);

// Performance
export const getAllPerformances = () => api.get('/performance');

// Commissions
export const getAllCommissions = () => api.get('/commissions');

// CRM
export const getCampaigns = () => api.get<Campaign[]>('/customers/campaigns');
export const createCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt' | 'createdBy'>) => api.post<Campaign>('/customers/campaigns', campaign);
export const sendCampaign = (id: string) => api.post(`/customers/campaigns/${id}/send`);

export const getFeedbacks = () => api.get<Feedback[]>('/customers/feedback');
export const createFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => api.post<Feedback>('/customers/feedback', feedback);

export const getOffers = () => api.get<Offer[]>('/customers/offers');
export const updateOffer = (id: string, offer: Partial<Offer>) => api.put(`/customers/offers/${id}`, offer);

export const triggerBirthdayOffers = () => api.post('/customers/trigger-birthday-offers');
export const triggerVIPOffers = () => api.post('/customers/trigger-vip-offers');
