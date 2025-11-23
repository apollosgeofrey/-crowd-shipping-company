// DashboardLayout.tsx (Updated)
import { type PropsWithChildren, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/index";
import { useTheme } from "../contexts/ThemeContext"; // Import the theme hook
import { clearAuth } from "../features/auth/store/authSlice";
import "./dashboardLayout.css";

export default function DashboardLayout({ children }: PropsWithChildren) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
	const dispatch = useAppDispatch();
	const nav = useNavigate();
	const { theme } = useTheme(); // Get the current theme

	// Handle window resize
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 992);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const logout = () => { 
		dispatch(clearAuth()); 
		nav("/login"); 
	};

	// Calculate sidebar width based on state
	const getSidebarWidth = () => {
		if (isMobile) return 0; // Sidebar is overlay on mobile
		return sidebarCollapsed ? 64 : 256;
	};

	const sidebarWidth = getSidebarWidth();

	return (
		<div className={`dashboard-layout ${theme}`} style={{ minHeight: '100vh' }}>
			<Sidebar onLogout={logout} collapsed={sidebarCollapsed} onToggleCollapse={setSidebarCollapsed}/>

			<main className="flex-grow-1 d-flex flex-column main-content" style={{marginLeft: isMobile ? '0' : `${sidebarWidth}px`, transition: 'margin-left 0.3s ease'}}>
				<Navbar sidebarWidth={sidebarWidth} sidebarCollapsed={sidebarCollapsed} isMobile={isMobile}/>
				<div className="flex-grow-1 content-area" style={{overflowY: 'auto', marginTop: '80px',  transition: 'margin-top 0.3s ease'}}>
					<div className="container-fluid p-3 p-lg-4 w-full">
						{children}
					</div>
				</div>
			</main>
		</div>
	);
}