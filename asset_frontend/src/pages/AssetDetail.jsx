import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  Building2, 
  MapPin, 
  Users, 
  Calendar,
  DollarSign,
  Shield,
  Wrench,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { assetAPI, warrantyAPI, maintenanceAPI, depreciationAPI } from '../services/api';
import FileDisplay from '../components/FileDisplay';
import Modal from '../components/Modal';
import SimpleAssetForm from '../components/SimpleAssetForm';

const AssetDetail = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [warranties, setWarranties] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [depreciations, setDepreciations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditAsset = () => {
    setShowEditModal(true);
  };

  const handleAssetUpdated = async () => {
    // Refresh asset data after update
    const response = await assetAPI.getById(id);
    setAsset(response.data);
    setShowEditModal(false);
  };

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true);
        
        const [
          assetRes,
          warrantiesRes,
          maintenancesRes,
          depreciationsRes,
        ] = await Promise.all([
          assetAPI.getById(id),
          warrantyAPI.getAll(),
          maintenanceAPI.getByAsset(id),
          depreciationAPI.getAll(),
        ]);

        setAsset(assetRes.data);
        
        // Filter warranties for this asset
        const assetWarranties = (warrantiesRes.data.results || warrantiesRes.data)
          .filter(warranty => warranty.asset === parseInt(id));
        setWarranties(assetWarranties);
        
        setMaintenances(maintenancesRes.data.results || maintenancesRes.data);
        
        // Filter depreciations for this asset
        const assetDepreciations = (depreciationsRes.data.results || depreciationsRes.data)
          .filter(depreciation => depreciation.asset === parseInt(id));
        setDepreciations(assetDepreciations);
        
      } catch (error) {
        console.error('Error fetching asset details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssetDetails();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Under Repair': 'bg-yellow-100 text-yellow-800',
      'Retired': 'bg-gray-100 text-gray-800',
      'Scrapped': 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    );
  };

  const isWarrantyExpiring = (endDate) => {
    const today = new Date();
    const warrantyEnd = new Date(endDate);
    const daysUntilExpiry = Math.ceil((warrantyEnd - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Asset not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The asset you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/assets" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/assets"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{asset.asset_name}</h1>
            <p className="text-sm text-gray-500">Asset Code: {asset.asset_code}</p>
          </div>
        </div>
        <button
          onClick={handleEditAsset}
          className="btn btn-primary flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Asset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Asset Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Asset Code</label>
                <p className="text-sm text-gray-900">{asset.asset_code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">{getStatusBadge(asset.status_name)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-sm text-gray-900">{asset.category_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-sm text-gray-900">{asset.location_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Vendor</label>
                <p className="text-sm text-gray-900">{asset.vendor_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Purchase Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(asset.purchase_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cost</label>
                <p className="text-sm text-gray-900">${parseFloat(asset.cost).toLocaleString()}</p>
              </div>
              {asset.end_of_life_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">End of Life Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(asset.end_of_life_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {asset.serial_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Serial Number</label>
                  <p className="text-sm text-gray-900">{asset.serial_number}</p>
                </div>
              )}
              {asset.model_number && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Model Number</label>
                  <p className="text-sm text-gray-900">{asset.model_number}</p>
                </div>
              )}
              {asset.brand && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand</label>
                  <p className="text-sm text-gray-900">{asset.brand}</p>
                </div>
              )}
            </div>
            {asset.description && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-sm text-gray-900 mt-1">{asset.description}</p>
              </div>
            )}
          </div>

          {/* Asset Documents */}
          {(asset.purchase_receipt_data_read || asset.manual_document_data_read) && (
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
              <div className="space-y-4">
                {asset.purchase_receipt_data_read && (
                  <FileDisplay
                    fileData={asset.purchase_receipt_data_read}
                    fileName={asset.purchase_receipt_name}
                    fileType={asset.purchase_receipt_type}
                    fileSize={asset.purchase_receipt_size}
                    label="Purchase Receipt"
                  />
                )}
                
                {asset.manual_document_data_read && (
                  <FileDisplay
                    fileData={asset.manual_document_data_read}
                    fileName={asset.manual_document_name}
                    fileType={asset.manual_document_type}
                    fileSize={asset.manual_document_size}
                    label="User Manual/Documentation"
                  />
                )}
              </div>
            </div>
          )}

          {/* Maintenance History */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Maintenance History</h2>
              <Link
                to={`/maintenance?asset=${id}`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {maintenances.length > 0 ? (
                maintenances.slice(0, 5).map((maintenance) => (
                  <div key={maintenance.maintenance_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {maintenance.maintenance_type.charAt(0).toUpperCase() + maintenance.maintenance_type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(maintenance.performed_on).toLocaleDateString()} - {maintenance.performed_by}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${parseFloat(maintenance.cost).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No maintenance records found</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Warranties */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Warranties</h2>
              <Link
                to={`/warranties?asset=${id}`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {warranties.length > 0 ? (
                warranties.map((warranty) => (
                  <div key={warranty.warranty_id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(warranty.start_date).toLocaleDateString()} - {new Date(warranty.end_date).toLocaleDateString()}
                        </p>
                        {warranty.warranty_provider && (
                          <p className="text-sm text-gray-500">{warranty.warranty_provider}</p>
                        )}
                      </div>
                      {isWarrantyExpiring(warranty.end_date) && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No warranties found</p>
              )}
            </div>
          </div>

          {/* Depreciation */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Depreciation</h2>
              <Link
                to={`/depreciation?asset=${id}`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {depreciations.length > 0 ? (
                depreciations.slice(0, 3).map((depreciation) => (
                  <div key={depreciation.depreciation_id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {depreciation.method_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(depreciation.calculated_on).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${parseFloat(depreciation.book_value).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {depreciation.rate}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No depreciation records found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Asset Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Asset"
        size="xl"
      >
        <SimpleAssetForm
          onClose={() => setShowEditModal(false)}
          onSuccess={handleAssetUpdated}
          initialData={asset}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default AssetDetail;
