import { useEffect, useRef, useState } from 'react';
import { getProducts, createSale, getCustomers, mockProducts, mockCustomers } from '../services/api';
import { Receipt, exportReceiptPDF } from '../components/Receipt';
import PaymentModal from '../components/PaymentModal';
import { useSync } from '../hooks/useSync';
import type { Product, Customer } from '../types/components';

export default function POS() {
  // ensure the sync hook runs at top of component
  useSync();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Array<Product & { quantity: number; discount?: number }>>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const taxRate = 16; // Default VAT for Kenya
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const receiptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          getProducts(),
          getCustomers()
        ]);
        // Show API data if available, otherwise show mock data for demo
        setProducts(productsRes.data && productsRes.data.length > 0 ? productsRes.data : mockProducts);
        setCustomers(customersRes.data && customersRes.data.length > 0 ? customersRes.data : mockCustomers);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fall back to mock data for demo purposes
        setProducts(mockProducts);
        setCustomers(mockCustomers);
      }
    };
    fetchData();
  }, []);

  const addToCart = (product: Product) => {
    // Business rule: Check if product is in stock
    if (product.stock <= 0) {
      alert(`${product.name} is out of stock!`);
      return;
    }

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      // Business rule: Don't allow adding more than available stock
      if (exists.quantity >= product.stock) {
        alert(`Cannot add more ${product.name}. Only ${product.stock} available in stock.`);
        return;
      }
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const scanProduct = () => {
    const product = products.find(p => p.id === barcodeInput || p.name.toLowerCase().includes(barcodeInput.toLowerCase()));
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found');
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      // Business rule: Check stock availability when updating quantity
      const product = products.find(p => p.id === productId);
      if (product && newQuantity > product.stock) {
        alert(`Cannot set quantity to ${newQuantity}. Only ${product.stock} available in stock.`);
        return;
      }
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const applyDiscount = () => {
    // Business logic: Enhanced discount system
    const code = discountCode.toUpperCase().trim();
    if (code === 'SAVE10') {
      setAppliedDiscount(10); // 10% discount
      alert('10% discount applied!');
    } else if (code === 'SAVE20') {
      setAppliedDiscount(20); // 20% discount
      alert('20% discount applied!');
    } else if (code === 'LOYALTY5') {
      // Business rule: Loyalty discount for returning customers
      if (customerId) {
        setAppliedDiscount(5);
        alert('5% loyalty discount applied for returning customer!');
      } else {
        alert('Loyalty discount requires customer selection');
      }
    } else if (code === 'BULK15') {
      // Business rule: Bulk purchase discount
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (totalItems >= 5) {
        setAppliedDiscount(15);
        alert('15% bulk purchase discount applied!');
      } else {
        alert('Bulk discount requires at least 5 items');
      }
    } else {
      alert('Invalid discount code. Available codes: SAVE10, SAVE20, LOYALTY5, BULK15');
    }
  };

  const getSubtotal = () =>
    cart.reduce((sum: number, item) => sum + (item.sellingPrice || 0) * (item.quantity || 0), 0);

  const getTaxAmount = () => (getSubtotal() * taxRate) / 100;

  const getDiscountAmount = () => (getSubtotal() * appliedDiscount) / 100;

  const getTotal = () => getSubtotal() + getTaxAmount() - getDiscountAmount();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentMethod: string, amountPaid: number) => {
    try {
      // Validate stock availability before processing sales
      for (const item of cart) {
        if (item.stock < item.quantity) {
          alert(`Insufficient stock for ${item.name}. Available: ${item.stock}`);
          return;
        }
      }

      // Process each sale with business logic
      for (const item of cart) {
        await createSale({
          productId: item.id,
          customerId: customerId || null,
          quantity: item.quantity,
          total: item.sellingPrice * item.quantity,
        });
      }

      // Calculate business metrics
      const subtotal = getSubtotal();
      const taxAmount = getTaxAmount();
      const discountAmount = getDiscountAmount();
      const total = getTotal();

      alert(`Sale completed successfully!\nSubtotal: KES ${subtotal.toFixed(2)}\nTax (${taxRate}%): KES ${taxAmount.toFixed(2)}\nDiscount: KES ${discountAmount.toFixed(2)}\nTotal: KES ${total.toFixed(2)}\nPayment method: ${paymentMethod}\nAmount paid: KES ${amountPaid.toFixed(2)}\nChange: KES ${(amountPaid - total).toFixed(2)}`);

      // Reset cart and form
      setCart([]);
      setCustomerId('');
      setDiscountCode('');
      setAppliedDiscount(0);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to complete sale. Please try again.');
    }
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;
    const html = receiptRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(`<html><head><title>Receipt</title></head><body>${html}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExportPDF = () => {
    const receiptData = {
      date: new Date().toLocaleString(),
      customer: customers.find(c => c.id === customerId)?.name || 'Walk-in',
      items: cart.map((item) => ({ name: item.name, quantity: item.quantity, total: item.sellingPrice * item.quantity })),
      subtotal: getSubtotal(),
      tax: getTaxAmount(),
      discount: getDiscountAmount(),
      total: getTotal(),
      taxRate,
      discountPercent: appliedDiscount,
    };
    exportReceiptPDF(receiptData);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">POS Terminal</h2>

      {/* Barcode Scanner */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Scan Barcode or Search Product
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && scanProduct()}
            placeholder="Scan barcode or type product name..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            onClick={scanProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Customer Selection & Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Customer
          </label>
          <select
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter discount code..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={applyDiscount}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Apply
            </button>
          </div>
          {appliedDiscount > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {appliedDiscount}% discount applied
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{p.name}</h3>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-1">KES {p.sellingPrice}</p>
            <p className="text-sm text-green-600 dark:text-green-400 mb-3">
              Margin: {p.buyingCost > 0 ? ((p.sellingPrice - p.buyingCost) / p.buyingCost * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Stock: {p.stock}</p>
            <button
              onClick={() => addToCart(p)}
              disabled={p.stock <= 0}
              className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {p.stock <= 0 ? 'Out of Stock' : `Add to Cart (Stock: ${p.stock})`}
            </button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Cart</h3>

        {cart.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">Cart is empty</p>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-gray-100">
                      {item.name}
                    </span>
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
                    KES {item.sellingPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    KES {getSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tax ({taxRate}%):</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    KES {getTaxAmount().toFixed(2)}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600 dark:text-green-400">Discount ({appliedDiscount}%):</span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      -KES {getDiscountAmount().toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    KES {getTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Sale
                </button>
                <button
                  onClick={handlePrint}
                  disabled={cart.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={cart.length === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden printable receipt area */}
      <div className="hidden">
        <div ref={receiptRef}>
          <Receipt
            cart={cart.map((it) => ({ name: it.name, quantity: it.quantity, total: it.sellingPrice * it.quantity }))}
            subtotal={getSubtotal()}
            tax={getTaxAmount()}
            discount={getDiscountAmount()}
            total={getTotal()}
            customer={customers.find(c => c.id === customerId) || 'Walk-in'}
            taxRate={taxRate}
            discountPercent={appliedDiscount}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={getTotal()}
        customer={customers.find(c => c.id === customerId) || 'Walk-in'}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
