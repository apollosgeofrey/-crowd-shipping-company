// DriverDetails.tsx
import userMale from "../../../../assets/images/user_male.png";

interface DriverDetailsProps {
    rating?: any;
    loading?: boolean;
}

export default function DriverDetails({ rating, loading = false }: DriverDetailsProps) {
    // Safe data access function
    const getSafeValue = (value: any, fallback: string = "N/A") => {
        return value !== undefined && value !== null ? value : fallback;
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Render star rating
    const renderStars = (ratingValue: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <i key={i}  className={`fa fa-star ${i < ratingValue ? "text-warning" : "text-muted"}`}></i>
        ));
    };

    // Get rating type badge
    const getRatingTypeBadge = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'customer': 'bg-primary text-white',
            'driver': 'bg-success text-white'
        };
        return typeMap[type] || 'bg-secondary text-white';
    };

    if (loading) {
        return (
            <div className="card border-0 shadow-sm rounded h-100 d-flex flex-column">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold placeholder-glow">
                            <span className="placeholder col-6"></span>
                        </h5>
                    </div>
                    
                    {/* Profile Image Skeleton */}
                    <div className="text-center mb-3">
                        <div className="placeholder-glow">
                            <div className="rounded-circle bg-light placeholder" style={{ width: '80px', height: '80px', margin: '0 auto' }}></div>
                        </div>
                    </div>

                    {/* Details Skeleton */}
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="mb-2">
                            <div className="placeholder-glow">
                                <span className="placeholder col-4"></span>
                                <span className="placeholder col-8"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm rounded h-100 d-flex flex-column">
            <div className="card-body">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">Rating Details</h5>
                    <span className={`badge ${getRatingTypeBadge(rating?.ratingType)}`}>
                        {getSafeValue(rating?.ratingType).toUpperCase()} RATING
                    </span>
                </div>

                {/* Profile Image */}
                <div className="text-center mb-3">
                    <img src={userMale} alt="Profile" className="rounded-circle shadow-sm" style={{ width: '80px', height: '80px', objectFit: 'cover' }}/>
                </div>

                {/* Rating Information */}
                <div className="mb-3">
                    <div className="text-center mb-2">
                        <div className="mb-1">
                            {renderStars(rating?.rating || 0)}
                        </div>
                        <h4 className="fw-bold text-warning">{rating?.rating || 0}/5</h4>
                    </div>
                    
                    {rating?.review && (
                        <div className="bg-light rounded p-3">
                            <p className="mb-0 small text-muted">
                                <i className="fa fa-quote-left me-1"></i>
                                {rating.review}
                                <i className="fa fa-quote-right ms-1"></i>
                            </p>
                        </div>
                    )}
                </div>

                {/* Rating Metadata */}
                <div className="small text-muted mb-3">
                    <div className="d-flex justify-content-between mb-1">
                        <span>Rating ID:</span>
                        <span className="fw-semibold">{getSafeValue(rating?._id)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span>Created:</span>
                        <span>{formatDate(rating?.createdAt)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span>Updated:</span>
                        <span>{formatDate(rating?.updatedAt)}</span>
                    </div>
                </div>

                {/* Rater Information */}
                <div className="mb-3">
                    <h6 className="fw-semibold border-bottom pb-1">
                        <i className="fa fa-user me-2"></i>Rater Information
                    </h6>
                    <div className="small">
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Name:</span>
                            <span className="fw-semibold">{getSafeValue(rating?.rater?.fullName)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Email:</span>
                            <span>{getSafeValue(rating?.rater?.email)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Phone:</span>
                            <span>{getSafeValue(rating?.rater?.phoneNumber)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">User Type:</span>
                            <span className="text-capitalize">{getSafeValue(rating?.rater?.userType)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">KYC Status:</span>
                            <span className={`badge ${rating?.rater?.kycStatus === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                {getSafeValue(rating?.rater?.kycStatus)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ratee Information */}
                <div className="mb-3">
                    <h6 className="fw-semibold border-bottom pb-1">
                        <i className="fa fa-user-check me-2"></i>Rated User Information
                    </h6>
                    <div className="small">
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Name:</span>
                            <span className="fw-semibold">{getSafeValue(rating?.ratee?.fullName)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Email:</span>
                            <span>{getSafeValue(rating?.ratee?.email)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Phone:</span>
                            <span>{getSafeValue(rating?.ratee?.phoneNumber)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">User Type:</span>
                            <span className="text-capitalize">{getSafeValue(rating?.ratee?.userType)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">KYC Status:</span>
                            <span className={`badge ${rating?.ratee?.kycStatus === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                {getSafeValue(rating?.ratee?.kycStatus)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                {/*<div className="mt-auto">
                    <div className="d-grid gap-2">
                        <button className="btn btn-outline-primary btn-sm">
                            <i className="fa fa-envelope me-1"></i> Contact Rater
                        </button>
                        <button className="btn btn-outline-secondary btn-sm">
                            <i className="fa fa-history me-1"></i> View History
                        </button>
                    </div>
                </div>*/}
            </div>
        </div>
    );
}