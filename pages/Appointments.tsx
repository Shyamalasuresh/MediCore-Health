import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalIcon, User } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { Appointment } from '../types';

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. Sarah Wilson', date: '2023-10-24', time: '09:00', type: 'Checkup', status: 'Scheduled' },
  { id: '2', patientId: '2', patientName: 'Alice Smith', doctorId: 'd1', doctorName: 'Dr. Sarah Wilson', date: '2023-10-24', time: '10:30', type: 'Consultation', status: 'Completed' },
  { id: '3', patientId: '3', patientName: 'Robert Johnson', doctorId: 'd2', doctorName: 'Dr. Mark Lee', date: '2023-10-24', time: '14:00', type: 'Emergency', status: 'Scheduled' },
  { id: '4', patientId: '4', patientName: 'Emily Davis', doctorId: 'd1', doctorName: 'Dr. Sarah Wilson', date: '2023-10-25', time: '11:00', type: 'Follow-up', status: 'Scheduled' },
];

export const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2023-10-24');

  // Simple calendar grid generation
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1); // Mock calendar days

  const getAppointmentsForDate = (date: string) => {
    return MOCK_APPOINTMENTS.filter(app => app.date === date);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Calendar Section */}
      <Card className="lg:w-2/3 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">October 2023</h2>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" icon={<ChevronLeft className="w-4 h-4" />} />
              <Button variant="outline" size="sm" icon={<ChevronRight className="w-4 h-4" />} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Month</Button>
            <Button variant="ghost" size="sm" className="bg-slate-100">Week</Button>
            <Button variant="ghost" size="sm">Day</Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden flex-1">
          {days.map(day => (
            <div key={day} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">
              {day}
            </div>
          ))}
          {/* Mock days logic - just rendering boxes for demo */}
          {calendarDays.map((day, idx) => {
            const isToday = day === 24; // Mocking Oct 24 as today
            const dateStr = `2023-10-${day}`;
            const apps = getAppointmentsForDate(dateStr);
            
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedDate(dateStr)}
                className={`bg-white p-2 min-h-[80px] cursor-pointer hover:bg-slate-50 transition-colors ${selectedDate === dateStr ? 'ring-2 ring-inset ring-teal-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-teal-600 text-white' : 'text-slate-700'}`}>
                    {day <= 31 ? day : ''}
                  </span>
                  {apps.length > 0 && day <= 31 && (
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  {day <= 31 && apps.slice(0, 2).map(app => (
                    <div key={app.id} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded truncate">
                      {app.time} {app.patientName}
                    </div>
                  ))}
                  {day <= 31 && apps.length > 2 && (
                    <div className="text-[10px] text-slate-400 pl-1">+{apps.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Side Panel: Schedule for Selected Day */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <Card className="flex-1 overflow-hidden flex flex-col" title={`Schedule: ${selectedDate}`}>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <CalIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                No appointments for this day.
              </div>
            ) : (
              getAppointmentsForDate(selectedDate).map(app => (
                <div key={app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <Clock className="w-4 h-4 text-teal-600" />
                      {app.time}
                    </div>
                    <Badge variant={app.status === 'Completed' ? 'success' : 'info'}>{app.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{app.patientName}</div>
                      <div className="text-xs text-slate-500">{app.type}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="w-full text-xs h-8">Reschedule</Button>
                    <Button size="sm" className="w-full text-xs h-8">Start Visit</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Add Appointment */}
        <Card title="Quick Book">
          <div className="space-y-4">
            <Input placeholder="Select Patient" />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" />
              <Input type="time" />
            </div>
            <select className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white">
              <option>General Checkup</option>
              <option>Consultation</option>
              <option>Emergency</option>
            </select>
            <Button className="w-full">Book Appointment</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
