import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { adminApi } from "../services/adminApi";
import userMale from "../../../assets/images/user_male.png";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ProfileTabIndex from "./adminDetailPartials/profileTab/ProfileTabIndex.tsx";
import AssignRoleTabIndex from "./adminDetailPartials/assignRoleTab/AssignRoleTabIndex.tsx";
import AnotherMenu1TabIndex from "./adminDetailPartials/anotherMenu1Tab/AnotherMenu1TabIndex.tsx";
import AnotherMenu2TabIndex from "./adminDetailPartials/anotherMenu2Tab/AnotherMenu2TabIndex.tsx";
import { FaUser, FaKey, FaList, FaShieldAlt, FaUserShield } from "react-icons/fa";

export default function AdminDetail() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState<string | null>(null);

    // Separate states for main tab
    const [activeMainTab, setActiveMainTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: <FaUser /> },
        { id: "assign-role", label: "Assign Role", icon: <FaKey /> },
        // { id: "permissions", label: "Permissions", icon: <FaShieldAlt /> },
        // { id: "activity", label: "Activity Log", icon: <FaList /> },
    ];

    // Fetch admin data
    useEffect(() => {
        const fetchAdmin = async () => {
            if (!id) {
                setError("Invalid admin ID");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await adminApi.getAdminById(id);
                if (res.code === 200 && res.data) {
                    setAdmin(res.data);
                } else {
                    setError(res.message || "Failed to load admin data");
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || "An error occurred while loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
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

    // Helper function to get role badge color
    const getRoleBadgeColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'super-admin': return 'danger';
            case 'admin': return 'primary';
            case 'moderator': return 'info';
            case 'support': return 'warning';
            default: return 'secondary';
        }
    };

    // Helper function to get verification status
    const getVerificationStatus = (admin: any) => {
        if (admin?.isVerified && admin?.kycStatus === 'completed') return <span className="text-success fw-semibold">Verified</span>;
        if (admin?.kycStatus === 'pending') return <span className="text-warning fw-semibold">KYC Pending</span>;
        if (!admin?.isVerified) return <span className="text-danger fw-semibold">Unverified</span>;
        return <span className="text-danger fw-semibold">Verification Required</span>;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="container mt-0">
                    <div className="row justify-content-center">
                        <div className="col-sm-12">
                            <div className="card shadow-sm border-0 p-5 d-flex align-items-center justify-content-center text-center" style={{ minHeight: "250px" }}>
                                <div>
                                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 mb-0 text-muted fw-semibold">Loading admin details...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !admin) {
        return (
            <DashboardLayout>
                <div className="card shadow-sm rounded p-4">
                    <div className="alert alert-danger">
                        <h5 className="alert-heading">Error Loading Admin</h5>
                        <p className="mb-0">{error || "Admin not found"}</p>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/admins" className="btn btn-sm btn-primary">
                            <i className="fa fa-arrow-left me-2"></i> Back to Admins
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
                        <img src={admin?.profile?.profilePicUrl || userMale} alt={admin?.fullName} className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }}/>
                        <div>
                            <h5 className="fw-bold mb-2">
                                {admin?.fullName}
                                <sup className={`text-${getStatusTextColor(admin?.status)} text-sm`}>
                                    &nbsp; - <small>({admin?.status?.toUpperCase()})</small>
                                </sup>
                            </h5>
                            <p className="mb-1 fw-semibold">
                                <span className="fa fa-id-card me-2"></span> {getVerificationStatus(admin)}
                            </p>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-user-shield me-2"></span>
                                <span className={`badge bg-${getRoleBadgeColor(admin?.role)}`}>
                                    {admin?.role?.charAt(0).toUpperCase() + admin?.role?.slice(1) || 'Admin'}
                                </span>
                            </p>
                            <p className="mb-0 text-muted small">
                                <span className="fa fa-calendar me-1"></span> Joined {new Date(admin?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="ms-auto d-flex gap-2">                        
                        <Link to={`/admins/${admin?._id}/edit`} className="btn btn-sm btn-primary px-3">
                            <span className="fa fa-pencil-alt me-1"></span> Edit Profile
                        </Link>
                    </div>
                </div>
                <hr />

                {/* Stats Bar */}
                <div className="row mb-4">
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-primary">{admin?.isApproved ? "Approved" : "Pending"}</div>
                            <small className="text-muted">Approval Status</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-success">{admin?.isVerified ? "Verified" : "Pending"}</div>
                            <small className="text-muted">Verification</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-info">{admin?.lastLogin ? new Date(admin?.lastLogin).toLocaleDateString() : 'Never'}</div>
                            <small className="text-muted">Last Login</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-warning">{admin?.twoFactorEnabled ? "Enabled" : "Disabled"}</div>
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
                        {activeMainTab === "profile" && (<ProfileTabIndex admin={admin} />)}
                        {activeMainTab === "assign-role" && (<AssignRoleTabIndex admin={admin} onAdminUpdate={(updatedAdmin) => setAdmin(updatedAdmin)} />)}
                        {/*{activeMainTab === "permissions" && (<AnotherMenu1TabIndex admin={admin} />)}*/}
                        {/*{activeMainTab === "activity" && (<AnotherMenu2TabIndex admin={admin} />)}*/}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}