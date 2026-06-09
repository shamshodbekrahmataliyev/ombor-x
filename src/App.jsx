import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Income from './pages/Income';
import Outcome from './pages/Outcome';
import Barcode from './pages/Barcode';
import Reports from './pages/Reports';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/income" element={<Income />} />
              <Route path="/outcome" element={<Outcome />} />
              <Route path="/barcode" element={<Barcode />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
