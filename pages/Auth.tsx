import React, { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui/Common';
import { useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center">
          <Activity className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Or{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-medium text-teal-600 hover:text-teal-500">
            {mode === 'login' ? 'start your 14-day free trial' : 'sign in to existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" className="pl-10 block w-full border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm h-10 border px-3" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input type="email" className="pl-10 block w-full border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm h-10 border px-3" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="password" className="pl-10 block w-full border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm h-10 border px-3" placeholder="••••••••" />
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-teal-600 hover:text-teal-500">Forgot password?</a>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full flex justify-center" size="lg">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
