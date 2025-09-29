import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { maintenanceAPI } from '../services/api';

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
import SimpleMaintenanceForm from '../components/SimpleMaintenanceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        setLoading(true);
        const response = await maintenanceAPI.getAll();
        setMaintenances(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching maintenances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, []);

  const handleMaintenanceCreated = async () => {
    // Refresh the maintenances list
    const response = await maintenanceAPI.getAll();
    setMaintenances(response.data.results || response.data);
  };

  const handleEditMaintenance = (maintenance) => {
    setEditingMaintenance(maintenance);
    setShowEditModal(true);
  };

  const handleMaintenanceUpdated = async () => {
    const response = await maintenanceAPI.getAll();
    setMaintenances(response.data.results || response.data);
    setShowEditModal(false);
    setEditingMaintenance(null);
  };

  const handleDeleteMaintenance = async (maintenance) => {
    if (window.confirm(`Are you sure you want to delete the maintenance record for "${maintenance.asset_name}"? This action cannot be undone.`)) {
      try {
        await maintenanceAPI.delete(maintenance.maintenance_id);
        const response = await maintenanceAPI.getAll();
        setMaintenances(response.data.results || response.data);
      } catch (error) {
        alert('Failed to delete maintenance record: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  const getMaintenanceTypeBadge = (type) => {
    const typeVariants = {
      'preventive': 'default',
      'corrective': 'secondary',
      'emergency': 'destructive',
      'upgrade': 'outline',
    };
    
    return (
      <Badge variant={typeVariants[type] || 'outline'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage asset maintenance records
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Maintenance
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Performed On</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.map((maintenance) => (
                <TableRow key={maintenance.maintenance_id}>
                  <TableCell className="font-medium">{maintenance.asset_name}</TableCell>
                  <TableCell>{getMaintenanceTypeBadge(maintenance.maintenance_type)}</TableCell>
                  <TableCell>{new Date(maintenance.performed_on).toLocaleDateString()}</TableCell>
                  <TableCell>{maintenance.performed_by}</TableCell>
                  <TableCell>₹{formatIndianNumber(parseFloat(maintenance.cost))}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-primary-600 hover:text-primary-700"
                        onClick={() => handleEditMaintenance(maintenance)}
                        title="Edit maintenance record"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteMaintenance(maintenance)}
                        title="Delete maintenance record"
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

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Maintenance Record"
        size="lg"
      >
        <SimpleMaintenanceForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleMaintenanceCreated}
        />
      </Modal>

      {/* Edit Maintenance Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Maintenance Record"
        size="lg"
      >
        <SimpleMaintenanceForm
          onClose={() => setShowEditModal(false)}
          onSuccess={handleMaintenanceUpdated}
          initialData={editingMaintenance}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default Maintenance;
