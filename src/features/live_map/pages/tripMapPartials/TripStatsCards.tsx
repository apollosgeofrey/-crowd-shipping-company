// TripStatsCards.tsx
import { FaPlane, FaShip, FaChartLine, FaUsers } from "react-icons/fa";

interface TripStatsCardsProps {
    metaData?: any;
    loading?: boolean;
}

export default function TripStatsCards({ metaData, loading = false }: TripStatsCardsProps) {
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
            {/* Total Trips Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-primary-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaChartLine className="fs-4 text-primary" />
                                <h5 className="fw-semibold mb-0 text-primary">Total Trips:</h5>
                                <h4 className="fw-bold text-primary mb-0">
                                    {getSafeValue(summary.totalTrips).toLocaleString()}
                                </h4>
                            </div>
                            <small className="text-muted">Updated: {updatedDate}</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Air Trips Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-danger-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaPlane className="fs-4 text-danger" />
                                <h5 className="fw-semibold mb-0 text-danger">Air Trips:</h5>
                                <h4 className="fw-bold text-danger mb-0">
                                    {getSafeValue(summary.fleetTypeCounts?.air).toLocaleString()}
                                </h4>
                            </div>
                            <small className="text-muted">Flight journeys</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maritime Trips Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-warning-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaShip className="fs-4 text-warning" />
                                <h5 className="fw-semibold mb-0 text-warning">Maritime Trips:</h5>
                                <h4 className="fw-bold text-warning mb-0">
                                    {getSafeValue(summary.fleetTypeCounts?.maritime).toLocaleString()}
                                </h4>
                            </div>
                            <small className="text-muted">Ship voyages</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Trips Card */}
            <div className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm rounded-3 bg-success-subtle">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaUsers className="fs-4 text-success" />
                                <h5 className="fw-semibold mb-0 text-success">Today's Trips:</h5>
                                <h4 className="fw-bold text-success mb-0">
                                    {getSafeValue(summary.todayTrips).toLocaleString()}
                                </h4>
                            </div>
                            <small className="text-muted">Updated: {updatedDate}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}