// ReportList.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import { FaSearch } from "react-icons/fa";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import reportApi, { type ReportFilters } from "../services/reportApi.ts";

export default function ReportList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [metaData, setMetaData] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [filters, setFilters] = useState<ReportFilters>({search: "", status: "", reportType: ""});

    // Fetch reports from API
    useEffect(() => {
        async function fetchReports() {
            setIsLoading(true);
            try {
                const response = await reportApi.getReports({page, limit: perPage, ...filters});
                if (response.code === 200) {
                    setReports(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                    setMetaData(response.data.meta);
                }
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchReports();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: keyof ReportFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({ search: "", status: "", reportType: "" });
        setPage(1);
    };

    // Handle export reports
    const handleExport = async () => {
        try {
            const blob = await reportApi.exportReports(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reports-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export reports:", err);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Format currency
    const formatCurrency = (amount: number, currency: string = "NGN") => {
        if (amount === undefined || amount === null) return "N/A";
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount / 100);
    };

    // Get status badge style
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'badge rounded bg-warning-subtle text-warning fw-semibold px-3 py-2',
            'resolved': 'badge rounded bg-success-subtle text-success fw-semibold px-3 py-2',
            'underReview': 'badge rounded bg-info-subtle text-info fw-semibold px-3 py-2',
            'escalated': 'badge rounded bg-danger-subtle text-danger fw-semibold px-3 py-2',
            'rejected': 'badge rounded bg-secondary-subtle text-secondary fw-semibold px-3 py-2'
        };
        return statusMap[status] || 'badge rounded bg-light text-dark fw-semibold px-3 py-2';
    };

    // Get report type badge
    const getReportTypeBadge = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'booking': 'bg-primary text-white',
            'customer': 'bg-success text-white',
            'other': 'bg-secondary text-white'
        };
        return typeMap[type] || 'bg-secondary text-white';
    };

    // Capitalize first letter
    const capitalizeFirst = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Format report description with truncation
    const formatDescription = (description: string) => {
        if (!description) return <span className="text-muted">No description</span>;
        
        if (description.length > 100) {
            return (
                <>
                    <div className="text-truncate" title={description}>
                        {description.substring(0, 100)}...
                    </div>
                    <small className="text-primary cursor-pointer">
                        Read more
                    </small>
                </>
            );
        }
        return description;
    };

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                {/* Left: Title & Description */}
                                <div>
                                    <h4 className="card-title mb-1">Reports Management</h4>
                                    <p className="text-muted small mb-0">Manage reports and feedbacks</p>
                                </div>

                                {/* Right: Export Button */}
                                <button className="btn btn-outline-secondary btn-sm fw-bold" onClick={handleExport}>
                                    <span>Export</span> <span className="fa fa-angle-down"></span>
                                </button>
                            </div>

                            {/* Filter Bar */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
                                
                                    {/* Filter By */}
                                    <button className="btn btn-sm btn-light border-0 fw-semibold px-3" disabled={true}>
                                        <i className="fa fa-filter me-1"></i> Filter By
                                    </button>

                                    {/* Search Input */}
                                    <div className="d-flex align-items-center px-2">
                                        <input type="text" className="form-control form-control-sm border-1 bg-transparent shadow-lg" 
                                            placeholder="Search reports or descriptions..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            style={{ minWidth: "200px" }}
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }} value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
                                            <option value="">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="underReview">Under Review</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="escalated">Escalated</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>

                                    {/* Report Type Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }} value={filters.reportType} onChange={(e) => handleFilterChange("reportType", e.target.value)}>
                                            <option value="">All Types</option>
                                            <option value="booking">Booking Reports</option>
                                            <option value="customer">Customer Reports</option>
                                            <option value="other">Other Reports</option>
                                        </select>
                                    </div>

                                    {/* Language Filter */}
                                    {/*<div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.language}
                                            onChange={(e) => handleFilterChange("language", e.target.value)}
                                        >
                                            <option value="">All Languages</option>
                                            <option value="en">English</option>
                                            <option value="fr">French</option>
                                            <option value="es">Spanish</option>
                                        </select>
                                    </div>*/}

                                    {/* Reset Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <button className="btn btn-sm btn-light border-0 fw-semibold px-3 text-danger" onClick={resetFilters}>
                                            <i className="fa fa-undo me-1"></i> Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stats and Info */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-muted">
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} reports
                                    </span>
                                </div>
                                
                                {metaData?.summary && (
                                    <div className="d-flex gap-3 small text-muted">
                                        <span>Pending: {metaData.summary.statusCounts?.pending || 0}</span>
                                        <span>Resolved: {metaData.summary.statusCounts?.resolved || 0}</span>
                                        <span>Total Amount: {formatCurrency(metaData.summary.financials?.totalReportAmount || 0)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0 table-sm table-striped">
                                    <thead className="table-light small">
                                        <tr>
                                            <th style={{ width: "2%" }} className="py-3">#</th>
                                            <th style={{ width: "12%" }} className="py-3">REFERENCE</th>
                                            <th style={{ width: "20%" }} className="py-3">REPORT DETAILS</th>
                                            <th style={{ width: "15%" }} className="py-3">REPORTER</th>
                                            <th style={{ width: "7%" }} className="py-3">TYPE</th>
                                            <th style={{ width: "16%" }} className="py-3">DESCRIPTION</th>
                                            <th style={{ width: "10%" }} className="py-3">AMOUNT</th>
                                            <th style={{ width: "8%" }} className="py-3">STATUS</th>
                                            <th style={{ width: "15%" }} className="py-3">DATE</th>
                                            <th style={{ width: "5%" }} className="py-3">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={10} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading reports...
                                                </td>
                                            </tr>
                                        ) : reports.length === 0 ? (
                                            <tr>
                                                <td colSpan={10} className="text-center text-muted py-4">No reports found</td>
                                            </tr>
                                        ) : (
                                            reports.map((report, index) => (
                                                <tr key={report._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-2 px-1 text-center fw-bold align-top">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Report Reference */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-primary">
                                                        	<Link to={`/reports/${report._id}/show`} className="text-primary text-decoration-none" title="View Report Details">
                                                        		{report.reportRef ?? 'N/A'}
                                                        	</Link>
                                                        </div>
                                                        <small className="text-muted">Booking: {report.booking?.bookingRef ?? 'N/A'}</small>
                                                    </td>
                                                    
                                                    {/* Report Details */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-dark">{report.natureOfReport ?? 'N/A'}</div>
                                                        <small className="text-muted text-capitalize">{report.reportType ?? 'N/A'}</small>
                                                    </td>
                                                    
                                                    {/* Reporter Info */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-1">
                                                            <div className="small fw-semibold">{report.raisedBy?.fullName ?? 'N/A'}</div>
                                                            <small className="text-muted">{report.raisedBy?.email ?? ''}</small>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Report Type */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`badge ${getReportTypeBadge(report.reportType)}`}>
                                                            {capitalizeFirst(report.reportType ?? 'N/A')}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Description */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small">{formatDescription(report.description)}</div>
                                                    </td>
                                                    
                                                    {/* Amount */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-success">{formatCurrency(report.reportAmount)}</div>
                                                        {report.amountRefunded > 0 && (<small className="text-muted">Refunded: {formatCurrency(report.amountRefunded)}</small>)}
                                                    </td>
                                                    
                                                    {/* Status */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`${getStatusBadge(report.status)}`}>
                                                            {capitalizeFirst(report.status ?? 'N/A')}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Date */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">{formatDate(report.createdAt)}</div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="text-muted py-2 px-1 align-top">
                                                        <div className="btn-group">
                                                            <Link to={`/reports/${report._id}/show`} className="btn btn-sm px-1 py-0 btn-outline-primary" title="View Report Details">
                                                                <i className="fa fa-eye small"></i> View
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
                            <PaginationBar page={page} perPage={perPage} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage}/>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}