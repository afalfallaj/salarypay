import React, { useState } from 'react';
import { useApp } from '../context';
import { Role } from '../types';
import { 
  Menu, X, LogOut, User as UserIcon, Building, 
  Briefcase, ShieldCheck, LayoutDashboard, 
  Users, CreditCard, DollarSign, Settings, EyeOff 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, impersonatedUser, logout, stopImpersonation } = useApp();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const activeUser = impersonatedUser || currentUser;
  const isImpersonating = !!impersonatedUser;

  if (!activeUser) return <>{children}</>;

  const getNavItems = () => {
    switch (activeUser.role) {
      case Role.CONSUMER:
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/consumer' },
          { label: 'Commitments', icon: CreditCard, path: '/consumer/commitments' },
          { label: 'Merchants', icon: Building, path: '/consumer/merchants' },
        ];
      case Role.EMPLOYER:
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/employer' },
          { label: 'Employees', icon: Users, path: '/employer/employees' },
          { label: 'Deduction Rules', icon: Settings, path: '/employer/rules' },
        ];
      case Role.BUSINESS:
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/business' },
          { label: 'Customers', icon: Users, path: '/business/customers' },
          { label: 'Settlements', icon: DollarSign, path: '/business/settlements' },
          { label: 'Developers', icon: Settings, path: '/business/api' },
        ];
      case Role.ADMIN:
        return [
          { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
          { label: 'Employers', icon: Building, path: '/admin/employers' },
          { label: 'Businesses', icon: Briefcase, path: '/admin/businesses' },
          { label: 'Consumers', icon: Users, path: '/admin/consumers' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="bg-amber-500 text-white px-4 py-2 flex justify-between items-center text-sm font-medium sticky top-0 z-50">
          <span>Viewing as {activeUser.name} ({activeUser.role}) - Read Only</span>
          <button 
            onClick={stopImpersonation}
            className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors"
          >
            <EyeOff size={16} /> Exit View
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center lg:hidden sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-indigo-600 text-xl">
          <ShieldCheck /> SalaryPay
        </div>
        <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
          <Menu />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <ShieldCheck /> SalaryPay
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X />
            </button>
          </div>

          <div className="px-6 py-4">
             <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                  {activeUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{activeUser.name}</div>
                  <div className="text-xs text-slate-400 capitalize">{activeUser.role.toLowerCase()}</div>
                </div>
             </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    location.pathname === item.path ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
            <button 
              onClick={logout} 
              className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
