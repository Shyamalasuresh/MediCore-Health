const API_BASE_URL = '/api';

export interface DashboardStats {
  total_patients: number;
  appointments_today: number;
  active_operations: number;
  monthly_revenue: number;
}

export const apiService = {
  async getStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getPatients() {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
  },

  async createPatient(patientData: any) {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    if (!response.ok) throw new Error('Failed to create patient');
    return response.json();
  },

  async updatePatient(id: string | number, patientData: any) {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    if (!response.ok) throw new Error('Failed to update patient');
    return response.json();
  },

  async deletePatient(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete patient');
    return response.json();
  },

  async getAppointments() {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  async createAppointment(appointmentData: any) {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
  },

  async getRecords() {
    const response = await fetch(`${API_BASE_URL}/records`);
    if (!response.ok) throw new Error('Failed to fetch records');
    return response.json();
  },

  async createRecord(recordData: any) {
    const response = await fetch(`${API_BASE_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData),
    });
    if (!response.ok) throw new Error('Failed to create record');
    return response.json();
  },

  async getInvoices() {
    const response = await fetch(`${API_BASE_URL}/invoices`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  async createInvoice(invoiceData: any) {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    return response.json();
  },

  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async updateSetting(settingData: any) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingData),
    });
    if (!response.ok) throw new Error('Failed to update setting');
    return response.json();
  },

  async login(loginData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  }
};
