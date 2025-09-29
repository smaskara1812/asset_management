import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetDetail from './pages/AssetDetail';
import Categories from './pages/Categories';
import Locations from './pages/Locations';
import Vendors from './pages/Vendors';
import Invoices from './pages/Invoices';
import Warranties from './pages/Warranties';
import Maintenance from './pages/Maintenance';
import Depreciation from './pages/Depreciation';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/warranties" element={<Warranties />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/depreciation" element={<Depreciation />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
