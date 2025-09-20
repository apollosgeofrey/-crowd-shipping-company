import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";



export default function SupportDataList() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(2);

	const [complaints, setComplaints] = useState<any[]>([
		{
			id: "01",
			title: "Driver Behavior",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Open",
		}, {
			id: "02",
			title: "Goods Lost",
			email: "adedeji@gmail.com",
			language: "English",
			updatedDate: "July 12, 2025",
			updatedTime: "11:23AM",
			status: "Open",
		}, {
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
		async function fetchComplaints() {
		  setIsLoading(true);
			try {
				// Example API call (replace with your backend endpoint)
                const res = await fetch(`/api/support-data?page=${page}`);
                // const data = await res.json();
                // Laravel paginate-style response often has: data, total, per_page, current_page
			    setComplaints(complaints);
                // optionally update totalPages dynamically: setTotalPages(data.last_page);
			} catch (err) {
			    console.error(err);
			} finally {
			    setIsLoading(false);
			}
		}
		fetchComplaints();
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
				    <div>
				        <h5 className="fw-bold mb-1">Support</h5>
				        <p className="text-muted small mb-0">Manage support tickets and inquiries</p>
				    </div>

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
			                      			<th style={{ width: "25%" }}>TITLE</th>
						                    <th style={{ width: "25%" }}>EMAIL</th>
						                    <th style={{ width: "15%" }}>LANGUAGE</th>
						                    <th style={{ width: "20%" }}>UPDATED</th>
						                    <th style={{ width: "10%" }}>STATUS</th>
			                    		</tr>
			                  		</thead>
				                  	<tbody>
				                    	{isLoading ? (
				                      		<tr>
				                        		<td colSpan={6} className="text-center text-muted py-3">Loading...</td>
				                      		</tr>
				                    	) : complaints.length === 0 ? (
				                      		<tr>
						                        <td colSpan={6} className="text-center text-muted py-3">No complaints found</td>
				                      		</tr>
				                    	) : (
						                    complaints.map((c) => (
						                        <tr key={c.id}>
						                          	<td className="text-muted py-3 px-2">{c.id}</td>
						                          	<td className="fw-semibold text-dark py-3 px-2">
						                            	<Link to={`/support-data/${c.id}/show`} className="text-decoration-none text-primary">{c.title}</Link>
						                          	</td>
						                          	<td className="text-muted py-3 px-2">{c.email}</td>
						                          	<td className="text-muted py-3 px-2">{c.language}</td>
						                          	<td className="text-muted py-3 px-2">
						                            	<div className="fw-semibold">
						                            		{c.updatedDate} &nbsp; - &nbsp; <small className="text-secondary">{c.updatedTime}</small>
						                            	</div>						                            	
						                          	</td>
						                          	<td className="text-muted py-3 px-2">
						                            	<span className={`col-sm-12 ${getStatusBadge(c.status)}`}>{c.status}</span>
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
