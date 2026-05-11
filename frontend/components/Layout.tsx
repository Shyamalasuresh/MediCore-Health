import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, FileText, CreditCard, Settings, LogOut, 
  Menu, Bell, Search, Activity, UserCircle, Sun, Moon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
  collapsed: boolean;
  userRole: string;
  darkMode: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active, collapsed, userRole, darkMode }) => {
  const activeBg = userRole === 'patient' ? (darkMode ? 'bg-indigo-900/40' : 'bg-indigo-50') : (darkMode ? 'bg-teal-900/40' : 'bg-teal-50');
  const activeText = userRole === 'patient' ? (darkMode ? 'text-indigo-400' : 'text-indigo-700') : (darkMode ? 'text-teal-400' : 'text-teal-700');
  const activeIcon = userRole === 'patient' ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-teal-400' : 'text-teal-600');

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1 relative group
        ${active 
          ? `${activeText} font-bold` 
          : `${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      {active && (
        <motion.div 
          layoutId="activeNav"
          className={`absolute inset-0 ${activeBg} rounded-lg -z-10 border border-${userRole === 'patient' ? 'indigo' : 'teal'}-100/20 shadow-sm`}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? activeIcon : (darkMode ? 'text-slate-500' : 'text-slate-400')}`} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole') || 'doctor';
  const userName = localStorage.getItem('userName') || 'Dr. Sarah Wilson';
  const userEmail = localStorage.getItem('userEmail') || 'sarah.wilson@medicore.com';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const doctorItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patients', icon: Users, label: 'Patients' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/records', icon: FileText, label: 'Medical Records' },
    { to: '/billing', icon: CreditCard, label: 'Billing' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const patientItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'My Health' },
    { to: '/appointments', icon: Calendar, label: 'My Visits' },
    { to: '/records', icon: FileText, label: 'My Records' },
    { to: '/billing', icon: CreditCard, label: 'Payments' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = userRole === 'patient' ? patientItems : doctorItems;
  const themeColor = userRole === 'patient' ? 'indigo' : 'teal';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${userRole === 'patient' ? (darkMode ? 'bg-slate-950' : 'bg-indigo-50/20') : (darkMode ? 'bg-slate-950' : 'bg-teal-50/20')} flex font-sans`}>
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm" 
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out flex flex-col shadow-xl
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
          ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r
        `}
      >
        <div className={`h-16 flex items-center px-6 border-b ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`w-8 h-8 rounded-lg ${userRole === 'patient' ? 'bg-indigo-600' : 'bg-teal-600'} flex items-center justify-center shrink-0 shadow-lg`}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg whitespace-nowrap ${!sidebarOpen && 'lg:hidden'} ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {userRole === 'patient' ? 'MyHealth' : 'MediCore'}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
              collapsed={!sidebarOpen}
              userRole={userRole}
              darkMode={darkMode}
            />
          ))}
        </nav>

        <div className={`p-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group
              ${darkMode ? 'text-slate-400 hover:bg-rose-900/30 hover:text-rose-400' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'}
              ${!sidebarOpen && 'lg:justify-center'}
            `}
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            {sidebarOpen ? <span className="font-medium">Logout</span> : <span className="lg:hidden">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 transition-colors duration-300 backdrop-blur-md border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm
          ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}
        `}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors border shadow-sm active:scale-95
                ${darkMode ? 'hover:bg-slate-800 text-slate-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-transparent hover:border-slate-200'}
              `}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className={`hidden md:flex items-center rounded-xl px-4 py-1.5 w-80 border focus-within:ring-2 focus-within:ring-${themeColor}-500 transition-all shadow-inner
              ${darkMode ? 'bg-slate-800/50 border-slate-700 focus-within:bg-slate-800' : 'bg-slate-100/50 border-slate-200 focus-within:bg-white'}
            `}>
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder={userRole === 'patient' ? 'Search records...' : 'Search patients...'} 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-500 text-slate-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all shadow-sm
                ${darkMode ? 'hover:bg-slate-800 text-amber-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-transparent hover:border-slate-200'}
              `}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-2 rounded-xl border transition-all shadow-sm
                ${darkMode ? 'hover:bg-slate-800 text-slate-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-transparent hover:border-slate-200'}
              `}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            </motion.button>
            
            <div className="relative group">
              <button className={`flex items-center gap-3 pl-4 border-l transition-all active:scale-95
                ${darkMode ? 'border-slate-800' : 'border-slate-200'}
              `}>
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{userName}</p>
                  <p className={`text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${userRole === 'patient' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'}`}>{userRole}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-6 ${userRole === 'patient' ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'}`}>
                  <UserCircle className="w-7 h-7" />
                </div>
              </button>

              <div className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all z-50
                ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
              `}>
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                  <p className={`text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{userName}</p>
                  <p className="text-xs text-slate-500">{userEmail}</p>
                </div>
                <div className="p-2">
                  <button className={`w-full text-left px-3 py-2.5 text-sm rounded-xl flex items-center gap-3 transition-colors
                    ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}
                  `}>
                    <UserCircle className={`w-5 h-5 ${userRole === 'patient' ? 'text-indigo-500' : 'text-teal-500'}`} /> <span className="font-medium">My Profile</span>
                  </button>
                  <button className={`w-full text-left px-3 py-2.5 text-sm rounded-xl flex items-center gap-3 transition-colors
                    ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}
                  `}>
                    <Settings className={`w-5 h-5 ${userRole === 'patient' ? 'text-indigo-500' : 'text-teal-500'}`} /> <span className="font-medium">{userRole === 'patient' ? 'Preferences' : 'Account Settings'}</span>
                  </button>
                </div>
                <div className={`p-2 border-t ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> <span className="font-bold">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-4 sm:p-6 lg:p-8"
            >
              <div className={`max-w-7xl mx-auto rounded-3xl p-1 bg-gradient-to-br from-transparent via-transparent to-${themeColor}-100/30`}>
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};