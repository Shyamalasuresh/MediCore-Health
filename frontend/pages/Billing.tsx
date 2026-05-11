import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, DollarSign, Filter, Search, Download, ExternalLink } from 'lucide-react';
import { Card, Button, Table, Thead, Tr, Th, Td, Badge, Input } from '../components/ui/Common';
import { apiService } from '../services/api';

export const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'doctor';
  const patientId = localStorage.getItem('patientId');

  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    description: '',
    status: 'Pending'
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [invoiceData, patientData] = await Promise.all([
        apiService.getInvoices(),
        apiService.getPatients()
      ]);
      
      if (userRole === 'patient' && patientId) {
        setInvoices(invoiceData.filter(i => i.patient_id.toString() === patientId).reverse());
      } else {
        setInvoices(invoiceData.reverse());
      }
      
      setPatients(patientData);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!formData.patientId) return alert('Select a patient');
    try {
      setIsSaving(true);
      const patient = patients.find(p => p.id === parseInt(formData.patientId));
      await apiService.createInvoice({
        patient_id: parseInt(formData.patientId),
        patient_name: `${patient.first_name} ${patient.last_name}`,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (userRole === 'patient') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Payments</h1>
          <Button variant="outline" icon={<Download className="w-4 h-4"/>}>Download Statement</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-indigo-600 text-white border-none shadow-indigo-200 dark:shadow-none shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><CreditCard className="w-6 h-6" /></div>
            </div>
            <p className="text-indigo-100 text-sm">Amount Due</p>
            <h3 className="text-2xl font-bold">{formatCurrency(invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0))}</h3>
          </Card>
          <Card>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Total Paid</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0))}</h3>
          </Card>
          <Card>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Total Invoices</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{invoices.length}</h3>
          </Card>
        </div>

        <Card title="Payment History">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading invoices...</div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Invoice ID</Th>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <tbody>
                {invoices.length === 0 ? (
                  <Tr><Td colSpan={6} className="text-center py-8 dark:text-slate-400">No billing history found</Td></Tr>
                ) : (
                  invoices.map(invoice => (
                    <Tr key={invoice.id}>
                      <Td className="text-xs font-medium dark:text-slate-300">INV-{invoice.id.toString().padStart(4, '0')}</Td>
                      <Td className="dark:text-slate-300">{new Date(invoice.date).toLocaleDateString()}</Td>
                      <Td className="text-slate-600 dark:text-slate-400">{invoice.description}</Td>
                      <Td className="font-bold dark:text-slate-100">{formatCurrency(invoice.amount)}</Td>
                      <Td>
                        <Badge variant={invoice.status === 'Paid' ? 'success' : invoice.status === 'Pending' ? 'warning' : 'error'}>
                          {invoice.status}
                        </Badge>
                      </Td>
                      <Td>
                        {invoice.status === 'Pending' ? (
                          <Button size="sm">Pay Now</Button>
                        ) : (
                          <Button variant="ghost" size="sm" icon={<ExternalLink className="w-3 h-3"/>}>View</Button>
                        )}
                      </Td>
                    </Tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Billing & Invoices</h1>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4"/>}>Create Invoice</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-teal-600 text-white border-none shadow-teal-200 dark:shadow-none shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><DollarSign className="w-6 h-6" /></div>
          </div>
          <p className="text-teal-100 text-sm">Total Revenue (All Time)</p>
          <h3 className="text-2xl font-bold">{formatCurrency(invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0))}</h3>
        </Card>
        <Card>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Pending Invoices</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{invoices.filter(i => i.status === 'Pending').length}</h3>
        </Card>
        <Card>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Overdue</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{invoices.filter(i => i.status === 'Overdue').length}</h3>
        </Card>
      </div>

      <Card title="Invoice History">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading invoices...</div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Invoice ID</Th>
                <Th>Patient</Th>
                <Th>Date</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <tbody>
              {invoices.length === 0 ? (
                <Tr><Td colSpan={6} className="text-center py-8 dark:text-slate-400">No invoices found</Td></Tr>
              ) : (
                invoices.map(invoice => (
                  <Tr key={invoice.id}>
                    <Td className="dark:text-slate-300">INV-{invoice.id.toString().padStart(4, '0')}</Td>
                    <Td className="font-medium dark:text-slate-100">{invoice.patient_name}</Td>
                    <Td className="dark:text-slate-300">{new Date(invoice.date).toLocaleDateString()}</Td>
                    <Td className="dark:text-slate-100">{formatCurrency(invoice.amount)}</Td>
                    <Td>
                      <Badge variant={invoice.status === 'Paid' ? 'success' : invoice.status === 'Pending' ? 'warning' : 'error'}>
                        {invoice.status}
                      </Badge>
                    </Td>
                    <Td className="text-slate-500 dark:text-slate-400 text-xs truncate max-w-xs">{invoice.description}</Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg p-6 border-teal-100 dark:border-teal-900 border">
            <h2 className="text-xl font-bold mb-6 text-teal-900 dark:text-teal-400">Create New Invoice</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                  value={formData.patientId}
                  onChange={e => setFormData({...formData, patientId: e.target.value})}
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                  ))}
                </select>
              </div>
              <Input label="Amount ($)" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              <Input label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} isLoading={isSaving}>Generate Invoice</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};