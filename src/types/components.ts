// Component Props Interfaces
export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  darkMode: boolean;
}

export interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export interface SettingsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  enhancedBg: boolean;
  setEnhancedBg: (value: boolean) => void;
  frostedOverlay: boolean;
  setFrostedOverlay: (value: boolean) => void;
}

export interface FrostedCardProps {
  children: React.ReactNode;
  frostedOverlay: boolean;
}

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'amber' | 'gray';
  fullScreen?: boolean;
}

export interface PageNavButtonsProps {
  className?: string;
}

export interface WelcomeCardProps {
  frostedOverlay?: boolean;
}

export interface NavLink {
  to: string;
  label: string;
  icon: string;
}

// Theme related types
export type ThemeMode = 'light' | 'dark';

// API Response Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferences?: string;
  loyaltyPoints: number;
  membershipTier: string;
  totalSpent: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  sellingPrice: number;
  buyingCost: number;
  brand?: string;
  wholesalerId: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  category?: Category;
  wholesaler?: Wholesaler;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  products?: Product[];
}

export interface Wholesaler {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id?: string;
  invoiceId?: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  product?: Product;
}

export interface Invoice {
  id?: string;
  wholesalerId: string;
  totalAmount: number;
  invoiceDate: string;
  createdAt?: string;
  wholesaler?: Wholesaler;
  items?: InvoiceItem[];
}

export interface Sale {
  id?: string;
  productId: string;
  customerId?: string | null;
  quantity: number;
  total: number;
  createdAt?: string;
  product?: Product;
  customer?: Customer;
}

export interface DashboardStats {
  totalRevenue: number;
  customerCount: number;
  topProducts: Array<{
    name: string;
    stock: number;
  }>;
  revenueTrend: Array<{
    label: string;
    total: number;
  }>;
}

// Receipt Types
export interface ReceiptItem {
  name: string;
  quantity: number;
  total: number;
}

export interface ReceiptData {
  date: string;
  customer: string;
  items: ReceiptItem[];
  total: number;
}

export interface ReceiptProps {
  cart?: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  customer?: string | Customer;
  taxRate?: number;
  discountPercent?: number;
}

// Offline Sale Types
export interface OfflineSale {
  id?: number;
  productId: string;
  customerId?: string | null;
  quantity: number;
  total: number;
}