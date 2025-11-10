import { useEffect } from 'react';
import { getOfflineSales, clearOfflineSales } from '../utils/db';
import { createSale } from '../services/api';

export const useSync = () => {
  useEffect(() => {
    const syncSales = async () => {
      const offline = await getOfflineSales();
      for (const sale of offline) {
        await createSale(sale);
      }
      await clearOfflineSales();
    };

    window.addEventListener('online', syncSales);
    return () => window.removeEventListener('online', syncSales);
  }, []);
};
