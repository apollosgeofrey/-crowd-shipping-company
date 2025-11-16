// RatingList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import RatingStatsCards from "./ratingListPartials/RatingStatsCards.tsx";
import ratingApi, { type RatingFilters } from "../services/ratingApi.ts";

export default function RatingList() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [metaData, setMetaData] = useState<any>(null);
    const [ratings, setRatings] = useState<any[]>([]);
    const [filters, setFilters] = useState<RatingFilters>({search: "", ratingType: "", minRating: "", maxRating: "", hasReview: ""});

    // Fetch ratings from API
    useEffect(() => {
        async function fetchRatings() {
            setIsLoading(true);
            try {
                const response = await ratingApi.getRatings({page, limit: perPage, ...filters});
                if (response.code === 200) {
                    setRatings(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                    setMetaData(response.data.meta);
                }
            } catch (err) {
                console.error("Failed to fetch ratings:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRatings();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: keyof RatingFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({ search: "", ratingType: "", minRating: "", maxRating: "", hasReview: "" });
        setPage(1);
    };

    // Handle view rating details
    const handleView = (rating: any) => navigate(`/ratings/${rating._id}/show`);

    // Handle export ratings
    const handleExport = async () => {
        try {
            const blob = await ratingApi.exportRatings(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ratings-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export ratings:", err);
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

    // Render star rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <i key={i} className={`fa fa-star ${i < rating ? "text-warning" : "text-muted"}`}></i>
        ));
    };

    // Get rating type badge
    const getRatingTypeBadge = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'customer': 'bg-primary text-white',
            'driver': 'bg-success text-white'
        };
        return typeMap[type] || 'bg-secondary text-white';
    };

    // Get booking status badge
    const getBookingStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'COMPLETED': 'bg-success text-white',
            'in-progress': 'bg-warning text-dark',
            'pending': 'bg-secondary text-white',
            'cancelled': 'bg-danger text-white'
        };
        return statusMap[status] || 'bg-secondary text-white';
    };

    // Capitalize first letter
    const capitalizeFirst = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                            {/* Statistics Cards */}
                            <div className="mb-4">
                                <RatingStatsCards metaData={metaData} loading={isLoading} />
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
                                        <input type="text" className="form-control form-control-sm border-1 bg-transparent" 
                                            placeholder="Search reviews or names..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            style={{ minWidth: "200px" }}
                                        />
                                    </div>

                                    {/* Rating Type Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.ratingType}
                                            onChange={(e) => handleFilterChange("ratingType", e.target.value)}
                                        >
                                            <option value="">All Types</option>
                                            <option value="customer">Customer Ratings</option>
                                            <option value="driver">Driver Ratings</option>
                                        </select>
                                    </div>

                                    {/* Min Rating Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.minRating}
                                            onChange={(e) => handleFilterChange("minRating", e.target.value)}
                                        >
                                            <option value="">Min Rating</option>
                                            <option value="1">1 Star</option>
                                            <option value="2">2 Stars</option>
                                            <option value="3">3 Stars</option>
                                            <option value="4">4 Stars</option>
                                            <option value="5">5 Stars</option>
                                        </select>
                                    </div>

                                    {/* Max Rating Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.maxRating}
                                            onChange={(e) => handleFilterChange("maxRating", e.target.value)}
                                        >
                                            <option value="">Max Rating</option>
                                            <option value="1">1 Star</option>
                                            <option value="2">2 Stars</option>
                                            <option value="3">3 Stars</option>
                                            <option value="4">4 Stars</option>
                                            <option value="5">5 Stars</option>
                                        </select>
                                    </div>

                                    {/* Has Review Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.hasReview}
                                            onChange={(e) => handleFilterChange("hasReview", e.target.value)}
                                        >
                                            <option value="">All Reviews</option>
                                            <option value="yes">With Reviews</option>
                                            <option value="no">Without Reviews</option>
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
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} ratings
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
                                            <th style={{ width: "15%" }} className="py-3">REFERENCE</th>
                                            <th style={{ width: "18%" }} className="py-3">RATER & RATEE</th>
                                            <th style={{ width: "8%" }} className="py-3">RATING TYPE</th>
                                            <th style={{ width: "12%" }} className="py-3">RATING</th>
                                            <th style={{ width: "20%" }} className="py-3">REVIEW</th>
                                            <th style={{ width: "7%" }} className="py-3">STATUS</th>
                                            <th style={{ width: "10%" }} className="py-3">DATE</th>
                                            <th style={{ width: "7%" }} className="py-3">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading ratings...
                                                </td>
                                            </tr>
                                        ) : ratings.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-muted py-4">No ratings found</td>
                                            </tr>
                                        ) : (
                                            ratings.map((rating, index) => (
                                                <tr key={rating._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-2 px-1 text-center fw-bold align-top">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Booking Reference */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-primary">
                                                            {rating.booking?.bookingRef ?? 'N/A'}
                                                        </div>
                                                        <small className="text-muted">
                                                            FEE: &nbsp; {formatCurrency(rating.booking?.total, rating.booking?.currency)}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Rater & Ratee */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-1">
                                                            <div className="small">
                                                            	<span className="fw-semibold text-muted me-1">Rater:</span>
                                                                {rating.rater?.fullName ?? 'N/A'}
                                                            </div>
                                                            <small className="text-muted">{rating.rater?.email ?? ''}</small>
                                                        </div>
                                                        <div>
                                                            <div className="small">
                                                            	<span className="fw-semibold text-muted me-1">Ratee:</span>
                                                                {rating.ratee?.fullName ?? 'N/A'}
                                                            </div>
                                                            <small className="text-muted">{rating.rater?.email ?? ''}</small>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Rating Type */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`badge ${getRatingTypeBadge(rating.ratingType)} col-sm-12`}>
                                                            {capitalizeFirst(rating.ratingType ?? 'N/A')}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Rating */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-1">
                                                            {renderStars(rating.rating)}
                                                        </div>
                                                        <div className="fw-semibold text-warning">
                                                            {rating.rating}/5
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Review */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small">
                                                            {rating.review ? (
                                                                <>
                                                                    <div className="text-truncate" title={rating.review}>
                                                                        {rating.review.length > 100 ? `${rating.review.substring(0, 100)}...` : rating.review}
                                                                    </div>
                                                                    {rating.review.length > 100 && (
                                                                        <small className="text-primary cursor-pointer">
                                                                            Read more
                                                                        </small>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-muted">No review</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Booking Status */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`badge ${getBookingStatusBadge(rating.booking?.status)} col-sm-12`}>
                                                            {capitalizeFirst(rating.booking?.status ?? 'N/A')}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Date */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">
                                                            {formatDate(rating.createdAt)}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="text-muted py-2 px-1 align-top">
                                                        <div className="btn-group">
                                                            <button className="btn btn-sm px-1 py-0 btn-outline-primary" title="View Rating Details" onClick={() => handleView(rating)}>
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
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}