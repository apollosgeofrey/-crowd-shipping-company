import { FaCalendarAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function TransactionStatsCards() {
	const stats = [
		{ id: 1, title: "Total Payout to Driver", value: "₦200,0000", updated: "July 14, 2023", trend: -8, bg: "bg-primary-subtle", text: "text-primary"},
		{ id: 2, title: "Completed Today", value: "1", updated: "July 14, 2023", trend: 8, bg: "bg-success-subtle", text: "text-success"},
		{ id: 3, title: "Total Revenue", value: "₦660,000", updated: "July 14, 2023", trend: -8, bg: "bg-danger-subtle", text: "text-danger", },
	];

	return (
	    <div className="row g-3">
		    {stats.map((s) => (
		        <div key={s.id} className="col-md-6 col-lg-4">
			        <div className={`card border-0 shadow-sm rounded-3 ${s.bg}`}>
			            {/*<div className="card-body d-flex justify-content-between align-items-center">*/}
			            <div className="card-body d-flex justify-content-between align-items-start">
				            {/* Left side */}
				            <div>
				                <div className="d-flex align-items-center gap-2 mb-2">
				                  	<FaCalendarAlt className={`${s.text}`} />
				                  	<h6 className={`fw-semibold mb-0 ${s.text}`}>{s.title}</h6>
				                </div>
				                <h4 className={`fw-bold ${s.text}`}>{s.value}</h4>
				                <small className="text-muted">Update: {s.updated}</small>
				            </div>

				            {/* Right side trend */}
				            <div className="text-end">
				                <span className={`fw-semibold ${s.text}`}>
				                  	{s.trend > 0 ? (
				                    	<><FaArrowUp /> {s.trend}%</>
				                  	) : (
				                    	<><FaArrowDown /> {Math.abs(s.trend)}%</>
				                  	)}
				                </span>
				            </div>
			            </div>
			        </div>
		        </div>
		    ))}
	    </div>
  	);
}