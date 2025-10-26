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
    const getStatusBadge = (pathfinder: Pathfinder) => {
        if (!pathfinder.isApproved && pathfinder.status === "pending") return "text-warning-subtle text-warning";
        if (pathfinder.isApproved && pathfinder.status === "active") return "text-success-subtle text-success";
        if (pathfinder.status === "suspended") return "text-danger-subtle text-danger";
        if (pathfinder.status === "inactive") return "text-secondary-subtle text-secondary";
        return "text-light text-dark";
    };

    // Get status display text
    const getStatusText = (pathfinder: Pathfinder) => {
        if (!pathfinder.isApproved && pathfinder.status === "pending") return "Pending Approval";
        if (pathfinder.isApproved && pathfinder.status === "active") return "Active";
        return pathfinder.status.charAt(0).toUpperCase() + pathfinder.status.slice(1);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get KYC status badge
    const getKycBadge = (kycStatus: string) => {
        switch (kycStatus) {
            case "completed": return "badge rounded bg-success-subtle text-success fw-semibold";
            case "pending": return "badge rounded bg-warning-subtle text-warning fw-semibold";
            case "rejected": return "badge rounded bg-danger-subtle text-danger fw-semibold";
            default: return "badge rounded bg-light text-dark fw-semibold";
        }
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
                                        <button 
                                            className="btn btn-sm btn-light border-0 fw-semibold px-3 text-danger"
                                            onClick={resetFilters}
                                        >
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
                                            <th style={{ width: "15%" }}>PATHFINDER</th>
                                            <th style={{ width: "20%" }}>CONTACT INFORMATION</th>
                                            <th style={{ width: "12%" }}>JOINED DATE</th>
                                            <th style={{ width: "12%" }}>LAST LOGIN</th>
                                            <th style={{ width: "17%" }}>KYC STATUS</th>
                                            <th style={{ width: "17%" }}>ACCOUNT STATUS</th>
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
                                                            ID: {pathfinder.userId}
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
                                                                    <small className="text-success mt-1">
                                                                        <i className="fa fa-circle me-1" style={{ fontSize: "6px" }}></i>
                                                                        Recently Active
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
                                                            <span className={getKycBadge(pathfinder.kycStatus)}>
                                                                {pathfinder.kycStatus?.charAt(0).toUpperCase() + pathfinder.kycStatus?.slice(1) || "N/A"}
                                                            </span>
                                                            {pathfinder.wallet && (
                                                                <small className="text-muted mt-1">
                                                                    Wallet Balance: ₦{pathfinder.wallet.balance?.toLocaleString() || "0"}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Account Status */}
                                                    <td className="py-3 px-2">
                                                        <div className="gap-3 small">
                                                            <span className={getStatusBadge(pathfinder)}>
                                                                {getStatusText(pathfinder)} ||
                                                            </span>
                                                            {pathfinder.isVerified && (
                                                                <span className="text-success">Verified </span> 
                                                            )}
                                                            {!pathfinder.isVerified && (
                                                                <span className="text-warning">Unverified</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="py-3 px-2">
                                                        <div className="dropdown">
                                                            <button className="btn btn-sm btn-primary border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown"aria-expanded="false">
                                                                Action
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end small">
                                                                <li>
                                                                    <Link 
                                                                        className="dropdown-item" 
                                                                        to={`/pathfinders/${pathfinder._id}/show`}
                                                                    >
                                                                        <i className="fa fa-eye me-2"></i>View Details
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link 
                                                                        className="dropdown-item" 
                                                                        to={`/pathfinders/${pathfinder._id}/edit`}
                                                                    >
                                                                        <i className="fa fa-edit me-2"></i>Edit
                                                                    </Link>
                                                                </li>
                                                                <li><hr className="dropdown-divider" /></li>
                                                                {!pathfinder.isApproved && (
                                                                    <li>
                                                                        <button className="dropdown-item text-success">
                                                                            <i className="fa fa-check me-2"></i>Approve
                                                                        </button>
                                                                    </li>
                                                                )}
                                                                {pathfinder.status === 'active' && (
                                                                    <li>
                                                                        <button className="dropdown-item text-warning">
                                                                            <i className="fa fa-pause me-2"></i>Suspend
                                                                        </button>
                                                                    </li>
                                                                )}
                                                                {pathfinder.status === 'suspended' && (
                                                                    <li>
                                                                        <button className="dropdown-item text-info">
                                                                            <i className="fa fa-play me-2"></i>Activate
                                                                        </button>
                                                                    </li>
                                                                )}
                                                                <li>
                                                                    <button className="dropdown-item text-danger">
                                                                        <i className="fa fa-trash me-2"></i>Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
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