import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/index.ts";
import { useIsAdmin, useIsCompany } from "../hooks/usePlatform.ts";

export default function ProtectedRoute({
	children,
	allowedRoles = [],
	fallbackPath = "/unauthorized"
}: { children: JSX.Element }) {
  	
  	// Define usecase variables
  	const isAdmin = useIsAdmin();
  	const isCompany = useIsCompany();
	const token = useAppSelector((s) => s.auth.token);

  	// Check if user has any of the allowed roles
  	const hasAccess = (allowedRoles.includes('admin') && isAdmin) || (allowedRoles.includes('company') && isCompany);

  	// or to a "no access" page
  	if (!hasAccess) return <Navigate to={fallbackPath} replace />;

	// if (!token) return <Navigate to="/login" replace />;
	if (!token) return children;
	return children;
}