import { PropsWithChildren } from "react";
import { APP_NAME } from "../config/constants";
import "./authLayout.css";


export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="row d-flex justify-content-center align-items-center min-vh-100 auth-font" style={{ backgroundColor:"#FDEFEB" }}>
			<div className="d-flex align-items-center justify-content-center border-success" id="authLayoutDiv">
				<div className="p-5 px-4 rounded shadow bg-white" style={{ width: "400px", height: "506.67px" }}>
					<h3 className="text-center text-primary">{APP_NAME}</h3>
					{children}
				</div>
			</div>
		</div>
	);
}