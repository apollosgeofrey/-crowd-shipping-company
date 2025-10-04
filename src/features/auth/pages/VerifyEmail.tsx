import Swal from "sweetalert2";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyEmailApi } from "../services/authService";
import { useIsAdmin, useIsCompany } from "../../../hooks/usePlatform";
import { AdminAuthLayout, CompanyAuthLayout } from "../../../layouts/AuthLayout";

export default function VerifyEmail() {
	const nav = useNavigate();
	const isAdmin = useIsAdmin();
	const isCompany = useIsCompany();
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(false);
			await verifyEmailApi(code);
			Swal.fire("Verified", "Your email is verified", "success");
			nav("/login");
		} catch (e:any) {
			Swal.fire("Error", e?.response?.data?.message || "Verification failed", "error");
		} finally {
			setLoading(false);
		}
	};

	if (isAdmin === true) {
		return (
			<AdminAuthLayout>
				<form onSubmit={submit}>
					<p className="text-center fw-bold text-dark small mt-5 mb-4">Enter OTP</p>
					<div className="mb-4">
						<label className="form-label small mb-3 text-center">
							A code has been sent to your mail, check your inbox and input it below to continue
						</label>
						<input className="form-control border-primary" value={code} onChange={(e)=>setCode(e.target.value)} required placeholder="Enter OTP Code"/>
					</div>
					<button className="mt-3 btn btn-primary w-100 rounded-pill">Verify and Proceed</button>
				</form>
				<div className="small text-center mt-3">
					Don't get code? <Link to="/forgot-password" className="text-sm text-primary text-decoration-none">Resend</Link>
				</div>
			</AdminAuthLayout>
		);
	} else if (isCompany === true) {
		return (
			<CompanyAuthLayout>
				<div className="px-2">
			        <h2 className="text-center fw-bold mb-2" style={{ fontSize: "32px", color: "#0f1724" }}>
			          	Confirm Email
			        </h2>

			        <p className="text-center text-muted mb-4" style={{ fontSize: "18px" }}>
			          	Check Your Email and Enter Confirmation Code
			        </p>

			        <form onSubmit={submit} noValidate>
				        <div className="mb-4">
				            <label htmlFor="code" className="form-label small text-muted fw-bold mb-0">
				              	Confirmation Code:<sup className="text-danger">*</sup>
				            </label>
				            <input id="code" name="code" type="text" className="form-control" placeholder="Enter Code" value={code} required onChange={(e) => setEmail(e.target.value)} aria-required/>
				        </div>

			          	{/* big orange button */}
			          	<button type="submit" className="btn btn-primary form-control fw-bold mb-4" disabled={loading} aria-disabled={loading}>
			            	{loading ? "Confirming..." : "Confirm Email"}
			          	</button>

			          	<hr />
			          	<div className="text-center mt-4 mb-3 text-muted fw-bold">Haven't received your code?</div>

				        <Link to="/forgot-password" className="btn btn-outline-primary w-100 fw-bold mb-4">
				            <span className="fa fa-refresh"></span> Resend Code
				        </Link>
			        </form>
			    </div>
			</CompanyAuthLayout>
		);
	}
}
