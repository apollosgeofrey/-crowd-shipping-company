export default function PersonalInformationTab({ user }: { user: any }) {

    // Split full name into first and last name for your layout
    const profile = user?.profile;
    const nameParts = user?.fullName?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return (
        <>
            <div className="row g-0 small">
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Full Name</p>
                    <p className="text-muted border-bottom pb-2">{user?.fullName || "Not specified"}</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Mobile Number</p>
                    <p className="text-muted border-bottom pb-2">{user?.phoneNumber || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Email Address</p>
                    <p className="text-muted border-bottom pb-2">{user?.email || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Gender</p>
                    <p className="text-muted border-bottom pb-2">
                        {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not specified"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Location</p>
                    <p className="text-muted border-bottom pb-2">
                        {profile?.geoLocation?.address || profile?.city || "Not specified"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">City</p>
                    <p className="text-muted border-bottom pb-2">{profile?.city || "Not specified"}</p>
                </div>

                {/* Additional fields from API that are available */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">State</p>
                    <p className="text-muted border-bottom pb-2">{profile?.state || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Country</p>
                    <p className="text-muted border-bottom pb-2">{profile?.country || "Not specified"}</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Status</p>
                    <p className="text-muted border-bottom pb-2">
                        <span className={`badge bg-${user?.status === 'active' ? 'success' : 'warning'}`}>
                            {user?.status}
                        </span>
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">KYC Status</p>
                    <p className="text-muted border-bottom pb-2">
                        <span className={`badge bg-${user?.kycStatus === 'completed' ? 'success' : 'warning'}`}>
                            {user?.kycStatus}
                        </span>
                    </p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Last Login</p>
                    <p className="text-muted border-bottom pb-2">
                        {user?.lastLogin ? new Date(user?.lastLogin).toLocaleString() : "Never logged in"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Member Since</p>
                    <p className="text-muted border-bottom pb-2">
                        {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="fw-semibold text-danger">
                    Verified by: {user?.isVerified ? "System" : "Pending"}
                </span>
                <div className="d-flex gap-3">
                    <button disabled={user?.kycStatus === 'completed'} className={`btn px-4 fw-semibold rounded-pill ${user?.kycStatus === 'completed' ? 'btn-success' : 'btn-primary'}`}>
                        {user?.kycStatus === 'completed' ? 'Verified' : 'Verify'}
                    </button>
                    <button className="btn btn-outline-primary px-4 fw-semibold rounded-pill" disabled={user?.kycStatus === 'completed'}>
                        Decline
                    </button>
                </div>
            </div>
        </>
    );
}