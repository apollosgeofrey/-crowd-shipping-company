// DashboardLayout.tsx (Updated)
import { type PropsWithChildren, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/index";
import { clearAuth } from "../features/auth/store/authSlice";
import "./dashboardLayout.css";


{/*<div className="modal fade" id="chargeModal" tabIndex={-1} aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">*/}

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

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
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar 
        onLogout={logout} 
        collapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      
      <main 
        className="flex-grow-1 d-flex flex-column"
        style={{ 
          marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Navbar 
          sidebarWidth={sidebarWidth}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
        />
        
        <div 
          className="flex-grow-1"
          style={{ 
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
            marginTop: '80px', // Account for fixed navbar height
            transition: 'margin-top 0.3s ease'
          }}
        >
          <div className="container-fluid p-3 p-lg-4" style={{ maxWidth: '1400px' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}