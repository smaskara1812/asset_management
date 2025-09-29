import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { warrantyAPI } from '../services/api';
import Modal from '../components/Modal';
import SimpleWarrantyForm from '../components/SimpleWarrantyForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import FileDisplay from '../components/FileDisplay';

const Warranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState(null);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        setLoading(true);
        const response = await warrantyAPI.getAll();
        setWarranties(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching warranties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranties();
  }, []);

  const handleWarrantyCreated = async () => {
    // Refresh the warranties list
    const response = await warrantyAPI.getAll();
    setWarranties(response.data.results || response.data);
  };

  const handleEditWarranty = (warranty) => {
    setEditingWarranty(warranty);
    setShowEditModal(true);
  };

  const handleWarrantyUpdated = async () => {
    const response = await warrantyAPI.getAll();
    setWarranties(response.data.results || response.data);
    setShowEditModal(false);
    setEditingWarranty(null);
  };

  const handleDeleteWarranty = async (warranty) => {
    if (window.confirm(`Are you sure you want to delete the warranty for "${warranty.asset_name}"? This action cannot be undone.`)) {
      try {
        await warrantyAPI.delete(warranty.warranty_id);
        const response = await warrantyAPI.getAll();
        setWarranties(response.data.results || response.data);
      } catch (error) {
        alert('Failed to delete warranty: ' + (error.response?.data?.detail || error.message));
      }
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warranties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage asset warranties
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Warranty
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warranties.map((warranty) => (
                <TableRow key={warranty.warranty_id}>
                  <TableCell className="font-medium">{warranty.asset_name}</TableCell>
                  <TableCell>{warranty.warranty_provider || '-'}</TableCell>
                  <TableCell>{new Date(warranty.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {new Date(warranty.end_date).toLocaleDateString()}
                      {isWarrantyExpiring(warranty.end_date) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500 ml-2" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={new Date(warranty.end_date) > new Date() ? 'default' : 'destructive'}>
                      {new Date(warranty.end_date) > new Date() ? 'Active' : 'Expired'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {warranty.warranty_document_data_read ? (
                      <FileDisplay
                        fileData={warranty.warranty_document_data_read}
                        fileName={warranty.warranty_document_name}
                        fileType={warranty.warranty_document_type}
                        fileSize={warranty.warranty_document_size}
                        className="!border-0 !p-0"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No document</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditWarranty(warranty)}
                        className="text-primary-600 hover:text-primary-700"
                        title="Edit warranty"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWarranty(warranty)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete warranty"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Warranty Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Warranty"
        size="lg"
      >
        <SimpleWarrantyForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleWarrantyCreated}
        />
      </Modal>

      {/* Edit Warranty Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Warranty"
        size="lg"
      >
        <SimpleWarrantyForm
          onClose={() => setShowEditModal(false)}
          onSuccess={handleWarrantyUpdated}
          initialData={editingWarranty}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default Warranties;
