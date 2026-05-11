import React, { useEffect, useState } from 'react';
import { Users, Calendar, Activity, DollarSign, Heart, Droplets, Clock, CreditCard } from 'lucide-react';
import { Card, Badge, Button, Table, Thead, Tr, Th, Td, Input } from '../components/ui/Common';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { apiService, DashboardStats } from '../services/api';

const dataActivity = [
  { name: 'Mon', patients: 24, appointments: 18, steps: 4500 },
  { name: 'Tue', patients: 32, appointments: 25, steps: 5200 },
  { name: 'Wed', patients: 28, appointments: 22, steps: 3800 },
  { name: 'Thu', patients: 35, appointments: 30, steps: 6100 },
  { name: 'Fri', patients: 45, appointments: 38, steps: 5900 },
  { name: 'Sat', patients: 15, appointments: 12, steps: 7200 },
  { name: 'Sun', patients: 8, appointments: 5, steps: 4100 },
];

const dataGender = [
  { name: 'Male', value: 450 },
  { name: 'Female', value: 580 },
  { name: 'Other', value: 45 },
];

const COLORS = ['#0f766e', '#14b8a6', '#99f6e4'];

const StatCard = ({ title, value, subtext, icon: Icon, trend, variant = 'teal' }: any) => {
  const userRole = localStorage.getItem('userRole') || 'doctor';
  
  const bgColor = variant === 'rose' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' : 
                  variant === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                  variant === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 
                  'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400';
  
  const trendColor = trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl p-6 border transition-all duration-300 shadow-sm hover:shadow-md ${userRole === 'patient' ? 'border-indigo-100 dark:border-indigo-900/50 shadow-indigo-50/50' : 'border-teal-100 dark:border-teal-900/50 shadow-teal-50/50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendColor}`}>
            {trend === 'up' ? '+12.5%' : '-2.4%'}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'doctor';
  const userName = localStorage.getItem('userName') || 'Dr. Sarah Wilson';
  const patientId = localStorage.getItem('patientId');

  const [bookData, setBookData] = useState({
    patientId: patientId || '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Checkup',
    doctorName: 'Dr. Sarah Wilson'
  });

  const fetchData = async () => {
    try {
      const [statsData, appointmentsData, patientsData, invoicesData] = await Promise.all([
        apiService.getStats(),
        apiService.getAppointments(),
        apiService.getPatients(),
        apiService.getInvoices()
      ]);
      setStats(statsData);
      
      if (userRole === 'patient' && patientId) {
        setAppointments(appointmentsData.filter(a => a.patient_id.toString() === patientId).reverse());
        setInvoices(invoicesData.filter(i => i.patient_id.toString() === patientId));
      } else {
        setAppointments(appointmentsData.slice(-5).reverse());
        setInvoices(invoicesData);
      }
      
      setPatients(patientsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async () => {
    const pId = userRole === 'patient' ? patientId : bookData.patientId;
    if (!pId) return alert('Select a patient');
    
    try {
      setIsBooking(true);
      const selectedPatient = patients.find(p => p.id.toString() === pId);
      await apiService.createAppointment({
        patient_id: parseInt(pId),
        patient_name: userRole === 'patient' ? userName : `${selectedPatient?.first_name} ${selectedPatient?.last_name}`,
        doctor_name: bookData.doctorName,
        appointment_date: new Date(bookData.date).toISOString(),
        time: bookData.time,
        type: bookData.type,
        status: 'Scheduled',
        amount: 100.0,
        notes: ''
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error booking:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  if (userRole === 'patient') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Health Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, {userName}. Here's your health summary.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Health Report</Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>Book Appointment</Button>
          </div>
        </div>

        {/* Patient Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
              title="Heart Rate" 
              value="72 bpm" 
              subtext="Normal range" 
              icon={Heart} 
              variant="rose"
          />
          <StatCard 
              title="Blood Pressure" 
              value="120/80" 
              subtext="Perfectly normal" 
              icon={Droplets} 
              variant="blue"
          />
          <StatCard 
              title="Upcoming Visits" 
              value={appointments.filter(a => a.status === 'Scheduled').length.toString()} 
              subtext="Next visit soon" 
              icon={Clock} 
              variant="teal"
          />
          <StatCard 
              title="Pending Bills" 
              value={formatCurrency(pendingAmount)} 
              subtext="Total amount to pay" 
              icon={CreditCard} 
              variant="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Your Activity" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataActivity}>
                  <defs>
                    <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#f8fafc'}} 
                    itemStyle={{color: '#f8fafc'}}
                  />
                  <Area type="monotone" dataKey="steps" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSteps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Health Progress">
             <div className="space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">BMI Index</p>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">22.4</span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-500 mb-1">Healthy</span>
                    </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Sleep Quality</p>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">7.5h</span>
                        <span className="text-xs text-blue-600 dark:text-blue-500 mb-1">Avg per night</span>
                    </div>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-300">Water Intake</p>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">2.1L</span>
                        <span className="text-xs text-amber-600 dark:text-amber-500 mb-1">Daily goal reached</span>
                    </div>
                </div>
             </div>
          </Card>
        </div>

        <Card title="My Appointments" action={<Button variant="ghost" size="sm">View All</Button>}>
          <Table>
            <Thead>
              <Tr>
                <Th>Doctor</Th>
                <Th>Date & Time</Th>
                <Th>Status</Th>
                <Th>Type</Th>
              </Tr>
            </Thead>
            <tbody>
              {appointments.length === 0 ? (
                  <Tr>
                      <Td colSpan={4} className="text-center py-8 text-slate-500">
                          No appointments found.
                      </Td>
                  </Tr>
              ) : (
                  appointments.map((apt) => (
                      <Tr key={apt.id}>
                          <Td className="font-medium text-slate-900 dark:text-slate-100">{apt.doctor_name}</Td>
                          <Td>
                              <div className="flex flex-col text-xs">
                              <span className="text-slate-700 dark:text-slate-300">{new Date(apt.appointment_date).toLocaleDateString()}</span>
                              <span className="text-slate-400 dark:text-slate-500">{apt.time}</span>
                              </div>
                          </Td>
                          <Td>
                              <Badge variant={
                                  apt.status === 'Completed' ? 'success' : 
                                  apt.status === 'Scheduled' ? 'info' : 'warning'
                              }>
                                  {apt.status}
                              </Badge>
                          </Td>
                          <Td className="text-xs text-slate-500 dark:text-slate-400">{apt.type}</Td>
                      </Tr>
                  ))
              )}
            </tbody>
          </Table>
        </Card>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 border-indigo-100 dark:border-indigo-900 border">
              <h2 className="text-xl font-bold mb-6 text-indigo-900 dark:text-indigo-400">Book New Appointment</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doctor</label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-indigo-500"
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Consultation Type</label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-indigo-500"
                    value={bookData.type}
                    onChange={(e) => setBookData({...bookData, type: e.target.value})}
                  >
                    <option>General Checkup</option>
                    <option>Follow-up</option>
                    <option>Specialist Consultation</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleBook} isLoading={isBooking}>Book Visit</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, {userName}. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Download Report</Button>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>Create Appointment</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Patients" 
            value={loading ? "..." : (stats?.total_patients || 0).toLocaleString()} 
            subtext="Total registered patients" 
            icon={Users} 
            trend="up" 
        />
        <StatCard 
            title="Appointments" 
            value={loading ? "..." : (stats?.appointments_today || 0).toLocaleString()} 
            subtext="Scheduled for today" 
            icon={Calendar} 
            trend="up" 
        />
        <StatCard 
            title="Operations" 
            value={loading ? "..." : (stats?.active_operations || 0).toLocaleString()} 
            subtext="Active procedures" 
            icon={Activity} 
            trend="down" 
        />
        <StatCard 
            title="Revenue" 
            value={loading ? "..." : formatCurrency(stats?.monthly_revenue || 0)} 
            subtext="Total earnings this month" 
            icon={DollarSign} 
            trend="up" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Patient Activity" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataActivity}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#f8fafc'}} 
                  itemStyle={{color: '#f8fafc'}}
                />
                <Area type="monotone" dataKey="patients" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Patient Demographics">
          <div className="h-72 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataGender}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataGender.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-4">
              {dataGender.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Appointments" action={<Button variant="ghost" size="sm">View All</Button>}>
        <Table>
          <Thead>
            <Tr>
              <Th>Patient</Th>
              <Th>Date & Time</Th>
              <Th>Status</Th>
              <Th>Type</Th>
            </Tr>
          </Thead>
          <tbody>
            {!appointments || appointments.length === 0 ? (
                <Tr>
                    <Td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">
                        No recent appointments found.
                    </Td>
                </Tr>
            ) : (
                appointments.map((apt) => (
                    <Tr key={apt.id}>
                        <Td className="font-medium text-slate-900 dark:text-slate-100">{apt.patient_name}</Td>
                        <Td>
                            <div className="flex flex-col text-xs">
                            <span className="text-slate-700 dark:text-slate-300">{new Date(apt.appointment_date).toLocaleDateString()}</span>
                            <span className="text-slate-400 dark:text-slate-500">{apt.time}</span>
                            </div>
                        </Td>
                        <Td>
                            <Badge variant={
                                apt.status === 'Completed' ? 'success' : 
                                apt.status === 'Scheduled' ? 'info' : 'warning'
                            }>
                                {apt.status}
                            </Badge>
                        </Td>
                        <Td className="text-xs text-slate-500 dark:text-slate-400">{apt.type}</Td>
                    </Tr>
                ))
            )}
          </tbody>
        </Table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 border-teal-100 dark:border-teal-900 border">
            <h2 className="text-xl font-bold mb-6 text-teal-900 dark:text-teal-400">Quick Book Appointment</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-teal-500"
                  value={bookData.patientId}
                  onChange={(e) => setBookData({...bookData, patientId: e.target.value})}
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                  ))}
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
                  <option>Checkup</option>
                  <option>Consultation</option>
                  <option>Emergency</option>
                  <option>Follow-up</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleBook} isLoading={isBooking}>Book Now</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};