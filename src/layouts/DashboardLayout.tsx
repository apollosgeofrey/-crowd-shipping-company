// // DashboardLayout.tsx (Updated)
// import { PropsWithChildren } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../store/index";
// import { clearAuth } from "../features/auth/store/authSlice";
// import "./dashboardLayout.css";

// export default function DashboardLayout({ children }: PropsWithChildren) {
//   const dispatch = useAppDispatch();
//   const nav = useNavigate();

//   const logout = () => { 
//     dispatch(clearAuth()); 
//     nav("/login"); 
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar onLogout={logout} />
//       <main className="flex-1 flex flex-col">
//         <Navbar />
//         <div className="flex-1 overflow-y-auto bg-gray-50">
//           <div className="p-6">
//             {children}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// CLAUSD CSS DASHBOARD
// // DashboardLayout.tsx (Updated)
// import { PropsWithChildren } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../store/index";
// import { clearAuth } from "../features/auth/store/authSlice";

// const layoutStyle: React.CSSProperties = {
//   display: 'flex',
//   minHeight: '100vh',
//   backgroundColor: '#f3f4f6'
// };

// const mainStyle: React.CSSProperties = {
//   flex: 1,
//   display: 'flex',
//   flexDirection: 'column'
// };

// const contentStyle: React.CSSProperties = {
//   flex: 1,
//   overflowY: 'auto',
//   backgroundColor: '#f9fafb'
// };

// const contentInnerStyle: React.CSSProperties = {
//   padding: '24px'
// };

// export default function DashboardLayout({ children }: PropsWithChildren) {
//   const dispatch = useAppDispatch();
//   const nav = useNavigate();

//   const logout = () => { 
//     dispatch(clearAuth()); 
//     nav("/login"); 
//   };

//   return (
//     <div style={layoutStyle}>
//       <Sidebar onLogout={logout} />
//       <main style={mainStyle}>
//         <Navbar />
//         <div style={contentStyle}>
//           <div style={contentInnerStyle}>
//             {children}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



// DashboardLayout.tsx (Updated)
import { PropsWithChildren } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/index";
import { clearAuth } from "../features/auth/store/authSlice";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const logout = () => { 
    dispatch(clearAuth()); 
    nav("/login"); 
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar onLogout={logout} />
      
      <main 
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: window.innerWidth >= 992 ? '0' : '0' }}
      >
        <Navbar />
        
        <div 
          className="flex-grow-1"
          style={{ 
            overflowY: 'auto',
            backgroundColor: '#f8f9fa' 
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