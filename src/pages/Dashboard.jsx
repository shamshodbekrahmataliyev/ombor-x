import { useStore } from '../context/StoreContext';
import { Package, TrendingUp, TrendingDown, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function Dashboard() {
  const { products, transactions, lowStockProducts, totalValue } = useStore();
  const todayTx = transactions.filter(t => new Date(t.date).toDateString() === new Date().toDateString());
  const todayIncome = todayTx.filter(t => t.type === 'kirim').reduce((s, t) => s + t.quantity, 0);
  const todayOutcome = todayTx.filter(t => t.type === 'chiqim').reduce((s, t) => s + t.quantity, 0);

  const stats = [
    { label: 'Jami mahsulot', value: products.length + ' tur', icon: Package, color: 'blue', sub: 'Omborxonada' },
    { label: 'Ombor qiymati', value: (totalValue / 1000000).toFixed(1) + ' mln', icon: TrendingUp, color: 'green', sub: "so'm" },
    { label: 'Bugungi kirim', value: todayIncome, icon: ArrowDownCircle, color: 'emerald', sub: 'dona/kg' },
    { label: 'Bugungi chiqim', value: todayOutcome, icon: ArrowUpCircle, color: 'orange', sub: 'dona/kg' },
    { label: 'Kam qoldiq', value: lowStockProducts.length + ' ta', icon: AlertTriangle, color: 'red', sub: 'diqqat!' },
  ];

  const colorMap = {
    blue: 'bg-blue-500', green: 'bg-green-500', emerald: 'bg-emerald-500',
    orange: 'bg-orange-500', red: 'bg-red-500'
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Boshqaruv paneli</h2>
        <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('uz-UZ', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${colorMap[color]} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
            <div className="text-xs text-gray-400">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Low stock */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> Kam qoldiqlar
          </h3>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">Hamma narsa yetarli ✅</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-red-50 rounded-xl p-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{p.name}</p>
                    <p className="text-xs text-gray-400">Min: {p.minStock} {p.unit}</p>
                  </div>
                  <span className="text-red-600 font-bold text-lg">{p.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">So'nggi harakatlar</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-sm">Hali harakat yo'q</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 6).map(t => (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'kirim' ? 'bg-green-100' : 'bg-orange-100'}`}>
                      {t.type === 'kirim' ? <ArrowDownCircle size={16} className="text-green-600" /> : <ArrowUpCircle size={16} className="text-orange-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{t.productName}</p>
                      <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${t.type === 'kirim' ? 'text-green-600' : 'text-orange-600'}`}>
                    {t.type === 'kirim' ? '+' : '-'}{t.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
