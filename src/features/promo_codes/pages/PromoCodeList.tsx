import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import PromoCodeModal from "./promoCodeListPartials/PromoCodeModal.tsx"


export default function PromoCodeList() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(2);
	const [showModal, setShowModal] = useState(false);
	const [editCharge, setEditCharge] = useState<any | null>(null);

	const [promoCodes, setPromoCodes] = useState<any[]>([
		{ id: "01", promoCode: "SAVE20", discount: 20, validFrom: "2025-08-30", validUntil: "2025-09-30", status: "Active", createdDate: "2025-07-01" },
		{ id: "02", promoCode: "FREERIDE", discount: 50, validFrom: "2025-08-15", validUntil: "2025-08-15", status: "Expired", createdDate: "2025-07-01" },
		{ id: "03", promoCode: "WELCOME10", discount: 10, validFrom: "2025-01-31", validUntil: "2025-12-31", status: "Active", createdDate: "2025-08-25" },
		{ id: "04", promoCode: "SUMMER25", discount: 25, validFrom: "2025-01-01", validUntil: "2025-09-01", status: "Active", createdDate: "2025-06-15" },
	]);




	// Simulate fetch
	useEffect(() => {
		async function fetchPromoCodes() {
		  setIsLoading(true);
			try {
				// Example API call (replace with your backend endpoint)
                const res = await fetch(`/api/promo-codes?page=${page}`);
                // const data = await res.json();
                // Laravel paginate-style response often has: data, total, per_page, current_page
			    setPromoCodes(promoCodes);
                // optionally update totalPages dynamically: setTotalPages(data.last_page);
			} catch (err) {
			    console.error(err);
			} finally {
			    setIsLoading(false);
			}
		}
		fetchPromoCodes();
	}, [page, perPage]);



	// handle the add of charge
	const handleAdd = () => {
    	setEditCharge(null);
    	setShowModal(true);
  	};

  	// handle the edit of charge
  	const handleEdit = (promoCode: any) => {
    	setEditCharge(promoCode);
    	setShowModal(true);
  	};

  	// handle the save of charge
  	const handleSave = (data: any) => {
    	if (editCharge) {
      		// Edit existing
      		setPromoCodes(promoCodes.map(c => (c.id === editCharge.id ? { ...c, ...data } : c)));
    	} else {
      		// Add new
      		setPromoCodes([...promoCodes, { id: promoCodes.length + 1, ...data }]);
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
				        <p className="text-muted small mb-0">Manage promotional codes</p>
				    </div>

				    {/* Right: Button */}
				    <button className="btn btn-primary btn-sm fw-semibold px-4 rounded d-flex align-items-center gap-2" onClick={handleAdd}>
				        <i className="fa fa-plus"></i> Create Promo Code
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
											<th style={{ width: "15%" }}>Promo Code</th>
									        <th style={{ width: "10%" }}>Discount</th>
									        <th style={{ width: "20%" }}>Valid From</th>
									        <th style={{ width: "20%" }}>Valid Until</th>
									        <th style={{ width: "10%" }}>Status</th>
									        <th style={{ width: "15%" }}>Created Date</th>
									        <th style={{ width: "5%" }}>Actions</th>
										</tr>
								    </thead>
								    <tbody>
										{isLoading ? (
										    <tr>
										      	<td colSpan={7} className="text-center text-muted py-3">Loading...</td>
										    </tr>
										) : promoCodes.length === 0 ? (
										    <tr>
										      	<td colSpan={7} className="text-center text-muted py-3">No promo code record found.</td>
										    </tr>
										  ) : (
										    promoCodes.map((pc, index) => (
										      	<tr key={pc.id}>
											        <td className="text-muted py-3">{pc.id}</td>
											        <td className="text-muted py-3">{pc.promoCode}</td>
											        <td className="text-muted py-3">{pc.discount}%</td>
											        <td className="text-muted py-3">{pc.validFrom}</td>
											        <td className="text-muted py-3">{pc.validUntil}</td>
											        <td className="py-3">
											          	<span className={`col-sm-12 badge fw-semibold px-3 py-2 rounded-3 ${pc.status === "Active" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
												           	{pc.status}
											          	</span>
											        </td>
										        	<td className="text-muted py-3">{pc.createdDate}</td>
											        <td className="py-3">
											          	<div className="d-flex gap-3">
												            <button className="btn btn-sm border-0 text-success" title="Edit Promo" onClick={() => handleEdit(pc)}>
											              		<i className="fa fa-edit"></i>
											            	</button>
											            	<button className="btn btn-sm border-0 text-danger" title="Delete Promo" onClick={() => handleDelete(pc)}>
											              		<i className="fa fa-trash"></i>
											            	</button>
											          	</div>
											        </td>
										      	</tr>
										    ))
										)}
									</tbody>

								</table>
							</div>

							{/* Modal */}
      						<PromoCodeModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={editCharge}/>

			              	{/* Pagination Bar */}
			              	<PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage}/>
			            </div>
			        </div>
		        </div>
		    </div>
	    </DashboardLayout>
  	);
}
