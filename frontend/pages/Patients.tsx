import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, FileEdit, Trash2, Eye } from 'lucide-react';
import { Card, Button, Input, Table, Thead, Tr, Th, Td, Badge } from '../components/ui/Common';
import { Patient } from '../types';
import { apiService } from '../services/api';

export const Patients: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    bloodType: '',
    emergencyContact: ''
  });

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getPatients();
      // Transform backend data to frontend format if necessary
      const transformedData = data.map((p: any) => ({
        id: p.id.toString(),
        patient_id: p.patient_id,
        firstName: p.first_name,
        lastName: p.last_name,
        dob: p.date_of_birth ? p.date_of_birth.split('T')[0] : '',
        gender: p.gender,
        email: p.email,
        phone: p.phone,
        address: p.address,
        bloodType: p.blood_type,
        status: p.status,
        lastVisit: p.last_visit || 'N/A'
      }));
      setPatients(transformedData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male',
      email: '',
      phone: '',
      address: '',
      bloodType: '',
      emergencyContact: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (patient: any) => {
    setEditingId(patient.id);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: patient.dob,
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      bloodType: patient.bloodType,
      emergencyContact: patient.emergencyContact || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await apiService.deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient.');
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dob ? new Date(formData.dob).toISOString() : null,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        blood_type: formData.bloodType,
        emergency_contact: formData.emergencyContact,
        status: 'Active'
      };

      if (editingId) {
        await apiService.updatePatient(editingId, payload);
      } else {
        const patientId = `P-${Math.floor(1000 + Math.random() * 9000)}`;
        await apiService.createPatient({ ...payload, patient_id: patientId });
      }

      setIsModalOpen(false);
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Failed to save patient. Please check your details.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Patients</h1>
        <Button onClick={handleAddClick} icon={<Plus className="w-4 h-4"/>}>Add Patient</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name, ID, or email..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-4 h-4"/>}>Filters</Button>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading patients...</div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Contact Info</Th>
                <Th>Last Visit</Th>
                <Th>Blood Type</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <Tr>
                  <Td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">No patients found.</Td>
                </Tr>
              ) : (
                filteredPatients.map((patient) => (
                  <Tr key={patient.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                          {patient.firstName ? patient.firstName[0] : ''}{patient.lastName ? patient.lastName[0] : ''}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{patient.firstName} {patient.lastName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{patient.gender}, {patient.dob ? (new Date().getFullYear() - new Date(patient.dob).getFullYear()) : 'N/A'} yrs</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex flex-col text-sm text-slate-600 dark:text-slate-400">
                        <span className="dark:text-slate-300">{patient.email}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{patient.phone}</span>
                      </div>
                    </Td>
                    <Td className="dark:text-slate-300">{patient.lastVisit}</Td>
                    <Td><span className="font-medium text-slate-700 dark:text-slate-300">{patient.bloodType}</span></Td>
                    <Td>
                      <Badge variant={patient.status === 'Active' ? 'success' : 'neutral'}>
                        {patient.status}
                      </Badge>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(patient)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                          title="Edit Patient"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(patient.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Add/Edit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingId ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="e.g. John" />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="e.g. Doe" />
              <Input label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} type="date" />
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input label="Email Address" name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john@example.com" />
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 8900" />
              <div className="sm:col-span-2">
                <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street address, City, State" />
              </div>
              <Input label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleInputChange} placeholder="e.g. O+" />
              <Input label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Name & Phone" />
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isSaving}>Save Patient</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

