export const mockCategories = [
  { id: 'cat-boho', name: 'Boho' },
  { id: 'cat-formal', name: 'Formal' },
  { id: 'cat-casual', name: 'Casual' },
  { id: 'cat-evening', name: 'Evening Wear' },
  { id: 'cat-accessories', name: 'Accessories' },
];

export const mockProducts = [
  {
    id: 'prod-001',
    name: 'Floral Maxi Dress',
    categoryId: 'cat-boho',
    price: 4500,
    stock: 12,
    imageUrl: '/assets/maxi.jpg',
  },
  {
    id: 'prod-002',
    name: 'Black Blazer',
    categoryId: 'cat-formal',
    price: 6200,
    stock: 8,
    imageUrl: '/assets/blazer.jpg',
  },
];

export const mockCustomers = [
  {
    id: 'cust-001',
    name: 'Zawadi M.',
    phone: '+254712345678',
    email: 'zawadi@gibs.com',
    preferences: 'Boho, Accessories',
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
import type { Customer, Product, Category, Sale, DashboardStats, Wholesaler, Invoice } from '../types/components';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // adjust for your backend
});

// Customers
export const getCustomers = () => api.get<Customer[]>('/customers');
export const createCustomer = (customer: Customer) => api.post<Customer>('/customers', customer);

// Sales
export const getSales = () => api.get<Sale[]>('/sales');
export const createSale = (sale: Sale) => api.post<Sale>('/sales', sale);

// Products
export const getProducts = () => api.get<Product[]>('/products');
export const createProduct = (product: Product) => api.post<Product>('/products', product);

// Categories
export const getCategories = () => api.get<Category[]>('/categories');
export const createCategory = (name: string) => api.post('/categories', { name });

// Wholesalers
export const getWholesalers = () => api.get<Wholesaler[]>('/wholesalers');
export const createWholesaler = (wholesaler: Wholesaler) => api.post<Wholesaler>('/wholesalers', wholesaler);

// Invoices
export const getInvoices = () => api.get<Invoice[]>('/invoices');
export const createInvoice = (invoice: Invoice) => api.post<Invoice>('/invoices', invoice);

export const getDashboardStats = () => api.get<DashboardStats>('/dashboard');
