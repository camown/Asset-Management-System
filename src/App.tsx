import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AssetsList from './pages/assets/AssetsList';
import AssetForm from './pages/assets/AssetForm';
import AssetDetails from './pages/assets/AssetDetails';
import WarrantyList from './pages/warranty/WarrantyList';
import WarrantyForm from './pages/warranty/WarrantyForm';
import WarrantyDetails from './pages/warranty/WarrantyDetails';
import MaintenanceList from './pages/maintenance/MaintenanceList';
import MaintenanceForm from './pages/maintenance/MaintenanceForm';
import MaintenanceDetails from './pages/maintenance/MaintenanceDetails';
import FinancialInsights from './pages/financial/FinancialInsights';
import Settings from './pages/settings/Settings';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      
      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assets" element={<AssetsList />} />
        <Route path="/assets/new" element={<AssetForm />} />
        <Route path="/assets/:id" element={<AssetDetails />} />
        <Route path="/warranties" element={<WarrantyList />} />
        <Route path="/warranties/new" element={<WarrantyForm />} />
        <Route path="/warranties/:id" element={<WarrantyDetails />} />
        <Route path="/maintenance" element={<MaintenanceList />} />
        <Route path="/maintenance/new" element={<MaintenanceForm />} />
        <Route path="/maintenance/:id" element={<MaintenanceDetails />} />
        <Route path="/financial" element={<FinancialInsights />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;