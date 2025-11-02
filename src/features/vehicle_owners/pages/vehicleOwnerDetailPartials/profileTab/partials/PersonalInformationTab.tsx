export default function PersonalInformationTab({ vehicleOwner }: { vehicleOwner: any }) {
    // Job title (not available in API, using user type as placeholder)
    const profile = vehicleOwner?.profile;
    const jobTitle = vehicleOwner?.userType ? vehicleOwner?.userType.charAt(0).toUpperCase() + vehicleOwner?.userType.slice(1) : "Not specified";

    return (
        <>
            <div className="row g-0 small">
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Full Name</p>
                    <p className="text-muted border-bottom pb-2">{vehicleOwner?.fullName || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Gender</p>
                    <p className="text-muted border-bottom pb-2">
                        {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not specified"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Mobile Number</p>
                    <p className="text-muted border-bottom pb-2">{vehicleOwner?.phoneNumber || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Email Address</p>
                    <p className="text-muted border-bottom pb-2">{vehicleOwner?.email || "Not specified"}</p>
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
                        <span className={`badge bg-${vehicleOwner?.status === 'active' ? 'success' : 'warning'}`}>
                            {vehicleOwner?.status}
                        </span>
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">KYC Status</p>
                    <p className="text-muted border-bottom pb-2">
                        <span className={`badge bg-${vehicleOwner?.kycStatus === 'completed' ? 'success' : 'warning'}`}>
                            {vehicleOwner?.kycStatus}
                        </span>
                    </p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Last Login</p>
                    <p className="text-muted border-bottom pb-2">
                        {vehicleOwner?.lastLogin ? new Date(vehicleOwner?.lastLogin).toLocaleString() : "Never logged in"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Member Since</p>
                    <p className="text-muted border-bottom pb-2">
                        {new Date(vehicleOwner?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="fw-semibold text-danger">
                    Verified by: {vehicleOwner?.isVerified ? "System" : "Pending"}
                </span>
                <div className="d-flex gap-3">
                    <button 
                        disabled={vehicleOwner?.kycStatus === 'completed'} 
                        className={`btn px-4 fw-semibold rounded-pill ${vehicleOwner?.kycStatus === 'completed' ? 'btn-success' : 'btn-primary'}`}
                    >
                        {vehicleOwner?.kycStatus === 'completed' ? 'Verified' : 'Verify'}
                    </button>
                    <button 
                        className="btn btn-outline-primary px-4 fw-semibold rounded-pill" 
                        disabled={vehicleOwner?.kycStatus === 'completed'}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </>
    );
}