import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PackageImage from "../../../assets/images/package_image.png";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import TransactionStatsCards from "./transactionListPartials/TransactionStatsCards.tsx"
import TransactionDetailModal from "./transactionListPartials/TransactionDetailModal.tsx"


export default function TransactionList() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(2);
	const [showModal, setShowModal] = useState(false);
	// const [editTransaction, setEditTransaction] = useState<any | null>(null);
	const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

	// handleView Implementation
	const handleView = (transaction: any) => {
	    setSelectedTransaction(transaction);   // save the clicked row data
	    setShowModal(true);             // show the modal
	};

	// const handleClose = () => {
	//     setShowModal(false);
	//     setSelectedTransaction(null);
	// };

	const [transactions, setTransactions] = useState<any[]>([
		{
		    id: "TRP-001",
		    description: "MacBook Pro",
		    value: 450000,
		    status: "In Transit",
		    progress: 65,
		    eta: "2:30 PM",
		    routeFrom: "Lagos Island",
		    routeTo: "Victoria Island",
		    distance: 12.5,
		    started: "1:15 PM",
		    beforeImage: PackageImage,
		    afterImage: PackageImage,
		    sender: {
		      	name: "John Smith",
		      	phone: "+234-801-234-5678",
		      	address: "Lagos Island",
		    },
		    receiver: {
		      	name: "Sarah Johnson",
		      	phone: "+234-801-234-5678",
		      	address: "Victoria Island",
		    },
		    driver: {
		      	name: "Michael Brown",
		      	phone: "+234-801-234-5678",
		      	vehicle: "Toyota Camry - ABC123XY",
		      	currentLocation: "Tafawa Balewa Square",
		    },
	  	}, {
		    id: "TRP-002",
		    description: "Legal Papers",
		    value: 25000,
		    status: "Picking Up",
		    progress: 20,
		    eta: "2:30 PM",
		    routeFrom: "Ikeja",
		    routeTo: "Maryland",
		    distance: 8.2,
		    started: "12:45 PM",
		    beforeImage: "/images/before-papers.jpg",
		    afterImage: "/images/after-papers.jpg",
		    sender: {
		      	name: "Samuel Ade",
		      	phone: "+234-802-111-2233",
		      	address: "Ikeja",
		    },
		    receiver: {
		      	name: "Grace Bello",
		      	phone: "+234-802-444-5566",
		      	address: "Maryland",
		    },
		    driver: {
		      	name: "James Anderson",
		      	phone: "+234-803-777-8899",
		      	vehicle: "Honda Accord - XYZ789AB",
		      	currentLocation: "Oregun Road",
		    },
	  	}, {
		    id: "TRP-003",
		    description: "Legal Papers",
		    value: 25000,
		    status: "Delivered",
		    progress: 100,
		    eta: "2:30 PM",
		    routeFrom: "Lekki Phase 1",
		    routeTo: "Ajah",
		    distance: 15.7,
		    started: "11:30 AM",
		    beforeImage: "/images/before-docs.jpg",
		    afterImage: "/images/after-docs.jpg",
		    sender: {
		      	name: "Ngozi Okafor",
		      	phone: "+234-805-123-4567",
		      	address: "Lekki Phase 1",
		    },
		    receiver: {
		      	name: "David Mark",
		      	phone: "+234-806-321-4321",
		      	address: "Ajah",
		    },
		    driver: {
		      	name: "Daniel Lee",
		      	phone: "+234-809-888-9999",
			    vehicle: "Nissan Altima - DEF456CD",
		      	currentLocation: "Ajah Bus Stop",
		    },
		}, {
		    id: "TRP-004",
		    description: "Designer Clothes",
		    value: 185000,
		    status: "Delivered",
		    progress: 100,
		    eta: "2:30 PM",
		    routeFrom: "San Francisco",
		    routeTo: "San Bay",
		    distance: 6.5,
		    started: "12:00 PM",
		    beforeImage: "/images/before-clothes.jpg",
		    afterImage: "/images/after-clothes.jpg",
		    sender: {
		      	name: "Aisha Bello",
		      	phone: "+234-810-222-3344",
		      	address: "San Francisco",
		    },
		    receiver: {
		      	name: "Olu Adeyemi",
		      	phone: "+234-811-999-8877",
		      	address: "San Bay",
		    },
		    driver: {
		      	name: "James Anderson",
		      	phone: "+234-803-777-8899",
		      	vehicle: "Honda Accord - XYZ789AB",
			    currentLocation: "Third Mainland Bridge",
		    },
	  	},
	]);



	// Simulate fetch
	useEffect(() => {
		async function fetchTransactions() {
		  setIsLoading(true);
			try {
				// Example API call (replace with your backend endpoint)
                // const res = await fetch(`/api/transactions?page=${page}`);
                // const data = await res.json();
                // Laravel paginate-style response often has: data, total, per_page, current_page
			    setTransactions(transactions);
			    setTotalPages(totalPages);
                // optionally update totalPages dynamically: setTotalPages(data.last_page);
			} catch (err) {
			    console.error(err);
			} finally {
			    setIsLoading(false);
			}
		}
		fetchTransactions();
	}, [page, perPage]);



	// handle the add of charge
	// const handleAdd = () => {
    // 	setEditTransaction(null);
    // 	setShowModal(true);
  	// };

  	// handle the edit of charge
  	// const handleEdit = (transaction: any) => {
    // 	setEditTransaction(transaction);
    // 	setShowModal(true);
  	// };

  	// handle the save of charge
  	// const handleSave = (data: any) => {
    // 	if (editTransaction) {
    //   		// Edit existing
    //   		setTransactions(transactions.map(c => (c.id === editTransaction.id ? { ...c, ...data } : c)));
    // 	} else {
    //   		// Add new
    //   		setTransactions([...transactions, { id: transactions.length + 1, ...data }]);
    // 	}
  	// };


	// handle the delete of charge
	const handleDelete = (charge: any) => {
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
		    	{/* Filter Bar */}
		        <div className="col-md-12">
			        <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
			            <div className="card-body">
			            	{/* Statistica Cards */}
			            	<div className="mb-4">
			            		<TransactionStatsCards />
			            	</div>

			                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
			                    <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
			                    
			                        {/* Filter By (first item, no border-left) */}
			                        <button className="btn btn-sm btn-light border-0 fw-semibold px-3">
			                            <i className="fa fa-filter me-1"></i> Filter By
			                        </button>

			                        {/* Divider applied to subsequent items */}
			                        <div className="d-flex align-items-center border-start px-2">
			                            <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }}>
			                            <option>Date</option>
			                            </select>
			                        </div>

			                        <div className="d-flex align-items-center border-start px-2">
			                            <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }}>
			                            <option>Verification</option>
			                            </select>
			                        </div>

			                        <div className="d-flex align-items-center border-start px-2">
			                            <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }}>
			                            <option>Active</option>
			                            <option>Inactive</option>
			                            </select>
			                        </div>

			                        <div className="d-flex align-items-center border-start px-2">
			                            <button className="btn btn-sm btn-light border-0 fw-semibold px-3 text-danger">
			                            <i className="fa fa-undo me-1"></i> Reset Filter
			                            </button>
			                        </div>
			                    </div>
			                </div>
			              	
			              	{/* Table */}
							<div className="table-responsive rounded-3 shadow-sm border">
								<table className="table align-middle mb-0">
								    <thead className="table-light">
									    <tr>
									        <th style={{ width: "5%" }}>#</th>
									        <th style={{ width: "10%" }}>Trip ID</th>
									        <th style={{ width: "20%" }}>Description</th>
									        <th style={{ width: "20%" }}>Driver</th>
									        <th style={{ width: "15%" }}>Route</th>
									        <th style={{ width: "10%" }}>Status</th>
									        <th style={{ width: "10%" }}>Progress</th>
									        <th style={{ width: "5%" }}>ETA</th>
									        <th style={{ width: "5%" }}>Action</th>
									    </tr>
								    </thead>
								    <tbody>
									    {isLoading ? (
									        <tr>
									          	<td colSpan={8} className="text-center text-muted py-3">Loading...</td>
									        </tr>
									    ) : transactions.length === 0 ? (
									        <tr>
									          	<td colSpan={8} className="text-center text-muted py-3">No transactions found.</td>
									        </tr>
									    ) : (
									        transactions.map((transaction, i) => (
										        <tr key={transaction.id}>
										            <td className="fw-semibold text-muted py-3">{i+1}</td>

										            {/* Trip ID */}
										            <td className="fw-semibold text-muted py-3">{transaction.id}</td>

										            {/* Description */}
										            <td className="py-3">
										              	<div className="fw-bold">{transaction.description}</div>
										              	<small className="text-muted">₦{transaction.value.toLocaleString()}</small>
										            </td>

										            {/* Driver */}
										            <td className="py-3">
										              	<div className="fw-bold">{transaction.driver.name}</div>
										              	<small className="text-muted">{transaction.driver.vehicle}</small>
										            </td>

										            {/* Route */}
										            <td className="py-3">
										              	<div>{transaction.routeFrom}</div>
										              	<span className="text-primary">→</span>
										              	<div>{transaction.routeTo}</div>
										            </td>

										            {/* Status */}
										            <td className="py-3">
											            <span className={`badge rounded-3 px-3 py-2 col-sm-12 fw-semibold ${
											                transaction.status === "In Transit" ? "bg-primary text-white" : transaction.status === "Delivered"
											                    ? "bg-success text-white" : transaction.status === "Picking Up" ? "bg-warning text-dark" : "bg-secondary text-white"}`}>
											                {transaction.status}
											            </span>
										            </td>

										            {/* Progress Bar */}
										            <td className="py-3">
										              	<div className="progress" style={{ height: "6px" }}>
											                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${transaction.progress}%` }} aria-valuenow={transaction.progress} aria-valuemin={0} aria-valuemax={100}/>
											            </div>
										              	<small className="text-muted">{transaction.progress}%</small>
										            </td>

										            {/* ETA */}
										            <td className="fw-semibold text-muted py-3">{transaction.eta}</td>

										            {/* Actions */}
										            <td className="py-3">
										              	<button className="btn btn-sm border-0 text-primary" title="View Trip" onClick={() => handleView(transaction)} >
										                	<i className="fa fa-eye"></i>
										              	</button>
										            </td>
										        </tr>
									        ))
									    )}
								    </tbody>
								</table>
							</div>

							{/* Modal */}
      						<TransactionDetailModal show={showModal} onClose={() => setShowModal(false)} transaction={selectedTransaction}/>

			              	{/* Pagination Bar */}
			              	<PaginationBar page={page} perPage={perPage} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage} />
			            </div>
			        </div>
		        </div>
		    </div>
	    </DashboardLayout>
  	);
}
