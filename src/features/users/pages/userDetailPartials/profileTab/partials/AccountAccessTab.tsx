import { FaShieldAlt, FaMobileAlt, FaEnvelope, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export default function AccountAccessTab({ user }: { user: any }) {
    
    // Helper function to get status badge
    const getStatusBadge = (status: boolean) => {
        return status ? (
            <span className="badge bg-success">Enabled</span>
        ) : (
            <span className="badge bg-secondary">Disabled</span>
        );
    };

    // Helper function to get verification status
    const getVerificationStatus = (isVerified: boolean) => {
        return isVerified ? (
            <span className="badge bg-success">Verified</span>
        ) : (
            <span className="badge bg-warning">Pending</span>
        );
    };

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                <h5 className="fw-semibold mb-4 text-primary d-flex align-items-center gap-2">
                    <FaShieldAlt /> Account Security & Access
                </h5>

                <div className="row g-0">
                    {/* Account Status */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                            <FaCheckCircle className="text-muted" /> Account Status
                        </p>
                        <p className="text-muted">
                            <span className={`badge bg-${user?.status === 'active' ? 'success' : 'warning'}`}>
                                {user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1) || 'Unknown'}
                            </span>
                        </p>
                    </div>

                    {/* Email Verification */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                            <FaEnvelope className="text-muted" /> Email Verification
                        </p>
                        <p className="text-muted">
                            {getVerificationStatus(user?.isVerified)}
                        </p>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                            <FaShieldAlt className="text-muted" /> 2FA Status
                        </p>
                        <p className="text-muted">
                            {getStatusBadge(user?.twoFactorEnabled)}
                        </p>
                    </div>

                    {/* Approval Status */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                            <FaCheckCircle className="text-muted" /> Admin Approval
                        </p>
                        <p className="text-muted">
                            {getStatusBadge(user?.isApproved)}
                        </p>
                    </div>

                    {/* Last Login */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                            <FaCalendarAlt className="text-muted" /> Last Login
                        </p>
                        <p className="text-muted">
                            {user?.lastLogin ? new Date(user?.lastLogin).toLocaleString() : 'Never logged in'}
                        </p>
                    </div>

                    {/* KYC Status */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                            <FaShieldAlt className="text-muted" /> KYC Status
                        </p>
                        <p className="text-muted">
                            <span className={`badge bg-${user?.kycStatus === 'completed' ? 'success' : 'warning'}`}>
                                {user?.kycStatus?.charAt(0).toUpperCase() + user?.kycStatus?.slice(1) || 'Pending'}
                            </span>
                        </p>
                    </div>

                    {/* Device Tokens */}
                    <div className="col-sm-6">
                        <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                            <FaMobileAlt className="text-muted" /> Connected Devices
                        </p>
                        <p className="text-muted">
                            {user?.deviceTokens?.length || 0} device(s)
                            {user?.deviceTokens?.length > 0 && (
                                <small className="d-block text-muted mt-1">
                                    Push notifications enabled
                                </small>
                            )}
                        </p>
                    </div>
                </div>

                {/* Security Actions */}
                <div className="row mt-4 pt-3 border-top">
                    <div className="col-sm-12">
                        <h6 className="fw-semibold mb-3">Security Actions</h6>
                        <div className="d-flex gap-2 flex-wrap">
                            <button className="btn btn-outline-primary btn-sm">
                                <span className="fa fa-shield-alt"></span> Reset Password
                            </button>
                            <button className={`btn btn-sm ${user?.twoFactorEnabled ? 'btn-outline-warning' : 'btn-outline-success'}`}>
                                <span className="fa fa-shield-alt"></span> {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                            </button>
                            <button className="btn btn-outline-info btn-sm">
                                <span className="fa fa-mobile-alt"></span> Manage Devices
                            </button>
                            <button className={`btn btn-sm ${user?.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}>
                                {user?.status === 'active' ? <><span className="fa fa-lock"></span> Suspend Account</> : <><span className="fa fa-check"></span> Activate Account</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Summary */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card bg-light border-0">
                            <div className="card-body py-3">
                                <div className="row text-center">
                                    <div className="col-md-3">
                                        <div className="fw-bold text-primary">
                                            {user?.isVerified ? "Verified" : "Pending"}
                                        </div>
                                        <small className="text-muted">Email Status</small>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="fw-bold text-success">
                                            {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                                        </div>
                                        <small className="text-muted">2FA Status</small>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="fw-bold text-info">
                                            {user?.isApproved ? "Approved" : "Pending"}
                                        </div>
                                        <small className="text-muted">Approval Status</small>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="fw-bold text-warning">
                                            {user?.deviceTokens?.length || 0}
                                        </div>
                                        <small className="text-muted">Devices</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}