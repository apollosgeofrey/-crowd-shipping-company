import { useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout";
import Swal from "sweetalert2";
import { verifyEmailApi } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmailApi(code);
      Swal.fire("Verified", "Your email is verified", "success");
      nav("/login");
    } catch (e:any) {
      Swal.fire("Error", e?.response?.data?.message || "Verification failed", "error");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={submit}>
        <p className="text-center fw-bold text-dark small mt-5 mb-4">Enter OTP</p>
        <div className="mb-4">
          <label className="form-label small mb-3 text-center">
            A code has been sent to your mail, check your inbox and input it below to continue
          </label>
          <input className="form-control border-primary" value={code} onChange={(e)=>setCode(e.target.value)} required
            placeholder="Enter OTP Code"
          />
        </div>
        <button className="mt-3 btn btn-primary w-100 rounded-pill">Verify and Proceed</button>
      </form>
      <div className="small text-center mt-3">
        Don't get code? <Link to="/forgot-password" className="text-sm text-primary text-decoration-none">Resend</Link>
      </div>
    </AuthLayout>
  );
}
