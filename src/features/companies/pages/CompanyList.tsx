import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import { companyApi } from "../services/companyApi.ts";

export default function CompanyList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState({search: "", status: "", verification: ""});

    // Fetch data whenever page, perPage, or filters change
    useEffect(() => {
        async function fetchCompanies() {
            setIsLoading(true);
            try {
                const response = await companyApi.getCompanies({
                    page,
                    limit: perPage,
                    search: filters.search || undefined,
                    status: filters.status || undefined,
                    verification: filters.verification || undefined
                });

                if (response.code === 200) {
                    setCompanies(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                }
            } catch (err) {
                console.error("Failed to fetch companies:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCompanies();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page when filters change
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({search: "", status: "", verification: ""});
        setPage(1);
    };

    // Get status text and color
    const getStatusTextColor = (status: string) => {
        if (status === "active") return "text-success";
        if (status === "pending") return "text-warning";
        if (status === "inactive") return "text-secondary";
        if (status === "rejected") return "text-danger";
        if (status === "processing") return "text-info";
        return "text-dark";
    };

    // Get status badge class
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active": return "badge bg-success-subtle text-success fw-semibold px-3 py-2 rounded";
            case "inactive": return "badge bg-light text-secondary fw-semibold px-3 py-2 rounded";
            case "rejected": return "badge bg-danger-subtle text-danger fw-semibold px-3 py-2 rounded";
            case "processing": 
            case "pending": return "badge bg-info-subtle text-info fw-semibold px-3 py-2 rounded";
            default: return "badge rounded bg-light text-dark fw-semibold px-3 py-2";
        }
    };

    // Format date
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

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
                                
                                    {/* Filter By (first item, no border-left) */}
                                    <button className="btn btn-sm btn-light border-0 fw-semibold px-3" disabled='disabled'>
                                        <i className="fa fa-filter me-1"></i> Filter By
                                    </button>

                                    {/* Search Input */}
                                    <div className="d-flex align-items-center px-2">
                                        <input type="text"
                                            className="form-control form-control-sm border-1 bg-transparent" 
                                            placeholder="Search company name or email..."
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
                                            <option value="inactive">Inactive</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>

                                    {/* Verification Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.verification}
                                            onChange={(e) => handleFilterChange("verification", e.target.value)}
                                        >
                                            <option value="">All Verification</option>
                                            <option value="verified">Verified</option>
                                            <option value="unverified">Unverified</option>
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
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} companies
                                    </span>
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm fw-bold">
                                        <span>Export</span> <span className="fa fa-angle-down"></span>
                                    </button>

                                    {/* Create Company */}
                                    <Link to="/companies/create" className="btn btn-primary btn-sm fw-bold">
                                        <span className="fa fa-plus-square"></span> Create New Company
                                    </Link>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0 table-sm table-striped">
                                    <thead className="table-light small">
                                        <tr>
                                            <th style={{ width: "2%" }} className="py-3">#</th>
                                            <th style={{ width: "20%" }} className="py-3">COMPANY</th>
                                            <th style={{ width: "20%" }} className="py-3">CONTACT INFORMATION</th>
                                            <th style={{ width: "15%" }} className="py-3">DATES</th>
                                            <th style={{ width: "18%" }} className="py-3">BUSINESS INFO</th>
                                            <th style={{ width: "15%" }} className="py-3">STATUSES</th>
                                            <th style={{ width: "10%" }} className="py-3">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading companies...
                                                </td>
                                            </tr>
                                        ) : companies.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center text-muted py-4">No companies found</td>
                                            </tr>
                                        ) : (
                                            companies.map((company, index) => (
                                                <tr key={company._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-2 px-1 text-center fw-bold">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Company Info */}
                                                    <td className="py-2 px-1">
                                                        <Link to={`/companies/${company._id}/show`} className="text-decoration-none btn-link text-primary fw-semibold d-block mb-0">
                                                            {company.name}
                                                        </Link>
                                                        <small className="text-muted d-block">
                                                            <b>RC Number:</b> {company.rcNumber || "N/A"}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Contact Information */}
                                                    <td className="py-2 px-1">
                                                        <div className="d-flex align-items-center mb-0">
                                                            <a href={`mailto:${company.email}`} className="text-decoration-none text-primary" title={`Send email to ${company.email}`}>
                                                                <i className="fa fa-envelope me-1" style={{ width: "16px" }}></i>
                                                                <small className="text-truncate" style={{ maxWidth: "160px" }} title={company.email}>
                                                                    {company.email || "N/A"}
                                                                </small>
                                                            </a>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <a href={`tel:${company.phoneNumber}`} className="text-decoration-none text-dark" title={`Call ${company.phoneNumber}`}>
                                                                <i className="fa fa-phone text-muted me-1" style={{ width: "16px" }}></i>
                                                                <small className="text-muted text-truncate" style={{ maxWidth: "160px" }} title={company.phoneNumber}>
                                                                    {company.phoneNumber || "N/A"}
                                                                </small>
                                                            </a>
                                                        </div>
                                                        {company.contactPerson && (
                                                            <div className="d-flex align-items-center mt-1">
                                                                <i className="fa fa-user text-muted me-1" style={{ width: "16px" }}></i>
                                                                <small className="text-muted text-truncate" style={{ maxWidth: "160px" }} title={company.contactPerson.fullName}>
                                                                    {company.contactPerson.fullName || "N/A"}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </td>
                                                    
                                                    {/* Dates */}
                                                    <td className="text-muted py-2 px-1">
                                                        <div className="col-sm-12">
                                                            <small className="fw-semibold me-1">CREATED:</small>
                                                            <small className="text-muted">
                                                                {formatDate(company.createdAt)} - {new Date(company.createdAt).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}
                                                            </small>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <small className="fw-semibold me-1">INCORPORATED:</small>
                                                            <small className="text-muted">
                                                                {company.incorporationDate ? formatDate(company.incorporationDate) : "N/A"}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Business Information */}
                                                    <td className="py-2 px-1">
                                                        <div className="d-flex flex-column align-items-start small">
                                                            <div className="text-muted mt-1">
                                                                <b>Tax ID:</b> {company.taxId || "N/A"}
                                                            </div>
                                                            <div className="text-muted mt-1">
                                                                <b>Location:</b> {company.cityState || "N/A"}
                                                            </div>
                                                            <div className="text-muted mt-1">
                                                                <b>Address:</b> {company.address ? (
                                                                    <span title={company.address} className="text-truncate" style={{ maxWidth: "150px" }}>
                                                                        {company.address}
                                                                    </span>
                                                                ) : "N/A"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Statuses */}
                                                    <td className="py-2 px-1 small">
                                                        <div className="text-muted">
                                                            <b>STATUS:</b>
                                                            <span className={`float-end ${getStatusTextColor(company.status)}`}>
                                                                {capitalizeFirst(company.status)}
                                                            </span>
                                                        </div> 
                                                        <div className="text-muted">
                                                            <b>VERIFICATION:</b>
                                                            {company.verifiedBy ? (
                                                                <span className="float-end text-success">Verified</span> 
                                                            ) : (
                                                                <span className="float-end text-warning">Unverified</span>
                                                            )}
                                                        </div>
                                                        <div className="text-muted">
                                                            <b>CONTACT PERSON:</b>
                                                            <span className={`float-end text-${company.contactPerson?.status === 'active' ? 'success' : 'warning'}`}>
                                                                {company.contactPerson ? capitalizeFirst(company.contactPerson.status) : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="text-muted py-2 px-1">
                                                        <div className="btn-group">
                                                            <Link to={`/companies/${company._id}/show`} className="btn btn-sm px-1 py-0 btn-outline-primary" title="View Company">
                                                                <i className="fa fa-eye small"></i>View
                                                            </Link>
                                                            <Link to={`/companies/${company._id}/edit`} className="btn btn-sm px-1 py-0 btn-outline-secondary" title="Edit Company">
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
                            <PaginationBar page={page} perPage={perPage} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}