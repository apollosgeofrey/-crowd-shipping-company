import { useState } from "react";
import { useParams } from "react-router-dom";
import userMale from "../../../assets/images/user_male.png";
import packageImage from "../../../assets/images/package_image.png";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import DriverDetails from "./ratingDetailPartials/DriverDetails.tsx";
import { FaPhone, FaPhoneAlt, FaVideo, FaPaperclip, FaSmile, FaPaperPlane } from "react-icons/fa";

export default function RatingDetail() {
	const { id } = useParams<{ id: string }>();
	const [activeTab, setActiveTab] = useState("message");
	
	const trip = {
		reference: "TRP-001",
		packageInfo: "Electronics Package - MacBook Pro",
		value: "₦450,000",
		status: "Delivered",
		rating: 4,
		review: "Driver was well behaved and spoke professionally",
		date: "1/5/2025 12:00 PM",
		progress: 100,
		sender: { name: "John Smith", phone: "+234-801-234-5678", address: "Lagos Island" },
		receiver: { name: "Sarah Johnson", phone: "+234-801-234-5678", address: "Victoria Island" },
		distance: "12.5 km",
		started: "1:15 PM",
		eta: "2:30 PM",
	};


	return (
	    <DashboardLayout>
		    <div className="row g-3">
		        {/* Left Sidebar - Complaint Details */}
		        <div className="col-md-4">
		        	<DriverDetails />
		        </div>

		        {/* Right Panel - Trip Details */}
				<div className="col-md-8">
					<div className="card border-0 shadow-sm rounded h-100 d-flex flex-column">
					    <div className="card-body">

						    {/* Header */}
						    <div className="d-flex justify-content-between align-items-center mb-3">
						        <h5 className="fw-bold">Trip Details - {trip.reference}</h5>
						        <button className="btn btn-sm btn-light border-0">
						          	<i className="fa fa-times fa-lg text-dark"></i>
						        </button>
						    </div>

					      	{/* Images */}
					      	<div className="row mb-4">
						        <div className="col-md-6">
						          	<p className="fw-semibold text-left mb-0">Before Delivery</p>
						          	<img src={packageImage} alt="Before Image" className="img-fluid rounded shadow-sm" />
						        </div>
						        <div className="col-md-6">
						          	<p className="fw-semibold text-left mb-0">After Delivery</p>
						          	<img src={packageImage} alt="After Image" className="img-fluid rounded shadow-sm" />
						        </div>
					      	</div>

					      	{/* Package Info + Status */}
						    <div className="d-flex justify-content-between align-items-center mb-3">
						        <div>
						          	<p className="fw-semibold mb-1">Package Information</p>
						          	<p className="mb-0 text-muted">{trip.packageInfo}</p>
						          	<p className="mb-0 text-muted">Value: {trip.value}</p>
						        </div>
						        <div>
						          	<p className="fw-semibold mb-1">Status</p>
						          	<span className="badge bg-success-subtle text-success px-3 py-2">{trip.status}</span>
						        </div>
						    </div>

					      	{/* Rating */}
					      	<div className="d-flex justify-content-between align-items-center mb-3">
						        <div>
						          	<p className="fw-semibold mb-1">Rating</p>
						          	<p className="mb-0 small text-muted">Review: {trip.review}</p>
					        		<small className="text-secondary">Date: {trip.date}</small>
						        </div>
						        <div>
						          	<p className="fw-semibold mb-1">
						          		{Array.from({ length: 5 }).map((_, i) => (
							            	<i key={i} className={`fa fa-star ${i < trip.rating ? "text-warning" : "text-muted"}`}></i>
							          	))}
						          	</p>
						        </div>
						    </div>

					      	{/* Progress */}
						    <div className="mb-3">
						        <p className="fw-semibold mb-1">Progress</p>
						        <div className="progress" style={{ height: "8px" }}>
						        	<div className="bg-success" style={{ width: `${trip.progress}%` }}></div>
						        </div>
						        <small className="text-muted">{trip.progress}% Complete</small>
						    </div>

						    {/* Sender Details */}
						    <p className="fw-semibold mb-0"><i className="fa fa-cube me-2"></i>Sender Details</p>
						    <div className="mb-3 p-3 pt-1 bg-light rounded">
						        <p className="mb-0 fw-semibold">{trip.sender.name}</p>
						        <p className="mb-0"><i className="fa fa-phone me-2"></i>{trip.sender.phone}</p>
						        <p className="mb-0"><i className="fa fa-map-marker-alt me-2"></i>{trip.sender.address}</p>
						    </div>

						    {/* Receiver Details */}
						    <p className="fw-semibold mb-0"><i className="fa fa-map-marker-alt me-2"></i>Receiver Details</p>
						    <div className="mb-2 p-3 pt-1 bg-light rounded">
						        <p className="mb-0 fw-semibold">{trip.receiver.name}</p>
						        <p className="mb-0"><i className="fa fa-phone me-2"></i>{trip.receiver.phone}</p>
						        <p className="mb-0"><i className="fa fa-map-marker-alt me-2"></i>{trip.receiver.address}</p>
						    </div>

						    {/* Meta Info */}
						    <div className="d-flex justify-content-between align-items-center mb-3">
						        <div>
						          	<p className="fw-semibold mb-1">Distance:</p>
						          	<p className="fw-semibold mb-1">Started:</p>
						          	<p className="fw-semibold mb-1">ETA:</p>
						        </div>
						        <div>
						          	<p className="text-muted mb-1">{trip.distance}</p>
						          	<p className="text-muted mb-1">{trip.started}</p>
						          	<p className="text-muted mb-1">{trip.eta}</p>
						        </div>
						    </div>
					    </div>
					</div>
				</div>
		    </div>
	    </DashboardLayout>
  	);
}
