import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalIcon, User, Plus } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { Appointment, Patient } from '../types';
import { apiService } from '../services/api';

export const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'doctor';
  const patientId = localStorage.getItem('patientId');
  const userName = localStorage.getItem('userName') || 'John Doe';

  const [bookData, setBookData] = useState({
    patientId: patientId || '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Checkup',
    doctorName: 'Dr. Sarah Wilson'
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [appData, patientData] = await Promise.all([
        apiService.getAppointments(),
        apiService.getPatients()
      ]);
      
      let filteredApps = appData;
      if (userRole === 'patient' && patientId) {
        filteredApps = appData.filter((a: any) => a.patient_id.toString() === patientId);
      }

      const transformedApps = filteredApps.map((a: any) => ({
        id: a.id.toString(),
        patientId: a.patient_id.toString(),
        patientName: a.patient_name,
        doctorId: 'd1',
        doctorName: a.doctor_name,
        date: a.appointment_date.split('T')[0],
        time: a.time,
        type: a.type,
        status: a.status
      }));

      const transformedPatients = patientData.map((p: any) => ({
        id: p.id.toString(),
        firstName: p.first_name,
        lastName: p.last_name,
      }));

      setAppointments(transformedApps);
      setPatients(transformedPatients);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(app => app.date === date);
  };

  const handleBook = async () => {
    const pId = userRole === 'patient' ? patientId : bookData.patientId;
    if (!pId) {
      alert('Please select a patient');
      return;
    }

    try {
      setIsBooking(true);
      const selectedPatient = patients.find(p => p.id === pId);
      const payload = {
        patient_id: parseInt(pId as string),
        patient_name: userRole === 'patient' ? userName : `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
        doctor_name: bookData.doctorName,
        appointment_date: new Date(bookData.date).toISOString(),
        time: bookData.time,
        type: bookData.type,
        status: 'Scheduled',
        amount: 100.0,
        notes: ''
      };
      await apiService.createAppointment(payload);
      fetchData();
    } catch (error) {
      console.error('Error booking:', error);
    } finally {
      setIsBooking(false);
    }
  };

  // Simple calendar grid generation
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{userRole === 'patient' ? 'My Visits' : 'Appointments'}</h1>
        {userRole === 'patient' && (
            <Button icon={<Plus className="w-4 h-4"/>} onClick={() => {
                const modal = document.getElementById('book-modal');
                if (modal) modal.style.display = 'flex';
            }}>Request Appointment</Button>
        )}
      </div>

      <div className="h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-2/3 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{monthName} {currentYear}</h2>
                <div className="flex gap-1">
                <Button variant="outline" size="sm" icon={<ChevronLeft className="w-4 h-4" />} />
                <Button variant="outline" size="sm" icon={<ChevronRight className="w-4 h-4" />} />
                </div>
            </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex-1">
            {days.map(day => (
                <div key={day} className="bg-slate-50 dark:bg-slate-950 p-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {day}
                </div>
            ))}
            {calendarDays.map((day) => {
                const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const apps = getAppointmentsForDate(dateStr);
                const isToday = day === today.getDate();
                
                return (
                <div 
                    key={day} 
                    onClick={() => setSelectedDate(dateStr)}
                    className={`bg-white dark:bg-slate-900 p-2 min-h-[80px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedDate === dateStr ? 'ring-2 ring-inset ring-teal-500' : ''}`}
                >
                    <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-teal-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {day}
                    </span>
                    {apps.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    )}
                    </div>
                    <div className="mt-2 space-y-1">
                    {apps.slice(0, 2).map(app => (
                        <div key={app.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${userRole === 'patient' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                        {app.time} {userRole === 'patient' ? app.doctorName : app.patientName}
                        </div>
                    ))}
                    </div>
                </div>
                );
            })}
            </div>
        </Card>

        <div className="lg:w-1/3 flex flex-col gap-6">
            <Card className="flex-1 overflow-hidden flex flex-col" title={`Schedule: ${selectedDate}`}>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {getAppointmentsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <CalIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                    No visits scheduled for this day.
                </div>
                ) : (
                getAppointmentsForDate(selectedDate).map(app => (
                    <div key={app.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold">
                        <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        {app.time}
                        </div>
                        <Badge variant={app.status === 'Completed' ? 'success' : 'info'}>{app.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <User className="w-4 h-4" />
                        </div>
                        <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{userRole === 'patient' ? app.doctorName : app.patientName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{app.type}</div>
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>
            </Card>

            {userRole === 'doctor' && (
                <Card title="Quick Book">
                <div className="space-y-4">
                    <select 
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                    value={bookData.patientId}
                    onChange={(e) => setBookData({...bookData, patientId: e.target.value})}
                    >
                    <option value="">Select Patient</option>
                    {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                    ))}
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                    <Input type="date" value={bookData.date} onChange={(e) => setBookData({...bookData, date: e.target.value})} />
                    <Input type="time" value={bookData.time} onChange={(e) => setBookData({...bookData, time: e.target.value})} />
                    </div>
                    <select 
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                    value={bookData.type}
                    onChange={(e) => setBookData({...bookData, type: e.target.value})}
                    >
                    <option>Checkup</option>
                    <option>Consultation</option>
                    <option>Emergency</option>
                    <option>Follow-up</option>
                    </select>
                    <Button className="w-full" onClick={handleBook} isLoading={isBooking}>Book Appointment</Button>
                </div>
                </Card>
            )}
        </div>
      </div>

      {/* Booking Modal for Patients */}
      <div id="book-modal" className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">Request Appointment</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doctor</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                  value={bookData.doctorName}
                  onChange={(e) => setBookData({...bookData, doctorName: e.target.value})}
                >
                  <option>Dr. Sarah Wilson</option>
                  <option>Dr. Michael Chen</option>
                  <option>Dr. Elena Rodriguez</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" value={bookData.date} onChange={(e) => setBookData({...bookData, date: e.target.value})} />
                <Input label="Time" type="time" value={bookData.time} onChange={(e) => setBookData({...bookData, time: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                  value={bookData.type}
                  onChange={(e) => setBookData({...bookData, type: e.target.value})}
                >
                  <option>General Checkup</option>
                  <option>Follow-up</option>
                  <option>Specialist</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                  const modal = document.getElementById('book-modal');
                  if (modal) modal.style.display = 'none';
              }}>Cancel</Button>
              <Button onClick={async () => {
                  await handleBook();
                  const modal = document.getElementById('book-modal');
                  if (modal) modal.style.display = 'none';
              }} isLoading={isBooking}>Submit Request</Button>
            </div>
          </div>
        </div>
    </div>
  );
};