import { useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { loginApi, LoginPayload, meApi } from "../services/authService";
import { useAppDispatch } from "../../../app/store";
import { setAuth } from "../store/authSlice";

export default function Login() {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { token } = await loginApi(form);
      const user = await meApi();
      dispatch(setAuth({ token, user }));
      Swal.fire("Success", "Login successful", "success");
      nav("/dashboard");
    } catch (e:any) {
      Swal.fire("Error", e?.response?.data?.message || "Invalid credentials", "error");
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" type="email"
            value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})}
            required />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input className="form-control" type="password"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})}
            required />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <div className="text-center mt-3">
        <Link to="/forgot-password" className="text-sm text-blue-600">Forgot password?</Link>
      </div>
    </AuthLayout>
  );
}
