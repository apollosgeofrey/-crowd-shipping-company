// RatingStatsCards.tsx
import { FaStar, FaComments, FaUsers, FaChartLine } from "react-icons/fa";

interface RatingStatsCardsProps {
    metaData?: any;
    loading?: boolean;
}

export default function RatingStatsCards({ metaData, loading = false }: RatingStatsCardsProps) {
    const summary = metaData?.summary || {};
    
    const getSafeValue = (value: any, defaultValue: number = 0): number => {
        if (value === undefined || value === null) return defaultValue;
        return Number(value) || defaultValue;
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return "Just now";
        }
    };

    if (loading) {
        return (
            <div className="row g-3">
                {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-3 bg-light">
                            <div className="card-body d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-start gap-3 w-100">
                                    <div className="p-2 rounded-3 bg-white placeholder-glow">
                                        <div style={{ width: '24px', height: '24px' }}></div>
                                    </div>
                                    <div className="w-100">
                                        <h6 className="fw-semibold mb-2 placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </h6>
                                        <h4 className="fw-bold placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </h4>
                                        <small className="text-muted placeholder-glow">
                                            <span className="placeholder col-4"></span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const updatedDate = summary.summaryUpdate ? formatDate(summary.summaryUpdate) : "Just now";

    return (
        <div className="row g-3">
            {/* Total Ratings Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-primary-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaStar className="fs-4 text-primary" />
                                <h6 className="fw-semibold mb-0 text-primary">Total Ratings</h6>
                            </div>
                            <h4 className="fw-bold text-primary">
                                {getSafeValue(summary.totalRatings).toLocaleString()}
                            </h4>
                            <small className="text-muted">Updated: {updatedDate}</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Average Rating Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-success-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaChartLine className="fs-4 text-success" />
                                <h6 className="fw-semibold mb-0 text-success">Average Rating</h6>
                            </div>
                            <h4 className="fw-bold text-success">
                                {getSafeValue(summary.averageRatings?.overall, 0).toFixed(1)}/5.0
                            </h4>
                            <small className="text-muted">Updated: {updatedDate}</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-info-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaComments className="fs-4 text-info" />
                                <h6 className="fw-semibold mb-0 text-info">Reviews</h6>
                            </div>
                            <h4 className="fw-bold text-info">
                                {getSafeValue(summary.reviews?.withReviews).toLocaleString()}
                            </h4>
                            <small className="text-muted">With written feedback</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Ratings Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-warning-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaUsers className="fs-4 text-warning" />
                                <h6 className="fw-semibold mb-0 text-warning">Today's Ratings</h6>
                            </div>
                            <h4 className="fw-bold text-warning">
                                {getSafeValue(summary.todayRatings).toLocaleString()}
                            </h4>
                            <small className="text-muted">Updated: {updatedDate}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}