import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, Employer, Business, Employee, Commitment, Settlement } from './types';
import { MOCK_USERS, MOCK_EMPLOYERS, MOCK_BUSINESSES, MOCK_EMPLOYEES, MOCK_COMMITMENTS, MOCK_SETTLEMENTS } from './mockData';

interface AppState {
  users: User[];
  employers: Employer[];
  businesses: Business[];
  employees: Employee[];
  commitments: Commitment[];
  settlements: Settlement[];
}

interface AppContextType {
  currentUser: User | null;
  impersonatedUser: User | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  startImpersonation: (user: User) => void;
  stopImpersonation: () => void;
  state: AppState;
  // Actions
  addEmployee: (employee: Employee) => void;
  updateEmployeeStatus: (id: string, status: 'Enabled' | 'Disabled') => void;
  updateCommitmentAmount: (id: string, amount: number) => void;
  cancelCommitment: (id: string) => void;
  updateEmployerRule: (id: string, percent: number) => void;
  toggleBusinessStatus: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  
  const [state, setState] = useState<AppState>({
    users: MOCK_USERS,
    employers: MOCK_EMPLOYERS,
    businesses: MOCK_BUSINESSES,
    employees: MOCK_EMPLOYEES,
    commitments: MOCK_COMMITMENTS,
    settlements: MOCK_SETTLEMENTS,
  });

  const login = (email: string, role: Role) => {
    // Simple mock login based on email prefix or role for demo
    let user = state.users.find(u => u.email === email && u.role === role);
    if (!user) {
        // Fallback for demo ease: Create a temp user if not found in mock but valid role
        user = {
            id: `temp-${Date.now()}`,
            name: 'Demo User',
            email,
            role,
            employerId: role === Role.CONSUMER ? 'emp1' : undefined,
            businessId: role === Role.BUSINESS ? 'biz1' : undefined
        };
    }
    setCurrentUser(user);
    setImpersonatedUser(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setImpersonatedUser(null);
  };

  const startImpersonation = (user: User) => {
    setImpersonatedUser(user);
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
  };

  const addEmployee = (employee: Employee) => {
    setState(prev => ({ ...prev, employees: [...prev.employees, employee] }));
  };

  const updateEmployeeStatus = (id: string, status: 'Enabled' | 'Disabled') => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === id ? { ...e, status } : e)
    }));
  };

  const updateCommitmentAmount = (id: string, amount: number) => {
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.map(c => c.id === id ? { ...c, amount } : c)
    }));
  };

  const cancelCommitment = (id: string) => {
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.map(c => c.id === id ? { ...c, status: 'Cancelled' } : c)
    }));
  };

  const updateEmployerRule = (id: string, percent: number) => {
    setState(prev => ({
        ...prev,
        employers: prev.employers.map(e => e.id === id ? { ...e, maxDeductionPercent: percent } : e)
    }));
  };

  const toggleBusinessStatus = (id: string) => {
      setState(prev => ({
          ...prev,
          businesses: prev.businesses.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Suspended' : 'Active' } : b)
      }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      impersonatedUser,
      login,
      logout,
      startImpersonation,
      stopImpersonation,
      state,
      addEmployee,
      updateEmployeeStatus,
      updateCommitmentAmount,
      cancelCommitment,
      updateEmployerRule,
      toggleBusinessStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
