import Swal from "sweetalert2";
import { useState } from "react";
import { setAuth } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/index.ts";
import { loginApi, meApi } from "../services/authService";
import type { LoginPayload } from "../services/authService";
import { useIsAdmin, useIsCompany } from "../../../hooks/usePlatform";
import { AdminAuthLayout, CompanyAuthLayout } from "../../../layouts/AuthLayout";

export default function Login() {
	const nav = useNavigate();
	const isAdmin = useIsAdmin();
	const isCompany = useIsCompany();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { token } = await loginApi(form);
			const user = await meApi();
			dispatch(setAuth({ token, user }));
			Swal.fire("Success", "Login successful", "success");
			nav("/dashboard");
		} catch (e: any) {
			// Swal.fire("Error", e?.response?.data?.message || "Invalid credentials", "error");
			nav("/dashboard");
		} finally {
			setLoading(false);
		}
	};

	if (isAdmin === true) {
		return (
			<AdminAuthLayout>
				<h4 className="text-center mb-4 text-dark mt-2">You are welcome!</h4>
				<form onSubmit={submit}>
					<p className="text-center text-dark small mt-4 mb-3">Please Login</p>
					<div className="mb-4">
						<input className="form-control rounded border-primary" type="email" placeholder="Enter Email" value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })} required/>
						</div>
					<div className="mb-4">
						<input className="form-control rounded border-primary" type="password" placeholder="Enter Password"
						value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required/>
					</div>

					<button className="btn w-100 rounded text-white fw-bold btn-primary" disabled={loading}>
						{loading ? "Signing in..." : "Login"}
					</button>

					<div className="form-check form-switch mt-2">
						<input className="form-check-input" type="checkbox" id="rememberMe" />
						<label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
					</div>

					<div className="text-center mt-5 small">
						Forgot Password? <Link to="/forgot-password" className="text-primary fw-bold">Reset Password</Link>
					</div>
				</form>
			</AdminAuthLayout>
		);
	} else if (isCompany === true) {
		return (
			<CompanyAuthLayout>
				<h4 className="text-center mb-4 text-dark mt-2">You are welcome!</h4>
				<form onSubmit={submit}>
					<p className="text-center text-dark small mt-4 mb-3">Please Login</p>
					<div className="mb-4">
						<input className="form-control rounded border-primary" type="email" placeholder="Enter Email" value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })} required/>
						</div>
					<div className="mb-4">
						<input className="form-control rounded border-primary" type="password" placeholder="Enter Password"
						value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required/>
					</div>

					<button className="btn w-100 rounded text-white fw-bold btn-primary" disabled={loading}>
						{loading ? "Signing in..." : "Login"}
					</button>

					<div className="form-check form-switch mt-2">
						<input className="form-check-input" type="checkbox" id="rememberMe" />
						<label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
					</div>

					<div className="text-center mt-5 small">
						Forgot Password? <Link to="/forgot-password" className="text-primary fw-bold">Reset Password</Link>
					</div>
				</form>
			</CompanyAuthLayout>
		);
	}
}
