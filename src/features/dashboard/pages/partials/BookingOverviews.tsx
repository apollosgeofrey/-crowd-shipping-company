// import { ProgressBar } from "react-bootstrap";

export default function BookingOverview({ recentBookings }: any) {
    // Helper function to get status color
    const getStatusColor = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'open': 'primary',
            'in_transit': 'info',
            'picking_up': 'warning',
            'delivered': 'success',
            'completed': 'success',
            'cancelled': 'danger'
        };
        return statusMap[status] || 'secondary';
    };

    // Helper function to calculate progress based on status
    const getProgress = (status: string) => {
        const progressMap: { [key: string]: number } = {
            'open': 0,
            'picking_up': 25,
            'in_transit': 65,
            'delivered': 100,
            'completed': 100,
            'cancelled': 0
        };
        return progressMap[status] || 0;
    };

    // Helper function to get route information
    const getRoute = (trip: any) => {
        if (trip.fleetType === 'air' && trip.flight) {
            return `${trip.flight.departureAirport?.city || trip.flight.departureCity} → ${trip.flight.arrivalAirport?.city || trip.flight.arrivalCity}`;
        } else if (trip.fleetType === 'maritime' && trip.ship) {
            return `${trip.ship.departurePort} → ${trip.ship.arrivalPort}`;
        }
        return 'Unknown Route';
    };

    // Helper function to get vehicle/ship information
    const getVehicleInfo = (trip: any) => {
        if (trip.fleetType === 'air' && trip.flight) {
            return `Flight ${trip.flightId?.slice(-6) || 'N/A'}`;
        } else if (trip.fleetType === 'maritime' && trip.ship) {
            return `${trip.ship.vesselName} - ${trip.ship.containerNumber}`;
        }
        return 'No Vehicle';
    };

    // Helper function to format ETA
    const getETA = (arrivalDate: string) => {
        if (!arrivalDate) return 'Unknown';
        const date = new Date(arrivalDate);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="card shadow rounded p-3" style={{ overflowX: "auto", maxWidth: "100vw" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold fs-6">
                	<span className="fa fa-list"></span> OVERVIEW OF (10) RECENT BOOKINGS
                </h6>
                <button className="btn btn-outline-secondary btn-sm rounded">
                    View All
                </button>
            </div>

            {/* Table */}
            <div className="table-xscroll small">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>ID</th>
					        <th style={{ width: '18%' }}>Description</th>
					        <th style={{ width: '15%' }}>Creator</th>
					        <th style={{ width: '22%' }}>Route</th>
					        <th style={{ width: '8%' }}>Type</th>
					        <th style={{ width: '10%' }}>Status</th>
					        <th style={{ width: '10%' }}>Progress</th>
					        <th style={{ width: '12%' }}>ETA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentBookings?.map((trip: any) => {
                            const statusColor = getStatusColor(trip.status);
                            const progress = getProgress(trip.status);
                            
                            return (
                                <tr key={trip.id}>
                                    <td>
                                        <div className="fw-bold">{trip.tripId}</div>
                                        <small className="text-muted text-uppercase">
                                            {trip.fleetType}
                                        </small>
                                    </td>
                                    <td>
                                        <div className="fw-bold">Trip {trip.tripId}</div>
                                        <small className="text-muted">
                                            📦 {trip.capacity.pounds} lbs
                                            {trip.capacity.dimension && ` • ${trip.capacity.dimension}`}
                                        </small>
                                    </td>
                                    <td>
                                        <div className="fw-bold">{trip.creator?.fullName || 'Unknown'}</div>
                                        <small className="text-muted">
                                            {getVehicleInfo(trip)}
                                        </small>
                                    </td>
                                    <td className="text-muted">
                                        {getRoute(trip)}
                                        {trip.fleetType === 'air' && trip.flight && (
                                            <small className="d-block text-info">
                                                {trip.flight.departureAirport?.iata} → {trip.flight.arrivalAirport?.iata}
                                            </small>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`w-100 badge bg-${trip.fleetType === 'air' ? 'info' : 'primary'}`}>
                                            {trip.fleetType}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`text-${statusColor} text-capitalize`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td style={{ width: "160px" }}>
                                        <div className="progress" style={{ height: "8px" }}>
                                            <div 
                                                className={`progress-bar bg-${statusColor}`} 
                                                role="progressbar" 
                                                style={{ width: `${progress}%` }}
                                                aria-valuenow={progress} 
                                                aria-valuemin={0} 
                                                aria-valuemax={100}
                                            />
                                        </div>
                                        <small className="text-muted">{progress}%</small>
                                    </td>
                                    <td className="fw-bold">
                                        {getETA(trip.arrivalDate)}
                                        <small className="d-block text-muted">
                                            {trip.arrivalDate ? new Date(trip.arrivalDate).toLocaleDateString() : ''}
                                        </small>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {/* Fallback for empty bookings */}
                {recentBookings.length === 0 && (
                    <div className="text-center py-4 text-muted">
                        <i>No recent bookings available</i>
                    </div>
                )}
            </div>
        </div>
    );
}