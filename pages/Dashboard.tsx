import React from 'react';
import { Users, Calendar, Activity, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Card, Badge, Button, Table, Thead, Tr, Th, Td } from '../components/ui/Common';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const dataActivity = [
  { name: 'Mon', patients: 24, appointments: 18 },
  { name: 'Tue', patients: 32, appointments: 25 },
  { name: 'Wed', patients: 28, appointments: 22 },
  { name: 'Thu', patients: 35, appointments: 30 },
  { name: 'Fri', patients: 45, appointments: 38 },
  { name: 'Sat', patients: 15, appointments: 12 },
  { name: 'Sun', patients: 8, appointments: 5 },
];

const dataGender = [
  { name: 'Male', value: 450 },
  { name: 'Female', value: 580 },
  { name: 'Other', value: 45 },
];

const COLORS = ['#0f766e', '#14b8a6', '#99f6e4'];

const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend === 'up' ? '+12.5%' : '-2.4%'}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{subtext}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, Dr. Wilson. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Download Report</Button>
          <Button size="sm">Create Appointment</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value="1,284" subtext="Total registered patients" icon={Users} trend="up" />
        <StatCard title="Appointments" value="42" subtext="Scheduled for today" icon={Calendar} trend="up" />
        <StatCard title="Operations" value="12" subtext="Active procedures" icon={Activity} trend="down" />
        <StatCard title="Revenue" value="$24.5k" subtext="Total earnings this month" icon={DollarSign} trend="up" />
      </div>

      {/* Charts Section */}
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
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
                  {dataGender.map((entry, index) => (
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
                  <span className="text-xs text-slate-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card title="Recent Appointments" action={<Button variant="ghost" size="sm">View All</Button>}>
        <Table>
          <Thead>
            <Tr>
              <Th>Patient Name</Th>
              <Th>Doctor</Th>
              <Th>Date & Time</Th>
              <Th>Status</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <tbody>
            <Tr>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JD</div>
                  <div>
                    <div className="font-medium text-slate-900">John Doe</div>
                    <div className="text-xs text-slate-500">ID: #P-1234</div>
                  </div>
                </div>
              </Td>
              <Td>Dr. Sarah Wilson</Td>
              <Td>
                <div className="flex flex-col">
                  <span>Oct 24, 2023</span>
                  <span className="text-xs text-slate-400">09:30 AM</span>
                </div>
              </Td>
              <Td><Badge variant="success">Completed</Badge></Td>
              <Td>$150.00</Td>
            </Tr>
            <Tr>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs">AS</div>
                  <div>
                    <div className="font-medium text-slate-900">Alice Smith</div>
                    <div className="text-xs text-slate-500">ID: #P-1235</div>
                  </div>
                </div>
              </Td>
              <Td>Dr. Mark Lee</Td>
              <Td>
                <div className="flex flex-col">
                  <span>Oct 24, 2023</span>
                  <span className="text-xs text-slate-400">10:15 AM</span>
                </div>
              </Td>
              <Td><Badge variant="warning">Pending</Badge></Td>
              <Td>$85.00</Td>
            </Tr>
             <Tr>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">RJ</div>
                  <div>
                    <div className="font-medium text-slate-900">Robert Johnson</div>
                    <div className="text-xs text-slate-500">ID: #P-1236</div>
                  </div>
                </div>
              </Td>
              <Td>Dr. Sarah Wilson</Td>
              <Td>
                <div className="flex flex-col">
                  <span>Oct 24, 2023</span>
                  <span className="text-xs text-slate-400">11:00 AM</span>
                </div>
              </Td>
              <Td><Badge variant="error">Cancelled</Badge></Td>
              <Td>$0.00</Td>
            </Tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
