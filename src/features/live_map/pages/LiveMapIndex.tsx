// TripMapList.tsx
import * as L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import TripStatsCards from "./tripMapPartials/TripStatsCards.tsx";
import tripApi, { type TripFilters } from "../services/tripApi.ts";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function TripMapList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [metaData, setMetaData] = useState<any>(null);
    const [trips, setTrips] = useState<any[]>([]);
    const [filters, setFilters] = useState<TripFilters>({search:"", fleetType:"", status:"",dateFrom:"", dateTo:""});

    // Fetch trips from API
    useEffect(() => {
        async function fetchTrips() {
            setIsLoading(true);
            try {
                const response = await tripApi.getTrips({page, limit: perPage, ...filters});

                if (response.code === 200) {
                    setTrips(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                    setMetaData(response.data.meta);
                }
            } catch (err) {
                console.error("Failed to fetch trips:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTrips();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: keyof TripFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({search: "", fleetType: "", status: "",dateFrom: "", dateTo: ""});
        setPage(1);
    };

    // Format date
    // const formatDate = (dateString: string) => {
    //     if (!dateString) return "N/A";
    //     try {
    //         return new Date(dateString).toLocaleDateString('en-US', {
    //             year: 'numeric',
    //             month: 'short',
    //             day: 'numeric',
    //             hour: '2-digit',
    //             minute: '2-digit'
    //         });
    //     } catch (error) {
    //         return "Invalid Date";
    //     }
    // };

    // Get fleet type color
    const getFleetTypeColor = (fleetType: string) => {
        const colorMap: { [key: string]: string } = {
            'air': '#dc3545',      // Red for air
            'maritime': '#ffc107', // Yellow for maritime
            'road': '#198754'      // Green for road
        };
        return colorMap[fleetType] || '#6c757d'; // Gray for unknown
    };

    // Get fleet type icon
    const getFleetTypeIcon = (fleetType: string) => {
        const iconMap: { [key: string]: string } = {
            'air': 'fa-plane',
            'maritime': 'fa-ship',
            'road': 'fa-truck'
        };
        return iconMap[fleetType] || 'fa-map-marker-alt';
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'open': 'bg-success-subtle text-success',
            'completed': 'bg-primary-subtle text-primary',
            'pending': 'bg-warning-subtle text-warning',
            'cancelled': 'bg-danger-subtle text-danger'
        };
        return statusMap[status] || 'bg-secondary-subtle text-secondary';
    };

    // // Create custom marker icon
    // const createIcon = (color: string): L.DivIcon => {
    //     return new L.DivIcon({
    //         className: "custom-marker",
    //         html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
    //         iconSize: [16, 16],
    //         iconAnchor: [8, 8]
    //     });
    // };

    // Process trips for map rendering - FIXED VERSION
	const getTripCoordinates = (trip: any) => {
	    if (trip.fleetType === 'air' && trip.flight) {
	        const departure = trip.flight.departureAirport;
	        const arrival = trip.flight.arrivalAirport;
	        
	        if (departure?.latitude && departure?.longitude && arrival?.latitude && arrival?.longitude) {
	            // IMPORTANT: Leaflet uses [lat, lng] format
	            return {
	                departure: [departure.latitude, departure.longitude] as L.LatLngExpression,
	                arrival: [arrival.latitude, arrival.longitude] as L.LatLngExpression,
	                coords: [
	                    [departure.latitude, departure.longitude],
	                    [arrival.latitude, arrival.longitude]
	                ] as L.LatLngExpression[]
	            };
	        }
	    }
	    
	    // For maritime trips or trips without coordinates, use default Nigeria coordinates
	    const defaultDeparture = [6.5244, 3.3792] as L.LatLngExpression; // Lagos [lat, lng]
	    const defaultArrival = [9.0579, 7.4951] as L.LatLngExpression; // Abuja [lat, lng]
	    
	    return {
	        departure: defaultDeparture,
	        arrival: defaultArrival,
	        coords: [defaultDeparture, defaultArrival] as L.LatLngExpression[]
	    };
	};

    // Calculate map center based on visible trips
    const getMapCenter = (): L.LatLngExpression => {
        if (trips.length === 0) return [9.0820, 8.6753] as L.LatLngExpression; // Default Nigeria center
        
        const coordinates = trips.flatMap(trip => {
            const coords = getTripCoordinates(trip);
            return [coords.departure, coords.arrival];
        }).filter(coord => coord !== null);
        
        if (coordinates.length === 0) return [9.0820, 8.6753] as L.LatLngExpression;
        
        const lats = coordinates.map(coord => (coord as [number, number])[0]);
        const lngs = coordinates.map(coord => (coord as [number, number])[1]);
        
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        
        return [centerLat, centerLng] as L.LatLngExpression;
    };

    // Safe data access function
    const getSafeValue = (value: any, fallback: string = "N/A") => {
        return value !== undefined && value !== null ? value : fallback;
    };

    // Capitalize first letter
    const capitalizeFirst = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                            {/* Statistics Cards */}
                            <div className="mb-4">
                                <TripStatsCards metaData={metaData} loading={isLoading} />
                            </div>

                            {/* Filter Bar */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
                                
                                    {/* Filter By */}
                                    <button className="btn btn-sm btn-light border-0 fw-semibold px-3" disabled={true}>
                                        <i className="fa fa-filter me-1"></i> Filter By
                                    </button>

                                    {/* Search Input */}
                                    <div className="d-flex align-items-center px-2">
                                        <input type="text" className="form-control form-control-sm border-1 bg-transparent" placeholder="Search trip ID or creator..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            style={{ minWidth: "200px" }}
                                        />
                                    </div>

                                    {/* Fleet Type Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.fleetType}
                                            onChange={(e) => handleFilterChange("fleetType", e.target.value)}
                                        >
                                            <option value="">All Types</option>
                                            <option value="air">Air Trips</option>
                                            <option value="maritime">Maritime Trips</option>
                                            <option value="road">Road Trips</option>
                                        </select>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange("status", e.target.value)}
                                        >
                                            <option value="">All Status</option>
                                            <option value="open">Open</option>
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    {/* Reset Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <button className="btn btn-sm btn-light border-0 fw-semibold px-3 text-danger" onClick={resetFilters}>
                                            <i className="fa fa-undo me-1"></i> Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions and Stats */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-muted">
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} trips
                                    </span>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card border-0 shadow-sm rounded" style={{ overflow: "hidden", maxWidth: "100vw" }}>
                                        <div className="card-body p-0" style={{ height: "800px" }}>
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center h-100">
                                                    <div className="text-center">
                                                        <div className="spinner-border text-primary mb-3" role="status"></div>
                                                        <div className="text-muted">Loading trips map...</div>
                                                    </div>
                                                </div>
                                            ) : (                                                

                                            	<MapContainer center={getMapCenter()} zoom={3} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
												    {/* Map tiles */}
												    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'/>

												    {/* Debug: Add a test marker to verify map is working */}
												    <Marker position={[9.0820, 8.6753]}>
												        <Popup>
												            <strong>Test Marker</strong><br />
												            Nigeria Center - If you see this, map is working
												        </Popup>
												    </Marker>

												    {/* Render trips */}
												    {trips.map((trip, index) => {
												        const coordinates = getTripCoordinates(trip);
												        const color = getFleetTypeColor(trip.fleetType);
												        const icon = getFleetTypeIcon(trip.fleetType);
												        
												        console.log(`Rendering Trip ${index}:`, trip.tripId, 'Color:', color);
												        console.log('Departure Coords:', coordinates.departure);
												        console.log('Arrival Coords:', coordinates.arrival);

												        return (
												            <div key={trip._id}>
												                {/* Route Line */}
												                <Polyline positions={coordinates.coords} 
												                    pathOptions={{ 
												                        color: color, 
												                        weight: 6,  // Increased weight
												                        opacity: 0.8,
												                        dashArray: trip.fleetType === 'maritime' ? '5, 10' : undefined // Dashed for maritime
												                    }}
												                />
												                
												                {/* Departure Marker - Using default icon for now */}
												                <Marker position={coordinates.departure}>
												                    <Popup>
												                        <div className="text-center">
												                            <h6 className="fw-bold mb-2">🚀 {trip.tripId}</h6>
												                            <p className="mb-1">
												                                <i className={`fa ${icon} me-2`}></i>
												                                {capitalizeFirst(trip.fleetType)} Trip - DEPARTURE
												                            </p>
												                            <p className="mb-1">
												                                <span className={`badge ${getStatusBadge(trip.status)}`}>
												                                    {capitalizeFirst(trip.status)}
												                                </span>
												                            </p>
												                            <p className="mb-1">
												                                <strong>Creator:</strong> {getSafeValue(trip.creator?.fullName)}
												                            </p>
												                            <p className="mb-1 text-muted">
												                                <small>Coordinates: {JSON.stringify(coordinates.departure)}</small>
												                            </p>
												                        </div>
												                    </Popup>
												                </Marker>

												                {/* Arrival Marker - Using default icon for now */}
												                <Marker position={coordinates.arrival}>
												                    <Popup>
												                        <div className="text-center">
												                            <h6 className="fw-bold mb-2">🏁 {trip.tripId}</h6>
												                            <p className="mb-1">
												                                <i className={`fa ${icon} me-2`}></i>
												                                {capitalizeFirst(trip.fleetType)} Trip - ARRIVAL
												                            </p>
												                            <p className="mb-1 text-muted">
												                                <small>Coordinates: {JSON.stringify(coordinates.arrival)}</small>
												                            </p>
												                        </div>
												                    </Popup>
												                </Marker>
												            </div>
												        );
												    })}
												</MapContainer>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                                
                            {/* Pagination Bar */}
                            <div className="mt-4">
                                <PaginationBar 
                                    page={page} 
                                    perPage={perPage} 
                                    totalPages={totalPages} 
                                    onPageChange={setPage} 
                                    onPerPageChange={setPerPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}