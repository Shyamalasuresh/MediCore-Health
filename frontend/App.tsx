import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { MedicalRecords } from './pages/MedicalRecords';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';

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
              <Route path="/records" element={<MedicalRecords />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
