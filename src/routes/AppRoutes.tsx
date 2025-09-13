import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../features/auth/pages/Login.tsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.tsx";
import ResetPassword from "../features/auth/pages/ResetPassword.tsx";
import VerifyEmail from "../features/auth/pages/VerifyEmail.tsx";

import Dashboard from "../features/dashboard/pages/Dashboard.tsx";

import UserList from "../features/users/pages/UserList.tsx";
import UserDetail from "../features/users/pages/UserDetail.tsx";
import UserCreate from "../features/users/pages/UserCreate.tsx";
import UserEdit from "../features/users/pages/UserEdit.tsx";

import AdminList from "../features/admin/pages/AdminList.tsx";
import AdminDetail from "../features/admin/pages/AdminDetail.tsx";
import AdminCreate from "../features/admin/pages/AdminCreate.tsx";
import AdminEdit from "../features/admin/pages/AdminEdit.tsx";

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


        {/* fallback routes id non is found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}