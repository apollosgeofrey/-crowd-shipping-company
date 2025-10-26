// components
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// auth routes
import Login from "../features/auth/pages/Login.tsx";
import Register from "../features/auth/pages/Register.tsx";
import VerifyEmail from "../features/auth/pages/VerifyEmail.tsx";
import ResetPassword from "../features/auth/pages/ResetPassword.tsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.tsx";

// dashboard route
import Dashboard from "../features/dashboard/pages/Dashboard.tsx";

// drivers management routes
import DriverList from "../features/drivers/pages/DriverList.tsx";
import DriverDetail from "../features/drivers/pages/DriverDetail.tsx";
import DriverCreate from "../features/drivers/pages/DriverCreate.tsx";
import DriverEdit from "../features/drivers/pages/DriverEdit.tsx";
// import DriverRequests from "../features/drivers/pages/DriverRequests.tsx";

// pathfinders management routes
import PathfinderList from "../features/pathfinders/pages/PathfinderList.tsx";
import PathfinderDetail from "../features/pathfinders/pages/PathfinderDetail.tsx";
import PathfinderCreate from "../features/pathfinders/pages/PathfinderCreate.tsx";
import PathfinderEdit from "../features/pathfinders/pages/PathfinderEdit.tsx";
// import PathfinderRequests from "../features/pathfinders/pages/PathfinderRequests.tsx";

// companies management routes
import CompanyList from "../features/companies/pages/CompanyList.tsx";
import CompanyDetail from "../features/companies/pages/CompanyDetail.tsx";
import CompanyCreate from "../features/companies/pages/CompanyCreate.tsx";
import CompanyEdit from "../features/companies/pages/CompanyEdit.tsx";
// import CompanyRequests from "../features/companies/pages/CompanyRequests.tsx";

// users management routes 
import UserList from "../features/users/pages/UserList.tsx";
import UserDetail from "../features/users/pages/UserDetail.tsx";
import UserCreate from "../features/users/pages/UserCreate.tsx";
import UserEdit from "../features/users/pages/UserEdit.tsx";

// admins management routes
import AdminList from "../features/admins/pages/AdminList.tsx";
import AdminDetail from "../features/admins/pages/AdminDetail.tsx";
import AdminCreate from "../features/admins/pages/AdminCreate.tsx";
import AdminEdit from "../features/admins/pages/AdminEdit.tsx";

// live_map management routes
import LiveMapIndex from "../features/live_map/pages/LiveMapIndex.tsx";

// bookings management routes
import BookingList from "../features/bookings/pages/BookingList.tsx";

// transactions management routes
import TransactionList from "../features/transactions/pages/TransactionList.tsx";

// promo_codes management routes
import PromoCodeList from "../features/promo_codes/pages/PromoCodeList.tsx";

// trip_charges management routes
import TripChargeList from "../features/trip_charges/pages/TripChargeList.tsx";

// reports management routes
import ReportList from "../features/reports/pages/ReportList.tsx";
import ReportDetail from "../features/reports/pages/ReportDetail.tsx";

// ratings management routes
import RatingList from "../features/ratings/pages/RatingList.tsx";
import RatingDetail from "../features/ratings/pages/RatingDetail.tsx";

// support_data management routes
import SupportDataList from "../features/support_data/pages/SupportDataList.tsx";
import SupportDataDetail from "../features/support_data/pages/SupportDataDetail.tsx";

// notifications management routes
import NotificationList from "../features/notifications/pages/NotificationList.tsx";

// system_settings management routes
import SystemSettingList from "../features/system_settings/pages/SystemSettingList.tsx";

// fallback route
import NotFoundPage from "../features/errors/pages/NotFoundPage.tsx";
import UnauthorizedPage from '../features/errors/pages/UnauthorizedPage.tsx';

