import { useStore } from '../context/StoreContext';
import { BarChart2, TrendingUp, TrendingDown, Package } from 'lucide-react';

export default function Reports() {
  const { products, transactions, totalValue } = useStore();

  const incomeTotal = transactions.filter(t=>t.type==='kirim').reduce((s,t)=>s+t.quantity,0);
  const outcomeTotal = transactions.filter(t=>t.type==='chiqim').reduce((s,t)=>s+t.quantity,0);

  const productStats = products.map(p => {
    const inc = transactions.filter(t=>t.productId===p.id&&t.type==='kirim').reduce((s,t)=>s+t.quantity,0);
    const out = transactions.filter(t=>t.productId===p.id&&t.type==='chiqim').reduce((s,t)=>s+t.quantity,0);
    return { ...p, inc, out, turnover: out };
  }).sort((a,b)=>b.turnover-a.turnover);

  const maxTurnover = Math.max(...productStats.map(p=>p.turnover), 1);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hisobotlar</h2>
        <p className="text-gray-500 text-sm mt-1">Ombor statistikasi va tahlili</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Jami mahsulot', value: products.length, icon: Package, color: 'blue', bg: 'bg-blue-500' },
          { label: 'Ombor qiymati', value: (totalValue/1000000).toFixed(2)+' mln', icon: BarChart2, color: 'green', bg: 'bg-green-500' },
          { label: 'Jami kirim', value: incomeTotal+' dona', icon: TrendingUp, color: 'emerald', bg: 'bg-emerald-500' },
          { label: 'Jami chiqim', value: outcomeTotal+' dona', icon: TrendingDown, color: 'orange', bg: 'bg-orange-500' },
        ].map(({ label, value, icon: Icon, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white"/>
            </div>
            <div className="text-xl font-bold text-gray-800">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Turnover chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Eng ko'p aylanuvchi mahsulotlar</h3>
          <div className="space-y-3">
            {productStats.slice(0,8).map(p => (
              <div key={p.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium truncate max-w-[200px]">{p.name}</span>
                  <span className="text-gray-500">{p.turnover} ta</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(p.turnover/maxTurnover)*100}%` }}/>
                </div>
              </div>
            ))}
            {productStats.length === 0 && <p className="text-gray-400 text-sm">Ma'lumot yo'q</p>}
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Kategoriyalar bo'yicha</h3>
          <div className="space-y-3">
            {Object.entries(
              products.reduce((acc, p) => { acc[p.category] = (acc[p.category]||0)+1; return acc; }, {})
            ).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-sm font-medium text-gray-700">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-blue-200 rounded-full w-20">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count/products.length)*100}%` }}/>
                  </div>
                  <span className="text-sm font-bold text-blue-600 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full product table */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-700">Mahsulotlar holati</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
                <th className="px-4 py-3">Mahsulot</th>
                <th className="px-4 py-3">Mavjud</th>
                <th className="px-4 py-3">Kirim</th>
                <th className="px-4 py-3">Chiqim</th>
                <th className="px-4 py-3">Qiymat</th>
                <th className="px-4 py-3">Holat</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {productStats.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-sm text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-sm">{p.quantity} {p.unit}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold text-sm">+{p.inc}</td>
                    <td className="px-4 py-3 text-orange-600 font-semibold text-sm">-{p.out}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{(p.quantity*p.price).toLocaleString()} so'm</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.quantity<=p.minStock?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>
                        {p.quantity<=p.minStock?'Kam':'Yetarli'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
