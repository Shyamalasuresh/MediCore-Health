import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, User, Activity, Clock, Download, Eye } from 'lucide-react';
import { Card, Button, Input, Table, Thead, Tr, Th, Td } from '../components/ui/Common';
import { apiService } from '../services/api';

export const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'doctor';
  const patientId = localStorage.getItem('patientId');

  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    treatment: '',
    doctorName: 'Dr. Sarah Wilson',
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 98.6,
    weight: 70,
    notes: ''
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [recordsData, patientsData] = await Promise.all([
        apiService.getRecords(),
        apiService.getPatients()
      ]);
      
      if (userRole === 'patient' && patientId) {
        setRecords(recordsData.filter((r: any) => r.patient_id.toString() === patientId).reverse());
      } else {
        setRecords(recordsData.reverse());
      }
      
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!formData.patientId) return alert('Select a patient');
    try {
      setIsSaving(true);
      await apiService.createRecord({
        patient_id: parseInt(formData.patientId),
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        doctor_name: formData.doctorName,
        blood_pressure: formData.bloodPressure,
        heart_rate: formData.heartRate,
        temperature: formData.temperature,
        weight: formData.weight,
        notes: formData.notes
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (userRole === 'patient') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Health Records</h1>
          <Button variant="outline" icon={<Download className="w-4 h-4"/>}>Export Records</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-teal-500">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg"><Activity className="w-5 h-5"/></div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Latest BP</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{records[0]?.blood_pressure || '120/80'}</p>
                </div>
            </div>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-rose-500">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg"><Clock className="w-5 h-5"/></div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Latest Pulse</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{records[0]?.heart_rate || '72'} bpm</p>
                </div>
            </div>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><FileText className="w-5 h-5"/></div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Total Records</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{records.length}</p>
                </div>
            </div>
          </Card>
        </div>

        <Card title="Clinical Documents">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading your records...</div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Diagnosis / Reason</Th>
                  <Th>Provider</Th>
                  <Th>Vital Signs</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <tbody>
                {records.length === 0 ? (
                  <Tr><Td colSpan={5} className="text-center py-8 dark:text-slate-400">No medical history available</Td></Tr>
                ) : (
                  records.map(record => (
                    <Tr key={record.id}>
                      <Td className="text-sm font-medium dark:text-slate-300">{new Date(record.date).toLocaleDateString()}</Td>
                      <Td>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{record.diagnosis}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{record.treatment}</p>
                        </div>
                      </Td>
                      <Td className="dark:text-slate-300">{record.doctor_name}</Td>
                      <Td>
                        <div className="flex flex-wrap gap-2">
                           <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-400">BP: {record.blood_pressure}</span>
                           <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-400">HR: {record.heart_rate}</span>
                        </div>
                      </Td>
                      <Td>
                        <Button variant="ghost" size="sm" icon={<Eye className="w-3 h-3"/>}>View Details</Button>
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Medical Records</h1>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4"/>}>Add Entry</Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading records...</div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Patient</Th>
                <Th>Date</Th>
                <Th>Diagnosis</Th>
                <Th>Doctor</Th>
                <Th>Vitals</Th>
              </Tr>
            </Thead>
            <tbody>
              {records.length === 0 ? (
                <Tr><Td colSpan={5} className="text-center py-8 dark:text-slate-400">No records found</Td></Tr>
              ) : (
                records.map(record => {
                  const patient = patients.find(p => p.id === record.patient_id);
                  return (
                    <Tr key={record.id}>
                      <Td>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium dark:text-slate-300">{patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown'}</span>
                        </div>
                      </Td>
                      <Td className="dark:text-slate-300">{new Date(record.date).toLocaleDateString()}</Td>
                      <Td className="dark:text-slate-300">{record.diagnosis}</Td>
                      <Td className="dark:text-slate-300">{record.doctor_name}</Td>
                      <Td>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          BP: {record.blood_pressure} | HR: {record.heart_rate}
                        </div>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">New Medical Record</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
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
              <Input label="Diagnosis" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
              <Input label="Doctor" value={formData.doctorName} readOnly />
              <div className="sm:col-span-2">
                <Input label="Treatment" value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} />
              </div>
              <Input label="Blood Pressure" value={formData.bloodPressure} onChange={e => setFormData({...formData, bloodPressure: e.target.value})} />
              <Input label="Heart Rate" type="number" value={formData.heartRate} onChange={e => setFormData({...formData, heartRate: parseInt(e.target.value)})} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isSaving}>Save Record</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};