// components/Navbar.tsx
import { Bell, Search, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useLocation, matchPath, Link } from "react-router-dom";
import { useLogout } from "../features/auth/hooks/useLogout";
import { useState, useRef, useEffect } from "react";
import { useUserData } from '../hooks/useUserData';
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

interface NavbarProps {
	sidebarWidth: number;
	sidebarCollapsed: boolean;
	isMobile: boolean;
}

export default function Navbar({ sidebarWidth, sidebarCollapsed, isMobile }: NavbarProps) {
	const { user } = useUserData();
	const handleLogout = useLogout();
	const { pathname } = useLocation();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { actualTheme } = useTheme(); // Get current theme

	// Close dropdown when clicking outside
	useEffect(() => {
	    const handleClickOutside = (event: MouseEvent) => {
	    	if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setDropdownOpen(false);
	    };
	    document.addEventListener('mousedown', handleClickOutside);
	    return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Theme-based styles
	const themeStyles = {
		light: {bg: "#ffffff",text: "#212529",textMuted: "#6c757d",border: "#e5e7eb",hoverBg: "#f8f9fa",inputBg: "#f8f9fa",badgeBg: "#dc3545",primary: "#f97316"},
		dark: {bg: "#1f2937",text: "#ffffff", textMuted: "#d1d5db",border: "#374151",hoverBg: "#374151",inputBg: "#374151",badgeBg: "#ef4444",primary: "#f97316"}
	};

	const current = themeStyles[actualTheme];

	// Unified route configuration
	const routeConfig: Record<string, { title: string; subtitle?: string; parent?: { label: string; path: string } }> = {
		"/dashboard": { title: `Hello ${user?.fullName || 'Admin'} 👋`, subtitle: "Good Morning" },
		
		"/vehicle-owners/:id/show": {title:"Vehicle Owner Details", subtitle:"Vehicle Owners > Details", parent:{label:"Vehicle Owners", path:"/vehicle-owners"}},
		"/vehicle-owners/:id/edit": {title:"Update Vehicle Owner", subtitle:"Vehicle Owners > Updating", parent:{label:"Vehicle Owners", path:"/vehicle-owners"}},
		"/vehicle-owners/create": {title:"Create Vehicle Owner", subtitle:"Vehicle Owners > Creation", parent:{label:"Vehicle Owners", path:"/vehicle-owners"}},
		"/vehicle-owners": {title:"Manage Vehicle Owner", subtitle:"Vehicle Owners > Requests", parent:{label:"Vehicle Owners", path:"/vehicle-owners"}},
		
		"/pathfinders/:id/show": {title:"Pathfinder Details", subtitle:"Pathfinders > Details", parent:{label:"Pathfinders", path:"/pathfinders"}},
		"/pathfinders/:id/edit": {title:"Update Pathfinder", subtitle:"Pathfinders > Updating", parent:{label:"Pathfinders", path:"/pathfinders"}},
		"/pathfinders/create": {title:"Create Pathfinder", subtitle:"Pathfinders > Creation", parent:{label:"Pathfinders", path:"/pathfinders"}},
		"/pathfinders": {title:"Manage Pathfinders", subtitle:"Pathfinders > Reports", parent:{label:"Pathfinders", path:"/pathfinders"}},
		
		"/companies/:id/show": {title:"Company Details", subtitle:"Companies > Details", parent:{label:"Companies", path:"/companies"}},
		"/companies/:id/edit": {title:"Update Company", subtitle:"Companies > Updating", parent:{label:"Companies", path:"/companies"}},
		"/companies/create": {title:"Create Company", subtitle:"Companies > Creation", parent:{label:"Companies", path:"/companies"}},
		"/companies": {title:"Manage Companies", subtitle:"Companies > Branches", parent:{label:"Companies", path:"/companies"}},
		
		"/users/:id/show": {title:"User Details", subtitle:"Users > Details", parent:{label:"Users", path:"/users"}},
		"/users/:id/edit": {title:"Update User", subtitle:"Users > Updating", parent:{label:"Users", path:"/users"}},
		"/users/create": {title:"Create User", subtitle:"Users > Creation", parent:{label:"Users", path:"/users"}},
		"/users": {title:"Manage Users", subtitle:"Users > View List", parent:{label:"Users", path:"/users"}},
		
		"/admins/:id/show": {title:"Admin Details", subtitle:"Admins > Details", parent:{label:"Admins", path:"/admins"}},
		"/admins/:id/edit": {title:"Update Admin", subtitle:"Admins > Updating", parent:{label:"Admins", path:"/admins"}},
		"/admins/create": {title:"Create Admin", subtitle:"Admins > Creation", parent:{label:"Admins", path:"/admins"}},
		"/admins": {title:"Manage Admin", subtitle:"Admin > View List", parent:{label:"Admin", path:"/admin"}},
		
		"/reports/:id/show": {title:"Report Details", subtitle:"Reports > Details", parent:{label:"Reports", path:"/reports"}},
		"/reports": {title:"Reports", subtitle:"Reports > View List", parent:{label:"Reports", path:"/reports"}},

		"/live-map": {title:"Live Map", subtitle:"Map > Tracking", parent: {label:"Map", path:"/live-map"}},
		"/bookings": {title: "All Bookings", subtitle:"Bookings > View List", parent:{label:"Bookings", path:"/bookings"}},
		"/transactions": {title:"Transactions", subtitle:"Finance > Transactions", parent:{label:"Finance", path:"/transactions"}},
		"/promo-codes": {title:"Promo Codes", subtitle:"Discounts > Promo Codes", parent:{label:"Discounts", path:"/promo-codes"}},
		"/trip-charges": {title:"Trip Charges", subtitle:"Trips > Charges", parent:{label:"Trips", path:"/trip-charges"}},
		
		"/ratings/:id/show": {title:"Rating Details", subtitle:"Ratings > Details", parent:{label:"Ratings", path:"/ratings"}},
		"/ratings": {title: "Ratings", subtitle: "Feedback > Ratings", parent: { label: "Feedback", path: "/ratings"}},

		"/support-data": {title: "Support Data", subtitle: "Support > Data", parent: { label: "Support", path: "/support-data"}},
		"/system-settings": {title: "System Settings", subtitle: "System > Settings", parent: { label: "System", path: "/system-settings"}},
		"/notifications": {title:"Notifications", subtitle:"System > Notifications", parent: {label:"System", path:"/notifications"}}
	};

	// Helpers for fallback
	const titleCase =  (s: string) => s.replace(/[-_]+/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
	const defaultTitle = `Hello ${user?.fullName || 'Admin'} 👋`;
	const defaultSubtitle = "Good Morning";

	// find the FIRST route key that matches the current path
	const matchedKey = Object.keys(routeConfig).find((key) => matchPath({ path: key, end: true }, pathname));

	// build pageConfig once
	const pageConfig = matchedKey ? routeConfig[matchedKey] : {
	    title: pathname === "/dashboard" ? defaultTitle : titleCase(pathname.split("/").filter(Boolean)[0] || "") ,
	    subtitle: pathname === "/dashboard" ? defaultSubtitle : titleCase(pathname.split("/").filter(Boolean)[0] || "") 
	};

	const getNavbarStyles = () => isMobile ? {left:"0", width:"100%", marginLeft:"0"} : {left:`${sidebarWidth}px`, width:`calc(100% - ${sidebarWidth}px)`, marginLeft:"0"};

	return (
		<header className="border-bottom shadow-sm position-fixed" style={{backgroundColor: current.bg,borderBottomColor: current.border, top: 0,zIndex: 1030,transition: "left 0.3s ease, width 0.3s ease, background-color 0.3s ease, border-color 0.3s ease", ...getNavbarStyles()}} >
			<div className="container-fluid px-3 px-lg-4 py-3">
				<div className="d-flex align-items-center justify-content-between">
					{/* Left: Title + Subtitle */}
					<div style={{ marginLeft: isMobile ? "48px" : "0" }}>
						<h1 className="h4 fw-semibold mb-1" style={{ color: current.text }}>
							{pageConfig.title}
						</h1>

			            {pageConfig.subtitle && pageConfig.parent ? (
			             	<p className="small mb-0 d-flex align-items-center" style={{ color: current.textMuted }}>
			                	<Link to={pageConfig.parent.path} className="text-decoration-none fw-semibold" style={{ color: current.primary }}>
			                  		{pageConfig.parent.label}
			                	</Link>
			                	<i className="fa fa-angle-right mx-2" style={{ color: current.textMuted }}></i>
			                	<span>{pageConfig.subtitle.split(">")[1]?.trim()}</span>
			             	</p>
			            ) : ( // fallback if no parent is defined
			              	<p className="small mb-0" style={{ color: current.textMuted }}>{pageConfig.subtitle}</p>
			            )}
					</div>

					{/* Right side (Search, Notifications, Profile) */}
					<div className="d-flex align-items-center gap-2 gap-lg-3">
						{/* Search */}
						<div className="position-relative d-none d-md-block">
							<Search size={16} className="position-absolute" style={{ left: "12px", top: "50%", transform: "translateY(-50%)",color: current.textMuted }}/>
							<input type="text" placeholder="Search..." className="form-control form-control-sm" style={{
								paddingLeft: "40px", backgroundColor: current.inputBg, border: `1px solid ${current.border}`, borderRadius: "8px", width: sidebarCollapsed ? "250px" : "200px",fontSize: "14px", transition: "width 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",color: current.text
							}}/>
						</div>

						{/* Mobile Search */}
						<button className="btn btn-sm d-md-none" style={{ backgroundColor: "transparent", border: `1px solid ${current.border}`, color: current.textMuted}}>
							<Search size={18} />
						</button>

						{/* Notifications */}
						<button className="btn btn-sm position-relative" style={{ backgroundColor: "transparent", border: "none", color: current.textMuted }}>
							<Bell size={20} />
							<span className="position-absolute badge rounded-pill" style={{ backgroundColor: current.badgeBg, fontSize: "8px", top: "8px", right: "8px", width: "8px",height: "8px", padding: 0}}/>
						</button>

						{/* User Profile Dropdown */}
			            <div className="dropdown" ref={dropdownRef}>
				            <button className="btn d-flex align-items-center gap-2 border-0 bg-transparent" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
				                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", backgroundColor: current.primary, color: "white", fontSize: "14px", fontWeight: "500"}}>
				                  	{ user?.fullName ? user.fullName.split(' ').slice(0, 2).map((word: string) => word.charAt(0)).join('') : 'CS' }
				                </div>
				                <div className="d-none d-sm-block text-start">
				                  	<p className="mb-0 fw-medium" style={{ fontSize: "14px", color: current.text }}>
				                    	{ user?.fullName || 'Crowdshipping' }
				                  	</p>
				                  	<p className="mb-0" style={{ fontSize: "12px", color: current.textMuted }}>
				                    	{ user?.userType || 'Admin' }
				                  	</p>
				                </div>
				                <ChevronDown size={16} style={{color: current.textMuted, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',  transition: 'transform 0.2s ease'}}/>
				            </button>

				            {/* Dropdown Menu */}
				            {dropdownOpen && (
				                <div className="dropdown-menu show shadow border-0" style={{
				                  	position: 'absolute', 
				                  	right: 0, 
				                  	top: '100%', 
				                  	minWidth: '200px', 
				                  	zIndex: 1050, 
				                  	borderRadius: '8px', 
				                  	border: `1px solid ${current.border}`,
				                  	backgroundColor: current.bg,
				                  	color: current.text,
				                  	transition: 'background-color 0.3s ease, border-color 0.3s ease'
				                }}>
				                  	{/* Profile Link */}
				                  	<Link to="/profile" className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => setDropdownOpen(false)} 
				                  		style={{ fontSize: '14px',color: current.text,backgroundColor: 'transparent'}}
				                  		onMouseEnter={(e) => e.currentTarget.style.backgroundColor = current.hoverBg}
				                  		onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
				                  	>
				                    	<User size={16} /> My Profile
				                  	</Link>
				                  
				                  	{/* Settings Link */}
				                  	<Link to="/system-settings" className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => setDropdownOpen(false)} 
				                  		style={{ fontSize: '14px', color: current.text, backgroundColor: 'transparent'}}
				                  		onMouseEnter={(e) => e.currentTarget.style.backgroundColor = current.hoverBg}
				                  		onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
				                  	>
				                    	<Settings size={16} /> Settings
				                  	</Link>
				                  
				                  	<div className="dropdown-divider my-1" style={{ backgroundColor: current.border }}></div>
				                  
				                  	{/* Logout Button */}
				                  	<button 
				                  		onClick={() => { handleLogout(); setDropdownOpen(false); }} 
				                  		className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
				                    	style={{ fontSize: '14px', border: 'none', background: 'none', width: '100%'}}
				                    	onMouseEnter={(e) => e.currentTarget.style.backgroundColor = current.hoverBg}
				                  		onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
				                  	>
				                    	<LogOut size={16} /> Logout
				                  	</button>
				                </div>
				            )}
			            </div>
					</div>
				</div>
			</div>
		</header>
	);
}