import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { ConsumerDashboard, ConsumerCommitments, ConsumerMerchants } from './pages/Consumer';
import { EmployerDashboard, EmployerEmployees, EmployerRules } from './pages/Employer';
import { BusinessDashboard, BusinessCustomers, BusinessSettlements, BusinessAPI } from './pages/Business';
import { AdminDashboard, AdminEmployers, AdminBusinesses, AdminConsumers } from './pages/Admin';
import { AppProvider, useApp } from './context';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser, impersonatedUser } = useApp();
  if (!currentUser && !impersonatedUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* Consumer Routes */}
      <Route path="/consumer" element={<ProtectedRoute><Layout><ConsumerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/consumer/commitments" element={<ProtectedRoute><Layout><ConsumerCommitments /></Layout></ProtectedRoute>} />
      <Route path="/consumer/merchants" element={<ProtectedRoute><Layout><ConsumerMerchants /></Layout></ProtectedRoute>} />
      
      {/* Employer Routes */}
      <Route path="/employer" element={<ProtectedRoute><Layout><EmployerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/employer/employees" element={<ProtectedRoute><Layout><EmployerEmployees /></Layout></ProtectedRoute>} />
      <Route path="/employer/rules" element={<ProtectedRoute><Layout><EmployerRules /></Layout></ProtectedRoute>} />

      {/* Business Routes */}
      <Route path="/business" element={<ProtectedRoute><Layout><BusinessDashboard /></Layout></ProtectedRoute>} />
      <Route path="/business/customers" element={<ProtectedRoute><Layout><BusinessCustomers /></Layout></ProtectedRoute>} />
      <Route path="/business/settlements" element={<ProtectedRoute><Layout><BusinessSettlements /></Layout></ProtectedRoute>} />
      <Route path="/business/api" element={<ProtectedRoute><Layout><BusinessAPI /></Layout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin/employers" element={<ProtectedRoute><Layout><AdminEmployers /></Layout></ProtectedRoute>} />
      <Route path="/admin/businesses" element={<ProtectedRoute><Layout><AdminBusinesses /></Layout></ProtectedRoute>} />
      <Route path="/admin/consumers" element={<ProtectedRoute><Layout><AdminConsumers /></Layout></ProtectedRoute>} />
    </Routes>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
