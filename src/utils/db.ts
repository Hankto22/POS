import { openDB } from 'idb';

// Type definitions
interface OfflineSale {
  id?: number;
  productId: string;
  customerId?: string | null;
  quantity: number;
  total: number;
}

// Avoid top-level await by using a promise for the DB connection
export const dbPromise = openDB('thrift-pos', 1, {
  upgrade(db) {
    db.createObjectStore('offlineSales', { keyPath: 'id', autoIncrement: true });
  },
});

export const saveOfflineSale = async (sale: OfflineSale) => {
  const db = await dbPromise;
  await db.add('offlineSales', sale);
};

export const getOfflineSales = async () => {
  const db = await dbPromise;
  return await db.getAll('offlineSales');
};

export const clearOfflineSales = async () => {
  const db = await dbPromise;
  const tx = db.transaction('offlineSales', 'readwrite');
  await tx.store.clear();
  await tx.done;
};
