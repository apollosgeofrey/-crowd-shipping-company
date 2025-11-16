import { FaUsers, FaCheckCircle, FaDollarSign, FaClock, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface BookingStatsCardsProps {
    metaData?: any;
    loading?: boolean;
}

export default function BookingStatsCards({ metaData, loading = false }: BookingStatsCardsProps) {
    // Get stats from the correct path in API response
    const summary = metaData?.summary || {};
    
    // Helper function to safely get values
    const getSafeValue = (value: any, defaultValue: number = 0): number => {
        if (value === undefined || value === null) return defaultValue;
        return Number(value) || defaultValue;
    };

    const getSafeString = (value: any, defaultValue: string = "0"): string => {
        if (value === undefined || value === null) return defaultValue;
        return String(value);
    };

    // Format date function with error handling
    function formatDate(dateString: string) {
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
    }

    if (loading) {
        return (
            <div className="row g-3">
                {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="col-md-6 col-lg-3">
                        <div className="card border rounded-4 shadow-sm h-100">
                            <div className="card-body d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-start gap-3 w-100">
                                    <div className="p-3 rounded-3 bg-light placeholder-glow">
                                        <div style={{ width: '24px', height: '24px' }}></div>
                                    </div>
                                    <div className="w-100">
                                        <h6 className="fw-semibold text-dark mb-1 placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </h6>
                                        <h4 className="fw-bold text-dark placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="row g-3">
            {/* Active Trips Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border rounded-4 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            <div className="p-3 rounded-3 bg-primary-subtle bg-opacity-10 text-primary">
                                <FaUsers className="fs-4" />
                            </div>
                            <div>
                                <h6 className="fw-semibold text-dark mb-1">Active Trips</h6>
                                <h4 className="fw-bold text-dark">{getSafeValue(summary.activeTrips, 0).toLocaleString()}</h4>
                            </div>
                        </div>
                        {/*<div className="ms-auto">
                            <span className={`badge rounded-pill px-3 py-2 fw-semibold text-white ${getSafeValue(summary.activeTrips) > 0 ? "bg-success" : "bg-secondary"}`}>
                                <FaArrowUp className="me-1" /> 12%
                            </span>
                        </div>*/}
                    </div>
                    <div className="card-footer bg-white border-0 pt-0">
                        <small className="text-muted">Updated: {formatDate(getSafeString(summary.summaryUpdate, new Date().toISOString()))}</small>
                    </div>
                </div>
            </div>

            {/* Completed Today Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border rounded-4 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success">
                                <FaCheckCircle className="fs-4" />
                            </div>
                            <div>
                                <h6 className="fw-semibold text-dark mb-1">Completed Today</h6>
                                <h4 className="fw-bold text-dark">{getSafeValue(summary.completedToday, 0).toLocaleString()}</h4>
                            </div>
                        </div>
                        {/*<div className="ms-auto">
                            <span className={`badge rounded-pill px-3 py-2 fw-semibold text-white ${getSafeValue(summary.completedToday) > 0 ? "bg-success" : "bg-secondary"}`}>
                                <FaArrowUp className="me-1" /> 5%
                            </span>
                        </div>*/}
                    </div>
                    <div className="card-footer bg-white border-0 pt-0">
                        <small className="text-muted">Updated: {formatDate(getSafeString(summary.summaryUpdate, new Date().toISOString()))}</small>
                    </div>
                </div>
            </div>

            {/* Total Revenue Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border rounded-4 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            <div className="p-3 rounded-3 bg-info bg-opacity-10 text-info">
                                <FaDollarSign className="fs-4" />
                            </div>
                            <div>
                                <h6 className="fw-semibold text-dark mb-1">Total Revenue</h6>
                                <h4 className="fw-bold text-dark">₦{getSafeValue(summary.totalRevenue, 0).toLocaleString()}</h4>
                            </div>
                        </div>
                        {/*<div className="ms-auto">
                            <span className={`badge rounded-pill px-3 py-2 fw-semibold text-white ${getSafeValue(summary.totalRevenue) > 0 ? "bg-success" : "bg-secondary"}`}>
                                <FaArrowDown className="me-1" /> 8%
                            </span>
                        </div>*/}
                    </div>
                    <div className="card-footer bg-white border-0 pt-0">
                        <small className="text-muted">Updated: {formatDate(getSafeString(summary.summaryUpdate, new Date().toISOString()))}</small>
                    </div>
                </div>
            </div>

            {/* Pending Bookings Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border rounded-4 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                                <FaClock className="fs-4" />
                            </div>
                            <div>
                                <h6 className="fw-semibold text-dark mb-1">Pending Bookings</h6>
                                <h4 className="fw-bold text-dark">{getSafeValue(summary.statusCounts?.pending, 0).toLocaleString()}</h4>
                            </div>
                        </div>
                        {/*<div className="ms-auto">
                            <span className={`badge rounded-pill px-3 py-2 fw-semibold text-white ${getSafeValue(summary.statusCounts?.pending) > 0 ? "bg-warning" : "bg-success"}`}>
                                <FaArrowUp className="me-1" /> 8%
                            </span>
                        </div>*/}
                    </div>
                    <div className="card-footer bg-white border-0 pt-0">
                        <small className="text-muted">Updated: {formatDate(getSafeString(summary.summaryUpdate, new Date().toISOString()))}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}