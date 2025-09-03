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
        <div className="mb-4">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={email}
                 onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Send Reset Link</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/login" className="text-sm text-blue-600">Back to login</Link>
      </div>
    </AuthLayout>
  );
}
