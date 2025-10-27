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
	const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState({search: "", status: "", isApproved: "", kycStatus: ""});


    // Fetch data whenever page, perPage, or filters change
    useEffect(() => {
        async function fetchUsers() {
            setIsLoading(true);
            try {
                const response = await userApi.getAllUsers({
                    page,
                    limit: perPage,
                    search: filters.search || undefined,
                    status: filters.status || undefined,
                    isApproved: filters.isApproved ? filters.isApproved === "true" : undefined,
                    kycStatus: filters.kycStatus || undefined
                });

                if (response.code === 200) {
                    // FIX: Access the nested data structure
                    setUsers(response.data.items); // Changed from response.data to response.data.items
                    setTotalPages(response.data.meta.totalPages); // Use actual pagination data
                    setTotalItems(response.data.meta.total); // Use actual total items
                }
            } catch (err) {
                console.error("Failed to fetch users:", err);
                // Set empty array on error to prevent map error
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page when filters change
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({search: "", status: "", isApproved: "", kycStatus: ""});
        setPage(1);
    };


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
                                	
                                	{/* Filter By (first item, no border-left) */}
									<button className="btn btn-sm btn-light border-0 fw-semibold px-3" disabled='disabled'>
										<i className="fa fa-filter me-1"></i> Filter By
									</button>

                                    {/* Search Input */}
                                    <div className="d-flex align-items-center px-2">
                                        <input type="text"
                                            className="form-control form-control-sm border-1 bg-transparent" 
                                            placeholder="Search name or email..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            style={{ minWidth: "200px" }}
                                        />
                                    </div>
                                    
                                    {/* Status Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange("status", e.target.value)}
                                        >
                                            <option value="">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    {/* Approval Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.isApproved}
                                            onChange={(e) => handleFilterChange("isApproved", e.target.value)}
                                        >
                                            <option value="">All Approval</option>
                                            <option value="true">Approved</option>
                                            <option value="false">Not Approved</option>
                                        </select>
                                    </div>

                                    {/* KYC Status Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.kycStatus}
                                            onChange={(e) => handleFilterChange("kycStatus", e.target.value)}
                                        >
                                            <option value="">All KYC</option>
                                            <option value="completed">KYC Completed</option>
                                            <option value="pending">KYC Pending</option>
                                            <option value="rejected">KYC Rejected</option>
                                        </select>
                                    </div>

                                    {/* Reset Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <button className="btn btn-sm btn-light border-0 fw-semibold px-3 text-danger" onClick={resetFilters}>
                                            <i className="fa fa-undo me-1"></i> Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions and Stats */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-muted">
					            		Showing {users.length} of {totalItems} users
                                    </span>
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm fw-bold">
                                        <span>Export</span> <span className="fa fa-angle-down"></span>
                                    </button>

                                    {/* Create User */}
                                    <Link to="/users/create" className="btn btn-primary btn-sm fw-bold">
                                        <span className="fa fa-plus-square"></span> Create New User
                                    </Link>
                                </div>
                            </div>

				          	{/* Table */}
				          	<div className="table-responsive rounded-3 shadow-sm border">
					            <table className="table align-middle mb-0 table-sm table-striped">
						             <thead className="table-light small">
						                <tr className="m-5">
							                <th style={{ width: "2%" }} className="py-3">#</th>
							                <th style={{ width: "20%" }} className="py-3">FULL NAME</th>
							                <th style={{ width: "18%" }} className="py-3">CONTACT DETAILS</th>
							                <th style={{ width: "15%" }} className="py-3">JOINED DATE</th>
							                <th style={{ width: "20%" }} className="py-3">WALLET</th>
							                <th style={{ width: "15%" }} className="py-3">STATUSES</th>
							                <th style={{ width: "10%" }} className="py-3">ACTION</th>
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