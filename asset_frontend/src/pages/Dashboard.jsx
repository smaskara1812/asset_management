import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Building2, 
  MapPin, 
  Users, 
  FileText, 
  Shield, 
  Wrench, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { assetAPI, warrantyAPI, maintenanceAPI } from '../services/api';

// Indian number formatting utility
const formatIndianNumber = (num) => {
  if (num >= 10000000) { // 1 crore
    return (num / 10000000).toFixed(2) + ' Cr';
  } else if (num >= 100000) { // 1 lakh
    return (num / 100000).toFixed(2) + ' L';
  } else if (num >= 1000) { // 1 thousand
    return (num / 1000).toFixed(1) + ' K';
  } else {
    return num.toString();
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeAssets: 0,
    underMaintenance: 0,
    expiringWarranties: 0,
    totalCost: 0,
  });
  const [recentAssets, setRecentAssets] = useState([]);
  const [expiringWarranties, setExpiringWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch assets
        const assetsResponse = await assetAPI.getAll();
        const assets = assetsResponse.data.results || assetsResponse.data;
        
        // Fetch expiring warranties
        const warrantiesResponse = await warrantyAPI.getExpiringSoon(30);
        const warranties = warrantiesResponse.data.results || warrantiesResponse.data;
        
        // Calculate stats
        const totalAssets = assets.length;
        const activeAssets = assets.filter(asset => asset.status_name === 'Active').length;
        const underMaintenance = assets.filter(asset => asset.status_name === 'Under Repair').length;
        const totalCost = assets.reduce((sum, asset) => sum + (parseFloat(asset.cost) || 0), 0);
        
        setStats({
          totalAssets,
          activeAssets,
          underMaintenance,
          expiringWarranties: warranties.length,
          totalCost,
        });
        
        // Set recent assets (last 5)
        setRecentAssets(assets.slice(0, 5));
        setExpiringWarranties(warranties.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Total Assets',
      value: stats.totalAssets,
      icon: Package,
      color: 'bg-blue-500',
      href: '/assets',
    },
    {
      name: 'Total Cost',
      value: `₹${formatIndianNumber(stats.totalCost)}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      href: '/assets',
    },
    {
      name: 'Active Assets',
      value: stats.activeAssets,
      icon: CheckCircle,
      color: 'bg-green-500',
      href: '/assets?status=active',
    },
    {
      name: 'Under Maintenance',
      value: stats.underMaintenance,
      icon: Wrench,
      color: 'bg-yellow-500',
      href: '/assets?status=maintenance',
    },
    {
      name: 'Expiring Warranties',
      value: stats.expiringWarranties,
      icon: AlertTriangle,
      color: 'bg-red-500',
      href: '/warranties',
    },
  ];

  const quickActions = [
    { name: 'Add New Asset', href: '/assets', icon: Package },
    { name: 'Manage Categories', href: '/categories', icon: Building2 },
    { name: 'Add Vendor', href: '/vendors', icon: Users },
    { name: 'Schedule Maintenance', href: '/maintenance', icon: Wrench },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your asset management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Assets */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Assets</h2>
            <Link
              to="/assets"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentAssets.length > 0 ? (
              recentAssets.map((asset) => (
                <div key={asset.asset_id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{asset.asset_name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">{asset.asset_code}</p>
                      <span className="text-sm font-medium text-emerald-600">
                        ₹{formatIndianNumber(parseFloat(asset.cost || 0))}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    asset.status_name === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : asset.status_name === 'Under Repair'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.status_name}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No assets found</p>
            )}
          </div>
        </div>

        {/* Expiring Warranties */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Expiring Warranties</h2>
            <Link
              to="/warranties"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {expiringWarranties.length > 0 ? (
              expiringWarranties.map((warranty) => (
                <div key={warranty.warranty_id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{warranty.asset_name}</p>
                    <p className="text-sm text-gray-500">
                      Expires: {new Date(warranty.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No warranties expiring soon</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon className="h-6 w-6 text-primary-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
