import { useState } from "react";
import { FaCalendarAlt, FaArrowLeft, FaArrowRight, FaEllipsisV } from "react-icons/fa";


interface Props {
    pathfinders?: {
        air: any;
        maritime: any;
    };
    // user?: {
    //     fullName: string;
    //     userType: string;
    //     role: string;
    // };
}

export default function BookingTrips({ pathfinders }: Props) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDays, setSelectedDays] = useState([6, 7, 8]);

	// Helpers
	const monthName = currentDate.toLocaleString("default", { month: "long" });
	const year = currentDate.getFullYear();
	const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

	const handlePrevMonth = () => {
		setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
	};

	const handleDayClick = (day: number) => {
		setSelectedDays([day]); // allow single selection (or expand logic for multi)
	};

	return (
		<div className="card shadow-sm rounded p-3 pb-0" style={{ fontSize: "0.9rem" }}>
			{/* Header */}
			<div className="d-flex justify-content-between align-items-center mb-2">
				<h6 className="fw-bold mb-0">Bookings Trips</h6>
				<button className="btn btn-sm btn-outline-secondary rounded">
					<FaCalendarAlt style={{ fontSize: "0.9rem" }} />
				</button>
			</div>

			{/* Calendar Header */}
			<div className="d-flex justify-content-between align-items-center mb-2 small">
				<button className="btn btn-sm btn-primary rounded" onClick={handlePrevMonth}>
					<FaArrowLeft />
				</button>
				<h6 className="fw-bold mb-0">{monthName}, {year}</h6>
				<button className="btn btn-sm btn-primary rounded" onClick={handleNextMonth}>
					<FaArrowRight />
				</button>
			</div>

			{/* Calendar */}
			<div className="text-center mb-2 small">
				<div className="d-flex justify-content-between fw-bold text-secondary mb-1 small">
					<span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
				</div>

				<div className="d-grid gap-1 small" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
					{Array.from({ length: daysInMonth }, (_, i) => {
						const day = i + 1;
						const isSelected = selectedDays.includes(day);
						return (
							<div key={day} onClick={() => handleDayClick(day)}
							className={`small p-1 text-center rounded-5 ${isSelected ? "bg-primary text-white fw-bold" : "text-secondary"} `}
							style={{ cursor: "pointer", fontSize: "0.85rem" }}>
								{day}
							</div>
						);
					})}
				</div>
			</div>

			<hr className="border-secondary m-0" />
			
			{/* Maritime Pathfinder Trips */}
			<div>
			    <h6 className="fw-bold text-secondary d-flex justify-content-between align-items-center mb-0 mt-2">
			        🚢 Maritime Pathfinder Trips <FaEllipsisV />
			    </h6>
			    
			    {pathfinders?.maritime?.length > 0 ? (
			    	pathfinders?.maritime?.slice(0, 2).map((pathfinder: any) => (
			            <div key={pathfinder.id} className="mb-0 p-2 py-1 border-0 border-bottom">
			                <div className="d-flex align-items-start">
			                    <span className="fw-bold me-3 small" style={{ color: "#9b5cff", minWidth: "60px" }}>
			                        {new Date(pathfinder.departureDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}<br />
			                        {new Date(pathfinder.departureDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			                    </span>
			                    <div className="flex-grow-1 small">
			                        <div className="fw-bold text-primary">
			                        	{pathfinder.creator.fullName}
				                        <span className="fw-bold text-dark small"> ||
				                            {pathfinder.ship?.departurePort || 'Unknown'} → {pathfinder.ship?.arrivalPort || 'Unknown'}
				                        </span>
			                        </div>
			                        <div className="d-flex justify-content-between align-items-center mt-1">
			                            <small className="text-muted">
			                                📦 {pathfinder.capacity.pounds} lbs • {pathfinder.capacity.dimension || 'Standard'}
			                            </small>
			                            <span className={`badge ${pathfinder.status === 'open' ? 'bg-success' : 'bg-warning'}`}>
			                                {pathfinder.status}
			                            </span>
			                        </div>
			                        <small className="text-info">
			                            ⏱️ ETA: {new Date(pathfinder.arrivalDate).toLocaleDateString()} • 
			                            🚢 {pathfinder.ship?.vesselName || 'Unknown Vessel'}
			                        </small>
			                    </div>
			                </div>
			            </div>
			        ))
			    ) : (
			        <div className="text-muted text-center p-3 border rounded">
			            <i>No maritime trips available</i>
			        </div>
			    )}
			</div>

			{/* Air Pathfinder Trips */}
			<div>
			    <h6 className="fw-bold text-secondary d-flex justify-content-between align-items-center mt-3 mb-0">
			        ✈️ Air Pathfinder Trips <FaEllipsisV />
			    </h6>
			    
			    {pathfinders?.air?.length > 0 ? (
			    	pathfinders?.air?.slice(0, 2).map((pathfinder: any) => (
			            <div key={pathfinder.id} className="mb-0 p-2 py-1 pb-0 border-0 border-bottom">
			                <div className="d-flex align-items-start">
			                    <span className="fw-bold small me-3" style={{ color: "#9b5cff", minWidth: "60px" }}>
			                        {new Date(pathfinder.departureDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}<br />
			                        {new Date(pathfinder.departureDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			                    </span>
			                    <div className="flex-grow-1 small">
			                        <div className="fw-bold text-primary">
			                        	{pathfinder.creator.fullName}
				                        <span className="fw-bold text-dark small"> ||
				                            {pathfinder.flight?.departureAirport?.city || pathfinder.flight?.departureCity || 'Unknown'} → 
				                            {pathfinder.flight?.arrivalAirport?.city || pathfinder.flight?.arrivalCity || 'Unknown'}
				                        </span>
			                        </div>
			                        <div className="d-flex justify-content-between align-items-center mt-1">
			                            <small className="text-muted">
			                                📦 {pathfinder.capacity.pounds} lbs • {pathfinder.capacity.dimension || 'Standard'}
			                            </small>
			                            <span className={`badge ${pathfinder.status === 'open' ? 'bg-success' : 'bg-warning'}`}>
			                                {pathfinder.status}
			                            </span>
			                        </div>
			                        <small className="text-info">
			                            ⏱️ ETA: {new Date(pathfinder.arrivalDate).toLocaleDateString()} • 
			                            🎫 {pathfinder.flightId ? `TRIP-${pathfinder.tripId.slice(-6)}` : 'No Flight'}
				                        {pathfinder.flight?.departureAirport && (
				                           	<span className="d-inline text-muted"> ||
				                                🛫 {pathfinder.flight.departureAirport.iata} • 
				                                🛬 {pathfinder.flight.arrivalAirport.iata}
				                            </span>
				                        )}
			                        </small>
			                    </div>
			                </div>
			            </div>
			        ))
			    ) : (
			        <div className="text-muted text-center p-3 border rounded">
			            <i>No air trips available</i>
			        </div>
			    )}
			</div>
		</div>
	);
}
