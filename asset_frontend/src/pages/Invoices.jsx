import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { invoiceAPI } from '../services/api';
import Modal from '../components/Modal';
import SimpleInvoiceForm from '../components/SimpleInvoiceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import FileDisplay from '../components/FileDisplay';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await invoiceAPI.getAll();
        setInvoices(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceCreated = async () => {
    // Refresh the invoices list
    const response = await invoiceAPI.getAll();
    setInvoices(response.data.results || response.data);
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
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage purchase invoices
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Invoice
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice_id}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.vendor_name}</TableCell>
                  <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {invoice.currency === 'INR' ? '₹' : invoice.currency === 'USD' ? '$' : invoice.currency || '$'}
                    {parseFloat(invoice.total_amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{invoice.currency}</TableCell>
                  <TableCell>
                    {invoice.invoice_file_data_read ? (
                      <FileDisplay
                        fileData={invoice.invoice_file_data_read}
                        fileName={invoice.invoice_file_name}
                        fileType={invoice.invoice_file_type}
                        fileSize={invoice.invoice_file_size}
                        className="!border-0 !p-0"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No file</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="text-primary-600 hover:text-primary-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
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

      {/* Add Invoice Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Invoice"
        size="lg"
      >
        <SimpleInvoiceForm
          onClose={() => setShowAddModal(false)}
          onSuccess={handleInvoiceCreated}
        />
      </Modal>
    </div>
  );
};

export default Invoices;
