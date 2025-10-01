import L from "leaflet";
// import { Link } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";



export default function LiveMapIndex() {
	const [isLoading, setIsLoading] = useState(false);

	// Simulate fetch
	useEffect(() => {
		async function fetchLiveLocations() {
		  setIsLoading(true);
			try {
				// Example API call (replace with your backend endpoint)
                // const res = await fetch(`/api/support-data?page=${page}`);
                // const data = await res.json();
                // Laravel paginate-style response often has: data, total, per_page, current_page
			    // optionally update totalPages dynamically: setTotalPages(data.last_page);
			} catch (err) {
			    console.error(err);
			} finally {
			    setIsLoading(false);
			}
		}
		fetchLiveLocations();
	}, []);

	// Custom marker icons
	const createIcon = (color: string) => new L.DivIcon({
	     className: "custom-marker",
	     html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff"></div>`,
	});

	// Example trips data
	const trips = [
	    {id: "TRP-001", driver: "Segun Jogjson", vehicle: "V001", status: "Active", color: "red", coords: [[7.3775, 3.9470], [7.4115, 3.9059]]},
	    {id: "TRP-002", driver: "James Doe", vehicle: "V002", status: "Completed", color: "blue", coords: [[7.3855, 3.8967], [7.4147, 3.9311]]},
	    {id: "TRP-003", driver: "Michael Brown", vehicle: "V003", status: "Active", color: "green", coords: [[7.3732, 3.9270], [7.3981, 3.9422]]},
	];

  	return (
	    <DashboardLayout>
		    <div className="row mb-4">
		    	<div className="d-flex justify-content-between align-items-center mb-4">
				    {/* Left: Title & Description */}
				    <div>
				        <h5 className="fw-bold mb-1">Live Tracking</h5>
				        <p className="text-muted small mb-0">Manage support tickets and inquiries</p>
				    </div>

				    {/* Right: Button */}
				    {/*<button className="btn btn-danger fw-semibold px-4 rounded d-flex align-items-center gap-2">
				        <i className="fa fa-plus"></i> Resolved
				    </button>*/}
				</div>

		      	{/* Status Filter */}
			    <div className="col-sm-12 col-md-4 mb-3">
			    	<label className="form-label fw-semibold mb-0">Select Status</label>
			      	<div className="input-group rounded shadow-sm">
			        	<select className="form-select fw-semibold">
			          		<option>All</option>
			          		<option>Active</option>
			          		<option>Compared</option>
			          		<option>Pending</option>
			        	</select>
				    </div>
		      	</div>

		      	{/* Trip Filter */}
			    <div className="col-sm-12 col-md-4 mb-3">
			    	<label className="form-label fw-semibold mb-0">Select Trip</label>
			      	<div className="input-group rounded shadow-sm">
			        	<select className="form-select fw-semibold">
			          		<option>All Trips</option>
			          		<option>Trips #ID1721 Segun Waleson</option>
			          		<option>Trips #ID1234 Segun Johnson</option>
			          		<option>Trips #ID1454 Segun Johnson</option>
			        	</select>
				    </div>
		      	</div>

			    {/* Sort Filter */}
				<div className="col-sm-12 col-md-4 mb-3">
				    <label className="form-label fw-semibold mb-0">Select Continent</label>
				    <div className="input-group rounded shadow-sm">
				        <select className="form-select fw-semibold">
				        	<option>All Continents</option>
				        	<option>Africa</option>
				        	<option>South America</option>
				        	<option>North America</option>
				        	<option>Asia</option>
				        	<option>Europe</option>
				        	<option>Australia</option>
				        	<option>Antarctica</option>
				        </select>
				    </div>
			    </div>
		        <div className="col-md-12">
			        <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
			            <div className="card-body">
			            	<div className="col-md-12">
						      	<div className="card border-0 shadow-sm rounded" style={{ overflow: "hidden", maxWidth: "100vw" }} >
							        <div className="card-body p-0" style={{ height: "500px" }}>
								        <MapContainer center={[7.3775, 3.9470]} zoom={13} style={{ height: "100%", width: "100%" }}>								            
								            {/* Map tiles */}
								            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'/>

								            {/* Render trips */}
								            {trips.map((trip) => (
								              	<Polyline key={trip.id} positions={trip.coords} color={trip.color} weight={4}>
									                {/* Start Marker */}
									                <Marker position={trip.coords[0]} icon={createIcon(trip.color)}>
									                  	<Popup>
									                    	<b>{trip.id} - {trip.driver}</b> <br />
									                    	Vehicle: {trip.vehicle} <br />
									                    	Status: {trip.status}
									                  	</Popup>
									                </Marker>

								                	{/* End Marker */}
								                	<Marker position={trip.coords[1]} icon={createIcon(trip.color)} />
								              	</Polyline>
								            ))}
								        </MapContainer>
							        </div>
						      	</div>
						    </div>			              	
			            </div>
			        </div>
		        </div>
		    </div>
	    </DashboardLayout>
  	);
}