export default function AppRoutes() {
	return (
	    <BrowserRouter>
		    <Routes>
		        {/* public routes */}
		        <Route path="/" element={<Navigate to="/login" replace />} />
		        <Route path="/login" element={<Login />} />
		        <Route path="/forgot-password" element={<ForgotPassword />} />
		        <Route path="/reset-password" element={<ResetPassword />} />
		        <Route path="/verify-email" element={<VerifyEmail />} />
		        
		        {/*Company Registration routes */}
		        <Route path="/register" element={<ProtectedRoute allowedRoles={['admin', 'company']}><Register /></ProtectedRoute>} />
		        
		        {/* dashboard routes */}
		        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'company']}><Dashboard /></ProtectedRoute>} />
		        
		        {/* drivers management routes */}
		        <Route path="/drivers" element={<ProtectedRoute allowedRoles={['admin', 'company']}><DriverList /></ProtectedRoute>} />
		        <Route path="/drivers/create" element={<ProtectedRoute allowedRoles={['admin', 'company']}><DriverCreate /></ProtectedRoute>} />
		        {/* <Route path="/drivers/requests" element={<ProtectedRoute allowedRoles={['admin', 'company']}><DriverRequests /></ProtectedRoute>} /> */}
		        <Route path="/drivers/:id/show" element={<ProtectedRoute allowedRoles={['admin', 'company']}><DriverDetail /></ProtectedRoute>} />
		        <Route path="/drivers/:id/edit" element={<ProtectedRoute allowedRoles={['admin', 'company']}><DriverEdit /></ProtectedRoute>} />

		        {/* pathfinders management routes */}
		        <Route path="/pathfinders" element={<ProtectedRoute allowedRoles={['admin']}><PathfinderList /></ProtectedRoute>} />
		        <Route path="/pathfinders/create" element={<ProtectedRoute allowedRoles={['admin']}><PathfinderCreate /></ProtectedRoute>} />
		        {/* <Route path="/pathfinders/requests" element={<ProtectedRoute allowedRoles={['admin']}><PathfinderRequests /></ProtectedRoute>} /> */}
		        <Route path="/pathfinders/:id/show" element={<ProtectedRoute allowedRoles={['admin']}><PathfinderDetail /></ProtectedRoute>} />
		        <Route path="/pathfinders/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><PathfinderEdit /></ProtectedRoute>} />

		        {/* companies management routes */}
		        <Route path="/companies" element={<ProtectedRoute allowedRoles={['admin']}><CompanyList /></ProtectedRoute>} />
		        <Route path="/companies/create" element={<ProtectedRoute allowedRoles={['admin']}><CompanyCreate /></ProtectedRoute>} />
		        {/* <Route path="/companies/requests" element={<ProtectedRoute allowedRoles={['admin']}><CompanyRequests /></ProtectedRoute>} /> */}
		        <Route path="/companies/:id/show" element={<ProtectedRoute allowedRoles={['admin', 'company']}><CompanyDetail /></ProtectedRoute>} />
		        <Route path="/companies/:id/edit" element={<ProtectedRoute allowedRoles={['admin', 'company']}><CompanyEdit /></ProtectedRoute>} />

		        {/* users management routes */}
		        <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><UserList /></ProtectedRoute>} />
		        <Route path="/users/create" element={<ProtectedRoute allowedRoles={['admin']}><UserCreate /></ProtectedRoute>} />
		        <Route path="/users/:id/show" element={<ProtectedRoute allowedRoles={['admin']}><UserDetail /></ProtectedRoute>} />
		        <Route path="/users/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><UserEdit /></ProtectedRoute>} />
		    
		        {/* admins management routes */}
		        <Route path="/admins" element={<ProtectedRoute allowedRoles={['admin']}><AdminList /></ProtectedRoute>} />
		        <Route path="/admins/create" element={<ProtectedRoute allowedRoles={['admin']}><AdminCreate /></ProtectedRoute>} />
		        <Route path="/admins/:id/show" element={<ProtectedRoute allowedRoles={['admin']}><AdminDetail /></ProtectedRoute>} />
		        <Route path="/admins/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminEdit /></ProtectedRoute>} />

		        {/* live-map management routes */}
		        <Route path="/live-map" element={<ProtectedRoute allowedRoles={['admin', 'company']}><LiveMapIndex /></ProtectedRoute>} />

		        {/* bookings management routes */}
		        <Route path="/bookings" element={<ProtectedRoute allowedRoles={['admin', 'company']}><BookingList /></ProtectedRoute>} />

		        {/* transactions management routes */}
		        <Route path="/transactions" element={<ProtectedRoute allowedRoles={['admin', 'company']}><TransactionList /></ProtectedRoute>} />

		        {/* promo-codes management routes */}
		        <Route path="/promo-codes" element={<ProtectedRoute allowedRoles={['admin', 'company']}><PromoCodeList /></ProtectedRoute>} />

		        {/* trip-charges management routes */}
		        <Route path="/trip-charges" element={<ProtectedRoute allowedRoles={['admin', 'company']}><TripChargeList /></ProtectedRoute>} />

		        {/* reports management routes */}
		        <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportList /></ProtectedRoute>} />
		        <Route path="/reports/:id/show" element={<ProtectedRoute allowedRoles={['admin']}><ReportDetail /></ProtectedRoute>} />

		        {/* ratings management routes */}
		        <Route path="/ratings" element={<ProtectedRoute allowedRoles={['admin', 'company']}><RatingList /></ProtectedRoute>} />
		        <Route path="/ratings/:id/show" element={<ProtectedRoute allowedRoles={['admin', 'company']}><RatingDetail /></ProtectedRoute>} />

		        {/* support-data management routes */}
		        <Route path="/support-data" element={<ProtectedRoute allowedRoles={['admin', 'company']}><SupportDataList /></ProtectedRoute>} />
		        <Route path="/support-data/:id/show" element={<ProtectedRoute allowedRoles={['admin', 'company']}><SupportDataDetail /></ProtectedRoute>} />

		        {/* notifications management routes */}
		        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['admin', 'company']}><NotificationList /></ProtectedRoute>} />
		        {/*<Route path="/notifications/:id/show" element={<ProtectedRoute allowedRoles={['admin', 'company']}><NotificationDetail /></ProtectedRoute>} />*/}

		        {/* system-settings management routes */}
		        <Route path="/system-settings" element={<ProtectedRoute allowedRoles={['admin']}><SystemSettingList /></ProtectedRoute>} />

		        {/* fallback routes id non is found */}
		        <Route path="/unauthorized" element={<UnauthorizedPage />} />
		        <Route path="*" element={<NotFoundPage />} />

		    </Routes>
	    </BrowserRouter>
	);
}