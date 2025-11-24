import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, FileEdit, Trash2, Eye } from 'lucide-react';
import { Card, Button, Input, Table, Thead, Tr, Th, Td, Badge } from '../components/ui/Common';
import { Patient } from '../types';

const MOCK_PATIENTS: Patient[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', dob: '1985-04-12', gender: 'Male', email: 'john@example.com', phone: '+1 234 567 890', address: '123 Main St', bloodType: 'O+', lastVisit: '2023-10-24', status: 'Active' },
  { id: '2', firstName: 'Alice', lastName: 'Smith', dob: '1990-07-22', gender: 'Female', email: 'alice@example.com', phone: '+1 987 654 321', address: '456 Oak Ave', bloodType: 'A-', lastVisit: '2023-10-20', status: 'Active' },
  { id: '3', firstName: 'Robert', lastName: 'Johnson', dob: '1978-01-30', gender: 'Male', email: 'rob@example.com', phone: '+1 555 123 456', address: '789 Pine Ln', bloodType: 'B+', lastVisit: '2023-09-15', status: 'Inactive' },
  { id: '4', firstName: 'Emily', lastName: 'Davis', dob: '1995-11-05', gender: 'Female', email: 'emily@example.com', phone: '+1 444 555 666', address: '321 Elm St', bloodType: 'AB+', lastVisit: '2023-10-22', status: 'Active' },
];

export const Patients: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4"/>}>Add Patient</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
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
            {filteredPatients.map((patient) => (
              <Tr key={patient.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{patient.firstName} {patient.lastName}</div>
                      <div className="text-xs text-slate-500">{patient.gender}, {new Date().getFullYear() - new Date(patient.dob).getFullYear()} yrs</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-col text-sm text-slate-600">
                    <span>{patient.email}</span>
                    <span className="text-xs text-slate-400">{patient.phone}</span>
                  </div>
                </Td>
                <Td>{patient.lastVisit}</Td>
                <Td><span className="font-medium text-slate-700">{patient.bloodType}</span></Td>
                <Td>
                  <Badge variant={patient.status === 'Active' ? 'success' : 'neutral'}>
                    {patient.status}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-teal-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600">
                      <FileEdit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Add Patient Modal (Simplified inline) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Add New Patient</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="First Name" placeholder="e.g. John" />
              <Input label="Last Name" placeholder="e.g. Doe" />
              <Input label="Date of Birth" type="date" />
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-teal-500 focus:border-teal-500">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <Input label="Email Address" type="email" placeholder="john@example.com" />
              <Input label="Phone Number" placeholder="+1 234 567 8900" />
              <div className="sm:col-span-2">
                <Input label="Address" placeholder="Street address, City, State" />
              </div>
              <Input label="Blood Type" placeholder="e.g. O+" />
              <Input label="Emergency Contact" placeholder="Name & Phone" />
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsModalOpen(false)}>Save Patient</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
