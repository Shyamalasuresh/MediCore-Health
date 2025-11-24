import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';

// Placeholder components for routes not fully detailed in the artifacts to keep within limits
const RecordsPlaceholder = () => (
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4">Medical Records</h2>
    <p className="text-slate-600">Patient records, diagnosis history, and documents management interface.</p>
  </div>
);

const BillingPlaceholder = () => (
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4">Billing & Invoices</h2>
    <p className="text-slate-600">Invoice generation, payment tracking, and insurance claims.</p>
  </div>
);

const SettingsPlaceholder = () => (
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4">Settings</h2>
    <p className="text-slate-600">User profile, clinic configuration, and application preferences.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Routes Wrapper */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/records" element={<RecordsPlaceholder />} />
              <Route path="/billing" element={<BillingPlaceholder />} />
              <Route path="/settings" element={<SettingsPlaceholder />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
