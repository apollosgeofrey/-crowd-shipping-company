import { FaUsers, FaBriefcase, FaCalendarAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function BookingStatsCards() {
  	const stats = [
	   { 
	      	id: 1, 
	      	title: "Active Trips", 
	      	value: "2", 
	      	updated: "July 16, 2023", 
	      	trend: 12, 
	      	icon: <FaUsers className="fs-4" />, 
	      	iconBg: "bg-purple", 
	      	trendColor: "bg-success" 
	    }, { 
	      	id: 2, 
	      	title: "Completed Today", 
	      	value: "1050", 
	      	updated: "July 14, 2023", 
	      	trend: 5, 
	      	icon: <FaBriefcase className="fs-4" />, 
	      	iconBg: "bg-purple", 
	      	trendColor: "bg-success" 
	    }, { 
	      	id: 3, 
	      	title: "Total Revenue", 
	      	value: "₦660,000", 
	      	updated: "July 14, 2023", 
	      	trend: -8, 
	      	icon: <FaCalendarAlt className="fs-4" />, 
	      	iconBg: "bg-purple", 
	      	trendColor: "bg-danger" 
    	},
  	];

  	return (
		<div className="row g-3">
		    {stats.map((s) => (
		        <div key={s.id} className="col-md-6 col-lg-4">
			        <div className="card border rounded-4 shadow-sm h-100">
			            {/* Card body */}
			            <div className="card-body d-flex justify-content-between align-items-start">
			              	{/* Left section */}
			              	<div className="d-flex align-items-start gap-3">
			                	<div className={`p-3 rounded-3 ${s.iconBg}`}>
			                  		{s.icon}
			                	</div>
				                <div>
				                 	<h6 className="fw-semibold text-dark mb-1">{s.title}</h6>
				                  	<h4 className="fw-bold text-dark">{s.value}</h4>
				                </div>
			              	</div>

			              	{/* Right trend */}
			              	<div className="ms-auto">
			                	<span className={`badge rounded-pill px-3 py-2 fw-semibold text-white ${s.trendColor}`}>
				                  	{s.trend > 0 ? (
					                    <><FaArrowUp className="me-1" /> {s.trend}%</>
					                ) : (
					                    <><FaArrowDown className="me-1" /> {Math.abs(s.trend)}%</>
					                )}
			                	</span>
			              	</div>
			            </div>

			            {/* Footer */}
			            <div className="card-footer bg-white border-0 pt-0">
			              	<small className="text-muted">Update: {s.updated}</small>
			            </div>
			        </div>
		        </div>
		    ))}
	    </div>
	);
}
