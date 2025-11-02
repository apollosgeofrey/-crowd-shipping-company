interface IdentityInformationTabProps {
    profile?: {
        identificationType?: string;
        licenseNumber?: string;
        gender?: string;
        country?: string;
        state?: string;
        city?: string;
        geoLocation?: {
            address?: string;
        };
    };
    identityInfo: {
        identificationType?: string;
        licenseNumber?: string;
        gender?: string;
    };
}

export default function IdentityInformationTab({ pathfinder }: {props: any}) {

    // Use actual data from props with fallbacks
    const profile = pathfinder?.profile || {}
    const identityData = {
        email: pathfinder.email || "Not specified",
        nationality: profile?.country || "Not specified",
        fullName: pathfinder.fullName || "Not specified",
        idNumber: profile?.licenseNumber || "Not provided",
        identityType: profile?.identificationType || "Not provided",
        gender: profile?.gender ? profile?.gender.charAt(0).toUpperCase() + profile?.gender.slice(1) : "Not specified",
        address: profile?.geoLocation?.address || (profile?.city && profile?.state ? `${profile.city}, ${profile.state}` : "Not specified"),
    }; 

    return (
        <>
            <div className="row g-0 small">
                {/* Identity Type */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Identification Type</p>
                    <p className="text-muted border-bottom pb-2">{identityData.identityType}</p>
                </div>

                {/* ID Number */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">License Number</p>
                    <p className="text-muted border-bottom pb-2">{identityData.idNumber}</p>
                </div>

                {/* Full Name - Note: This should come from parent's basicInfo */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Full Name</p>
                    <p className="text-muted border-bottom pb-2">{identityData.fullName}</p>
                </div>

                {/* Email - Note: This should come from parent's basicInfo */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Email Address</p>
                    <p className="text-muted border-bottom pb-2">{identityData.email}</p>
                </div>

                {/* Gender */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Gender</p>
                    <p className="text-muted border-bottom pb-2">{identityData.gender}</p>
                </div>

                {/* Nationality */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Nationality</p>
                    <p className="text-muted border-bottom pb-2">{identityData.nationality}</p>
                </div>
            </div>

            {/* Additional information from API that's available */}
            <div className="row g-0 mt-3 pt-3 small border-top">
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Country</p>
                    <p className="text-muted border-bottom pb-2">{profile?.country || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">State</p>
                    <p className="text-muted border-bottom pb-2">{profile?.state || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">City</p>
                    <p className="text-muted border-bottom pb-2">{profile?.city || "Not specified"}</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Language</p>
                    <p className="text-muted border-bottom pb-2">{profile?.language ? profile.language.charAt(0).toUpperCase() + profile.language.slice(1) : "Not specified"}</p>
                </div>
            </div>
        </>
    );
}