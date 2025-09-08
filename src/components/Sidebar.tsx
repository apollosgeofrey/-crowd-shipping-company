// components/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  FileText, 
  LogOut, 
  Settings,
  Calendar,
  CreditCard,
  Star,
  MessageCircle,
  Bell,
  Building2,
  Route,
  Filter,
  Gift,
  DollarSign,
  BarChart3,
  HelpCircle,
  UserCheck,
  MapPin,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}


export default function Sidebar({ onLogout, collapsed, onToggleCollapse }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'manage-driver', icon: Users, label: 'Manage Driver', path: '/drivers' },
    { id: 'manage-pathfinders', icon: Route, label: 'Manage Pathfinders', path: '/pathfinders' },
    { id: 'company-mgt', icon: Building2, label: 'Company MGT', path: '/company' },
    { id: 'manage-users', icon: UserCheck, label: 'Manage Users', path: '/users' },
    { id: 'manage-admin', icon: Settings, label: 'Manage Admin', path: '/admin' },
    { id: 'live-map', icon: Map, label: 'Live Map', path: '/live-map' },
    { id: 'all-bookings', icon: Bookmark, label: 'All Bookings', path: '/bookings' },
    { id: 'transactions', icon: DollarSign, label: 'Transactions', path: '/transactions' },
    { id: 'promo-codes', icon: Gift, label: 'Promo Codes', path: '/promo-codes' },
    { id: 'trip-charges', icon: CreditCard, label: 'Trip Charges', path: '/trip-charges' },
    { id: 'reports', icon: BarChart3, label: 'Reports', path: '/reports' },
    { id: 'ratings', icon: Star, label: 'Ratings', path: '/ratings' },
    { id: 'support-data', icon: MessageCircle, label: 'Support Data', path: '/support' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  const bottomMenuItems = [
    // { id: 'filters', icon: Filter, label: 'Filters', path: '/filters' },
    // { id: 'promo-code', icon: Gift, label: 'Promo Code', path: '/promo' },
    // { id: 'trip-charges-bottom', icon: CreditCard, label: 'Trip Charges', path: '/charges' },
    // { id: 'support', icon: HelpCircle, label: 'Support', path: '/help' },
    // { id: 'live-tracking', icon: MapPin, label: 'Live tracking', path: '/tracking' },
    // { id: 'company-bottom', icon: Building2, label: 'Company', path: '/company-info' },
    // { id: 'pathfinder-details', icon: Route, label: 'Pathfinder Details', path: '/pathfinder-details' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeMobile = () => setMobileOpen(false);

  // theme colors
  const colors = {
    dark: {
      sidebarBg: "#1f2937",
      sidebarText: "#d1d5db",
      hoverBg: "#374151",
      hoverText: "#ffffff",
      border: "#374151",
      headerText: "#ffffff",
    },
    light: {
      sidebarBg: "#ffffff",
      sidebarText: "#000000",
      hoverBg: "#f3f4f6",
      hoverText: "#111827",
      border: "#e5e7eb",
      headerText: "#111827",
    }
  };

  const current = colors[theme];


  return (
    <>
      {/* Mobile Menu Button */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="d-lg-none position-fixed btn btn-dark"
        style={{ top: '16px', left: '16px', zIndex: 1050, borderRadius: '8px', padding: '8px 12px' }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="d-lg-none position-fixed w-100 h-100"
          style={{ top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1040 }}
          onClick={closeMobile}
        />
      )}


        {/* Sidebar */}
        <div className="position-fixed position-lg-static h-100 d-flex flex-column shadow-lg"
          style={{ 
            backgroundColor: current.sidebarBg, 
            color: current.sidebarText, 
            width: collapsed ? '64px' : '256px', 
            minHeight: '100vh', 
            top: 0,
            left: mobileOpen ? 0 : (window.innerWidth >= 992 ? 0 : '-256px'), 
            zIndex: 1042, 
            transition: 'all 0.3s ease', 
            overflowY: 'auto'
          }}
        >      
          
        {/* Header */}
        <div className="p-3 d-flex align-items-center justify-content-between border-bottom" style={{ borderBottomColor: current.border }}>
          {!collapsed && (
            <h5 className="mb-0 fw-semibold" style={{ color: current.headerText }}>CROWDSHIPPING</h5>
          )}
          <div className="d-flex gap-2">
            {/* Theme toggle button */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="btn btn-sm p-1"
              style={{ backgroundColor: "transparent", border: "none", color: current.sidebarText }}
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16}/> : <Moon size={16}/>}
            </button>

            {/* Collapse toggle */}
            <button onClick={() => onToggleCollapse(!collapsed)} className="btn btn-sm p-1 d-none d-lg-block"
              style={{ backgroundColor: 'transparent', border: 'none', color: current.sidebarText, borderRadius: '6px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = current.hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
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
          <div className="mb-4">
            {!collapsed && (
              <p className="text-uppercase fw-bold mb-3 px-3" style={{ fontSize: '12px', color: current.sidebarText, letterSpacing: '0.05em' }}>
                MAIN
              </p>
            )}
            <nav className="d-flex flex-column gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={closeMobile}
                    className="btn text-decoration-none d-flex align-items-center p-2"
                    style={{
                      backgroundColor: active ? '#f97316' : 'transparent',
                      color: active ? 'white' : current.sidebarText,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      boxShadow: active ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
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
                    }}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (<span className="ms-3 text-truncate">{item.label}</span>)}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Menu Items */}
          <div className="mt-4 border-top" style={{ borderTopColor: current.border }}>
            <nav className="d-flex flex-column gap-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={closeMobile}
                    className="btn text-decoration-none d-flex align-items-center p-2"
                    style={{
                      backgroundColor: active ? '#f97316' : 'transparent',
                      color: active ? 'white' : current.sidebarText,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      boxShadow: active ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
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
                    }}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="ms-3 text-truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-2 border-top" style={{ borderTopColor: current.border }}>
          <button
            onClick={() => {
              onLogout();
              closeMobile();
            }}
            className="btn w-100 d-flex align-items-center p-2"
            style={{
              backgroundColor: 'transparent',
              color: current.sidebarText,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = current.hoverBg;
              e.currentTarget.style.color = current.hoverText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = current.sidebarText;
            }}
            title={collapsed ? 'Log out' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span className="ms-3">Log out</span>}
          </button>
        </div>
      </div>
    </>

  );
}
