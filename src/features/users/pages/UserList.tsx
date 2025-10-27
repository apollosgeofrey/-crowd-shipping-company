import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { userApi, type User } from "../services/userApi.ts";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";

// Interface for the API response structure
interface UsersResponse {
    code: number;
    message: string;
    data: {
        items: User[];
        meta: {
            total: number;
            perPage: number;
            currentPage: number;
            totalPages: number;
        };
    };
}

export default function UserList() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [users, setUsers] = useState<User[]>([]);
	const [totalUsers, setTotalUsers] = useState(0);

	// Fetch data whenever page or perPage changes
	useEffect(() => {
		async function fetchUsers() {
		  	setIsLoading(true);
			try {
				const response: UsersResponse = await userApi.getAllUsers({
					page: page, 
					limit: perPage
				});
				
				// Access users from response.data.data.items
				setUsers(response.data.items);
				
				// Use the pagination meta from the API
				if (response.data.meta) {
					setTotalPages(response.data.meta.totalPages);
					setTotalUsers(response.data.meta.total);
				} else {
					// Fallback calculation
					setTotalPages(Math.ceil(response.data.items.length / perPage));
				}
			} catch (err) {
				console.error("Failed to fetch users:", err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchUsers();
	}, [page, perPage]);

	// Format date to display
	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			day: 'numeric', 
			month: 'short', 
			year: 'numeric' 
		});
	};


	// Get KYC status badge
    const getKycTextColor = (kycStatus: string) => {
        switch (kycStatus) {
            case "completed": return "text-success";
            case "pending": return "text-warning";
            case "rejected": return "text-danger";
            default: return "text-dark";
        }
    };


	// Get status badge based on user status
	const getStatusTextColor = (status: string) => {
	    switch (status.toLowerCase()) {
			case "active": 
				return "text-success";
			case "inactive": 
			case "suspended":
				return "text-secondary";
			case "rejected": 
			case "cancelled":
				return "text-danger";
			case "processing": 
			case "pending":
				return "text-info";
			default: 
				return "text-dark";
	    }
	};

	// Capitalize first letter for display
	const capitalizeFirst = (str: string) => (!str) ? '' : str.charAt(0).toUpperCase() + str.slice(1);

	// Format wallet balance for display
	const formatBalance = (balance: number) => new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN'
	}).format(balance);

	return (
		<DashboardLayout>
		  	<div className="row mb-4">
			    <div className="col-12">
				     <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
				        <div className="card-body">
				          
				          	{/* Filter Bar */}
				          	<div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
					            <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
					              	<button className="btn btn-sm btn-light border-0 fw-semibold px-3">
					                	<i className="fa fa-filter me-1"></i> Filter By
					              	</button>

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

					        {/* Actions */}
					        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
					            <div className="d-flex gap-2">
					              	<button className="btn btn-outline-secondary btn-sm fw-bold">
					                	<span className="">Export</span> <span className="fa fa-angle-down"></span>
					              	</button>

					              	<Link to="/users/create" className="btn btn-primary btn-sm fw-bold">
					                	<span className="fa fa-plus"></span> Create User
					              	</Link>
					            </div>
					            
					            {/* Total users count */}
					            <div className="text-muted small">
					            	Showing {users.length} of {totalUsers} users
					            </div>
					        </div>

				          	{/* Table */}
				          	<div className="table-responsive rounded-3 shadow-sm border">
					            <table className="table align-middle mb-0 table-sm">
						             <thead className="table-light small">
						                <tr className="m-5">
							                <th style={{ width: "2%" }}>#</th>
							                <th style={{ width: "20%" }}>FULL NAME</th>
							                <th style={{ width: "18%" }}>CONTACT DETAILS</th>
							                <th style={{ width: "15%" }}>JOINED DATE</th>
							                <th style={{ width: "20%" }}>WALLET</th>
							                <th style={{ width: "15%" }}>STATUSES</th>
							                <th style={{ width: "10%" }}>ACTION</th>
						                </tr>
						             </thead>
						             <tbody className="small">
						                {isLoading ? (
						                  	<tr>
						                    	<td colSpan={6} className="text-center text-muted py-3">
						                    		<div className="spinner-border spinner-border-sm me-2"></div>
						                    		Loading users...
						                    	</td>
						                  	</tr>
						                ) : (
						                  	users.length === 0 ? (
						                    	<tr>
						                    		<td colSpan={6} className="text-center text-muted py-3">
						                    			No users found
						                    		</td>
						                    	</tr>
						                  	) : (
						                    users.map((user, index) => (
						                      	<tr key={user._id}>
							                        <td className="text-muted py-3 px-2">
							                        	{(page - 1) * perPage + index + 1}
							                        </td>
							                        <td className="text-muted py-3 px-2">
							                        	<Link to={`/users/${user._id}/show`} className="text-decoration-none text-primary fw-bold">
							                        		{user.fullName}
							                        	</Link>
							                        	<small className="text-muted d-block">
                                                            <b>ID:</b> {user.userId}
                                                        </small>
							                        </td>
							                     	<td className="text-muted py-3 px-2">
													    <a href={`mailto:${user.email}`} className="text-decoration-none text-primary" title={`Send email to ${user.email}`}>
													        📧 {user.email}
													    </a>
													    <br />
													    <small className="text-muted">
													        <a href={`tel:${user.phoneNumber}`} className="text-decoration-none text-dark" title={`Call ${user.phoneNumber}`}>
													            📞 {user.phoneNumber}
													        </a>
													    </small>
													</td>
							                        <td className="text-muted py-3 px-2">
							                        	{formatDate(user.createdAt)}
							                        	<br />
							                        	<small className="text-muted">
							                        		<><strong>• Last login:</strong> {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</>							                        		 
							                        	</small>
							                        </td>
							                        <td className="text-muted py-3 px-2">
							                        	<span className="text-muted">
							                        		<strong className="me-1">Wallet ID:</strong> {user.walletId || 'N/A'}
							                        	</span>
							                        	<br />
							                        	<small className="text-muted">
							                        		<strong className="me-1">Balance:</strong> {user.wallet ? formatBalance(user.wallet.balance) : '₦0'}
							                        	</small>
							                        </td>
                                                    <td className="py-3 px-2 small">
                                                        <div className="text-muted small">
                                                            <b>KYC:</b>
                                                            <span className={`float-end ${getKycTextColor(user.kycStatus)}`}>
                                                                {capitalizeFirst(user.kycStatus)}
                                                            </span>
                                                        </div> 
                                                        <div className="text-muted small">
                                                            <b>ACCOUNT:</b>
                                                            <span className={`float-end ${getStatusTextColor(user.status)}`}>
                                                                {capitalizeFirst(user.status)}
                                                            </span>
                                                        </div>
                                                        <div className="text-muted small">
                                                            <b>APPROVAL:</b>
								                        	<span className={`float-end text-${user.isApproved ? 'success' : 'warning'}`}>
								                        		{user.isApproved ? 'Approved' : 'Pending'}
								                        	</span>
                                                        </div>                                                        
                                                        <div className="text-muted small">
                                                            <b>VERIFICATION:</b>
                                                            {user.isVerified ? (
                                                                <span className="float-end text-success">Verified </span> 
                                                            ) : (
                                                                <span className="float-end text-warning">Unverified</span>
                                                            )}
                                                        </div>
                                                    </td>
							                        <td className="text-muted py-3 px-2">
							                        	<div className="btn-group">
															<Link to={`/users/${user._id}/show`} className="btn btn-sm btn-outline-primary" title="View User">
																View <i className="fa fa-eye small"></i>
															</Link>
															<Link to={`/users/${user._id}/edit`} className="btn btn-sm btn-outline-secondary" title="Edit User">
																Edit <i className="fa fa-edit small"></i>
															</Link>
														</div>
													</td>
						                      	</tr>
						                    ))
						                  )
						                )}
						            </tbody>
					            </table>
				          	</div>

				          	{/* Pagination Bar */}
				          	<PaginationBar 
				          		page={page} 
				          		perPage={perPage} 
				          		totalPages={totalPages} 
				          		onPageChange={setPage} 
				          		onPerPageChange={setPerPage} 
				          	/>
				        </div>
				    </div>
			    </div>
		  	</div>
		</DashboardLayout>
	);
}