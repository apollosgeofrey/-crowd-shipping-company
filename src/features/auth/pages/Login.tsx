import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { setAuth } from "../store/authSlice";
import { loginApi } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import type { LoginPayload } from "../services/authService";
import { useIsAdmin, useIsCompany } from "../../../hooks/usePlatform";
import { useAppDispatch, useAppSelector } from "../../../store/index.ts";
import { AdminAuthLayout, CompanyAuthLayout } from "../../../layouts/AuthLayout";

export default function Login() {

	 // ✅ Login form states
	const nav = useNavigate();
	const isAdmin = useIsAdmin();
	const isCompany = useIsCompany();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
	const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);
	const isUserAuthenticated = isAuthenticated !== undefined ? isAuthenticated : !!token && !!user;

	// ✅ Redirect to dashboard if authenticated
	useEffect(() => {
		if (isUserAuthenticated) nav("/dashboard", { replace: true });
	}, [isUserAuthenticated, nav, isAuthenticated, token, user]);
	
	// ✅ Login submit handler for admin and company
	const submit = async () => {		  
		try {
			setLoading(true);
			const loginResponse = await loginApi(form);

			// Validate the full response structure
		    if (!loginResponse?.data?.token || !loginResponse?.data?.user) throw new Error("Invalid response from server");

		    dispatch(setAuth({ token: loginResponse.data.token, user: loginResponse.data.user }));
		    Swal.fire("Success", (loginResponse.message || "Login successful"), "success");
			nav("/dashboard", { replace: true });
		} catch (e: any) {
		    console.log("ERROR caught:", e);
		    console.log("Error details:", e?.response);
		    Swal.fire("Error", (e?.response?.data?.message || "Invalid credentials"), "error");
		} finally {
		    setLoading(false);
		}
	};

	// ✅ Show loading while checking authentication or redirecting
	if (isAuthenticated) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
				<div className="text-center">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Redirecting...</span>
					</div>
					<p className="mt-2">Redirecting to dashboard...</p>
				</div>
			</div>
		);
	}

	// ✅ Render login form for admin
	if (isAdmin === true) {
		return (
			<AdminAuthLayout>
				<h4 className="text-center mb-4 text-dark mt-2">You are welcome!</h4>
				<form /*noValidate*/>
					<p className="text-center text-dark small mt-4 mb-3">Please Login</p>
					<div className="mb-4">
						<input className="form-control form-control-lg rounded border-primary" type="email" placeholder="Enter Email" value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })} required autoFocus/>
					</div>
					<div className="mb-4">
						<input className="form-control form-control-lg rounded border-primary" type="password" placeholder="Enter Password"
						value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required/>
					</div>

					{/* primary button - orange color inline so no external CSS */}
			        <button type="button" onClick={submit} className="btn w-100 rounded text-white fw-bold btn-primary" disabled={loading}>
			        	{loading ?
			            	<><span className="spinner-border spinner-border-sm text-white" role="status"><span className="visually-hidden">Loading...</span></span> Signing in...</>
			            	:
			            	<> <span className="fa fa-sign-in"></span> Login</>
			            }
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
	} else if (isCompany === true) { // ✅ Render login form for company
		return (
			<CompanyAuthLayout>
				<div>
			        <h1 className="text-center fw-bold mb-2" style={{ fontSize: "34px", color: "#0f1724" }}>
			        	Sign In
			        </h1>
			        <div className="text-center mb-3">
			          	<small className="text-muted fw-bold">New to Our Product?</small>
			          	<Link to="/register" className="text-primary fw-bold ms-2">Create an Account</Link>
			        </div>

			        <form /*noValidate*/>
				        <div className="mb-4">
				            <label className="form-label small text-muted fw-bold mb-0">
				            	Email:<sup className="text-danger">*</sup>
				            </label>
				            <input type="email" className="form-control" placeholder="Enter Email Address" value={form.email}
				              required onChange={(e) => setForm({ ...form, email: e.target.value })} autoFocus />
				        </div>

				        <div className="mb-4">
					        <label className="form-label small text-muted fw-bold mb-0">
					            Password:<sup className="text-danger">*</sup>
				            </label>
				            <input type="password" className="form-control" placeholder="Enter Password" value={form.password}
				              required onChange={(e) => setForm({ ...form, password: e.target.value })}/>
				        </div>

				        <div className="d-flex align-items-center justify-content-between mb-4">
				            <div className="form-check">
				              	<input className="form-check-input" id="rememberMe" type="checkbox" />
				              	<label className="form-check-label small fw-bold" htmlFor="rememberMe">Keep me signed in</label>
				            </div>

				            <div>
				              	<Link to="/forgot-password" className="small text-primary fw-bold">Forgot your password?</Link>
				            </div>
				        </div>

				        {/* primary button - orange color inline so no external CSS */}
				        <button type="button" onClick={submit} className="btn btn-primary form-control fw-bold mb-3 mt-3" disabled={loading}>
				            {loading ?
			            		<><span className="spinner-border spinner-border-sm text-white" role="status"><span className="visually-hidden">Loading...</span></span> Signing in...</>
				            	:
				            	<> <span className="fa fa-sign-in"></span> Login</>
				            }
				        </button>

				        <hr />

				        <div className="text-center small text-muted mb-4 fw-bold">Or sign in using:</div>

				        <div className="d-grid gap-2 mb-5">
				            <button type="button" className="btn d-flex align-items-center justify-content-center rounded"
				            style={{ border: "1px solid #e6eef6", backgroundColor: "#fff", padding: ".6rem .75rem", color: "#223"}}>				              	
				              	{/* Google icon */}
					            <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center" }}>
					                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" focusable="false">
					                	<path fill="#EA4335" d="M24 9.5c3.9 0 7.4 1.3 10.2 3.5L38 8C33.9 4.6 29.2 2.5 24 2.5 15.6 2.5 8.4 7.9 5.1 15.1l6.9 5.4C13.5 15.3 18.4 9.5 24 9.5z"/>
					                  	<path fill="#34A853" d="M46.5 24.6c0-1.6-.1-2.9-.4-4.2H24v8.1h12.6c-.5 2.6-2 4.9-4.3 6.4l6.9 5.4c4-3.7 6.7-9.1 6.7-15.7z"/>
					                  	<path fill="#4A90E2" d="M11.9 28.9A14.5 14.5 0 0 1 12 24c0-1.6.3-3.2.8-4.7L5.9 13.9A23.9 23.9 0 0 0 2.5 24c0 3.8.9 7.4 2.6 10.6l6.8-5.7z"/>
					                  	<path fill="#FBBC05" d="M24 44c5.1 0 9.9-1.7 13.6-4.7l-6.9-5.4C30.8 33.8 27.6 35 24 35c-5.7 0-10.6-5.8-11.9-13.3L5.1 26.8C7.8 34.1 14.9 44 24 44z"/>
					                </svg>
					            </span>
				              	<span className="ms-3">Continue with Google</span>
				            </button>

				            <button type="button" className="btn d-flex align-items-center justify-content-center rounded"
				            style={{ border: "1px solid #e6eef6", backgroundColor: "#fff", padding: ".6rem .75rem", color: "#223" }}>
				              	{/* Facebook icon */}
					            <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center" }}>
					                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false">
					                	<path fill="#1877F2" d="M22 12.073C22 6.48 17.523 2 12 2S2 6.48 2 12.073C2 17.08 5.657 21.128 10.438 21.996v-6.99H7.898v-2.933h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.933h-2.33v6.99C18.343 21.128 22 17.08 22 12.073z"/>
					                </svg>
					            </span>
					            <span className="ms-3">Continue with Facebook</span>
				            </button>
				        </div>
				    </form>
			    </div>
			</CompanyAuthLayout>
		);
	}
}
