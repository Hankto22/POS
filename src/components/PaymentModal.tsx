import { useState } from 'react';
import type { Customer, Payment } from '../types/components';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  customer?: string | Customer;
  onPaymentComplete: (payments: Payment[], change: number) => void;
}

export default function PaymentModal({ isOpen, onClose, total, customer, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [amountPaid, setAmountPaid] = useState<string>(total.toString());
  const [mpesaNumber, setMpesaNumber] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVV, setCardCVV] = useState<string>('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<string>('cash');
  const [currentAmount, setCurrentAmount] = useState<string>('');

  const handlePayment = () => {
    if (paymentMethod === 'mixed') {
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      if (totalPaid < total) {
        alert('Total amount paid is less than total');
        return;
      }
      const change = Math.max(0, totalPaid - total);
      onPaymentComplete(payments, change);
    } else {
      const amount = parseFloat(amountPaid);
      if (amount < total) {
        alert('Amount paid is less than total');
        return;
      }
      const change = Math.max(0, amount - total);
      onPaymentComplete([{ method: paymentMethod, amount }], change);
    }
    onClose();
    resetForm();
  };

  const addPayment = () => {
    const amount = parseFloat(currentAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newPayment: Payment = { method: currentPaymentMethod, amount };
    setPayments([...payments, newPayment]);
    setCurrentAmount('');
    setCurrentPaymentMethod('cash');
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setPaymentMethod('cash');
    setAmountPaid(total.toString());
    setMpesaNumber('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setPayments([]);
    setCurrentPaymentMethod('cash');
    setCurrentAmount('');
  };

  const getTotalPaid = () => {
    if (paymentMethod === 'mixed') {
      return payments.reduce((sum, p) => sum + p.amount, 0);
    }
    return parseFloat(amountPaid) || 0;
  };

  const getChange = () => {
    return Math.max(0, getTotalPaid() - total);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Payment</h3>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400">Customer:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {typeof customer === 'string' ? customer : customer?.name || 'Walk-in'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              KES {total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mpesa">M-Pesa</option>
            <option value="mixed">Mixed Payment</option>
          </select>
        </div>

        {paymentMethod === 'mixed' ? (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Payments</h4>

            {/* Add Payment Form */}
            <div className="flex gap-2 mb-3">
              <select
                value={currentPaymentMethod}
                onChange={(e) => setCurrentPaymentMethod(e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mpesa">M-Pesa</option>
              </select>
              <input
                type="number"
                step="0.01"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
              />
              <button
                onClick={addPayment}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Payment List */}
            {payments.length > 0 && (
              <div className="space-y-1 mb-3">
                {payments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm capitalize">{payment.method}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">KES {payment.amount.toFixed(2)}</span>
                      <button
                        onClick={() => removePayment(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Paid */}
            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900 rounded">
              <span className="text-sm font-medium">Total Paid:</span>
              <span className="text-sm font-bold">KES {getTotalPaid().toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <>
            {paymentMethod === 'mpesa' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  M-Pesa Number
                </label>
                <input
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="07XXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount Paid
              </label>
              <input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
          </>
        )}

        {getChange() > 0 && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-green-800 dark:text-green-200">Change:</span>
              <span className="font-bold text-green-800 dark:text-green-200">
                KES {getChange().toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handlePayment}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Payment
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}