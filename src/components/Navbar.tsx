// components/Navbar.tsx
import { Bell, Search, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface NavbarProps {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  isMobile: boolean;
}

export default function Navbar({ sidebarWidth, sidebarCollapsed, isMobile }: NavbarProps) {
  const { pathname } = useLocation();
  
  // Unified route configuration
  const routeConfig: Record<string, { title: string; subtitle?: string; parent?: { label: string; path: string } }> = {
    "/dashboard": { title: "Hello Admin 👋", subtitle: "Good Morning" },
    "/drivers": {title:"Manage Driver", subtitle:"Drivers > Requests", parent:{label:"Drivers", path:"/drivers"}},
    "/pathfinders": {title:"Manage Pathfinders", subtitle:"Pathfinders > Reports", parent:{label:"Pathfinders", path:"/pathfinders"}},
    "/companies": {title:"Manage Companies", subtitle:"Companies > Branches", parent:{label:"Companies", path:"/companies"}},
    "/users": {title:"Manage Users", subtitle:"Users > View List", parent:{label:"Users", path:"/users"}},
    "/admin": {title:"Manage Admin", subtitle:"Admin > View List", parent:{label:"Admin", path:"/admin"}},
    "/live-map": {title:"Live Map", subtitle:"Map > Tracking", parent: {label:"Map", path:"/live-map"}},
    "/bookings": {title: "All Bookings", subtitle:"Bookings > View List", parent:{label:"Bookings", path:"/bookings"}},
    "/transactions": {title:"Transactions", subtitle:"Finance > Transactions", parent:{label:"Finance", path:"/transactions"}},
    "/promo-codes": {title:"Promo Codes", subtitle:"Discounts > Promo Codes", parent:{label:"Discounts", path:"/promo-codes"}},
    "/trip-charges": {title:"Trip Charges", subtitle:"Trips > Charges", parent:{label:"Trips", path:"/trip-charges"}},
    "/reports": {title:"Reports", subtitle:"Analytics > Reports", parent:{label:"Analytics", path:"/reports"}},
    "/ratings": {title: "Ratings", subtitle: "Feedback > Ratings", parent: { label: "Feedback", path: "/ratings"}},
    "/support-data": {title: "Support Data", subtitle: "Support > Data", parent: { label: "Support", path: "/support-data"}},
    "/system-settings": {title: "System Settings", subtitle: "System > Settings", parent: { label: "System", path: "/system-settings"}},
    "/notifications": {title:"Notifications", subtitle:"System > Notifications", parent: {label:"System", path:"/notifications"}}

    // ...other routes
  };
 
  // Helpers for fallback
  const titleCase = (s: string) => s.replace(/[-_]+/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const defaultTitle = "Hello Admin 👋";
  const defaultSubtitle = "Good Morning";

  const pageConfig =
    routeConfig[pathname] || {
      title: pathname === "/dashboard" && defaultTitle,
      subtitle: pathname === "/dashboard" ? defaultSubtitle : titleCase(pathname.split("/").filter(Boolean)[0] || "") + " > View List",
    };

  const getNavbarStyles = () =>
    isMobile ? {left:"0", width:"100%", marginLeft:"0"} : {left:`${sidebarWidth}px`, width:`calc(100% - ${sidebarWidth}px)`, marginLeft:"0"};

  return (
    <header
      className="bg-white border-bottom shadow-sm position-fixed"
      style={{
        borderBottomColor: "#e5e7eb",
        top: 0,
        zIndex: 1030,
        transition: "left 0.3s ease, width 0.3s ease",
        ...getNavbarStyles(),
      }}
    >
      <div className="container-fluid px-3 px-lg-4 py-3">
        <div className="d-flex align-items-center justify-content-between">
          {/* Left: Title + Subtitle */}
          <div style={{ marginLeft: isMobile ? "48px" : "0" }}>
            <h1 className="h4 fw-semibold text-dark mb-1">{pageConfig.title}</h1>            
            {pageConfig.subtitle && pageConfig.parent ? (
              <p className="small text-muted mb-0 d-flex align-items-center">
                <Link 
                  to={pageConfig.parent.path} 
                  className="text-decoration-none fw-semibold text-primary"
                >
                  {pageConfig.parent.label}
                </Link>
                <i className="fa fa-angle-right mx-2 text-muted"></i>
                <span>{pageConfig.subtitle.split(">")[1]?.trim()}</span>
              </p>
            ) : ( // fallback if no parent is defined
              <p className="small text-muted mb-0">{pageConfig.subtitle}</p>
            )}
          </div>

          {/* Right side (Search, Notifications, Profile) same as before */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {/* Search */}
            <div className="position-relative d-none d-md-block">
              <Search size={16} className="position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }}/>
              <input
                type="text"
                placeholder="Search..."
                className="form-control form-control-sm"
                style={{
                  paddingLeft: "40px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  width: sidebarCollapsed ? "250px" : "200px",
                  fontSize: "14px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Mobile Search */}
            <button className="btn btn-sm btn-outline-secondary d-md-none">
              <Search size={18} />
            </button>

            {/* Notifications */}
            <button className="btn btn-sm position-relative" style={{ backgroundColor: "transparent", border: "none", color: "#6c757d" }}>
              <Bell size={20} />
              <span
                className="position-absolute badge rounded-pill"
                style={{
                  backgroundColor: "#dc3545",
                  fontSize: "8px",
                  top: "8px",
                  right: "8px",
                  width: "8px",
                  height: "8px",
                  padding: 0,
                }}
              />
            </button>

            {/* User Profile */}
            <div className="d-flex align-items-center gap-2 cursor-pointer">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#f97316",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                RA
              </div>
              <div className="d-none d-sm-block text-end">
                <p className="mb-0 fw-medium" style={{ fontSize: "14px", color: "#212529" }}>
                  Robert Allen
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                  Admin
                </p>
              </div>
              <ChevronDown size={16} className="text-muted" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
