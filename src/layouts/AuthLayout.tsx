import "./authLayout.css";
import { type PropsWithChildren } from "react";
import { APP_NAME } from "../config/constants";
import bgImage from "../assets/images/company_bg_image.png";


export function AdminAuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="row d-flex justify-content-center align-items-center min-vh-100 auth-font" style={{ backgroundColor:"#FDEFEB" }}>
			<div className="d-flex align-items-center justify-content-center border-success" id="authLayoutDiv">
				<div className="p-5 px-4 rounded-3 mx-3 shadow bg-white" style={{ width: "400px", height: "506.67px" }}>
					<h3 className="text-center text-primary">{APP_NAME}</h3>
					{children}
				</div>
			</div>
		</div>
	);
}


export function AdminSplitAuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="row min-vh-100 auth-font">
			{/* Left Brand Section */}
			<div className="col-md-6 d-none d-md-flex align-items-center justify-content-center" 
				style={{ backgroundColor: "#FDEFEB" }}>
				<div className="text-center">
					<h1 className="display-4 fw-bold text-primary">{APP_NAME}</h1>
					<p className="lead">Administrators</p>
				</div>
			</div>
			
			{/* Right Form Section */}
			<div className="col-md-6 d-flex align-items-center justify-content-center p-5">
				<div className="w-100" style={{ maxWidth: "400px" }}>
					{children}
				</div>
			</div>
		</div>
	);
}


export function CompanyAuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="company-auth-bg" style={{ backgroundImage: `url(${bgImage})`,}}>
		   	<div className="company-auth-container">
		        <div className="auth-card">
			        <div className="auth-card-brand text-center mb-3">
			            <h2 className="h4 fw-bold mb-1">Crowdshipping</h2>
			            <p className="mb-0 text-muted small">Your reliable transportation partner</p>
			        </div>

			        <div className="auth-card-body">
			            {/* form content passed as children */}
			            {children}
			        </div>

			        <div className="auth-card-footer text-center mt-3">
			            <small className="text-muted">By creating account, you agree to our Terms of Service.</small>
			        </div>
			    </div>
		    </div>
	    </div>
	);
}


export function CompanySplitAuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="row min-vh-100 auth-font">
			{/* Left Brand Section */}
			<div className="col-md-6 d-none d-md-flex align-items-center justify-content-center" style={{ backgroundColor: "#FDEFEB" }}>
				<div className="text-center">
					<h1 className="display-4 fw-bold text-primary">{APP_NAME}</h1>
					<p className="lead">Your reliable transportation partner</p>
				</div>
			</div>			

			{/* Right Form Section */}
			<div className="col-md-6 d-flex align-items-center justify-content-center p-5" style={{ backgroundImage: `url(${bgImage})`,}}>
				<div className="w-100" style={{ maxWidth: "400px" }}>
				    <div className="auth-card">				        
				        <div className="auth-card-body">
				            {children}
				        </div>

				        <div className="auth-card-footer text-center mt-3">
				            <small className="text-muted">By creating account, you agree to our Terms of Service.</small>
				        </div>
				    </div>
			    </div>
			</div>
		</div>
	);
}