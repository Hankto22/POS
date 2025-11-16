import { useLocation, useNavigate } from 'react-router-dom';
import type { PageNavButtonsProps } from '../types/components';

const pageOrder = [
  '/shop',
  '/categories',
  '/products',
  '/customers',
  '/pos',
  '/sales',
  '/receipt',
  '/receipt-history',
  '/last-receipt'
];

export function PageNavButtons({ className = '' }: PageNavButtonsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const idx = pageOrder.indexOf(location.pathname);

  if (idx === -1) return null;

  return (
    <div className={`flex justify-between items-center mt-8 gap-4 ${className}`}>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 transition-colors"
        onClick={() => navigate(pageOrder[idx - 1])}
        disabled={idx === 0}
        aria-label="Go to previous page"
      >
        <span>⬅️</span>
        <span>Back</span>
      </button>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {idx + 1} of {pageOrder.length}
      </div>

      <button
        className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg shadow hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 transition-colors"
        onClick={() => navigate(pageOrder[idx + 1])}
        disabled={idx === pageOrder.length - 1}
        aria-label="Go to next page"
      >
        <span>Next</span>
        <span>➡️</span>
      </button>
    </div>
  );
}