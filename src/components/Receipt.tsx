import { forwardRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ReceiptData, ReceiptProps } from '../types/components';

function exportReceiptPDF(receipt: ReceiptData & { subtotal?: number; tax?: number; discount?: number; taxRate?: number; discountPercent?: number; payments?: Array<{ method: string; amount: number }>; change?: number }): void {
  const doc = new jsPDF();

  // Header with branding
  doc.setFontSize(20);
  doc.text('ROYAL GIBS BOUTIQUE', 14, 20);
  doc.setFontSize(12);
  doc.text('Fashion & Lifestyle', 14, 28);
  doc.text('Embu, Kenya', 14, 34);

  // Receipt details
  doc.setFontSize(10);
  doc.text(`Receipt #: ${Date.now()}`, 14, 45);
  doc.text(`Date: ${receipt.date}`, 14, 51);
  doc.text(`Customer: ${receipt.customer}`, 14, 57);

  // Items table
  autoTable(doc, {
    startY: 65,
    head: [['Item', 'Qty', 'Price', 'Total']],
    body: receipt.items.map((item: { name: string; quantity: number; total: number }) => [
      item.name,
      item.quantity.toString(),
      `KES ${(item.total / item.quantity).toFixed(2)}`,
      `KES ${item.total.toFixed(2)}`
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [255, 193, 7] }, // Amber color
  });

  const finalY = (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 85;

  // Financial breakdown
  let currentY = finalY + 10;
  if (receipt.subtotal) {
    doc.text(`Subtotal: KES ${receipt.subtotal.toFixed(2)}`, 14, currentY);
    currentY += 6;
  }
  if (receipt.tax) {
    doc.text(`Tax (${receipt.taxRate || 16}%): KES ${receipt.tax.toFixed(2)}`, 14, currentY);
    currentY += 6;
  }
  if (receipt.discount) {
    doc.text(`Discount (${receipt.discountPercent || 0}%): -KES ${receipt.discount.toFixed(2)}`, 14, currentY);
    currentY += 6;
  }

  // Total
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: KES ${receipt.total.toFixed(2)}`, 14, currentY + 5);
  currentY += 10;

  // Payments
  if (receipt.payments && receipt.payments.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Payments:', 14, currentY);
    currentY += 6;
    receipt.payments.forEach(payment => {
      doc.text(`${payment.method}: KES ${payment.amount.toFixed(2)}`, 14, currentY);
      currentY += 6;
    });
    if (receipt.change && receipt.change > 0) {
      doc.text(`Change: KES ${receipt.change.toFixed(2)}`, 14, currentY);
      currentY += 6;
    }
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping at Royal Gibs!', 14, currentY + 20);
  doc.text('Follow us @royalgibs', 14, currentY + 26);

  // QR Code placeholder (in a real implementation, you'd generate a QR code)
  doc.rect(150, currentY + 10, 30, 30);
  doc.setFontSize(6);
  doc.text('QR Code', 160, currentY + 25);

  doc.save(`RoyalGibs_Receipt_${Date.now()}.pdf`);
}

// Export the function separately to avoid fast refresh issues
// eslint-disable-next-line react-refresh/only-export-components
export { exportReceiptPDF };

// Simple printable receipt component. Exported as a named export `Receipt`.
export const Receipt = forwardRef<HTMLDivElement, ReceiptProps & { change?: number }>(({ cart = [], subtotal, tax, discount, total = 0, customer, taxRate, discountPercent, payments, change }, ref) => {
  const customerName = typeof customer === 'string' ? customer : customer?.name || 'Walk-in';

  return (
    <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', maxWidth: '300px', margin: '0 auto', padding: '10px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
        <h1 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>ROYAL GIBS BOUTIQUE</h1>
        <p style={{ margin: '2px 0', fontSize: '12px' }}>Fashion & Lifestyle</p>
        <p style={{ margin: '2px 0', fontSize: '10px' }}>Nairobi, Kenya</p>
      </div>

      {/* Receipt Details */}
      <div style={{ fontSize: '10px', marginBottom: '10px' }}>
        <p style={{ margin: '2px 0' }}>Receipt #: {Date.now()}</p>
        <p style={{ margin: '2px 0' }}>Date: {new Date().toLocaleString()}</p>
        <p style={{ margin: '2px 0' }}>Customer: {customerName}</p>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #000' }}>
            <th style={{ textAlign: 'left', padding: '4px 0' }}>Item</th>
            <th style={{ textAlign: 'center', padding: '4px 0' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '4px 0' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((it, idx) => (
            <tr key={idx}>
              <td style={{ padding: '2px 0' }}>{it.name}</td>
              <td style={{ textAlign: 'center', padding: '2px 0' }}>{it.quantity}</td>
              <td style={{ textAlign: 'right', padding: '2px 0' }}>KES {it.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Financial Breakdown */}
      <div style={{ fontSize: '10px', borderTop: '1px solid #000', paddingTop: '5px' }}>
        {subtotal && <p style={{ margin: '2px 0' }}>Subtotal: KES {subtotal.toFixed(2)}</p>}
        {tax && <p style={{ margin: '2px 0' }}>Tax ({taxRate || 16}%): KES {tax.toFixed(2)}</p>}
        {discount && <p style={{ margin: '2px 0' }}>Discount ({discountPercent || 0}%): -KES {discount.toFixed(2)}</p>}
        <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '12px', borderTop: '1px solid #000', paddingTop: '5px' }}>
          TOTAL: KES {total.toFixed(2)}
        </p>
        {payments && payments.length > 0 && (
          <div style={{ marginTop: '5px', fontSize: '10px' }}>
            <p style={{ margin: '2px 0', fontWeight: 'bold' }}>Payments:</p>
            {payments.map((payment, idx) => (
              <p key={idx} style={{ margin: '2px 0' }}>
                {payment.method}: KES {payment.amount.toFixed(2)}
              </p>
            ))}
            {change && change > 0 && (
              <p style={{ margin: '2px 0', fontWeight: 'bold' }}>
                Change: KES {change.toFixed(2)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: '9px', marginTop: '10px', borderTop: '1px dashed #000', paddingTop: '5px' }}>
        <p style={{ margin: '2px 0' }}>Thank you for shopping at Royal Gibs!</p>
        <p style={{ margin: '2px 0' }}>Follow us @royalgibs</p>
        {/* QR Code placeholder */}
        <div style={{ margin: '5px auto', width: '30px', height: '30px', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '6px' }}>QR</span>
        </div>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';
