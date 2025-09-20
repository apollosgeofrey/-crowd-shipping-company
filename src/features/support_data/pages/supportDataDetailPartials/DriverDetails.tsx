import { useParams } from "react-router-dom";
import userMale from "../../..//../assets/images/user_male.png";


export default function DriverDetails() {
	const driver = {
		name: "John Ashernine",
		email: "IsaacWondas@gmail.com",
		vehicle: "Toyota Camry - ABC123XY",
		registrationDate: "August 12th, 2025",
		supportMessage: "Allow",
		issueTitle: "Inability to Connect with driver",
		issueDate: "August 12th, 2025",
		language: "English",
	};

	return (
		<div className="card border-0 shadow-sm rounded h-100">
	        <div className="card-body">
	        	<div className="d-flex align-itCreateems-center gap-3 mb-3">
	                <img src={userMale} alt="Driver" className="rounded" style={{ width: "70px", height: "70px", objectFit: "cover" }}/>
	                <div>
	                 	<h6 className="fw-bold text-muted mb-3">Driver</h6>
	                    <h5 className="fw-bold text-primary">{driver.name}</h5>
	                 </div>
	            </div>

	            <div className="mb-5">
					<p className="mb-1">
						<span className="fw-semibold text-primary">Email</span>
						<span className="float-end">{driver.email}</span>
					</p>
					<p className="mb-1">
						<span className="fw-semibold text-primary">Vehicle</span>
						<span className="float-end">{driver.vehicle}</span>
					</p>
					<p className="mb-1">
						<span className="fw-semibold text-primary">Registration Date</span>
						<span className="float-end">{driver.registrationDate}</span>
					</p>
					<p className="mb-1">
						<span className="fw-semibold text-primary">Support Message</span>
						<span className="float-end">{driver.supportMessage}</span>
					</p>
				</div>
				<p className="small text-muted fw-bold">You can close this issue</p>
				<button className="btn btn-outline-primary col-12 fw-semibold">Close</button>
	        </div>
	    </div>
  	);
}

