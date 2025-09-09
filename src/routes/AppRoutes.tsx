import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import Dashboard from "../features/dashboard/pages/Dashboard";
// import Users from "../features/users/pages/Users";
import NotFoundPage from "../features/errors/pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={
          <Dashboard />
          // <Users />
          // <ProtectedRoute>
          //   <Dashboard />
          //   <Users />
          // </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}