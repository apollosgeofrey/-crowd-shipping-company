import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import { vehicleOwnerApi, type VehicleOwner } from "../services/vehicleOwnerApi.ts";

export default function VehicleOwnerList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [vehicleOwners, setVehicleOwners] = useState<VehicleOwner[]>([]);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        isApproved: "",
        kycStatus: ""
    });

    // Fetch data whenever page, perPage, or filters change
    useEffect(() => {
        async function fetchVehicleOwners() {
            setIsLoading(true);
            try {
                const response = await vehicleOwnerApi.getVehicleOwners({
                    page,
                    limit: perPage,
                    search: filters.search || undefined,
                    status: filters.status || undefined,
                    isApproved: filters.isApproved ? filters.isApproved === "true" : undefined,
                    kycStatus: filters.kycStatus || undefined
                });

                if (response.code === 200) {
                    // FIX: Access the nested data structure
                    setVehicleOwners(response.data.items); // Changed from response.data to response.data.items
                    setTotalPages(response.data.meta.totalPages); // Use actual pagination data
                    setTotalItems(response.data.meta.total); // Use actual total items
                }
            } catch (err) {
                console.error("Failed to fetch vehicle owners:", err);
                // Set empty array on error to prevent map error
                setVehicleOwners([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchVehicleOwners();
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
    const getStatusTextColor = (vehicleOwner: VehicleOwner) => {
        if (!vehicleOwner.isApproved && vehicleOwner.status === "pending") {
            return "text-warning-subtle text-warning";
        }
        if (vehicleOwner.isApproved && vehicleOwner.status === "active") {
            return "text-success-subtle text-success";
        }
        if (vehicleOwner.status === "suspended") {
            return "text-danger-subtle text-danger";
        }
        if (vehicleOwner.status === "inactive") {
            return "text-secondary-subtle text-secondary";
        }
        return "text-light text-dark";
    };

    // Get status display text
    const getStatusText = (vehicleOwner: VehicleOwner) => {
        if (!vehicleOwner.isApproved && vehicleOwner.status === "pending") {
            return "Pending Approval";
        }
        if (vehicleOwner.isApproved && vehicleOwner.status === "active") {
            return "Active";
        }
        return vehicleOwner.status.charAt(0).toUpperCase() + vehicleOwner.status.slice(1);
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
            case "completed": return "badge rounded bg-success-subtle text-success fw-semibold px-2 py-1";
            case "pending": return "badge rounded bg-warning-subtle text-warning fw-semibold px-2 py-1";
            case "rejected": return "badge rounded bg-danger-subtle text-danger fw-semibold px-2 py-1";
            default: return "badge rounded bg-light text-dark fw-semibold px-2 py-1";
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
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} vehicle owners
                                    </span>
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm fw-bold">
                                        <span>Export</span> <span className="fa fa-angle-down"></span>
                                    </button>

                                    {/* Create Vehicle Owner */}
                                    <Link to="/drivers/create" className="btn btn-primary btn-sm fw-bold">
                                        <span className="fa fa-plus"></span> Create Vehicle Owner
                                    </Link>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0 table-sm">
                                    <thead className="table-light small">
                                        <tr>
                                            <th style={{ width: "2%" }}>#</th>
                                            <th style={{ width: "20%" }}>VEHICLE OWNER</th>
                                            <th style={{ width: "20%" }}>CONTACT INFORMATION</th>
                                            <th style={{ width: "10%" }}>JOINED DATE</th>
                                            <th style={{ width: "15%" }}>LAST LOGIN</th>
                                            <th style={{ width: "10%" }}>KYC STATUS</th>
                                            <th style={{ width: "20%" }}>ACCOUNT STATUS</th>
                                            <th style={{ width: "5%" }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={8} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading vehicle owners...
                                                </td>
                                            </tr>
                                        ) : !vehicleOwners || vehicleOwners.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center text-muted py-4">
                                                    No vehicle owners found
                                                </td>
                                            </tr>
                                        ) : (
                                            vehicleOwners.map((vehicleOwner, index) => (
                                                <tr key={vehicleOwner._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-3 px-2 text-center fw-bold">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Vehicle Owner Info */}
                                                    <td className="py-3 px-2">
                                                        <Link to={`/drivers/${vehicleOwner._id}/show`} className="text-decoration-none text-primary fw-semibold d-block mb-1">
                                                            {vehicleOwner.fullName}
                                                        </Link>
                                                        <small className="text-muted d-block">
                                                            ID: {vehicleOwner.userId}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Contact Information */}
                                                    <td className="py-3 px-2">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <a href={`mailto:${vehicleOwner.email}`} className="text-decoration-none text-primary" title={`Send email to ${vehicleOwner.email}`}>
                                                                <i className="fa fa-envelope me-2" style={{ width: "16px" }}></i>
                                                                <small className="text-truncate" style={{ maxWidth: "160px" }} title={vehicleOwner.email}>
                                                                    {vehicleOwner.email || "N/A"}
                                                                </small>
                                                            </a>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <a href={`tel:${vehicleOwner.phoneNumber}`} className="text-decoration-none text-dark" title={`Call ${vehicleOwner.phoneNumber}`}>
                                                                <i className="fa fa-phone text-muted me-2" style={{ width: "16px" }}></i>
                                                                <small className="text-muted text-truncate" style={{ maxWidth: "160px" }} title={vehicleOwner.phoneNumber}>
                                                                    {vehicleOwner.phoneNumber || "N/A"}
                                                                </small>
                                                            </a>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Joined Date */}
                                                    <td className="text-muted py-3 px-2">
                                                        <div className="d-flex flex-column">
                                                            <small className="fw-semibold">{formatDate(vehicleOwner.createdAt)}</small>
                                                            <small className="text-muted">
                                                                {new Date(vehicleOwner.createdAt).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Last Login */}
                                                    <td className="text-muted py-3 px-2">
                                                        <div className="d-flex flex-column">
                                                            {vehicleOwner.lastLogin ? (
                                                                <>
                                                                    <small className="fw-semibold">{formatDate(vehicleOwner.lastLogin)}</small>
                                                                    <small className="text-muted">
                                                                        {new Date(vehicleOwner.lastLogin).toLocaleTimeString('en-US', {
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
                                                            <span className={getKycBadge(vehicleOwner.kycStatus)}>
                                                                {vehicleOwner.kycStatus?.charAt(0).toUpperCase() + vehicleOwner.kycStatus?.slice(1) || "N/A"}
                                                            </span>
                                                            {vehicleOwner.wallet && (
                                                                <small className="text-muted mt-1">
                                                                    Balance: ₦{vehicleOwner.wallet.balance?.toLocaleString() || "0"}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Account Status */}
                                                    <td className="py-3 px-2">
                                                        <div className="gap-3 small">
                                                            <span className={getStatusTextColor(vehicleOwner)}>
                                                                {getStatusText(vehicleOwner)} ||
                                                            </span>
                                                            {vehicleOwner.isVerified && (
                                                                <span className="text-success">&nbsp; Verified</span>
                                                            )}
                                                            {!vehicleOwner.isVerified && (
                                                                <span className="text-warning">&nbsp; Unverified</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="py-3 px-2">
                                                        <div className="dropdown">
                                                            <button 
                                                                className="btn btn-sm btn-primary border-0 dropdown-toggle" 
                                                                type="button" 
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                Action
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                <li>
                                                                    <Link 
                                                                        className="dropdown-item" 
                                                                        to={`/drivers/${vehicleOwner._id}/show`}
                                                                    >
                                                                        <i className="fa fa-eye me-2"></i>View Details
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link 
                                                                        className="dropdown-item" 
                                                                        to={`/drivers/${vehicleOwner._id}/edit`}
                                                                    >
                                                                        <i className="fa fa-edit me-2"></i>Edit
                                                                    </Link>
                                                                </li>
                                                                <li><hr className="dropdown-divider" /></li>
                                                                {!vehicleOwner.isApproved && (
                                                                    <li>
                                                                        <button className="dropdown-item text-success">
                                                                            <i className="fa fa-check me-2"></i>Approve
                                                                        </button>
                                                                    </li>
                                                                )}
                                                                {vehicleOwner.status === 'active' && (
                                                                    <li>
                                                                        <button className="dropdown-item text-warning">
                                                                            <i className="fa fa-pause me-2"></i>Suspend
                                                                        </button>
                                                                    </li>
                                                                )}
                                                                {vehicleOwner.status === 'suspended' && (
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