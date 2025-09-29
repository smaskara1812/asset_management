import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Package,
  Building2,
  MapPin,
  Users
} from 'lucide-react';
import { assetAPI, categoryAPI, locationAPI, vendorAPI, statusAPI } from '../services/api';

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
import Modal from '../components/Modal';
import SimpleAssetForm from '../components/SimpleAssetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    vendor: '',
    status: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          assetsRes,
          categoriesRes,
          locationsRes,
          vendorsRes,
          statusesRes,
        ] = await Promise.all([
          assetAPI.getAll(),
          categoryAPI.getAll(),
          locationAPI.getAll(),
          vendorAPI.getAll(),
          statusAPI.getAll(),
        ]);

        setAssets(assetsRes.data.results || assetsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
        setLocations(locationsRes.data.results || locationsRes.data);
        setVendors(vendorsRes.data.results || vendorsRes.data);
        setStatuses(statusesRes.data.results || statusesRes.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search is empty, fetch all assets
      const response = await assetAPI.getAll();
      setAssets(response.data.results || response.data);
      return;
    }

    try {
      const response = await assetAPI.search(searchQuery);
      setAssets(response.data.results || response.data);
    } catch (error) {
      console.error('Error searching assets:', error);
    }
  };

  const handleFilter = async () => {
    try {
      let filteredAssets = [];
      
      if (filters.status) {
        const response = await assetAPI.byStatus(filters.status);
        filteredAssets = response.data.results || response.data;
      } else if (filters.category) {
        const response = await assetAPI.byCategory(filters.category);
        filteredAssets = response.data.results || response.data;
      } else {
        const response = await assetAPI.getAll();
        filteredAssets = response.data.results || response.data;
      }

      // Apply additional filters
      if (filters.location) {
        filteredAssets = filteredAssets.filter(asset => asset.location === parseInt(filters.location));
      }
      if (filters.vendor) {
        filteredAssets = filteredAssets.filter(asset => asset.vendor === parseInt(filters.vendor));
      }

      setAssets(filteredAssets);
    } catch (error) {
      console.error('Error filtering assets:', error);
    }
  };

  const clearFilters = async () => {
    setFilters({
      category: '',
      location: '',
      vendor: '',
      status: '',
    });
    setSearchQuery('');
    const response = await assetAPI.getAll();
    setAssets(response.data.results || response.data);
  };

  const handleAssetCreated = async () => {
    // Refresh the assets list
    const response = await assetAPI.getAll();
    setAssets(response.data.results || response.data);
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setShowEditModal(true);
  };

  const handleAssetUpdated = async () => {
    // Refresh the assets list
    const response = await assetAPI.getAll();
    setAssets(response.data.results || response.data);
    setShowEditModal(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = async (asset) => {
    if (window.confirm(`Are you sure you want to delete "${asset.asset_name}"? This action cannot be undone.`)) {
      try {
        await assetAPI.delete(asset.asset_id);
        // Refresh the assets list
        const response = await assetAPI.getAll();
        setAssets(response.data.results || response.data);
      } catch (error) {
        alert('Failed to delete asset: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusVariants = {
      'Active': 'default',
      'Under Repair': 'secondary',
      'Retired': 'outline',
      'Scrapped': 'destructive',
    };
    
    return (
      <Badge variant={statusVariants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization's assets
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.status_id} value={status.status_id}>
                    {status.status_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => setFilters({ ...filters, category: value === "all" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={handleFilter}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <TableRow key={asset.asset_id}>
                    <TableCell className="font-medium">{asset.asset_code}</TableCell>
                    <TableCell>{asset.asset_name}</TableCell>
                    <TableCell>{asset.category_name}</TableCell>
                    <TableCell>{asset.location_name}</TableCell>
                    <TableCell>{asset.vendor_name}</TableCell>
                    <TableCell>{getStatusBadge(asset.status_name)}</TableCell>
                    <TableCell>₹{formatIndianNumber(parseFloat(asset.cost))}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/assets/${asset.asset_id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAsset(asset)}
                          title="Edit asset"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAsset(asset)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete asset"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="8" className="text-center py-8 text-gray-500">
                    No assets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Asset Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Asset"
        size="xl"
      >
        <SimpleAssetForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAssetCreated}
        />
      </Modal>
    </div>
  );
};

export default Assets;
