import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { vendorAPI } from '../services/api';
import Modal from '../components/Modal';
import SimpleVendorForm from '../components/SimpleVendorForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await vendorAPI.getAll();
        setVendors(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleVendorCreated = async () => {
    const response = await vendorAPI.getAll();
    setVendors(response.data.results || response.data);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setShowEditModal(true);
  };

  const handleVendorUpdated = async () => {
    const response = await vendorAPI.getAll();
    setVendors(response.data.results || response.data);
    setShowEditModal(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = async (vendor) => {
    if (window.confirm(`Are you sure you want to delete "${vendor.vendor_name}"? This action cannot be undone.`)) {
      try {
        await vendorAPI.delete(vendor.vendor_id);
        const response = await vendorAPI.getAll();
        setVendors(response.data.results || response.data);
      } catch (error) {
        alert('Failed to delete vendor: ' + (error.response?.data?.detail || error.message));
      }
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage vendor information
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.vendor_id}>
                  <TableCell className="font-medium">{vendor.vendor_name}</TableCell>
                  <TableCell>{vendor.contact_person || '-'}</TableCell>
                  <TableCell>
                    {vendor.contact_number && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-3 w-3 mr-1" />
                        {vendor.contact_number}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {vendor.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-3 w-3 mr-1" />
                        {vendor.email}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.is_active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vendor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditVendor(vendor)}
                        title="Edit vendor"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVendor(vendor)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete vendor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Vendor"
        size="lg"
      >
        <SimpleVendorForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleVendorCreated}
        />
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Vendor"
        size="lg"
      >
        <SimpleVendorForm
          onClose={() => setShowEditModal(false)}
          onSuccess={handleVendorUpdated}
          initialData={editingVendor}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default Vendors;
