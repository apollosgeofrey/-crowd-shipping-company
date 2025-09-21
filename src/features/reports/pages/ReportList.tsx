import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";



export default function ReportList() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(2);

	const [reports, setReports] = useState<any[]>([
		{
			id: "01",
			title: "Driver Behavior",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Open",
		},{
			id: "02",
			title: "Goods Lost",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Open",
		},{
			id: "03",
			title: "Recommendation",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Open",
		}, {
			id: "04",
			title: "Gilbert Johnston",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Answered",
		}, {
			id: "05",
			title: "Alan Cain",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Open",
		}, {
			id: "06",
			title: "Alfred Murray",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Answered",
		},
	]);

	// Simulate fetch
	useEffect(() => {
		async function fetchReports() {
		  setIsLoading(true);
			try {
				// Example API call (replace with your backend endpoint)
                const res = await fetch(`/api/reports?page=${page}`);
                // const data = await res.json();
                // Laravel paginate-style response often has: data, total, per_page, current_page
			    setReports(reports);
                // optionally update totalPages dynamically: setTotalPages(data.last_page);
			} catch (err) {
			    console.error(err);
			} finally {
			    setIsLoading(false);
			}
		}
		fetchReports();
	}, [page, perPage]);


	// Badge style
	const getStatusBadge = (status: string) => {
		switch (status) {
	  		case "Open":
	    		return "badge rounded bg-success-subtle text-success fw-semibold px-3 py-2";
	  		case "Answered":
	    		return "badge rounded bg-warning-subtle text-warning fw-semibold px-3 py-2";
	  		default:
	    		return "badge rounded bg-light text-dark fw-semibold px-3 py-2";
		}
	};

  	return (
	    <DashboardLayout>
		    <div className="row mb-4">
		    	<div className="d-flex justify-content-between align-items-center mb-4">
				    {/* Left: Title & Description */}
				    <p className="text-muted small mb-0">Manage reports and feedbacks</p>

				    {/* Right: Button */}
				    {/*<button className="btn btn-danger fw-semibold px-4 rounded d-flex align-items-center gap-2">
				        <i className="fa fa-plus"></i> Resolved
				    </button>*/}
				</div>

			    {/* Search Box */}
			    <div className="col-sm-12 col-md-4 mb-3">
			    	<label className="form-label fw-semibold mb-0">Search</label>
			    	<div className="input-group rounded shadow-sm">
				        <button className="btn btn-white border fw-semibold"><FaSearch className="text-muted" /></button>
				        <input type="text" className="form-control border-start-0" placeholder="Enter Search" />
				    </div>
			    </div>

		      	{/* Status Filter */}
			    <div className="col-sm-12 col-md-4 mb-3">
			    	<label className="form-label fw-semibold mb-0">Status</label>
			      	<div className="input-group rounded shadow-sm">
			        	<select className="form-select fw-semibold">
			          		<option>All</option>
			          		<option>Open</option>
			          		<option>Answered</option>
			          		<option>Closed</option>
			        	</select>
				    </div>
		      	</div>

			    {/* Language Filter */}
				<div className="col-sm-12 col-md-4 mb-3">
				    <label className="form-label fw-semibold mb-0">Language</label>
				    <div className="input-group rounded shadow-sm">
				        <select className="form-select fw-semibold">
				        	<option>All languages</option>
				        	<option>English</option>
				        	<option>French</option>
				        	<option>Spanish</option>
				        </select>
				    </div>
			    </div>
			    <div className="col-md-12">
					<div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
					    <div className="card-body">
							{/* Table */}
							<div className="table-responsive rounded-3 shadow-sm border">
							    <table className="table align-middle mb-0">
								    <thead className="table-light">
								        <tr>
											<th style={{ width: "5%" }}>ID</th>
											<th style={{ width: "25%" }}>Title</th>
											<th style={{ width: "20%" }}>Email</th>
											<th style={{ width: "15%" }}>Language</th>
											<th style={{ width: "20%" }}>Updated</th>
											<th style={{ width: "15%" }}>Status</th>
								        </tr>
								    </thead>
								    <tbody>
								        {isLoading ? (
									        <tr>
									            <td colSpan={6} className="text-center text-muted py-3">Loading...</td>
									        </tr>
									    ) : reports.length === 0 ? (
									        <tr>
									            <td colSpan={6} className="text-center text-muted py-3">No reports found</td>
									        </tr>
									    ) : (
									        reports.map((r) => (
										        <tr key={r.id}>
										            {/* ID */}
										            <td className="text-muted py-3 px-2">{r.id}</td>

										            {/* Title */}
										            <td className="fw-semibold text-dark py-3 px-2">
										                <Link to={`/reports/${r.id}/show`} className="text-decoration-none text-primary">{r.title}</Link>
										            </td>

										            {/* Email */}
										            <td className="text-muted py-3 px-2">{r.email}</td>

										            {/* Language */}
										            <td className="text-muted py-3 px-2">{r.language}</td>

										            {/* Updated Date + Time */}
										            <td className="text-dark fw-semibold py-3 px-2">
										                {r.updatedDate} &nbsp; - &nbsp;  <small className="text-secondary">{r.updatedTime}</small>
										            </td>

										            {/* Status */}
										            <td className="text-muted py-3 px-2">
										                <span className={`col-sm-12 ${getStatusBadge(r.status)}`}>{r.status}</span>
										            </td>
									            </tr>
									        ))
								        )}
								    </tbody>
							    </table>
							</div>

						    {/* Pagination Bar */}
						    <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage}/>
					    </div>
					</div>
				</div>
		    </div>
	    </DashboardLayout>
  	);
}
