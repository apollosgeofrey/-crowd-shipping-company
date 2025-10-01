import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import TripChargeModal from "./tripChargeListPartials/TripChargeModal.tsx"


export default function TripChargeList() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(2);
	const [showModal, setShowModal] = useState(false);
	const [editCharge, setEditCharge] = useState<any | null>(null);

	const [tripCharges, setTripCharges] = useState<any[]>([
	  	{ id: '01', chargeType: "Surge Pricing", amount: 500, area: "Lagos Island", dateApplied: "2025-08-27", status: "Active" },
	  	{ id: '02', chargeType: "Toll Fee", amount: 200, area: "Third Mainland Bridge", dateApplied: "2025-08-20", status: "Active" },
	  	{ id: '03', chargeType: "Waiting Time", amount: 100, area: "All Areas", dateApplied: "2025-08-15", status: "Inactive" },
	  	{ id: '04', chargeType: "Cancellation Fee", amount: 300, area: "All Areas", dateApplied: "2025-08-25", status: "Active" },
	]);


	// Simulate fetch
	useEffect(() => {
		async function fetchTripCharges() {
		  setIsLoading(true);
			try {
				// Example API call (replace with your backend endpoint)
                const res = await fetch(`/api/trip-charges?page=${page}`);
                // const data = await res.json();
                // Laravel paginate-style response often has: data, total, per_page, current_page
			    setTripCharges(tripCharges);
                // optionally update totalPages dynamically: setTotalPages(data.last_page);
			} catch (err) {
			    console.error(err);
			} finally {
			    setIsLoading(false);
			}
		}
		fetchTripCharges();
	}, [page, perPage]);



	// handle the add of charge
	const handleAdd = () => {
    	setEditCharge(null);
    	setShowModal(true);
  	};

  	// handle the edit of charge
  	const handleEdit = (tripCharge: any) => {
    	setEditCharge(tripCharge);
    	setShowModal(true);
  	};

  	// handle the save of charge
  	const handleSave = (data: any) => {
    	if (editCharge) {
      		// Edit existing
      		setTripCharges(tripCharges.map(c => (c.id === editCharge.id ? { ...c, ...data } : c)));
    	} else {
      		// Add new
      		setTripCharges([...tripCharges, { id: tripCharges.length + 1, ...data }]);
    	}
  	};


	// handle the delete of charge
	const handleDelete = (charge) => {
		Swal.fire({
		    title: "Are you sure?",
		    text: `You are about to delete "${charge.chargeType}" charge applied on "${charge.dateApplied}".`,
		    icon: "warning",
		    showCancelButton: true,
		    confirmButtonColor: "#d33",
		    cancelButtonColor: "#3085d6",
		    confirmButtonText: "Yes, delete it!",
		    cancelButtonText: "No, don't delete it!",
		}).then((result) => {
		    if (result.isConfirmed) {
		      	// your delete logic
		      	// onDelete(charge.id);

		      	Swal.fire("Deleted!", "The charge has been removed.", "success");
		    }
		});
	};

  	return (
	    <DashboardLayout>
		    <div className="row mb-4">
		    	<div className="d-flex justify-content-between align-items-center mb-4">
				    {/* Left: Title & Description */}
				    <div>
				        {/*<h5 className="fw-bold mb-1">Support</h5>*/}
				        <p className="text-muted small mb-0">Configure and manage additional trip charges</p>
				    </div>

				    {/* Right: Button */}
				    <button className="btn btn-primary btn-sm fw-semibold px-4 rounded d-flex align-items-center gap-2" onClick={handleAdd}>
				        <i className="fa fa-plus"></i> Add New Charge
				    </button>
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
										  	<th style={{ width: "5%" }}>#</th>
										  	<th style={{ width: "25%" }}>Charge Type</th>
										  	<th style={{ width: "15%" }}>Amount (₦)</th>
										  	<th style={{ width: "25%" }}>Area</th>
										  	<th style={{ width: "15%" }}>Date Applied</th>
										  	<th style={{ width: "10%" }}>Status</th>
											<th style={{ width: "5%" }}>Actions</th>
										</tr>
								    </thead>
								    <tbody>
								      	{isLoading ? (
								        	<tr>
								          		<td colSpan={6} className="text-center text-muted py-3">Loading...</td>
								        	</tr>
								      	) : tripCharges.length === 0 ? (
									        <tr>
									        	<td colSpan={6} className="text-center text-muted py-3">No trip charge record found.</td>
									        </tr>
								      	) : (
									        tripCharges.map((tc) => (
									         	<tr key={tc.id}>
										            <td className="text-muted py-3 px-2">{tc.id}</td>
										            <td className="text-muted py-3 px-2">{tc.chargeType}</td>
										            <td className="text-muted py-3 px-2">₦{tc.amount.length > 0 ? tc.amount.toFixed(2) : '0.0'}</td>
										            <td className="text-muted py-3 px-2">{tc.area}</td>
										            <td className="text-muted py-3 px-2">{tc.dateApplied}</td>
										            <td className="text-muted py-3 px-2">
										              <span className={`badge fw-semibold px-3 py-2 rounded col-sm-12 ${tc.status === "Active" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
										                {tc.status}
										              </span>
										            </td>
										            <td className="py-3 px-2 d-flex gap-3">
										            	<button className="btn btn-sm border-0 text-success" title="Modify Charge" onClick={() => handleEdit(tc)}>
										            		<i className="fa fa-edit"></i>
										            	</button>
										            	<button className="btn btn-sm border-0 text-danger" title="Delete Charge" onClick={() => handleDelete(tc)}>
										                	<i className="fa fa-trash"></i>
										              	</button>
										            </td>
									          	</tr>
									        ))
								      	)}
								    </tbody>
								</table>
							</div>

							{/* Modal */}
      						<TripChargeModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={editCharge}/>

			              	{/* Pagination Bar */}
			              	<PaginationBar page={page} perPage={perPage} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage} />
			            </div>
			        </div>
		        </div>
		    </div>
	    </DashboardLayout>
  	);
}
