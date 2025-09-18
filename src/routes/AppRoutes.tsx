// components
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// auth routes
import Login from "../features/auth/pages/Login.tsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.tsx";
import ResetPassword from "../features/auth/pages/ResetPassword.tsx";
import VerifyEmail from "../features/auth/pages/VerifyEmail.tsx";

// dashboard route
import Dashboard from "../features/dashboard/pages/Dashboard.tsx";

// users management routes 
import UserList from "../features/users/pages/UserList.tsx";
import UserDetail from "../features/users/pages/UserDetail.tsx";
import UserCreate from "../features/users/pages/UserCreate.tsx";
import UserEdit from "../features/users/pages/UserEdit.tsx";

// admin management routes
import AdminList from "../features/admin/pages/AdminList.tsx";
import AdminDetail from "../features/admin/pages/AdminDetail.tsx";
import AdminCreate from "../features/admin/pages/AdminCreate.tsx";
import AdminEdit from "../features/admin/pages/AdminEdit.tsx";

// drivers management routes
import DriverList from "../features/drivers/pages/DriverList.tsx";
import DriverDetail from "../features/drivers/pages/DriverDetail.tsx";
import DriverCreate from "../features/drivers/pages/DriverCreate.tsx";
import DriverEdit from "../features/drivers/pages/DriverEdit.tsx";
// import DriverRequests from "../features/drivers/pages/DriverRequests.tsx";

// pathfinders management routes
import PathfinderList from "../features/pathfinders/pages/PathfinderList.tsx";
import PathfinderDetail from "../features/pathfinders/pages/PathfinderDetail.tsx";
import PathfinderCreate from "../features/pathfinders/pages/PathfinderCreate.tsx";
import PathfinderEdit from "../features/pathfinders/pages/PathfinderEdit.tsx";
// import PathfinderRequests from "../features/pathfinders/pages/PathfinderRequests.tsx";

// companies management routes
import CompanyList from "../features/companies/pages/CompanyList.tsx";
import CompanyDetail from "../features/companies/pages/CompanyDetail.tsx";
import CompanyCreate from "../features/companies/pages/CompanyCreate.tsx";
import CompanyEdit from "../features/companies/pages/CompanyEdit.tsx";
// import CompanyRequests from "../features/companies/pages/CompanyRequests.tsx";

// fallback route
import NotFoundPage from "../features/errors/pages/NotFoundPage.tsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* dashboard routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* users management routes */}
        <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="/users/create" element={<ProtectedRoute><UserCreate /></ProtectedRoute>} />
        <Route path="/users/:id/show" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
        <Route path="/users/:id/edit" element={<ProtectedRoute><UserEdit /></ProtectedRoute>} />
    
        {/* admin management routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
        <Route path="/admin/create" element={<ProtectedRoute><AdminCreate /></ProtectedRoute>} />
        <Route path="/admin/:id/show" element={<ProtectedRoute><AdminDetail /></ProtectedRoute>} />
        <Route path="/admin/:id/edit" element={<ProtectedRoute><AdminEdit /></ProtectedRoute>} />

        {/* drivers management routes */}
        <Route path="/drivers" element={<ProtectedRoute><DriverList /></ProtectedRoute>} />
        <Route path="/drivers/create" element={<ProtectedRoute><DriverCreate /></ProtectedRoute>} />
        {/* <Route path="/drivers/requests" element={<ProtectedRoute><DriverRequests /></ProtectedRoute>} /> */}
        <Route path="/drivers/:id/show" element={<ProtectedRoute><DriverDetail /></ProtectedRoute>} />
        <Route path="/drivers/:id/edit" element={<ProtectedRoute><DriverEdit /></ProtectedRoute>} />

        {/* pathfinders management routes */}
        <Route path="/pathfinders" element={<ProtectedRoute><PathfinderList /></ProtectedRoute>} />
        <Route path="/pathfinders/create" element={<ProtectedRoute><PathfinderCreate /></ProtectedRoute>} />
        {/* <Route path="/pathfinders/requests" element={<ProtectedRoute><PathfinderRequests /></ProtectedRoute>} /> */}
        <Route path="/pathfinders/:id/show" element={<ProtectedRoute><PathfinderDetail /></ProtectedRoute>} />
        <Route path="/pathfinders/:id/edit" element={<ProtectedRoute><PathfinderEdit /></ProtectedRoute>} />

        {/* companies management routes */}
        <Route path="/companies" element={<ProtectedRoute><CompanyList /></ProtectedRoute>} />
        <Route path="/companies/create" element={<ProtectedRoute><CompanyCreate /></ProtectedRoute>} />
        {/* <Route path="/companies/requests" element={<ProtectedRoute><CompanyRequests /></ProtectedRoute>} /> */}
        <Route path="/companies/:id/show" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
        <Route path="/companies/:id/edit" element={<ProtectedRoute><CompanyEdit /></ProtectedRoute>} />

        {/* fallback routes id non is found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}