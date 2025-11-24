export interface User {
  id: string;
  name: string;
  role: 'admin' | 'doctor' | 'staff';
  email: string;
  avatarUrl?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  allergies?: string[];
  lastVisit: string;
  status: 'Active' | 'Inactive';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Checkup' | 'Consultation' | 'Emergency' | 'Follow-up';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  doctorName: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
  };
  attachments?: string[];
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  cost: number;
  quantity: number;
}

export type Theme = 'light' | 'dark';
