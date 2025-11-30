import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Role } from '../types';
import { ShieldCheck, User, Building, Briefcase, Lock } from 'lucide-react';
import { Button, Card } from '../components/ui';

const DEMO_CREDENTIALS = {
  [Role.CONSUMER]: 'john@techcorp.com',
  [Role.EMPLOYER]: 'hr@techcorp.com',
  [Role.BUSINESS]: 'owner@fitlifegym.com',
  [Role.ADMIN]: 'admin@salarypay.com'
};

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(Role.CONSUMER);
  const [email, setEmail] = useState(DEMO_CREDENTIALS[Role.CONSUMER]);
  const [password, setPassword] = useState('password');
  const [isSignup, setIsSignup] = useState(false);
  const [employerName, setEmployerName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth delay
    setTimeout(() => {
        login(email || `${role.toLowerCase()}@demo.com`, role);
        switch (role) {
            case Role.CONSUMER: navigate('/consumer'); break;
            case Role.EMPLOYER: navigate('/employer'); break;
            case Role.BUSINESS: navigate('/business'); break;
            case Role.ADMIN: navigate('/admin'); break;
        }
    }, 500);
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setIsSignup(false);
    setEmail(DEMO_CREDENTIALS[selectedRole]);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl shadow-lg mb-4">
          <ShieldCheck className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">SalaryPay</h1>
        <p className="text-slate-500 mt-2">Financial freedom, powered by your salary.</p>
      </div>

      <Card className="w-full max-w-md p-8">
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => handleRoleSelect(Role.CONSUMER)} 
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${role === Role.CONSUMER ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Consumer
          </button>
          <button 
            onClick={() => handleRoleSelect(Role.EMPLOYER)}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${role === Role.EMPLOYER ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Employer
          </button>
          <button 
            onClick={() => handleRoleSelect(Role.BUSINESS)}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${role === Role.BUSINESS ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Business
          </button>
           <button 
            onClick={() => handleRoleSelect(Role.ADMIN)}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${role === Role.ADMIN ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Admin
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {isSignup && role === Role.CONSUMER && (
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employer Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Where do you work?"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">If your employer isn't registered, we'll contact them.</p>
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-2.5 mt-2">
            {isSignup ? 'Create Account' : 'Sign In'}
          </Button>
        </form>
        
        {role === Role.CONSUMER && (
            <div className="mt-6 text-center">
            <button 
                onClick={() => setIsSignup(!isSignup)} 
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
            >
                {isSignup ? 'Already have an account? Sign In' : 'New here? Create an account'}
            </button>
            </div>
        )}
      </Card>
    </div>
  );
};