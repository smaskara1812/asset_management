import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingDown } from 'lucide-react';
import { depreciationAPI } from '../services/api';

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
import SimpleDepreciationForm from '../components/SimpleDepreciationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Depreciation = () => {
  const [depreciations, setDepreciations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDepreciation, setEditingDepreciation] = useState(null);

  useEffect(() => {
    const fetchDepreciations = async () => {
      try {
        setLoading(true);
        const response = await depreciationAPI.getAll();
        setDepreciations(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching depreciations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepreciations();
  }, []);

  const handleDepreciationCreated = async () => {
    // Refresh the depreciations list
    const response = await depreciationAPI.getAll();
    setDepreciations(response.data.results || response.data);
  };

  const handleEditDepreciation = (depreciation) => {
    setEditingDepreciation(depreciation);
    setShowEditModal(true);
  };

  const handleDepreciationUpdated = async () => {
    const response = await depreciationAPI.getAll();
    setDepreciations(response.data.results || response.data);
    setShowEditModal(false);
    setEditingDepreciation(null);
  };

  const handleDeleteDepreciation = async (depreciation) => {
    if (window.confirm(`Are you sure you want to delete the depreciation record for "${depreciation.asset_name}"? This action cannot be undone.`)) {
      try {
        await depreciationAPI.delete(depreciation.depreciation_id);
        const response = await depreciationAPI.getAll();
        setDepreciations(response.data.results || response.data);
      } catch (error) {
        alert('Failed to delete depreciation record: ' + (error.response?.data?.detail || error.message));
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
          <h1 className="text-2xl font-bold text-gray-900">Depreciation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage asset depreciation records
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Depreciation
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Book Value</TableHead>
                <TableHead>Calculated On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depreciations.map((depreciation) => (
                <TableRow key={depreciation.depreciation_id}>
                  <TableCell className="font-medium">{depreciation.asset_name}</TableCell>
                  <TableCell>{depreciation.method_name}</TableCell>
                  <TableCell>{depreciation.rate}%</TableCell>
                  <TableCell>₹{formatIndianNumber(parseFloat(depreciation.book_value))}</TableCell>
                  <TableCell>{new Date(depreciation.calculated_on).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-primary-600 hover:text-primary-700"
                        onClick={() => handleEditDepreciation(depreciation)}
                        title="Edit depreciation record"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDepreciation(depreciation)}
                        title="Delete depreciation record"
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

      {/* Add Depreciation Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Depreciation Record"
        size="lg"
      >
        <SimpleDepreciationForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleDepreciationCreated}
        />
      </Modal>

      {/* Edit Depreciation Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Depreciation Record"
        size="lg"
      >
        <SimpleDepreciationForm
          onClose={() => setShowEditModal(false)}
          onSuccess={handleDepreciationUpdated}
          initialData={editingDepreciation}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default Depreciation;
