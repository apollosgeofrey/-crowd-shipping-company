// BookingList.tsx
import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import BookingStatsCards from "./bookingListPartials/BookingStatsCards.tsx";
import bookingApi, { type BookingFilters } from "../services/bookingApi.ts";
import BookingDetailModal from "./bookingListPartials/BookingDetailModal.tsx";

export default function BookingList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState<any[]>([]);
    const [metaData, setMetaData] = useState<any>(null);
    const [filters, setFilters] = useState<BookingFilters>({
        search: "",
        status: "",
        paymentStatus: "",
        fleetType: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    // Fetch bookings from API
    useEffect(() => {
        async function fetchBookings() {
            setIsLoading(true);
            try {
                const response = await bookingApi.getBookings({page, limit: perPage, ...filters});
                if (response.code === 200) {
                    setBookings(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                    setMetaData(response.data.meta);
                }
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBookings();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: keyof BookingFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page when filters change
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({ search: "", status: "", paymentStatus: "", fleetType: "" });
        setPage(1);
    };

    // Handle view booking details
    const handleView = (booking: any) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    // Handle export bookings
    const handleExport = async () => {
        try {
            const blob = await bookingApi.exportBookings(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export bookings:", err);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency
    const formatCurrency = (amount: number, currency: string = "NGN") => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Get status badge color
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'PENDING': 'bg-warning-subtle text-warning',
            'IN_PROGRESS': 'bg-primary-subtle text-primary',
            'ARRIVED_DESTINATION': 'bg-info-subtle text-info',
            'DELIVERED': 'bg-success-subtle text-success',
            'CANCELLED': 'bg-danger-subtle text-danger',
            'REJECTED': 'bg-secondary-subtle text-secondary'
        };
        return statusMap[status] || 'bg-secondary text-white';
    };

    // Get payment status badge
    const getPaymentStatusBadge = (paymentStatus: string) => {
        const statusMap: { [key: string]: string } = {
            'paid': 'bg-success text-white',
            'unpaid': 'bg-warning text-dark',
            'failed': 'bg-danger text-white',
            'refunded': 'bg-info text-white'
        };
        return statusMap[paymentStatus] || 'bg-secondary text-white';
    };

    // Get fleet type badge
    const getFleetTypeBadge = (fleetType: string) => {
        const typeMap: { [key: string]: string } = {
            'road': 'bg-primary-subtle text-primary',
            'air': 'bg-info-subtle text-info',
            'maritime': 'bg-success-subtle text-success'
        };
        return typeMap[fleetType] || 'bg-secondary text-white';
    };

    // Capitalize first letter
    const capitalizeFirst = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Format status for display
    const formatStatus = (status: string) => {
        return status.toLowerCase().split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                            {/* Statistics Cards - Pass the stats data */}
                            <div className="mb-4">
                                <BookingStatsCards 
                                    metaData={metaData} 
                                    loading={isLoading} 
                                />
                            </div>

                            {/* Filter Bar */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
                                
                                    {/* Filter By (first item, no border-left) */}
                                    <button className="btn btn-sm btn-light border-0 fw-semibold px-3" disabled={true}>
                                        <i className="fa fa-filter me-1"></i> Filter By
                                    </button>

                                    {/* Search Input */}
                                    <div className="d-flex align-items-center px-2">
                                        <input 
                                            type="text"
                                            className="form-control form-control-sm border-1 bg-transparent shadow-lg" 
                                            placeholder="Search booking reference..."
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
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="ARRIVED_DESTINATION">Arrived</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>

                                    {/* Payment Status Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.paymentStatus}
                                            onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
                                        >
                                            <option value="">All Payment</option>
                                            <option value="paid">Paid</option>
                                            <option value="unpaid">Unpaid</option>
                                        </select>
                                    </div>

                                    {/* Fleet Type Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.fleetType}
                                            onChange={(e) => handleFilterChange("fleetType", e.target.value)}
                                        >
                                            <option value="">All Fleet Types</option>
                                            <option value="road">Road</option>
                                            <option value="air">Air</option>
                                            <option value="maritime">Maritime</option>
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
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} bookings
                                    </span>
                                </div>
                                
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm fw-bold" onClick={handleExport}>
                                        <span>Export</span> <span className="fa fa-angle-down"></span>
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0 table-sm table-striped">
                                    <thead className="table-light small">
                                        <tr>
                                            <th style={{ width: "3%" }} className="py-3">#</th>
                                            <th style={{ width: "15%" }} className="py-3">BOOKING REF</th>
                                            <th style={{ width: "15%" }} className="py-3">SENDER & RECEIVER</th>
                                            <th style={{ width: "15%" }} className="py-3">PATHFINDER</th>
                                            <th style={{ width: "15%" }} className="py-3">ROUTE</th>
                                            <th style={{ width: "14%" }} className="py-3">FINANCIAL INFO</th>
                                            <th style={{ width: "8%" }} className="py-3">STATUSES</th>
                                            <th style={{ width: "10%" }} className="py-3">DATES</th>
                                            <th style={{ width: "5%" }} className="py-3">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading bookings...
                                                </td>
                                            </tr>
                                        ) : bookings.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-muted py-4">No bookings found</td>
                                            </tr>
                                        ) : (
                                            bookings.map((booking, index) => (
                                                <tr key={booking._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-2 px-1 text-center fw-bold align-top">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Booking Reference */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-primary">{booking.bookingRef}</div>
                                                        <small className="text-muted">
                                                            Tracking: {booking.parcelGroup?.trackingId || "N/A"}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Sender & Receiver */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-1">
                                                            <div className="small">
                                                            	<span className="fw-semibold text-muted me-1">Sender:</span>
                                                                {booking.sender?.fullName || "N/A"}
                                                            </div>
                                                            <small className="text-muted">
                                                                {booking.sender?.phoneNumber || ""}
                                                            </small>
                                                        </div>
                                                        <div>
                                                            <div className="small">
                                                            	<span className="fw-semibold text-muted me-1">Receiver:</span>
                                                                {booking.parcelGroup?.receiverName || "N/A"}
                                                            </div>
                                                            <small className="text-muted">
                                                                {booking.parcelGroup?.receiverPhone || ""}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Pathfinder */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold">
                                                            {booking.traveller?.fullName || "N/A"}
                                                        </div>
                                                        <small className="text-muted d-block">
                                                            {booking.traveller?.email || "N/A"}
                                                        </small>
                                                        <small className="text-muted">
                                                            {booking.traveller?.phoneNumber || "N/A"}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Route Information */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-1">
                                                            <div className="small text-truncate" style={{ maxWidth: "150px" }} title={booking.parcelGroup?.pickUpLocation?.address}>
                                                            	<small className="fw-semibold text-muted me-1">From:</small>
                                                                {booking.parcelGroup?.pickUpLocation?.address || "N/A"}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="small text-truncate" style={{ maxWidth: "150px" }} title={booking.parcelGroup?.dropOffLocation?.address}>
                                                            	<small className="fw-semibold text-muted me-1">To:</small>
                                                                {booking.parcelGroup?.dropOffLocation?.address || "N/A"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Financial Information */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-0">
                                                            <div className="fw-semibold text-success">
                                                            	<span className="fw-semibold text-muted me-1">Total:</span>
                                                                {formatCurrency(booking.total, booking.currency)}
                                                            </div>
                                                        </div>
                                                        <div className="mb-0">
                                                            <div className="small">
                                                            	<small className="fw-semibold text-muted me-1">Weight:</small>
                                                                {booking.parcelGroup?.weight || "0"} kg
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className={`badge ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                                                                {capitalizeFirst(booking.paymentStatus)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Statuses */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-0 col-sm">
                                                            <span className={`badge ${getStatusBadge(booking.status)} col-sm-12`}>
                                                                {formatStatus(booking.status)}
                                                            </span>
                                                        </div>
                                                        <div className="mb-0">
                                                            <span className={`badge ${getFleetTypeBadge(booking.fleetType)} col-sm-12`}>
                                                                {capitalizeFirst(booking.fleetType)}
                                                            </span>
                                                        </div>
                                                        <div className="small text-muted col-sm-12">
                                                            Parcel: {capitalizeFirst(booking.parcelGroup?.status || "N/A")}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Dates */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">
                                                            <div className="mb-1">
                                                                <span className="fw-semibold me-1">Created:</span>
                                                                {formatDate(booking.createdAt)}
                                                            </div>
                                                            <div>
                                                                <span className="fw-semibold me-1">Updated:</span>
                                                                {formatDate(booking.updatedAt)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="text-muted py-2 px-1 align-top">
                                                        <div className="btn-group">
                                                            <button className="btn btn-sm px-1 py-0 btn-outline-primary" title="View Booking" onClick={() => handleView(booking)}>
                                                                <i className="fa fa-eye small"></i> View
                                                            </button>
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

                            {/* Booking Detail Modal - Pass the selected booking */}
                            <BookingDetailModal show={showModal} onClose={() => setShowModal(false)} booking={selectedBooking} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}