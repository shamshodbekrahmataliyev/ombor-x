import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ScanLine, Search, Printer } from 'lucide-react';

function BarcodeDisplay({ value, name }) {
  const bars = value.split('').map(Number);
  return (
    <div className="flex flex-col items-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl">
      <div className="flex items-end gap-[1px] h-14 mb-2">
        {bars.map((d, i) => {
          const widths = [3,2,2,3,2,3,2,2,3,3];
          const w = widths[d];
          return (
            <div key={i} className="flex gap-[1px]">
              <div className="bg-black" style={{ width: w * 2 + 'px', height: '48px' }}/>
              <div className="bg-white" style={{ width: '2px', height: '48px' }}/>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-sm font-bold tracking-widest">{value}</p>
      {name && <p className="text-xs text-gray-500 mt-1 text-center max-w-[150px] truncate">{name}</p>}
    </div>
  );
}

export default function Barcode() {
  const { products, generateBarcode, updateProduct } = useStore();
  const [search, setSearch] = useState('');
  const [found, setFound] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState([]);

  const handleSearch = () => {
    const q = search.trim();
    if (!q) return;
    const p = products.find(pr => pr.barcode === q || pr.name.toLowerCase().includes(q.toLowerCase()));
    if (p) { setFound(p); setNotFound(false); }
    else { setFound(null); setNotFound(true); }
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev, id]);

  const regenerateBarcode = (id) => {
    updateProduct(id, { barcode: generateBarcode() });
  };

  const printSelected = () => {
    const items = products.filter(p => selected.includes(p.id));
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Barkodlar</title><style>
      body{font-family:monospace;} .item{display:inline-block;margin:8px;padding:8px;border:1px solid #ccc;text-align:center;}
      .code{font-size:14px;font-weight:bold;letter-spacing:4px;} .name{font-size:11px;color:#666;}
    </style></head><body>`);
    items.forEach(p => {
      win.document.write(`<div class="item"><div class="code">${p.barcode}</div><div class="name">${p.name}</div></div>`);
    });
    win.document.write('</body></html>');
    win.print();
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Barkod tizimi</h2>
        <p className="text-gray-500 text-sm mt-1">Barkod yaratish, qidirish va chop etish</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <ScanLine size={18} className="text-blue-500"/> Barkod qidirish
          </h3>
          <div className="flex gap-2 mb-4">
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Barkod yoki nom..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700">
              <Search size={16}/>
            </button>
          </div>
          {found && (
            <div className="space-y-3">
              <BarcodeDisplay value={found.barcode} name={found.name}/>
              <div className="bg-blue-50 rounded-xl p-3 text-sm space-y-1">
                <p className="font-semibold text-blue-800">{found.name}</p>
                <p className="text-blue-600">Miqdor: {found.quantity} {found.unit}</p>
                <p className="text-blue-600">Kategoriya: {found.category}</p>
              </div>
            </div>
          )}
          {notFound && <p className="text-red-500 text-sm text-center py-4">❌ Mahsulot topilmadi</p>}
        </div>

        {/* All barcodes */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-700">Barcha barkodlar</h3>
            {selected.length > 0 && (
              <button onClick={printSelected} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">
                <Printer size={16}/> {selected.length} ta chop etish
              </button>
            )}
          </div>
          <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto max-h-[550px]">
            {products.map(p => (
              <div key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition ${selected.includes(p.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); regenerateBarcode(p.id); }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg ml-2">↻</button>
                </div>
                <BarcodeDisplay value={p.barcode} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
