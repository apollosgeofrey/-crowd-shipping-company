import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { vehicleOwnerApi } from "../services/vehicleOwnerApi.ts";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";

export default function VehicleOwnerList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [vehicleOwners, setVehicleOwners] = useState<any[]>([]);
    const [filters, setFilters] = useState({search: "", status: "", isApproved: "", kycStatus: ""});

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
        setFilters({search: "", status: "", isApproved: "", kycStatus: ""});
        setPage(1);
    };

    // Get status text based on status and approval
    const getStatusTextColor = (status: string) => {
        switch (status) {
            case "pending": return "text-warning";
            case "active": return "text-success";
            case "suspended": return "text-danger";
            case "inactive": return "text-secondary";
            default: return "text-dark";
        }
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
                                    <button className="btn btn-sm btn-light border-0 fw-semibold px-3" disabled={true}>
                                        <i className="fa fa-filter me-1"></i> Filter By
                                    </button>

                                    {/* Search Input */}
                                    <div className="d-flex align-items-center px-2">
                                        <input type="text"
                                            className="form-control form-control-sm border-1 bg-transparent shadow-lg" 
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
                                    <Link to="/vehicle-owners/create" className="btn btn-primary btn-sm fw-bold">
                                        <span className="fa fa-plus-square"></span> Create New Vehicle Owner
                                    </Link>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0 table-sm table-striped">
                                    <thead className="table-light small">
                                        <tr>
                                            <th style={{ width: "2%" }} className="py-3">#</th>
                                            <th style={{ width: "16%" }} className="py-3">VEHICLE OWNER</th>
                                            <th style={{ width: "20%" }} className="py-3">CONTACT INFORMATION</th>
                                            <th style={{ width: "18%" }} className="py-3">DATES</th>
                                            <th style={{ width: "20%" }} className="py-3">WALLET</th>
                                            <th style={{ width: "16%" }} className="py-3">STATUSES</th>
                                            <th style={{ width: "8%" }} className="py-3">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading vehicle owners...
                                                </td>
                                            </tr>
                                        ) : !vehicleOwners || vehicleOwners.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted py-4">
                                                    No vehicle owners found
                                                </td>
                                            </tr>
                                        ) : (
                                            vehicleOwners.map((vehicleOwner, index) => (
                                                <tr key={vehicleOwner._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-2 px-1 align-top text-center fw-bold">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Vehicle Owner Info */}
                                                    <td className="py-2 px-1 align-top">
                                                        <Link to={`/vehicle-owners/${vehicleOwner._id}/show`} className="text-decoration-none text-primary fw-semibold d-block mb-0">
                                                            {vehicleOwner.fullName}
                                                        </Link>
                                                        <small className="text-muted d-block">
                                                            ID: {vehicleOwner.userId}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Contact Information */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="d-flex align-items-center mb-0">
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
                                                    <td className="text-muted py-2 px-1 align-top">
                                                        <div className="col-sm-12">
                                                            <small className="fw-semibold me-1">JOINED:</small>
                                                            <small className="text-muted">
                                                                {formatDate(vehicleOwner.createdAt)} - {new Date(vehicleOwner.createdAt).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}
                                                            </small>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <small className="fw-semibold me-1">LAST LOGIN:</small>
                                                            <small className="text-muted">
                                                                {vehicleOwner.lastLogin ? (
                                                                    <>{formatDate(vehicleOwner.lastLogin)} - {new Date(vehicleOwner.lastLogin).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}</>
                                                                ) : (
                                                                    <><i className="fa fa-circle me-1" style={{ fontSize: "6px" }}></i>  Never Logged In</>
                                                                )}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Wallert */}
                                                    <td className="text-muted py-2 px-1 align-top small">
                                                        <span className="text-muted">
                                                            <strong className="me-1">Wallet ID:</strong> {vehicleOwner.walletId || 'N/A'}
                                                        </span>
                                                        <span className="d-block text-muted">
                                                            <strong className="me-1">Balance:</strong> {vehicleOwner.wallet ? formatBalance(vehicleOwner.wallet.balance) : '₦0'}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Account Status */}
                                                    <td className="py-2 px-1 align-top small">
                                                        <div className="text-muted">
                                                            <b>KYC:</b>
                                                            <span className={`float-end ${getKycTextColor(vehicleOwner.kycStatus)}`}>
                                                                {capitalizeFirst(vehicleOwner.kycStatus)}
                                                            </span>
                                                        </div> 
                                                        <div className="text-muted">
                                                            <b>ACCOUNT:</b>
                                                            <span className={`float-end ${getStatusTextColor(vehicleOwner.status)}`}>
                                                                {capitalizeFirst(vehicleOwner.status)}
                                                            </span>
                                                        </div>
                                                        <div className="text-muted">
                                                            <b>APPROVAL:</b>
                                                            <span className={`float-end text-${vehicleOwner.isApproved ? 'success' : 'warning'}`}>
                                                                {vehicleOwner.isApproved ? 'Approved' : 'Pending'}
                                                            </span>
                                                        </div>                                                        
                                                        <div className="text-muted">
                                                            <b>VERIFICATION:</b>
                                                            {vehicleOwner.isVerified ? (
                                                                <span className="float-end text-success">Verified </span> 
                                                            ) : (
                                                                <span className="float-end text-warning">Unverified</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    
                                                    {/* Actions */}
                                                    <td className="text-muted py-2 px-1 align-top">
                                                        <div className="btn-group">
                                                            <Link to={`/vehicle-owners/${vehicleOwner._id}/show`} className="btn btn-sm px-1 py-0 btn-outline-primary" title="View User">
                                                                <i className="fa fa-eye small"></i>View
                                                            </Link>
                                                            <Link to={`/vehicle-owners/${vehicleOwner._id}/edit`} className="btn btn-sm px-1 py-0 btn-outline-secondary" title="Edit User">
                                                                <i className="fa fa-edit small"></i>Edit
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