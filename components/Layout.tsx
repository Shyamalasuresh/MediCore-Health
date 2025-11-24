import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, FileText, CreditCard, Settings, LogOut, 
  Menu, Bell, Search, X, Activity, UserCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1
      ${active 
        ? 'bg-teal-50 text-teal-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
      ${collapsed ? 'justify-center' : ''}
    `}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
    {!collapsed && <span>{label}</span>}
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear tokens here
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: Users, label: 'Patients' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/records', icon: FileText, label: 'Medical Records' },
    { to: '/billing', icon: CreditCard, label: 'Billing' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden" 
          onClick={() => setSidebarOpen(true)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg text-slate-800 whitespace-nowrap ${!sidebarOpen && 'lg:hidden'}`}>
              MediCore
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname.startsWith(item.to)}
              collapsed={!sidebarOpen && window.innerWidth >= 1024}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors
              ${!sidebarOpen && 'lg:justify-center'}
            `}
          >
            <LogOut className="w-5 h-5" />
            {(!sidebarOpen && window.innerWidth < 1024) ? null : <span className={!sidebarOpen ? 'lg:hidden' : ''}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-64">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search patients, doctors..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">Dr. Sarah Wilson</p>
                <p className="text-xs text-slate-500">Chief Physician</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                <UserCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};