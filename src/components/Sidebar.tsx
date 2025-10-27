// components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useLogout } from "../features/auth/hooks/useLogout";

import {
	LayoutDashboard, Users, Map, LogOut, Settings, CreditCard, Star, MessageCircle, Bell, Building2, Route,
	Gift, DollarSign, BarChart3, UserCheck, Bookmark, ChevronLeft, ChevronRight, ChevronDown, Menu, X, Sun, Moon, Cog
} from "lucide-react";

// add platform hooks
import { useIsAdmin, useIsCompany } from "../hooks/usePlatform"; // adjust path if your hooks live elsewhere

// --- Move types and menu definition OUTSIDE the component so they're stable across renders ---
// types (could also be in src/types/menu.d.ts)
type Platform = "admin" | "company" | "unknown";
interface MenuItem {
	id: string;
	icon?: any;           // your icon component
	label: string;
	path?: string;
	children?: MenuItem[];
	platforms?: Platform[]; // if absent -> visible to all
}

// Menu items for sidebar (raw definition — visibility controlled later)
const MENU_ITEMS: MenuItem[] = [
  	{ id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', platforms: ['admin', 'company'] },
	{ id: 'company-profile', icon: Building2, label: 'Company Profile', path: '/companies/3234/show', platforms: ['company'] },
	{ id: 'manage-company-vehicle-owner', icon: Users, label: 'Manage Drivers', path: '/vehicle-owners', platforms: ['company'] },
  	{
	    id: 'manage-vehicle-owner',
	    icon: Users,
	    label: 'Manage Vehicle Owners',
	    children: [
	      	{ id: 'vehicle-owners-list', label: 'View Vehicle Owners', path: '/vehicle-owners' },
	      	{ id: 'create-vehicle-owner', label: 'Create New Vehicle Owner', path: '/vehicle-owners/create' },
	    ],
	    platforms: ['admin']
  	}, {
	    id: 'manage-pathfinders',
	    icon: Route,
	    label: 'Manage Pathfinders',
	    children: [
	      	{ id: 'pathfinders-list', label: 'View Pathfinders', path: '/pathfinders' },
	      	{ id: 'create-pathfinder', label: 'Create New Pathfinder', path: '/pathfinders/create' },
	    ],
	    platforms: ['admin']
  	}, {
	    id: 'company-mgt',
	    icon: Building2,
	    label: 'Manage Companies',
	    children: [
	      	{ id: 'companies-list', label: 'Companies List', path: '/companies' },
	      	{ id: 'create-company', label: 'Create New Company', path: '/companies/create' },
	    ],
	    platforms: ['admin']
  	}, {
	    id: 'manage-users',
	    icon: UserCheck,
	    label: 'Manage Users',
	    children: [
	      	{ id: 'users-list', label: 'View Users', path: '/users' },
	      	{ id: 'create-user', label: 'Create New User', path: '/users/create' },
	    ],
	    platforms: ['admin']
  	}, {
	    id: 'manage-admins',
	    icon: Settings,
	    label: 'Manage Admins',
	    children: [
	      	{ id: 'companies-list', label: 'View Admins', path: '/admins' },
	      	{ id: 'create-admin', label: 'Create New Admin', path: '/admins/create' },
	    ],
	    platforms: ['admin']
  	},
	{ id: 'live-map', icon: Map, label: 'Live Map', path: '/live-map', platforms: ['admin', 'company'] },
	{ id: 'all-bookings', icon: Bookmark, label: 'All Bookings', path: '/bookings', platforms: ['admin', 'company'] },
	{ id: 'transactions', icon: DollarSign, label: 'Transactions', path: '/transactions', platforms: ['admin', 'company'] },
	{ id: 'promo-codes', icon: Gift, label: 'Promo Codes', path: '/promo-codes', platforms: ['admin', 'company'] },
	{ id: 'trip-charges', icon: CreditCard, label: 'Trip Charges', path: '/trip-charges', platforms: ['admin', 'company'] },
	{ id: 'reports', icon: BarChart3, label: 'Reports', path: '/reports', platforms: ['admin'] },
	{ id: 'ratings', icon: Star, label: 'Ratings', path: '/ratings', platforms: ['admin', 'company'] },
	{ id: 'support-data', icon: MessageCircle, label: 'Support', path: '/support-data', platforms: ['admin', 'company'] },
	{ id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications', platforms: ['admin', 'company'] },
	{ id: 'system-settings', icon: Cog, label: 'System Settings', path: '/system-settings', platforms: ['admin'] },
];

// Interface for sidebar props
interface SidebarProps { onLogout?: () => void; collapsed: boolean; onToggleCollapse: (collapsed: boolean) => void;}

// Sidebar menu implementation
export default function Sidebar({ onLogout, collapsed, onToggleCollapse }: SidebarProps) {
	// platform flags from redux (set at startup in main.tsx/store)
	const isAdmin = useIsAdmin();
	const location = useLocation();
	const isCompany = useIsCompany();
	const handleLogout = useLogout();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [theme, setTheme] = useState<"dark" | "light">("light");
	const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
	const isActive = (path?: string, isChild: boolean = false) => {
	  	if (!path) return false;	  
	  	if (isChild) return location.pathname === path; // For children, use exact match
		
		// For parents, use startsWith but ensure we don't match partial segments
	  	if (!isChild) {
		    const normalizedPath = path.endsWith('/') ? path : path + '/';
		    const normalizedLocation = location.pathname.endsWith('/') ? location.pathname : location.pathname + '/';		    
		    return normalizedLocation.startsWith(normalizedPath);
		}
	};


	/**
	 * Platform visibility helpers
	 * - if `platforms` is missing -> visible to all
	 * - otherwise visible when the current platform is included
	**/
  	const isItemVisible = (item: MenuItem): boolean => {
		if (!item.platforms || item.platforms.length === 0) return true;
		if (isAdmin && item.platforms.includes("admin")) return true;
		if (isCompany && item.platforms.includes("company")) return true;
		return false;
  	};

  	const filterMenu = (items: MenuItem[]): MenuItem[] => {
    	return items.filter(i => isItemVisible(i)).map(i => ({...i, children: i.children ? filterMenu(i.children) : undefined}))
      	.filter(i => {
	        // hide parents with no path and no children left
	        if (!i.path && i.children && i.children.length === 0) return false;
        	return true;
      	});
  	};

	// Compute visible menu based on platform — memoized for performance.
	// NOTE: MENU_ITEMS is stable (top-level constant) so the only deps are the platform flags.
	const visibleMenu = useMemo(() => filterMenu(MENU_ITEMS), [isAdmin, isCompany]);

  	// Open parent dropdown if current route matches any child (use visibleMenu so only visible children are checked)
  	// IMPORTANT: this effect updates openDropdowns only when it actually changes to avoid infinite loops.
  	useEffect(() => {
	    const newState: { [key: string]: boolean } = {};
	    visibleMenu.forEach((item) => {
	      	if (item.children) {
	        	newState[item.id] = item.children.some((child) => child.path ? location.pathname.startsWith(child.path) : false);
	      	}
    	});

    	// update state only if there's a difference to avoid unnecessary re-renders
    	setOpenDropdowns((prev) => {
		    // create merged result
		    const merged = { ...prev, ...newState };

		    // shallow equality check
		    const prevKeys = Object.keys(prev);
		    const mergedKeys = Object.keys(merged);
		    if (prevKeys.length === mergedKeys.length && prevKeys.every(k => (prev as any)[k] === (merged as any)[k])) {
		        return prev; // no change => don't update state
		    }
		    return merged; // changed => update state (causes single render)
    	});
  
  	// visibleMenu and location.pathname are correct deps; we purposely do NOT depend on openDropdowns here.
  	}, [location.pathname, visibleMenu]);

  	// Toggle dropdown state for parent
  	const toggleDropdown = (id: string) => {
    	setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  	};

  	// Close mobile menu
  	const closeMobile = () => setMobileOpen(false);

  	// theme colors
  	const colors = {
    	dark: {sidebarBg: "#1f2937", sidebarText: "#d1d5db", hoverBg: "#374151", hoverText: "#ffffff", border: "#374151", headerText: "#ffffff"},
    	light: {sidebarBg: "#ffffff", sidebarText: "#000000", hoverBg: "#f3f4f6", hoverText: "#111827", border: "#e5e7eb", headerText: "#111827"}
  	};
  	const current = colors[theme];

  	return (
	    <>
		    {/* Mobile Menu Button */}
		    <button onClick={() => setMobileOpen(!mobileOpen)} className="d-lg-none position-fixed btn btn-dark"
		        style={{ top: '16px', left: '16px', zIndex: 1050, borderRadius: '8px', padding: '8px 12px' }}>
		        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
		    </button>

		    {/* Mobile Overlay */}
		    {mobileOpen && (
		        <div className="d-lg-none position-fixed w-100 h-100" onClick={closeMobile}
		          style={{ top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1040 }}
		        />
		    )}

		    {/* Sidebar */}
		    <div className="position-fixed position-lg-static h-100 d-flex flex-column shadow-lg" style={{ backgroundColor: current.sidebarBg, color: current.sidebarText, width: collapsed ? '64px' : '256px', minHeight: '100vh', top: 0, left: mobileOpen ? 0 : (window.innerWidth >= 992 ? 0 : '-256px'), zIndex: 1042, transition: 'all 0.3s ease', overflowY: 'auto' }}>

		        {/* Header */}
		        <div className="p-3 d-flex align-items-center justify-content-between border-bottom" style={{ borderBottomColor: current.border }}>
		          	{!collapsed && (
		            	<h6 className="mb-0 fw-semibold text-primary" style={{ color: current.headerText }}>
		              		{/* Theme toggle button */}
		              		<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="btn btn-sm p-1 text-primary" style={{ backgroundColor: "transparent", border: "none", color: current.sidebarText }} title="Toggle theme">
		                		{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
		              		</button>
		              		CROWDSHIPPING
		            	</h6>
		          	)}

		          {/* Collapse toggle */}
		          <div className="d-flex gap-2">
		            	<button onClick={() => onToggleCollapse(!collapsed)} className="btn btn-sm p-1 d-none d-lg-block" style={{ backgroundColor: 'transparent', border: 'none', color: current.sidebarText, borderRadius: '6px' }}
		              	onMouseEnter={(e) => e.currentTarget.style.backgroundColor = current.hoverBg} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
		              		{collapsed ? (
				                <div className="d-flex" style={{ marginLeft: "-4px" }}>
				                	<ChevronRight size={16} style={{ marginRight: "-6px" }} /><ChevronRight size={16} />
				                </div>
		              		) : (
				                <div className="d-flex" style={{ marginLeft: "-4px" }}>
				                	<ChevronLeft size={16} style={{ marginRight: "-6px" }} /><ChevronLeft size={16} />
				                </div>
		              		)}
		            	</button>
		          	</div>
		        </div>

		        {/* Main Menu Section */}
		        <div className="flex-grow-1 p-2">
		          	<div className="mb-0">
		            	{!collapsed && (
		              		<p className="text-uppercase fw-bold mb-3 px-3" style={{ fontSize: '12px', color: current.sidebarText, letterSpacing: '0.05em' }}>MAIN</p>
		            	)}

		            	{visibleMenu.length > 0 ? (
		              		<nav className="d-flex flex-column gap-1">
		                		{visibleMenu.map((item) => {
				                  	const Icon = item.icon;
				                  	const active = isActive(item.path);
				                  	const hasChildren = !!item.children;
				                  	const isDropdownOpen = openDropdowns[item.id];

		                  			// Parent button for dropdown menus
					                if(hasChildren) {
					                    return (
					                      	<div key={item.id}>
					                        	<button key={item.id} type="button" className="btn text-decoration-none d-flex align-items-center p-2 w-100" title={collapsed ? item.label : ''}
				                          		style={{ backgroundColor: active ? '#FDEFEB' : 'transparent', color: active ? '#f97316' : current.sidebarText, border: 'none', borderRadius: '8px',
				                            	fontSize: '14px', transition: 'all 0.2s ease', textAlign: 'left', justifyContent: collapsed ? 'center' : 'flex-start', boxShadow: active ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none' }}
				                          		onClick={() => {
				                            		if (hasChildren) {
				                              			toggleDropdown(item.id);
				                            		} else {
				                              			closeMobile();
				                            		}
				                          		}}
				                          		onMouseEnter={(e) => {
				                            		if (!active) {
				                              			e.currentTarget.style.backgroundColor = current.hoverBg;
				                              			e.currentTarget.style.color = current.hoverText;
				                            		}
				                          		}}
				                          		onMouseLeave={(e) => {
				                            		if (!active) {
				                              			e.currentTarget.style.backgroundColor = 'transparent';
				                              			e.currentTarget.style.color = current.sidebarText;
				                            		}
				                          		}}>
					                          		<Icon size={20} className="flex-shrink-0" />
					                          		{!collapsed && (
					                            		<>
					                              			<span className="ms-3 text-truncate">{item.label}</span>
					                              			{hasChildren && (
					                                			<span className="ms-auto">
					                                  				{isDropdownOpen ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
					                                			</span>
					                              			)}
					                            		</>
					                          		)}
					                        	</button>

					                        	{/* Render children if open */}
					                        	{(isDropdownOpen && !collapsed) && (
					                          		<div className="ms-4 d-flex flex-column gap-1">
					                            		{item.children!.map((child) => {
					                              			const childActive = isActive(child.path, true);
					                              			return (					                              				
					                                			<Link key={child.id} to={child.path ?? "#"} onClick={closeMobile} className="btn text-decoration-none d-flex align-items-center p-2" title={child.label}
					                                  				style={{ backgroundColor: childActive ? '#FDEFEB' : 'transparent', color: childActive ? '#f97316' : current.sidebarText, border: 'none',
					                                    			borderRadius: '8px', fontSize: '13px', transition: 'all 0.2s ease', textAlign: 'left', marginLeft: '8px' }}
				                                  				onMouseEnter={(e) => {
				                                    				if (!childActive) {
				                                      					e.currentTarget.style.backgroundColor = current.hoverBg;
				                                      					e.currentTarget.style.color = current.hoverText;
				                                    				}
				                                  				}}
				                                  				onMouseLeave={(e) => {
								                                    if (!childActive) {
								                                      	e.currentTarget.style.backgroundColor = 'transparent';
								                                      	e.currentTarget.style.color = current.sidebarText;
								                                    }
				                                  				}}>
					                                  				<span className="ms-1">{child.label}</span>
					                                			</Link>
					                              			);
					                            		})}
					                          		</div>
					                        	)}
					                      	</div>
					                    );
					                }

				                  // Regular menu item
				                  return (
				                    	<Link key={item.id} to={item.path || '#'} onClick={closeMobile} className="btn text-decoration-none d-flex align-items-center p-2 w-100" title={collapsed ? item.label : ''}
			                      		style={{ backgroundColor: active ? '#FDEFEB' : 'transparent', color: active ? '#f97316' : current.sidebarText, border: 'none', borderRadius: '8px', fontSize: '14px',
			                        	transition: 'all 0.2s ease', textAlign: 'left', justifyContent: collapsed ? 'center' : 'flex-start', boxShadow: active ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none' }}
			                      		onMouseEnter={(e) => {
				                        	if (!active) {
				                          		e.currentTarget.style.backgroundColor = current.hoverBg;
				                          		e.currentTarget.style.color = current.hoverText;
				                        	}
				                      	}}
			                      		onMouseLeave={(e) => {
					                        if (!active) {
					                          	e.currentTarget.style.backgroundColor = 'transparent';
					                          	e.currentTarget.style.color = current.sidebarText;
					                        }
					                    }}>
				                      		<Icon size={20} className="flex-shrink-0" />
				                      		{!collapsed && <span className="ms-3 text-truncate">{item.label}</span>}
				                    	</Link>
				                  	);
				                })}
				            </nav>
				        ) : null}
		          	</div>
		        </div>

		        {/* Logout Button */}
		        <div className="p-2 pt-0 border-top" style={{ borderTopColor: current.border }}>
		          	<button onClick={() => {handleLogout(); closeMobile();}} className="btn w-100 d-flex align-items-center p-2" title={collapsed ? 'Log out' : ''}
	            	style={{backgroundColor: 'transparent', color: current.sidebarText, border: 'none', borderRadius: '8px',
	              		fontSize: '14px', transition: 'all 0.2s ease',textAlign: 'left', justifyContent: collapsed ? 'center' : 'flex-start'}}
            		onMouseEnter={(e) => {
              			e.currentTarget.style.backgroundColor = current.hoverBg;
              			e.currentTarget.style.color = current.hoverText;
            		}}
            		onMouseLeave={(e) => {
              			e.currentTarget.style.backgroundColor = 'transparent';
              			e.currentTarget.style.color = current.sidebarText;
            		}}>
	            		<LogOut size={20} className="flex-shrink-0" />
	            		{!collapsed && <span className="ms-3">Log out</span>}
		          	</button>
		        </div>
		    </div>
	    </>
  	);
}
