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
  variants?: Variant[];
}

export interface Variant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  style?: string;
  stock: number;
  createdAt: string;
  product?: Product;
  batches?: Batch[];
}

export interface Batch {
  id: string;
  variantId: string;
  batchNumber?: string;
  serialNumber?: string;
  expirationDate?: string;
  stock: number;
  createdAt: string;
  variant?: Variant;
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

export interface Payment {
  id?: string;
  method: string;
  amount: number;
}

export interface ReceiptData {
  date: string;
  customer: string;
  items: ReceiptItem[];
  total: number;
  payments?: Payment[];
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
  payments?: Payment[];
}

// Offline Sale Types
export interface OfflineSale {
  id?: number;
  productId: string;
  customerId?: string | null;
  quantity: number;
  total: number;
}

// Employee & Role Management Types
export interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Shift {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  totalSales: number;
  totalHours?: number;
  customerSatisfaction?: number;
  createdAt: string;
  user?: User;
}

export interface Commission {
  id: string;
  shiftId: string;
  amount: number;
  createdAt: string;
  shift?: Shift;
}

export interface Performance {
  totalShifts: number;
  totalHours: number;
  totalSales: number;
  averageSalesPerShift: number;
  averageHoursPerShift: number;
  averageCustomerSatisfaction?: number;
  shifts?: Shift[];
}

// CRM Types
export interface Campaign {
  id: string;
  name: string;
  type: string;
  message: string;
  targetTiers?: string;
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
  user?: User;
}

export interface Feedback {
  id: string;
  customerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: Customer;
}

export interface Offer {
  id: string;
  customerId: string;
  type: string;
  description: string;
  discountPercent: number;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
  customer?: Customer;
}