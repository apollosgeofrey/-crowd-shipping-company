export default function PersonalInformationTab({ admin }: { admin: any }) {
    // Job title (using role as placeholder)
    const profile = admin?.profile;
    const jobTitle = admin?.role ? admin?.role.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Not specified";

    return (
        <>
            <div className="row g-0 small">
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">First Name</p>
                    <p className="text-muted border-bottom pb-2">{admin?.fullName || "Not specified"}</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Mobile Number</p>
                    <p className="text-muted border-bottom pb-2">{admin?.phoneNumber || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Email Address</p>
                    <p className="text-muted border-bottom pb-2">{admin?.email || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Gender</p>
                    <p className="text-muted border-bottom pb-2">
                        {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not specified"}
                    </p>
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

                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Staff ID</p>
                    <p className="text-muted border-bottom pb-2">{admin?.userId || "Not specified"}</p>
                </div>

                {/* Additional fields from API that are available */}
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
                        <span className={`badge bg-${admin?.status === 'active' ? 'success' : 'warning'}`}>
                            {admin?.status?.charAt(0).toUpperCase() + admin?.status?.slice(1) || 'Unknown'}
                        </span>
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Admin Role</p>
                    <p className="text-muted border-bottom pb-2">
                        <span className={`badge bg-${
                            admin?.role === 'super-admin' ? 'danger' : 
                            admin?.role === 'admin' ? 'primary' : 
                            admin?.role === 'moderator' ? 'info' : 'secondary'
                        }`}>
                            {jobTitle}
                        </span>
                    </p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Last Login</p>
                    <p className="text-muted border-bottom pb-2">
                        {admin?.lastLogin ? new Date(admin?.lastLogin).toLocaleString() : "Never logged in"}
                    </p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Member Since</p>
                    <p className="text-muted border-bottom pb-2">
                        {new Date(admin?.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Admin-specific fields */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0 text-dark">Approval Status</p>
                    <p className="text-muted border-bottom pb-2">
                        <span className={`badge bg-${admin?.isApproved ? 'success' : 'warning'}`}>
                            {admin?.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Footer - Admin specific */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="fw-semibold text-danger">
                    Created By: {admin?.createdBy || "System"}
                </span>
            </div>
        </>
    );
}