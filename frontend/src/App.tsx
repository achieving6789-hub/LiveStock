import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboards
import { FarmerDashboard } from './pages/dashboards/FarmerDashboard';
import { FieldWorkerDashboard } from './pages/dashboards/FieldWorkerDashboard';
import { VeterinarianDashboard } from './pages/dashboards/VeterinarianDashboard';
import { LabDashboard } from './pages/dashboards/LabDashboard';
import { DistrictDashboard } from './pages/dashboards/DistrictDashboard';
import { StateDashboard } from './pages/dashboards/StateDashboard';
import { SuperAdminDashboard } from './pages/dashboards/SuperAdminDashboard';

// Farmer & Clinical Modules
import { ReportHealthIssuePage } from './pages/farmer/ReportHealthIssuePage';
import { ReportMortalityPage } from './pages/farmer/ReportMortalityPage';
import { MyAnimalsPage } from './pages/farmer/MyAnimalsPage';
import { AnimalTimelinePage } from './pages/farmer/AnimalTimelinePage';
import { AdvisoriesPage } from './pages/farmer/AdvisoriesPage';

// Veterinary & Lab Modules
import { PriorityQueuePage } from './pages/veterinarian/PriorityQueuePage';
import { InvestigationsPage } from './pages/veterinarian/InvestigationsPage';
import { SampleRequestsPage } from './pages/veterinarian/SampleRequestsPage';
import { LabSampleQueuePage } from './pages/lab/LabSampleQueuePage';
import { LabResultsPage } from './pages/lab/LabResultsPage';

// Surveillance & Admin Modules
import { DistrictSurveillancePage } from './pages/district/DistrictSurveillancePage';
import { DistrictMortalityPage } from './pages/district/DistrictMortalityPage';
import { StateDistrictsPage } from './pages/state/StateDistrictsPage';
import { StateGISPage } from './pages/state/StateGISPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';

import { LanguageProvider } from './contexts/LanguageContext';

// Dynamic redirect component based on user's active role
const RoleBasedRedirect: React.FC = () => {
  const { user, activeRole, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (activeRole) {
    case 'FARMER':
      return <Navigate to="/farmer" replace />;
    case 'FIELD_WORKER':
      return <Navigate to="/field-worker" replace />;
    case 'VETERINARIAN':
      return <Navigate to="/veterinarian" replace />;
    case 'LAB_STAFF':
      return <Navigate to="/lab" replace />;
    case 'DISTRICT_OFFICER':
      return <Navigate to="/district" replace />;
    case 'STATE_ADMIN':
      return <Navigate to="/state" replace />;
    case 'SUPER_ADMIN':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/farmer" replace />;
  }
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Root dynamic redirector */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Protected Application Routes wrapped with Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            {/* FARMER SCOPE */}
            <Route element={<ProtectedRoute allowedRoles={['FARMER', 'SUPER_ADMIN']} />}>
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/farmer/report" element={<ReportHealthIssuePage />} />
              <Route path="/farmer/mortality" element={<ReportMortalityPage />} />
              <Route path="/farmer/animals" element={<MyAnimalsPage />} />
              <Route path="/farmer/animals/:id" element={<AnimalTimelinePage />} />
              <Route path="/farmer/advisories" element={<AdvisoriesPage />} />
            </Route>

            {/* FIELD WORKER SCOPE */}
            <Route element={<ProtectedRoute allowedRoles={['FIELD_WORKER', 'SUPER_ADMIN']} />}>
              <Route path="/field-worker" element={<FieldWorkerDashboard />} />
              <Route path="/field-worker/reports" element={<PriorityQueuePage />} />
              <Route path="/field-worker/assigned" element={<InvestigationsPage />} />
            </Route>

            {/* VETERINARIAN SCOPE */}
            <Route element={<ProtectedRoute allowedRoles={['VETERINARIAN', 'SUPER_ADMIN']} />}>
              <Route path="/veterinarian" element={<VeterinarianDashboard />} />
              <Route path="/veterinarian/queue" element={<PriorityQueuePage />} />
              <Route path="/veterinarian/investigations" element={<InvestigationsPage />} />
              <Route path="/veterinarian/samples" element={<SampleRequestsPage />} />
            </Route>

            {/* LAB STAFF SCOPE */}
            <Route element={<ProtectedRoute allowedRoles={['LAB_STAFF', 'SUPER_ADMIN']} />}>
              <Route path="/lab" element={<LabDashboard />} />
              <Route path="/lab/samples" element={<LabSampleQueuePage />} />
              <Route path="/lab/results" element={<LabResultsPage />} />
            </Route>

            {/* DISTRICT OFFICER SCOPE */}
            <Route element={<ProtectedRoute allowedRoles={['DISTRICT_OFFICER', 'SUPER_ADMIN']} />}>
              <Route path="/district" element={<DistrictDashboard />} />
              <Route path="/district/surveillance" element={<DistrictSurveillancePage />} />
              <Route path="/district/mortality" element={<DistrictMortalityPage />} />
            </Route>

            {/* STATE ADMIN SCOPE */}
            <Route element={<ProtectedRoute allowedRoles={['STATE_ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/state" element={<StateDashboard />} />
              <Route path="/state/districts" element={<StateDistrictsPage />} />
              <Route path="/state/gis" element={<StateGISPage />} />
            </Route>

            {/* SUPER ADMIN SCOPE */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/admin" element={<SuperAdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/audit" element={<AdminAuditPage />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
