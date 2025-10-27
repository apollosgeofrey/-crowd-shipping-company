import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import { pathfinderApi, type Pathfinder, type PaginatedResponse } from "../services/pathfinderApi.ts";

export default function PathfinderList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pathfinders, setPathfinders] = useState<Pathfinder[]>([]);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        isApproved: "",
        kycStatus: ""
    });

    // Fetch data whenever page, perPage, or filters change
    useEffect(() => {
        async function fetchPathfinders() {
            setIsLoading(true);
            try {
                const response = await pathfinderApi.getPathfinders({
                    page,
                    limit: perPage,
                    search: filters.search || undefined,
                    status: filters.status || undefined,
                    isApproved: filters.isApproved ? filters.isApproved === "true" : undefined,
                    kycStatus: filters.kycStatus || undefined
                });

                if (response.code === 200) {
                    setPathfinders(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                }
            } catch (err) {
                console.error("Failed to fetch pathfinders:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPathfinders();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page when filters change
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            search: "",
            status: "",
            isApproved: "",
            kycStatus: ""
        });
        setPage(1);
    };

    // Get status text based on status and approval
    const getStatusTextColor = (status: string) => {
        if (status === "pending") return "text-warning";
        if (status === "active") return "text-success";
        if (status === "inactive") return "text-secondary";
        if (status === "suspended") return "text-danger";
        return "text-dark";
    };

    // Format date
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Get KYC status badge
    const getKycTextColor = (kycStatus: string) => {
        switch (kycStatus) {
            case "completed": return "text-success";
            case "pending": return "text-warning";
            case "rejected": return "text-danger";
            default: return "text-dark";
        }
    };

    // Capitalize first letter for display
    const capitalizeFirst = (str: string) => (!str) ? '' : str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                        
                            {/* Filter Bar */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
                                
                                    {/* Search Input */}
                                    <div className="d-flex align-items-center px-2">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm border-0 bg-transparent" 
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
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} pathfinders
                                    </span>
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm fw-bold">
                                        <span>Export</span> <span className="fa fa-angle-down"></span>
                                    </button>

                                    {/* Create Pathfinder */}
                                    <Link to="/pathfinders/create" className="btn btn-primary btn-sm fw-bold">
                                        <span className="fa fa-plus"></span> Create Pathfinder
                                    </Link>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0 table-sm">
                                    <thead className="table-light small">
                                        <tr>
                                            <th style={{ width: "2%" }}>#</th>
                                            <th style={{ width: "16%" }}>PATHFINDER</th>
                                            <th style={{ width: "18%" }}>CONTACT INFORMATION</th>
                                            <th style={{ width: "10%" }}>JOINED DATE</th>
                                            <th style={{ width: "10%" }}>LAST LOGIN</th>
                                            <th style={{ width: "19%" }}>WALLET</th>
                                            <th style={{ width: "15%" }}>STATUSES</th>
                                            <th style={{ width: "10%" }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={8} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading pathfinders...
                                                </td>
                                            </tr>
                                        ) : pathfinders.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center text-muted py-4">
                                                    No pathfinders found
                                                </td>
                                            </tr>
                                        ) : (
                                            pathfinders.map((pathfinder, index) => (
                                                <tr key={pathfinder._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-3 px-2 text-center fw-bold">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Pathfinder Info */}
                                                    <td className="py-3 px-2">
                                                        <Link to={`/pathfinders/${pathfinder._id}/show`} className="text-decoration-none btn-link text-primary fw-semibold d-block mb-1">
                                                            {pathfinder.fullName}
                                                        </Link>
                                                        <small className="text-muted d-block">
                                                            <b>ID:</b> {pathfinder.userId}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Contact Information */}
                                                    <td className="py-3 px-2">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <a href={`mailto:${pathfinder.email}`} className="text-decoration-none text-primary" title={`Send email to ${pathfinder.email}`}>
                                                                <i className="fa fa-envelope me-2" style={{ width: "16px" }}></i>
                                                                <small className="text-truncate" style={{ maxWidth: "160px" }} title={pathfinder.email}>
                                                                    {pathfinder.email || "N/A"}
                                                                </small>
                                                            </a>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <a href={`tel:${pathfinder.phoneNumber}`} className="text-decoration-none text-dark" title={`Call ${pathfinder.phoneNumber}`}>
                                                                <i className="fa fa-phone text-muted me-2" style={{ width: "16px" }}></i>
                                                                <small className="text-muted text-truncate" style={{ maxWidth: "160px" }} title={pathfinder.phoneNumber}>
                                                                    {pathfinder.phoneNumber || "N/A"}
                                                                </small>
                                                            </a>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Joined Date */}
                                                    <td className="text-muted py-3 px-2">
                                                        <div className="d-flex flex-column">
                                                            <small className="fw-semibold">{formatDate(pathfinder.createdAt)}</small>
                                                            <small className="text-muted">
                                                                {new Date(pathfinder.createdAt).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Last Login */}
                                                    <td className="text-muted py-3 px-2">
                                                        <div className="d-flex flex-column">
                                                            {pathfinder.lastLogin ? (
                                                                <>
                                                                    <small className="fw-semibold">{formatDate(pathfinder.lastLogin)}</small>
                                                                    <small className="text-muted">
                                                                        {new Date(pathfinder.lastLogin).toLocaleTimeString('en-US', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </small>
                                                                </>
                                                            ) : (
                                                                <small className="text-muted">
                                                                    <i className="fa fa-circle me-1" style={{ fontSize: "6px" }}></i>
                                                                    Never Logged In
                                                                </small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* KYC Status */}
                                                    <td className="py-3 px-2">
                                                        <div className="d-flex flex-column align-items-start">
                                                            {pathfinder.wallet ? (
                                                                <>
                                                                    <div className="text-muted mt-1">
                                                                        <b>Wallet ID:</b> {pathfinder.wallet._id || "N/A"}
                                                                    </div>
                                                                    <div className="text-muted mt-1">
                                                                        <b>Balance:</b> ₦{pathfinder.wallet.balance?.toLocaleString() || "0"}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Account Statuses */}
                                                    <td className="py-3 px-2 small">
                                                        <div className="text-muted">
                                                            <b>KYC:</b>
                                                            <span className={`float-end ${getKycTextColor(pathfinder.kycStatus)}`}>
                                                                {capitalizeFirst(pathfinder.kycStatus)}
                                                            </span>
                                                        </div> 
                                                        <div className="text-muted">
                                                            <b>ACCOUNT:</b>
                                                            <span className={`float-end ${getStatusTextColor(pathfinder.status)}`}>
                                                                {capitalizeFirst(pathfinder.status)}
                                                            </span>
                                                        </div>
                                                        <div className="text-muted">
                                                            <b>APPROVAL:</b>
                                                            <span className={`float-end text-${pathfinder.isApproved ? 'success' : 'warning'}`}>
                                                                {pathfinder.isApproved ? 'Approved' : 'Pending'}
                                                            </span>
                                                        </div>                                                        
                                                        <div className="text-muted">
                                                            <b>VERIFICATION:</b>
                                                            {pathfinder.isVerified ? (
                                                                <span className="float-end text-success">Verified </span> 
                                                            ) : (
                                                                <span className="float-end text-warning">Unverified</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="text-muted py-3 px-2">
                                                        <div className="btn-group">
                                                            <Link to={`/pathfinders/${pathfinder._id}/show`} className="btn btn-sm btn-outline-primary" title="View Pathfinder">
                                                                View <i className="fa fa-eye small"></i>
                                                            </Link>
                                                            <Link to={`/pathfinders/${pathfinder._id}/edit`} className="btn btn-sm btn-outline-secondary" title="Edit Pathfinder">
                                                                Edit <i className="fa fa-edit small"></i>
                                                            </Link>
                                                        </div>
                                                    </td>                                                    
                                                </tr>
                                            ))
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