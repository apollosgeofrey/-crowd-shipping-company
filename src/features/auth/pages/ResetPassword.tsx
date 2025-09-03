import { useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout";
import Swal from "sweetalert2";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../services/authService";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return Swal.fire("Error", "Passwords do not match", "error");
    try {
      await resetPasswordApi({ token, email, password, password_confirmation: confirm });
      Swal.fire("Done", "Password has been reset", "success");
      nav("/login");
    } catch (e:any) {
      Swal.fire("Error", e?.response?.data?.message || "Reset failed", "error");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input className="form-control" type="password" value={password}
            onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label">Confirm Password</label>
          <input className="form-control" type="password" value={confirm}
            onChange={(e)=>setConfirm(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Reset Password</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/login" className="text-sm text-blue-600">Back to login</Link>
      </div>
    </AuthLayout>
  );
}
