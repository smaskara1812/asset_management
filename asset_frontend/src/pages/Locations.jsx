import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { locationAPI } from '../services/api';
import Modal from '../components/Modal';
import SimpleLocationForm from '../components/SimpleLocationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await locationAPI.getAll();
        setLocations(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationCreated = async () => {
    // Refresh the locations list
    const response = await locationAPI.getAll();
    setLocations(response.data.results || response.data);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setShowEditModal(true);
  };

  const handleLocationUpdated = async () => {
    const response = await locationAPI.getAll();
    setLocations(response.data.results || response.data);
    setShowEditModal(false);
    setEditingLocation(null);
  };

  const handleDeleteLocation = async (location) => {
    if (window.confirm(`Are you sure you want to delete "${location.location_name}"? This action cannot be undone.`)) {
      try {
        await locationAPI.delete(location.location_id);
        const response = await locationAPI.getAll();
        setLocations(response.data.results || response.data);
      } catch (error) {
        alert('Failed to delete location: ' + (error.response?.data?.detail || error.message));
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
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage asset locations
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.location_id}>
                  <TableCell className="font-medium">{location.location_name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.city || '-'}</TableCell>
                  <TableCell>{location.state || '-'}</TableCell>
                  <TableCell>{new Date(location.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditLocation(location)}
                        title="Edit location"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLocation(location)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete location"
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

      {/* Add Location Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Location"
      >
        <SimpleLocationForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleLocationCreated}
        />
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Location"
      >
        <SimpleLocationForm
          onClose={() => setShowEditModal(false)}
          onSuccess={handleLocationUpdated}
          initialData={editingLocation}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default Locations;
