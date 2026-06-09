import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const initialProducts = [
  { id: 1, barcode: '1001001', name: 'Guruch (1kg)', category: 'Oziq-ovqat', unit: 'kg', quantity: 150, minStock: 20, price: 12000, supplier: 'Toshkent Savdo' },
  { id: 2, barcode: '1001002', name: 'Un (1kg)', category: 'Oziq-ovqat', unit: 'kg', quantity: 80, minStock: 15, price: 8000, supplier: 'Toshkent Savdo' },
  { id: 3, barcode: '1001003', name: 'Shakar (1kg)', category: 'Oziq-ovqat', unit: 'kg', quantity: 5, minStock: 10, price: 15000, supplier: 'Samarqand Savdo' },
  { id: 4, barcode: '1002001', name: 'Motor yog\'i 5L', category: 'Auto', unit: 'dona', quantity: 25, minStock: 5, price: 180000, supplier: 'Avto Servis' },
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ombor_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ombor_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('ombor_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('ombor_transactions', JSON.stringify(transactions)); }, [transactions]);

  const generateBarcode = () => Math.floor(1000000 + Math.random() * 9000000).toString();

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now(), barcode: product.barcode || generateBarcode() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, data) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const addTransaction = (type, productId, quantity, note = '') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const tx = {
      id: Date.now(), type, productId, productName: product.name,
      barcode: product.barcode, quantity, note,
      date: new Date().toISOString(), user: 'Admin'
    };
    setTransactions(prev => [tx, ...prev]);
    const newQty = type === 'kirim' ? product.quantity + quantity : product.quantity - quantity;
    updateProduct(productId, { quantity: Math.max(0, newQty) });
  };

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <StoreContext.Provider value={{
      products, transactions, addProduct, updateProduct, deleteProduct,
      addTransaction, generateBarcode, lowStockProducts, totalValue
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
