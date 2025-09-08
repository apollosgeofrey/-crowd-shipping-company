// components/Navbar.tsx (Updated)
import { Bell, Search, ChevronDown, User } from "lucide-react";

interface NavbarProps {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  isMobile: boolean;
}

export default function Navbar({ sidebarWidth, sidebarCollapsed, isMobile }: NavbarProps) {
  const getNavbarStyles = () => {
    if (isMobile) {
      return {
        left: '0',
        width: '100%',
        marginLeft: '0'
      };
    }
    
    return {
      left: `${sidebarWidth}px`,
      width: `calc(100% - ${sidebarWidth}px)`,
      marginLeft: '0'
    };
  };

  return (
    <header 
      className="bg-white border-bottom shadow-sm position-fixed"
      style={{ 
        borderBottomColor: '#e5e7eb',
        top: 0,
        zIndex: 1030,
        transition: 'left 0.3s ease, width 0.3s ease',
        ...getNavbarStyles()
      }}
    >
      <div className="container-fluid px-3 px-lg-4 py-3">
        <div className="d-flex align-items-center justify-content-between">
          {/* Left side - Greeting */}
          <div className="d-flex align-items-center">
            <div style={{ 
              marginLeft: isMobile ? '48px' : '0' // Account for mobile menu button
            }}>
              <h1 className="h4 h3-lg fw-semibold text-dark mb-1 d-flex align-items-center">
                Hello Admin 
                <span className="ms-2">👋</span>
              </h1>
              <p className="small text-muted mb-0">Good Morning</p>
            </div>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            {/* Search - Hidden on mobile */}
            <div className="position-relative d-none d-md-block">
              <Search 
                size={16} 
                className="position-absolute text-muted"
                style={{
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="form-control form-control-sm"
                style={{
                  paddingLeft: '40px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  width: sidebarCollapsed ? '250px' : '200px', // Wider when sidebar collapsed
                  fontSize: '14px',
                  transition: 'width 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f97316';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(249, 115, 22, 0.25)';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
              />
            </div>

            {/* Mobile Search Button */}
            <button className="btn btn-sm btn-outline-secondary d-md-none">
              <Search size={18} />
            </button>

            {/* Notifications */}
            <button 
              className="btn btn-sm position-relative"
              style={{ 
                backgroundColor: 'transparent',
                border: 'none',
                color: '#6c757d'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderRadius = '8px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Bell size={20} />
              <span 
                className="position-absolute badge rounded-pill"
                style={{
                  backgroundColor: '#dc3545',
                  fontSize: '8px',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  padding: 0
                }}
              ></span>
            </button>

            {/* User Profile */}
            <div className="d-flex align-items-center gap-2 cursor-pointer">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#f97316',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  RA
                </div>
                <div className="d-none d-sm-block text-end">
                  <p className="mb-0 fw-medium" style={{ fontSize: '14px', color: '#212529' }}>
                    Robert Allen
                  </p>
                  <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                    Admin
                  </p>
                </div>
                <ChevronDown size={16} className="text-muted" />
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            {/*<div className="d-none d-lg-flex align-items-center gap-2 border-start ps-3 ms-2">
              <button className="btn btn-sm btn-light">Comments</button>
              <button className="btn btn-sm btn-light">Properties</button>
              <span className="small text-muted px-2">64%</span>
              <button 
                className="btn btn-sm text-white"
                style={{ backgroundColor: '#f97316' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                Share
              </button>
            </div>*/}

            {/* Mobile Action Menu */}
            {/*<div className="d-lg-none">
              <button 
                className="btn btn-sm text-white"
                style={{ backgroundColor: '#f97316' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                Share
              </button>
            </div>*/}
          </div>
        </div>
      </div>
    </header>
  );
}