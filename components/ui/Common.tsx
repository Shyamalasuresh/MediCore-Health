import React, { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// --- Card ---
export const Card: React.FC<{ children: ReactNode; className?: string; title?: string; action?: ReactNode }> = ({ children, className = '', title, action }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        {title && <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

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
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500",
    outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500",
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

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input
      className={`w-full h-10 px-3 rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-teal-500'} focus:border-teal-500 focus:outline-none focus:ring-1 transition-colors text-sm bg-white text-slate-900 placeholder-slate-400 ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: ReactNode; variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-rose-100 text-rose-800",
    neutral: "bg-slate-100 text-slate-800",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Table Components ---
export const Table: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-slate-600">{children}</table>
  </div>
);

export const Thead: React.FC<{ children: ReactNode }> = ({ children }) => (
  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
    {children}
  </thead>
);

export const Th: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th scope="col" className={`px-6 py-3 font-medium ${className}`}>{children}</th>
);

export const Tr: React.FC<{ children: ReactNode; onClick?: () => void; className?: string }> = ({ children, onClick, className = '' }) => (
  <tr 
    onClick={onClick} 
    className={`bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const Td: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);
