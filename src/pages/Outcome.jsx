import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowUpCircle, Plus, Search, AlertTriangle } from 'lucide-react';

export default function Outcome() {
  const { products, transactions, addTransaction } = useStore();
  const [form, setForm] = useState({ productId: '', quantity: 1, note: '' });
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const outcomeTx = transactions.filter(t => t.type === 'chiqim');
  const filtered = outcomeTx.filter(t =>
    t.productName.toLowerCase().includes(search.toLowerCase()) ||
    t.barcode?.includes(search)
  );

  const selectedProduct = products.find(p => p.id === Number(form.productId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productId || form.quantity <= 0) return;
    if (selectedProduct && Number(form.quantity) > selectedProduct.quantity) {
      setMsg({ text: '❌ Omborда yetarli mahsulot yo\'q!', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      return;
    }
    addTransaction('chiqim', Number(form.productId), Number(form.quantity), form.note);
    setMsg({ text: '✅ Chiqim muvaffaqiyatli qo\'shildi!', type: 'success' });
    setForm({ productId: '', quantity: 1, note: '' });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chiqim</h2>
        <p className="text-gray-500 text-sm mt-1">Ombordan mahsulot chiqarish</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <ArrowUpCircle size={18} className="text-orange-500" /> Yangi chiqim
          </h3>
          {msg.text && (
            <div className={`mb-4 px-4 py-2 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mahsulot</label>
              <select value={form.productId} onChange={e => setForm({...form, productId: e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Tanlang...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (mavjud: {p.quantity})</option>)}
              </select>
            </div>
            {selectedProduct && selectedProduct.quantity <= selectedProduct.minStock && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600 text-xs">
                <AlertTriangle size={14}/> Bu mahsulot kam qolgan!
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miqdor</label>
              <input type="number" min="1" max={selectedProduct?.quantity || 9999} value={form.quantity}
                onChange={e => setForm({...form, quantity: e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
              {selectedProduct && <p className="text-xs text-gray-400 mt-1">Mavjud: {selectedProduct.quantity} {selectedProduct.unit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
              <input type="text" value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Ixtiyoriy..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2">
              <Plus size={18}/> Chiqim qo'shish
            </button>
          </form>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-700">Chiqim tarixi</h3>
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-semibold">{outcomeTx.length} ta</span>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            <table className="w-full">
              <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
                <th className="px-4 py-3">Mahsulot</th>
                <th className="px-4 py-3">Barkod</th>
                <th className="px-4 py-3">Miqdor</th>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3">Izoh</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 text-sm">{t.productName}</td>
                    <td className="px-4 py-3"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{t.barcode}</code></td>
                    <td className="px-4 py-3 text-orange-600 font-bold">-{t.quantity}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.date).toLocaleString('uz-UZ')}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{t.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">Chiqim tarixi yo'q</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
