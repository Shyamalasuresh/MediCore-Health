import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, User, Building, CreditCard, Bell, Shield, Smartphone } from 'lucide-react';
import { Card, Button, Input } from '../components/ui/Common';
import { apiService } from '../services/api';

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'doctor';
  const userName = localStorage.getItem('userName') || 'Dr. Sarah Wilson';
  const userEmail = localStorage.getItem('userEmail') || 'sarah.wilson@medicore.com';

  const [clinicName, setClinicName] = useState('MediCore Health');
  const [clinicAddress, setClinicAddress] = useState('123 Medical Drive, Healthcare City');
  const [clinicEmail, setClinicEmail] = useState('contact@medicore.com');
  const [currency, setCurrency] = useState('USD');

  // Patient specific state
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    appointments: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (userRole === 'doctor') {
          const data = await apiService.getSettings();
          // Map settings to state
          data.forEach((s: any) => {
            if (s.key === 'clinic_name') setClinicName(s.value);
            if (s.key === 'clinic_address') setClinicAddress(s.value);
            if (s.key === 'clinic_email') setClinicEmail(s.value);
            if (s.key === 'currency') setCurrency(s.value);
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [userRole]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (userRole === 'doctor') {
        const updates = [
          { key: 'clinic_name', value: clinicName, category: 'general' },
          { key: 'clinic_address', value: clinicAddress, category: 'general' },
          { key: 'clinic_email', value: clinicEmail, category: 'general' },
          { key: 'currency', value: currency, category: 'billing' }
        ];
        await Promise.all(updates.map(u => apiService.updateSetting(u)));
      }
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (userRole === 'patient') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <Button onClick={handleSave} isLoading={isSaving} icon={<Save className="w-4 h-4"/>}>Save Preferences</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium transition-colors">
              <User className="w-4 h-4" /> Profile
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Shield className="w-4 h-4" /> Privacy
            </button>
          </aside>

          <div className="md:col-span-3 space-y-6">
            <Card title="Personal Profile">
              <div className="space-y-4">
                <Input label="Full Name" value={userName} disabled />
                <Input label="Email Address" value={userEmail} disabled />
                <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </Card>

            <Card title="Notification Preferences">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                        <p className="text-sm font-medium dark:text-slate-200">Email Notifications</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Receive health updates via email</p>
                    </div>
                    <input type="checkbox" checked={notifications.email} onChange={e => setNotifications({...notifications, email: e.target.checked})} className="w-4 h-4 text-teal-600 rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                        <p className="text-sm font-medium dark:text-slate-200">SMS Reminders</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Get appointment reminders on your phone</p>
                    </div>
                    <input type="checkbox" checked={notifications.sms} onChange={e => setNotifications({...notifications, sms: e.target.checked})} className="w-4 h-4 text-teal-600 rounded" />
                </div>
              </div>
            </Card>

            <Card title="Security">
              <Button variant="outline" size="sm" icon={<Shield className="w-4 h-4"/>}>Change Password</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <Button onClick={handleSave} isLoading={isSaving} icon={<Save className="w-4 h-4"/>}>Save All Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium transition-colors">
            <Building className="w-4 h-4" /> General
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <CreditCard className="w-4 h-4" /> Billing
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </aside>

        <div className="md:col-span-3 space-y-6">
          <Card title="Clinic Information">
            <div className="space-y-4">
              <Input label="Clinic Name" value={clinicName} onChange={e => setClinicName(e.target.value)} />
              <Input label="Clinic Email" value={clinicEmail} onChange={e => setClinicEmail(e.target.value)} />
              <Input label="Clinic Address" value={clinicAddress} onChange={e => setClinicAddress(e.target.value)} />
            </div>
          </Card>

          <Card title="Regional & Currency">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Currency</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Format</label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Security">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</p>
              </div>
              <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-slate-400 rounded-full transition-all"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};