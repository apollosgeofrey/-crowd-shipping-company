import { useEffect } from "react";
import { X } from "lucide-react";

interface BookingDetailModalProps {
  	show: boolean;
  	onClose: () => void;
  	booking?: any;
}

export default function BookingDetailModal({ show, onClose, booking }: BookingDetailModalProps) {
	useEffect(() => {
	    if (show) {
	      	document.body.classList.add("modal-open");
	    } else {
	      	document.body.classList.remove("modal-open");
	    }
	}, [show]);

	if (!show || !booking) return null;
	return (
	    <>
		    {/* Backdrop */}
		    <div className="modal-backdrop fade show"></div>

		    <div className="modal fade show d-block" tabIndex={-1}>
		        <div className="modal-dialog modal-dialog-centered modal-md">
			        <div className="modal-content rounded-4 border-0 shadow">
			            {/* Header */}
			            <div className="modal-header border-0 d-flex justify-content-between align-items-center">
						  	{/* Left aligned text */}
						  	<h5 className="fw-bold mb-0">
						    	Booking Details - {booking.id}
						  	</h5>

						  	{/* Right aligned close button */}
						  	<button className="btn btn-sm border-0 text-muted" onClick={onClose}>
						    	<X size={20} />
						  	</button>
						</div>


			            {/* Body */}
			            <div className="modal-body">
			              	{/* Package Info */}
			              	<div className="mb-4">
				                <h6 className="fw-bold">Package Information</h6>
				                <p className="mb-1">{booking.package}</p>
				                <p className="fw-semibold">Value: ₦{booking.value}</p>
			              	</div>

				            {/* Before / After Delivery */}
				            <div className="row mb-4">
				                <div className="col-6">
				                  	<p className="fw-bold">Before Delivery</p>
				                  	<img src={booking.beforeImage} className="img-fluid rounded shadow-sm" alt="Before" />
				                </div>
				                <div className="col-6">
				                  	<p className="fw-bold">After Delivery</p>
				                  	<img src={booking.afterImage || "https://via.placeholder.com/200x150?text=No+Image"} className="img-fluid rounded shadow-sm" alt="After" />
				                </div>
				            </div>

				            {/* Progress */}
				            <div className="mb-4">
				                <p className="fw-bold mb-1">Progress</p>
				                <div className="progress" style={{ height: "8px" }}>
				                  	<div className="progress-bar bg-warning" role="progressbar" style={{ width: `${booking.progress}%` }}/>  	
				                </div>
				               	<small className="text-muted">{booking.progress}% Complete</small>
				            </div>

				            {/* Sender */}
				            <div className="mb-4">
				                <h6 className="fw-bold"><i className="fa fa-user me-2"></i>Sender Details</h6>
				                <div className="bg-light p-3 rounded pt-1">
				                  	<p className="fw-bold mb-1">{booking.sender.name}</p>
				                  	<p className="mb-1"><i className="fa fa-phone me-2"></i>{booking.sender.phone}</p>
				                  	<p className="mb-0"><i className="fa fa-map-marker me-2"></i>{booking.sender.address}</p>
				                </div>
				            </div>

				            {/* Receiver */}
				            <div className="mb-4">
				                <h6 className="fw-bold"><i className="fa fa-user me-2"></i>Receiver Details</h6>
				                <div className="bg-light p-3 rounded pt-1">
				                  	<p className="fw-bold mb-1">{booking.receiver.name}</p>
				                  	<p className="mb-1"><i className="fa fa-phone me-2"></i>{booking.receiver.phone}</p>
				                  	<p className="mb-0"><i className="fa fa-map-marker me-2"></i>{booking.receiver.address}</p>
				                </div>
				            </div>

				            {/* Driver */}
				            <div className="mb-4">
				                <h6 className="fw-bold"><i className="fa fa-car me-2"></i>Driver Details</h6>
				                <div className="bg-light p-3 rounded pt-1">
					                <p className="fw-bold mb-1">{booking.driver.name}</p>
					                <p className="mb-1"><i className="fa fa-phone me-2"></i>{booking.driver.phone}</p>
					                <p className="mb-1"><i className="fa fa-car me-2"></i>{booking.driver.vehicle}</p>
					                <p className="mb-0"><i className="fa fa-map-marker me-2"></i>Current: {booking.driver.currentLocation}</p>
				                </div>
				            </div>

				            {/* Meta Info */}
				            <div className="d-flex justify-content-between small text-muted mb-3">
				                <span><b>Distance:</b> {booking.distance} km</span>
				                <span><b>Started:</b> {booking.started}</span>
				                <span><b>ETA:</b> {booking.eta}</span>
				            </div>
			            </div>
			        </div>
		        </div>
		    </div>
	    </>
	);
}
