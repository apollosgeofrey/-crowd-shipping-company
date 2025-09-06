import { useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout";
import Swal from "sweetalert2";
import { forgotPasswordApi } from "../services/authService";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPasswordApi(email);
      Swal.fire("Sent", "Password reset link sent to your email", "success");
    } catch (e:any) {
      Swal.fire("Error", e?.response?.data?.message || "Unable to send reset link", "error");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={submit}>
        <p className="text-center fw-bold text-dark small mt-5 mb-4">Reset Password</p>
        <div className="mb-5">
          <label className="form-label text-justify small mb-3">
            Please enter the email address attached to your account
          </label>
          <input className="form-control border-primary" type="email" placeholder="Enter Email Address"
            value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100 rounded-pill">Send Reset Link</button>
      </form>
      <div className="text-left small mt-3">
        <Link to="/login" className="text-sm text-primary text-decoration-none">
          <span className="fas fa-angle-double-left"></span>Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}