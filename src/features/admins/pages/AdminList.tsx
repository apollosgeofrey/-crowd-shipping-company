import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { adminApi, type Admin } from "../services/adminApi.ts";
import DashboardLayout from "../../../layouts/DashboardLayout";
import PaginationBar from "../../../components/PaginationBar.tsx";

// Interface for the API response structure
interface AdminsResponse {
    code: number;
    message: string;
    data: {
        items: Admin[];
        meta: {
            total: number;
            perPage: number;
            currentPage: number;
            totalPages: number;
        };
    };
}

export default function AdminList() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [totalAdmins, setTotalAdmins] = useState(0);

	// Fetch data whenever page or perPage changes
	useEffect(() => {
		async function fetchAdmins() {
			setIsLoading(true);
			try {
				const response: AdminsResponse = await adminApi.getAllAdmins({
					page: page, 
					limit: perPage
				});
				
				// Access admins from response.data.data.items
				setAdmins(response.data.items);
				
				// Use the pagination meta from the API
				if (response.data.meta) {
					setTotalPages(response.data.meta.totalPages);
					setTotalAdmins(response.data.meta.total);
				} else {
					// Fallback calculation
					setTotalPages(Math.ceil(response.data.items.length / perPage));
				}
			} catch (err) {
				console.error("Failed to fetch admins:", err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchAdmins();
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

	// Get Status Badge Classes 
	const getStatusBadge = (status: string) => {
		switch (status.toLowerCase()) {
			case "active": 
				return "badge rounded bg-success-subtle text-success fw-semibold";
			case "inactive": 
			case "suspended":
				return "badge rounded bg-secondary-subtle text-secondary fw-semibold";
			case "rejected": 
			case "cancelled":
				return "badge rounded bg-danger-subtle text-danger fw-semibold";
			case "processing": 
			case "pending":
				return "badge rounded bg-info-subtle text-info fw-semibold";
			default: 
				return "badge rounded bg-light text-dark fw-semibold";
		}
	};

	// Capitalize first letter for display
	const capitalizeFirst = (str: string) => {
		if (!str) return '';
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	// Format role for better display
	const formatRole = (role: string) => {
		return role.split('-').map(word => capitalizeFirst(word)).join(' ');
	};

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
											<option>Admin Role</option>
											<option value="super-admin">Super Admin</option>
											<option value="admin">Admin</option>
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
										<span className="">Export</span> <i className="fa fa-angle-down"></i>
									</button>
									
									{/* Create Admin URL */}
									<Link to="/admins/create" className="btn btn-primary btn-sm fw-bold">
										<span className="fa fa-plus"></span> Create Admin
									</Link>
								</div>
								
								{/* Total admins count */}
								<div className="text-muted small">
									Showing {admins.length} of {totalAdmins} admins
								</div>
							</div>

							{/* Table */}
							<div className="table-responsive rounded-3 shadow-sm border">
								<table className="table align-middle mb-0 table-sm">
									<thead className="table-light small">
										<tr>
											<th style={{ width: "5%" }}>#</th>
											<th style={{ width: "25%" }}>ADMIN DETAILS</th>
											<th style={{ width: "20%" }}>CONTACT INFO</th>
											<th style={{ width: "15%" }}>DATE</th>
											<th style={{ width: "20%" }}>ROLE & STATUS</th>
											<th style={{ width: "15%" }}>ACTIONS</th>
										</tr>
									</thead>
									<tbody className="small">
										{isLoading ? (
											<tr>
												<td colSpan={6} className="text-center text-muted py-3">
													<div className="spinner-border spinner-border-sm me-2"></div>
													Loading admins...
												</td>
											</tr>
										) : (
											admins.length === 0 ? (
												<tr>
													<td colSpan={6} className="text-center text-muted py-3">
														No admins found
													</td>
												</tr>
											) : (
												admins.map((admin, index) => (
													<tr key={admin._id}>
														<td className="text-muted py-3 px-2">
															{(page - 1) * perPage + index + 1}
														</td>
														<td className="text-muted py-3 px-2">
															<Link to={`/admins/${admin._id}/show`} className="text-decoration-none text-primary fw-bold">
																{admin.fullName}
															</Link>
															<br />
															<small className="text-muted">
																ID: {admin.userId}
															</small>
															<br />
															<small className={`text-${admin.isVerified ? 'success' : 'warning'}`}>
																{admin.isVerified ? '✓ Verified' : 'Pending verification'}
															</small>
														</td>
														<td className="text-muted py-3 px-2">
															<a href={`mailto:${admin.email}`} className="text-decoration-none text-primary" title={`Send email to ${admin.email}`}>
																📧 {admin.email}
															</a>
															<br />
															<small className="text-muted">
																<a href={`tel:${admin.phoneNumber}`} className="text-decoration-none text-dark" title={`Call ${admin.phoneNumber}`}>
																	📞 {admin.phoneNumber}
																</a>
															</small>
														</td>
														<td className="text-muted py-3 px-2">
															{formatDate(admin.createdAt)}
															<br />
															<small className="text-muted">
																Last login: {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
															</small>
														</td>
														<td className="text-muted py-3 px-2">
															<span className={`badge ${admin.role === 'super-admin' ? 'bg-warning' : 'bg-info'} text-dark`}>
																{formatRole(admin.role)}
															</span> ||
															<span className={`${getStatusBadge(admin.status)}`}>
																{capitalizeFirst(admin.status)}
															</span>
														</td>
														<td className="text-muted py-3 px-2">
															<div className="btn-group">
																<Link to={`/admins/${admin._id}/show`} className="btn btn-sm btn-outline-primary" title="View Admin">
																	<i className="fa fa-eye small"></i>
																</Link>
																<Link to={`/admins/${admin._id}/edit`} className="btn btn-sm btn-outline-secondary" title="Edit Admin">
																	<i className="fa fa-edit small"></i>
																</Link>
																<button className="btn btn-sm btn-outline-danger" title="Delete Admin" onClick={() => {/* Add delete handler */}}>
																	<i className="fa fa-trash small"></i>
																</button>
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