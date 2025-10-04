import Swal from "sweetalert2";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../services/authService";
import { useIsAdmin, useIsCompany } from "../../../hooks/usePlatform";
import { AdminAuthLayout, CompanyAuthLayout } from "../../../layouts/AuthLayout";

export default function ForgotPassword() {
	const isAdmin = useIsAdmin();
	const isCompany = useIsCompany();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await forgotPasswordApi(email);
			Swal.fire("Sent", "Password reset link sent to your email", "success");
		} catch (e:any) {
			Swal.fire("Error", e?.response?.data?.message || "Unable to send reset link", "error");
		}
	};

	if (isAdmin === true) {
		return (
			<AdminAuthLayout>
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
			</AdminAuthLayout>
		);
	} else if (isCompany === true) {
		return (
			<CompanyAuthLayout>
				<div className="px-2">
			        <h2 className="text-center fw-bold mb-2" style={{ fontSize: "32px", color: "#0f1724" }}>
			          	Password Reset
			        </h2>

			        <p className="text-center text-muted mb-4" style={{ fontSize: "18px" }}>
			          	We Will Help You Reset your Password
			        </p>

			        <form onSubmit={submit} noValidate>
				        <div className="mb-4">
				            <label htmlFor="resetEmail" className="form-label small text-muted fw-bold mb-0">
				              	Email:<sup className="text-danger">*</sup>
				            </label>
				            <input id="resetEmail" name="email" type="email" className="form-control" placeholder="Enter Email Address" value={email} required onChange={(e) => setEmail(e.target.value)} aria-required/>
				        </div>

			          	{/* big orange button */}
			          	<button type="submit" className="btn btn-primary form-control fw-bold mb-4" disabled={loading} aria-disabled={loading}>
			            	{loading ? "Sending..." : "Reset Password"}
			          	</button>

			          	<hr />
			          	<div className="text-center mt-4 mb-3 text-muted fw-bold">Remembered your Password?</div>

			          	<Link to="/login" className="btn btn-outline-primary w-100 fw-bold mb-4">
				            <span className="fa fa-angle-double-left"></span> Back to Sign In
						</Link>
			        </form>
			    </div>
			</CompanyAuthLayout>
		);
	}
}