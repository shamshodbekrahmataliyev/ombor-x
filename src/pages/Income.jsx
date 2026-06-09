import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowDownCircle, Plus, Search } from 'lucide-react';

export default function Income() {
  const { products, transactions, addTransaction } = useStore();
  const [form, setForm] = useState({ productId: '', quantity: 1, note: '' });
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const incomeTx = transactions.filter(t => t.type === 'kirim');
  const filtered = incomeTx.filter(t =>
    t.productName.toLowerCase().includes(search.toLowerCase()) ||
    t.barcode?.includes(search)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productId || form.quantity <= 0) return;
    addTransaction('kirim', Number(form.productId), Number(form.quantity), form.note);
    setMsg('✅ Kirim muvaffaqiyatli qo\'shildi!');
    setForm({ productId: '', quantity: 1, note: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kirim</h2>
        <p className="text-gray-500 text-sm mt-1">Omborga mahsulot kiritish</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <ArrowDownCircle size={18} className="text-green-500" /> Yangi kirim
          </h3>
          {msg && <div className="mb-4 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">{msg}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mahsulot</label>
              <select value={form.productId} onChange={e => setForm({...form, productId: e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Tanlang...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (mavjud: {p.quantity})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miqdor</label>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
              <input type="text" value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Ixtiyoriy..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
              <Plus size={18}/> Kirim qo'shish
            </button>
          </form>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-700">Kirim tarixi</h3>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">{incomeTx.length} ta</span>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
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
                    <td className="px-4 py-3 text-green-600 font-bold">+{t.quantity}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.date).toLocaleString('uz-UZ')}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{t.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">Kirim tarixi yo'q</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
