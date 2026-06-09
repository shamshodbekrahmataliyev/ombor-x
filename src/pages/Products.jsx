import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Search, Edit2, Trash2, AlertTriangle, X } from 'lucide-react';

const CATEGORIES = ['Oziq-ovqat', 'Auto', 'Elektron', 'Kiyim', 'Qurilish', 'Boshqa'];
const UNITS = ['dona', 'kg', 'litr', 'm', 'm²', 'quti'];

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, generateBarcode } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name:'', barcode:'', category:'Oziq-ovqat', unit:'dona', quantity:0, minStock:5, price:0, supplier:'' });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ name:'', barcode: generateBarcode(), category:'Oziq-ovqat', unit:'dona', quantity:0, minStock:5, price:0, supplier:'' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditItem(p);
    setForm({ ...p });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editItem) updateProduct(editItem.id, { ...form, quantity: Number(form.quantity), minStock: Number(form.minStock), price: Number(form.price) });
    else addProduct({ ...form, quantity: Number(form.quantity), minStock: Number(form.minStock), price: Number(form.price) });
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mahsulotlar</h2>
          <p className="text-gray-500 text-sm mt-1">Jami: {products.length} ta mahsulot</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
          <Plus size={18} /> Yangi mahsulot
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nomi, barkod yoki kategoriya bo'yicha qidiring..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs font-semibold text-gray-500 uppercase bg-gray-50">
              <th className="px-6 py-3">Mahsulot</th>
              <th className="px-6 py-3">Barkod</th>
              <th className="px-6 py-3">Kategoriya</th>
              <th className="px-6 py-3">Miqdor</th>
              <th className="px-6 py-3">Narx</th>
              <th className="px-6 py-3">Holat</th>
              <th className="px-6 py-3">Amal</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.supplier}</p>
                  </td>
                  <td className="px-6 py-4"><code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{p.barcode}</code></td>
                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{p.category}</span></td>
                  <td className="px-6 py-4 font-semibold">{p.quantity} {p.unit}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{p.price.toLocaleString()} so'm</td>
                  <td className="px-6 py-4">
                    {p.quantity <= p.minStock
                      ? <span className="flex items-center gap-1 text-red-600 text-xs font-semibold"><AlertTriangle size={14}/> Kam</span>
                      : <span className="text-green-600 text-xs font-semibold">✓ Yetarli</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"><Edit2 size={16}/></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">Mahsulot topilmadi</div>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editItem ? 'Tahrirlash' : 'Yangi mahsulot'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-500"/></button>
            </div>
            <div className="space-y-4">
              {[['name','Nomi','text'],['barcode','Barkod','text'],['supplier','Yetkazuvchi','text']].map(([k,l,t]) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                  <input type={t} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                  <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O'lchov birligi</label>
                  <select value={form.unit} onChange={e => setForm({...form,unit:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[['quantity','Miqdor'],['minStock','Min qoldiq'],['price','Narx (so\'m)']].map(([k,l]) => (
                  <div key={k}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                    <input type="number" value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">Saqlash</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition">Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
