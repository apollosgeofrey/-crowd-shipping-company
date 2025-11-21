// PromoCodeStatsCards.tsx
import { FaTags, FaCheckCircle, FaClock, FaPercentage, FaDollarSign, FaGift } from "react-icons/fa";

interface PromoCodeStatsCardsProps {
    metaData?: any;
    loading?: boolean;
}

export default function PromoCodeStatsCards({ metaData, loading = false }: PromoCodeStatsCardsProps) {
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
                {[1, 2, 3, 4, 5, 6].map((id) => (
                    <div key={id} className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm rounded-3 bg-light">
                            <div className="card-body d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-start gap-3 w-100">
                                    <div className="p-2 rounded-3 bg-white placeholder-glow">
                                        <div style={{ width: '24px', height: '24px' }}></div>
                                    </div>
                                    <div className="w-100">
                                        <h6 className="fw-semibold mb-0 placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </h6>
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
            {/* Total Promo Codes */}
            <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 bg-primary-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-0">
                                <FaTags className="fs-4 text-primary" />
                                <h6 className="fw-semibold mb-0 text-primary">
                                    Total Codes:
                                </h6>
                                <h5 className="fw-bold mb-0 text-primary">
                                    {getSafeValue(summary.totalPromoCodes).toLocaleString()}
                                </h5>
                            </div>
                            <small className="text-muted">Updated: {updatedDate}</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Promo Codes */}
            <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 bg-success-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-0">
                                <FaCheckCircle className="fs-4 text-success" />
                                <h6 className="fw-semibold mb-0 text-success">Active Codes:</h6>
                                <h5 className="fw-bold mb-0 text-success">
                                    {getSafeValue(summary.activePromoCodes).toLocaleString()}
                                </h5>
                            </div>
                            <small className="text-muted">Currently running</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Promo Codes */}
            <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 bg-info-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-0">
                                <FaClock className="fs-4 text-info" />
                                <h6 className="fw-semibold mb-0 text-info">Today Codes:</h6>
                                <h5 className="fw-bold mb-0 text-info">
                                    {getSafeValue(summary.todayPromoCodes).toLocaleString()}
                                </h5>
                            </div>
                            <small className="text-muted">Created today</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Percentage Discounts */}
            <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 bg-warning-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-0">
                                <FaPercentage className="fs-4 text-warning" />
                                <h6 className="fw-semibold mb-0 text-warning">Percentage Codes:</h6>
                                <h5 className="fw-bold mb-0 text-warning">
                                    {getSafeValue(summary.typeCounts?.percentage).toLocaleString()}(%)
                                </h5>
                            </div>
                            <small className="text-muted">% Discount codes</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flat Discounts */}
            <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 bg-danger-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-0">
                                <FaDollarSign className="fs-4 text-danger" />
                                <h6 className="fw-semibold mb-0 text-danger">Flat Rate Codes:</h6>
                                <h5 className="fw-bold mb-0 text-danger">
                                    {getSafeValue(summary.typeCounts?.flat).toLocaleString()}
                                </h5>
                            </div>
                            <small className="text-muted">Fixed amount codes</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Free Services */}
            <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-3 bg-secondary-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-0">
                                <FaGift className="fs-4 text-secondary" />
                                <h6 className="fw-semibold mb-0 text-secondary">Free Codes:</h6>
                                <h5 className="fw-bold mb-0 text-secondary">
                                    {getSafeValue(summary.typeCounts?.free).toLocaleString()}
                                </h5>
                            </div>
                            <small className="text-muted">Free service codes</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}