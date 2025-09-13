import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../features/auth/pages/Login.tsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.tsx";
import ResetPassword from "../features/auth/pages/ResetPassword.tsx";
import VerifyEmail from "../features/auth/pages/VerifyEmail.tsx";
import Dashboard from "../features/dashboard/pages/Dashboard.tsx";
import Users from "../features/users/pages/Users.tsx";
import UserDetail from "../features/users/pages/UserDetail.tsx";
import Admin from "../features/admin/pages/Admin.tsx";
import AdminDetail from "../features/admin/pages/AdminDetail.tsx";
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
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />

        {/* admin management routes */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/:id" element={<ProtectedRoute><AdminDetail /></ProtectedRoute>} />

        {/* fallback routes id non is found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}