

export default function PersonalInformationTab({pathfinder}: any) {
    // Job title (not available in API, using user type as placeholder)
    const profile = pathfinder?.profile;
    const jobTitle = pathfinder?.userType ? pathfinder?.userType.charAt(0).toUpperCase() + pathfinder?.userType.slice(1) : "Not specified";

    return (
        <>
            <div className="row g-0 small">
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Full Name</p>
                    <p className="text-muted border-bottom pb-2">{pathfinder?.fullName || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Gender</p>
                    <p className="text-muted border-bottom pb-2">
                        {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not specified"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Mobile Number</p>
                    <p className="text-muted border-bottom pb-2">{pathfinder?.phoneNumber || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Email Address</p>
                    <p className="text-muted border-bottom pb-2">{pathfinder?.email || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Job Title</p>
                    <p className="text-muted border-bottom pb-2">{jobTitle}</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Location</p>
                    <p className="text-muted border-bottom pb-2">
                        {profile?.geoLocation?.address || profile?.city || "Not specified"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">City</p>
                    <p className="text-muted border-bottom pb-2">{profile?.city || "Not specified"}</p>
                </div>

                {/* Additional fields from API that weren't in your original design */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">State</p>
                    <p className="text-muted border-bottom pb-2">{profile?.state || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Country</p>
                    <p className="text-muted border-bottom pb-2">{profile?.country || "Not specified"}</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Status</p>
                    <p className="text-muted border-bottom pb-2">
                        <span className={`badge bg-${pathfinder?.status === 'active' ? 'success' : 'warning'}`}>
                            {pathfinder?.status}
                        </span>
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">KYC Status</p>
                    <p className="text-muted border-bottom pb-2">
                        <span className={`badge bg-${pathfinder?.kycStatus === 'completed' ? 'success' : 'warning'}`}>
                            {pathfinder?.kycStatus}
                        </span>
                    </p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Last Login</p>
                    <p className="text-muted border-bottom pb-2">
                        {pathfinder?.lastLogin ? new Date(pathfinder?.lastLogin).toLocaleString() : "Never logged in"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Member Since</p>
                    <p className="text-muted border-bottom pb-2">
                        {new Date(pathfinder?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="fw-semibold text-danger">
                    Verified by: {pathfinder?.isVerified ? "System" : "Pending"}
                </span>
                <div className="d-flex gap-3">
                    <button disabled={pathfinder?.kycStatus === 'completed'} className={`btn px-4 fw-semibold rounded-pill ${pathfinder?.kycStatus === 'completed' ? 'btn-success' : 'btn-primary'}`}>
                        {pathfinder?.kycStatus === 'completed' ? 'Verified' : 'Verify'}
                    </button>
                    <button className="btn btn-outline-primary px-4 fw-semibold rounded-pill" disabled={pathfinder?.kycStatus === 'completed'}>
                        Decline
                    </button>
                </div>
            </div>
        </>
    );
}