import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { vehicleOwnerApi } from "../services/vehicleOwnerApi";
import userMale from "../../../assets/images/user_male.png";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FaUser, FaMoneyBillWave, FaClipboardCheck, FaChartBar } from "react-icons/fa";
import ProfileTabIndex from "./vehicleOwnerDetailPartials/profileTab/ProfileTabIndex.tsx";
import EarningTabIndex from "./vehicleOwnerDetailPartials/earningsTab/EarningTabIndex.tsx";
import BookingTabIndex from "./vehicleOwnerDetailPartials/bookingsTab/BookingTabIndex.tsx";
import ReportTabIndex from "./vehicleOwnerDetailPartials/reportsTab/ReportTabIndex.tsx";

export default function VehicleOwnerDetail() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [vehicleOwner, setVehicleOwner] = useState(null);
    const [error, setError] = useState<string | null>(null);

    // Separate states for main tab and profile sub-tab
    const [activeMainTab, setActiveMainTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: <FaUser /> },
        { id: "earnings", label: "Earnings", icon: <FaMoneyBillWave /> },
        { id: "bookings", label: "Bookings", icon: <FaClipboardCheck /> },
        { id: "reports", label: "Reports", icon: <FaChartBar /> },
    ];

    // Fetch vehicle owner data
    useEffect(() => {
        const fetchVehicleOwner = async () => {
            if (!id) {
                setError("Invalid vehicle owner ID");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await vehicleOwnerApi.getVehicleOwnerById(id);
                if (res.code === 200 && res.data) {
                    setVehicleOwner(res.data);
                } else {
                    setError(res.message || "Failed to load vehicle owner data");
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || "An error occurred while loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleOwner();
    }, [id]);

    // Helper function to get status badge color
    const getStatusTextColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'suspended': return 'danger';
            case 'blocked': return 'danger';
            case 'deactivated': return 'secondary';
            default: return 'secondary';
        }
    };

    // Helper function to get verification status (with colored labels)
    const getVerificationStatus = (vehicleOwner: any) => {
        if (vehicleOwner?.isVerified && vehicleOwner?.kycStatus === 'verified') return <span className="text-success fw-semibold">Verified</span>;
        if (vehicleOwner?.kycStatus === 'pending') return <span className="text-warning fw-semibold">KYC Pending</span>;
        if (!vehicleOwner?.isVerified) return <span className="text-danger fw-semibold">Unverified</span>;
        return <span className="text-danger fw-semibold">Verification Required</span>;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="container mt-4">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8">
                            <div className="card shadow-sm border-0 p-5 d-flex align-items-center justify-content-center text-center" style={{ minHeight: "250px" }}>
                                <div>
                                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 mb-0 text-muted fw-semibold">Loading vehicle owner details...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !vehicleOwner) {
        return (
            <DashboardLayout>
                <div className="card shadow-sm rounded p-4">
                    <div className="alert alert-danger">
                        <h5 className="alert-heading">Error Loading Vehicle Owner</h5>
                        <p className="mb-0">{error || "Vehicle owner not found"}</p>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/vehicle-owners" className="btn btn-primary">
                            <i className="fa fa-arrow-left me-2"></i> Back to Vehicle Owners
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="card shadow-sm rounded p-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <img src={vehicleOwner?.profile?.profilePicUrl || userMale} alt={vehicleOwner?.fullName} className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }}/>
                        <div>
                            <h5 className="fw-bold mb-2">
                                {vehicleOwner?.fullName}
                                <sup className={`text-${getStatusTextColor(vehicleOwner?.status)} text-sm`}>
                                    &nbsp; - <small>({vehicleOwner?.status?.toUpperCase()})</small>
                                </sup>
                            </h5>
                            <p className="mb-1 fw-semibold">
                                <span className="fa fa-id-card me-2"></span>
                                {getVerificationStatus(vehicleOwner)}
                            </p>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-wallet me-2"></span>
                                <span className="text-dark">{vehicleOwner?.userId || "Vehicle Owner"}</span>
                            </p>
                            <p className="mb-0 text-muted small">
                                <span className="fa fa-calendar me-1"></span>
                                Joined {new Date(vehicleOwner?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="ms-auto d-flex gap-2">                        
                        <Link to={`/vehicle-owners/${vehicleOwner?._id}/edit`} className="btn btn-primary px-3">
                            <span className="fa fa-pencil-alt me-1"></span> Edit Profile
                        </Link>
                    </div>
                </div>
                <hr />

                {/* Stats Bar */}
                <div className="row mb-4">
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-primary">₦{(vehicleOwner?.wallet?.balance || 0).toLocaleString()}</div>
                            <small className="text-muted">Wallet Balance</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-success">{vehicleOwner?.isApproved ? "Yes" : "No"}</div>
                            <small className="text-muted">Approved</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-info">
                                {vehicleOwner?.lastLogin ? new Date(vehicleOwner?.lastLogin).toLocaleDateString() : 'Never'}
                            </div>
                            <small className="text-muted">Last Login</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-warning">{vehicleOwner?.twoFactorEnabled ? "Enabled" : "Disabled"}</div>
                            <small className="text-muted">2FA</small>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Sidebar Tabs */}
                    <div className="col-md-3 mb-3">
                        <ul className="nav flex-column nav-pills gap-2">
                            {tabs.map((tab) => (
                                <li key={tab.id} className="nav-item">
                                    <button style={{ borderRadius: "6px" }} onClick={() => setActiveMainTab(tab.id)}
                                        className={`nav-link d-flex align-items-center gap-2 col-sm-12 ${
                                        activeMainTab === tab.id ? "active bg-primary text-white" : "text-dark"
                                    }`}>
                                        {tab.icon} {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Content Area */}
                    <div className="col-md-9">
                        {activeMainTab === "profile" && (<ProfileTabIndex vehicleOwner={vehicleOwner} />)}
                        {activeMainTab === "earnings" && (<EarningTabIndex vehicleOwner={vehicleOwner} />)}
                        {activeMainTab === "bookings" && (<BookingTabIndex vehicleOwner={vehicleOwner} />)}
                        {activeMainTab === "reports" && (<ReportTabIndex vehicleOwner={vehicleOwner} />)}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}