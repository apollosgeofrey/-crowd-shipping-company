import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/index.ts";
import { useIsAdmin, useIsCompany } from "../hooks/usePlatform.ts";


type ProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles?: PlatformRole[];      // empty = allow any authenticated user
  fallbackPath?: string;             // where to redirect when unauthorized (403)
  requireAuth?: boolean;             // if true, redirect unauthenticated users to /login
};


export default function ProtectedRoute({
  children,
  allowedRoles = [],
  fallbackPath = "/unauthorized",
  requireAuth = true,
}: ProtectedRouteProps) {

  	// Define usecase variables
  	const isAdmin = useIsAdmin();
  	const isCompany = useIsCompany();
	const token = useAppSelector((s) => s.auth.token);

	// Check if user is authenticateds
	// if (!token) return <Navigate to="/login" replace />;

  	// Check if user has any of the allowed roles
  	const hasAccess = (allowedRoles.includes('admin')&&isAdmin) || (allowedRoles.includes('company')&&isCompany);

  	// Check if user has access else redirect to "no access" page
  	if (!hasAccess) return <Navigate to={fallbackPath} replace />;

  	// temporarily return the children
	if (!token) return children;

	// Finally return the children
	return children;
}