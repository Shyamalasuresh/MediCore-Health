import React, { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// --- Card ---
export const Card: React.FC<{ children: ReactNode; className?: string; title?: string; action?: ReactNode; variant?: 'default' | 'patient' | 'clinic' }> = ({ children, className = '', title, action, variant = 'default' }) => {
  const userRole = localStorage.getItem('userRole') || 'doctor';
  
  // Custom border and shadow effects based on role/variant
  const effects = userRole === 'patient' 
    ? 'border-indigo-100 dark:border-indigo-900/50 shadow-lg shadow-indigo-100/50 dark:shadow-none hover:shadow-indigo-200/50 transition-all duration-300' 
    : 'border-teal-100 dark:border-teal-900/50 shadow-md shadow-teal-50/50 dark:shadow-none hover:shadow-teal-100/50 transition-all duration-300';

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border ${effects} ${className}`}>
      {(title || action) && (
        <div className={`px-6 py-4 border-b ${userRole === 'patient' ? 'border-indigo-50 bg-indigo-50/20 dark:border-indigo-900/30 dark:bg-indigo-950/20' : 'border-teal-50 bg-teal-50/20 dark:border-teal-900/30 dark:bg-teal-950/20'} flex justify-between items-center rounded-t-xl`}>
          {title && <h3 className={`font-bold text-lg ${userRole === 'patient' ? 'text-indigo-900 dark:text-indigo-400' : 'text-teal-900 dark:text-teal-400'}`}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

// --- Button ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, icon, className = '', ...props 
}) => {
  const userRole = localStorage.getItem('userRole') || 'doctor';
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg active:scale-95";
  
  const variants = {
    primary: userRole === 'patient' 
      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none" 
      : "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-sm shadow-teal-200 dark:shadow-none",
    secondary: "bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 focus:ring-slate-500",
    outline: userRole === 'patient'
      ? "border border-indigo-200 dark:border-indigo-800 bg-transparent text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500"
      : "border border-teal-200 dark:border-teal-800 bg-transparent text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 focus:ring-teal-500",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : icon ? <span className="mr-2">{icon}</span> : null}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const userRole = localStorage.getItem('userRole') || 'doctor';
  const focusRing = userRole === 'patient' ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-teal-500 focus:border-teal-500';

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <input
        className={`w-full h-10 px-3 rounded-lg border transition-all text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
          ${error ? 'border-red-500 focus:ring-red-500' : `border-slate-300 dark:border-slate-700 ${focusRing}`} 
          focus:outline-none focus:ring-1 shadow-sm ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: ReactNode; variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
    warning: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50",
    error: "bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50",
    neutral: "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    info: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Table Components ---
export const Table: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">{children}</table>
  </div>
);

export const Thead: React.FC<{ children: ReactNode }> = ({ children }) => {
  const userRole = localStorage.getItem('userRole') || 'doctor';
  const bg = userRole === 'patient' ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'bg-teal-50/30 dark:bg-teal-900/10';
  return (
    <thead className={`text-xs text-slate-500 dark:text-slate-400 uppercase ${bg} border-b border-slate-200 dark:border-slate-800`}>
      {children}
    </thead>
  );
};

export const Th: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th scope="col" className={`px-6 py-3 font-semibold ${className}`}>{children}</th>
);

export const Tr: React.FC<{ children: ReactNode; onClick?: () => void; className?: string }> = ({ children, onClick, className = '' }) => (
  <tr 
    onClick={onClick} 
    className={`bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const Td: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);
