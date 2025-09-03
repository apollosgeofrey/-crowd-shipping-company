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
        <div className="mb-4">
          <label className="form-label">Verification Code</label>
        <input className="form-control" value={code} onChange={(e)=>setCode(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Verify</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/login" className="text-sm text-blue-600">Back to login</Link>
      </div>
    </AuthLayout>
  );
}
