import Swal from "sweetalert2";
import { useState } from "react";
import { resetPasswordApi } from "../services/authService";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useIsAdmin, useIsCompany } from "../../../hooks/usePlatform";
import { AdminAuthLayout, CompanyAuthLayout } from "../../../layouts/AuthLayout";

export default function ResetPassword() {
	const nav = useNavigate();
	const isAdmin = useIsAdmin();
	const isCompany = useIsCompany();
	const [params] = useSearchParams();
	const token = params.get("token") || "";
	const email = params.get("email") || "";

	const [confirm, setConfirm] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	// toggle states
	const [showConfirm, setShowConfirm] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirm) return Swal.fire("Error", "Passwords do not match", "error");
		try {
			setLoading(false);
			await resetPasswordApi({ token, email, password, confirm });
			Swal.fire("Done", "Password has been reset", "success");
			nav("/login");
		} catch (e:any) {
			Swal.fire("Error", e?.response?.data?.message || "Reset failed", "error");
		} finally {
			setLoading(false);
		}
	};
	if (isAdmin === true) {
		return (
			<AdminAuthLayout>
				<form onSubmit={submit}>
					<p className="text-center fw-bold text-dark small mt-4 mb-4">Enter New Password</p>
					{/* New Password */}
					<div className="mb-3">
						<label className="form-label mb-0 small">
							New Password:<sup className="text-danger">*</sup>
						</label>
						<div className="input-group">
							<input className="form-control border-primary border-end-0 rounded-end-0" type={showPassword ? "text" : "password"} value={password}
							placeholder="Enter New Password" onChange={(e) => setPassword(e.target.value)} required/>
							<button type="button" className="btn btn-outline-primary border-start-0 rounded-start-0" onClick={() => setShowPassword(!showPassword)}>
								<i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
							</button>
						</div>
					</div>

					{/* Confirm Password */}
					<div className="mb-4">
						<label className="form-label mb-0 small">
							Confirm Password:<sup className="text-danger">*</sup>
						</label>
						<div className="input-group">
							<input className="form-control border-primary border-end-0 rounded-end-0" type={showConfirm ? "text" : "password"} value={confirm}
							placeholder="Enter Confirm Password" onChange={(e) => setConfirm(e.target.value)} required/>
							<button type="button" className="btn btn-outline-primary border-start-0 rounded-start-0" onClick={() => setShowConfirm(!showConfirm)}>
								<i className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
							</button>
						</div>
					</div>

					{/* Reset button */}
					<button type="submit" className="btn btn-primary mt-3 rounded-pill w-100" disabled={loading} aria-disabled={loading}>
		            	{loading ? "Reseting..." : "Reset Password"}
		          	</button>
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
				<div>
			        <h1 className="text-center fw-bold mb-5" style={{ fontSize: "34px", color: "#0f1724" }}>
			        	Enter New Password
			        </h1>
			        
			        <form onSubmit={submit} noValidate>			        	
				        <div className="mb-4">
					        <label className="form-label small text-muted fw-bold mb-0">
					            New Password:<sup className="text-danger">*</sup>
				            </label>
				            
							<div className="input-group">
								<input className="form-control border-primary border-end-0 rounded-end-0" type={showPassword ? "text" : "password"} value={password}
								placeholder="Enter New Password" onChange={(e) => setPassword(e.target.value)} required/>
								<button type="button" className="btn btn-outline-primary border-start-0 rounded-start-0" onClick={() => setShowPassword(!showPassword)}>
									<i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
								</button>
							</div>
				        </div>

				        {/* Confirm Password */}
						<div className="mb-4">
							<label className="form-label mb-0 small">
								Confirm Password:<sup className="text-danger">*</sup>
							</label>
							<div className="input-group">
								<input className="form-control border-primary border-end-0 rounded-end-0" type={showConfirm ? "text" : "password"} value={confirm}
								placeholder="Enter Confirm Password" onChange={(e) => setConfirm(e.target.value)} required/>
								<button type="button" className="btn btn-outline-primary border-start-0 rounded-start-0" onClick={() => setShowConfirm(!showConfirm)}>
									<i className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
								</button>
							</div>
						</div>

		          	    {/* Reset button */}
						<button type="submit" className="btn btn-primary form-control fw-bold mb-3 mt-3" disabled={loading} aria-disabled={loading}>
		            		{loading ? "Reseting..." : "Reset Password"}
				        </button>				       
				    </form>
				</div>

				<div className="text-left small mt-3">
					<Link to="/login" className="text-sm text-primary text-decoration-none">
						<span className="fas fa-angle-double-left"></span>Back to login
					</Link>
				</div>
			</CompanyAuthLayout>
		);
	}
}

