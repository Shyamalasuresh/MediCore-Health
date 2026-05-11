import React, { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button, Input } from '../components/ui/Common';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'doctor' | 'patient'>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await apiService.login({
        email,
        password,
        role
      });

      // Simulated auth storage with real data from API
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.full_name);
      localStorage.setItem('userEmail', data.email);
      if (data.patient_id) {
        localStorage.setItem('patientId', data.patient_id.toString());
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isRedFlag = error?.includes('RED FLAG');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className={`mx-auto h-12 w-12 ${role === 'doctor' ? 'bg-teal-600' : 'bg-indigo-600'} rounded-xl flex items-center justify-center shadow-lg transition-colors`}>
          <Activity className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        
        <div className="mt-4 flex justify-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl w-fit mx-auto shadow-inner">
          <button 
            onClick={() => { setRole('doctor'); setError(null); }}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${role === 'doctor' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-md scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Clinic Staff
          </button>
          <button 
            onClick={() => { setRole('patient'); setError(null); }}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${role === 'patient' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Patient Portal
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className={`bg-white dark:bg-slate-900 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border ${isRedFlag ? 'border-red-500 bg-red-50/10' : 'border-slate-100 dark:border-slate-800'}`}>
          
          {error && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-shake ${isRedFlag ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'}`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 ${isRedFlag ? 'text-white' : 'text-amber-500'}`} />
              <div>
                <p className={`text-sm font-bold ${isRedFlag ? 'uppercase tracking-wide' : ''}`}>{isRedFlag ? 'Security Alert' : 'Authentication Error'}</p>
                <p className="text-xs opacity-90 mt-1 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${role === 'doctor' ? 'text-teal-400' : 'text-indigo-400'}`} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 block w-full border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 ${role === 'doctor' ? 'focus:ring-teal-500 focus:border-teal-500' : 'focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm h-12 border dark:bg-slate-800 dark:text-slate-100 px-4 transition-all shadow-sm`} 
                  placeholder="you@example.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${role === 'doctor' ? 'text-teal-400' : 'text-indigo-400'}`} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 block w-full border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 ${role === 'doctor' ? 'focus:ring-teal-500 focus:border-teal-500' : 'focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm h-12 border dark:bg-slate-800 dark:text-slate-100 px-4 transition-all shadow-sm`} 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className={`h-4 w-4 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800 ${role === 'doctor' ? 'text-teal-600 focus:ring-teal-500' : 'text-indigo-600 focus:ring-indigo-500'}`} />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 font-medium">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className={`font-bold ${role === 'doctor' ? 'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300' : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'}`}>Forgot password?</a>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full flex justify-center h-12 text-base font-bold shadow-lg" 
              variant="primary"
              isLoading={isLoading}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className={`font-bold ${role === 'doctor' ? 'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300' : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'}`}
              >
                {mode === 'login' ? 'Sign up now' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Test Accounts Tip */}
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2">Development Access</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Doctor:</span>
              <code className="bg-white dark:bg-slate-900 px-1.5 rounded border border-slate-200 dark:border-slate-700 font-bold dark:text-slate-300">doctor@medicore.com / password123</code>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Patient:</span>
              <code className="bg-white dark:bg-slate-900 px-1.5 rounded border border-slate-200 dark:border-slate-700 font-bold dark:text-slate-300">patient@example.com / password123</code>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Admin:</span>
              <code className="bg-white dark:bg-slate-900 px-1.5 rounded border border-slate-200 dark:border-slate-700 font-bold dark:text-slate-300">admin@medicore.com / adminpassword</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
