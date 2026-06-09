import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowDownCircle, ArrowUpCircle, BarChart2, ScanLine, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Boshqaruv' },
  { to: '/products', icon: Package, label: 'Mahsulotlar' },
  { to: '/income', icon: ArrowDownCircle, label: 'Kirim' },
  { to: '/outcome', icon: ArrowUpCircle, label: 'Chiqim' },
  { to: '/barcode', icon: ScanLine, label: 'Barkod' },
  { to: '/reports', icon: BarChart2, label: 'Hisobotlar' },
];

export default function Sidebar() {
  const { lowStockProducts } = useStore();
  return (
    <aside className="w-64 bg-gray-900 min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">O</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Ombor X</h1>
            <p className="text-xs text-gray-400">Ombor tizimi</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      {lowStockProducts.length > 0 && (
        <div className="p-4 m-4 bg-red-900/40 border border-red-700 rounded-xl">
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-1">
            <AlertTriangle size={16} /> Kam qoldiq
          </div>
          <p className="text-xs text-red-300">{lowStockProducts.length} ta mahsulot tugayapti</p>
        </div>
      )}
    </aside>
  );
}
