import { ReactElement } from "react";
// import { Navigate } from "react-router-dom";
// import { useAppSelector } from "../store/index.ts";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
	// const token = useAppSelector((s) => s.auth.token);
	// if (!token) return <Navigate to="/login" replace />;
	return children;
}