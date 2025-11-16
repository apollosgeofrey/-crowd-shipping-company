// RatingDetail.tsx
import { useState, useEffect } from "react";
import ratingApi from "../services/ratingApi.ts";
import { useParams, useNavigate } from "react-router-dom";
import packageImage from "../../../assets/images/package_image.png";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import DriverDetails from "./ratingDetailPartials/DriverDetails.tsx";

export default function RatingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [rating, setRating] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch rating details from API
    useEffect(() => {
        async function fetchRatingDetails() {
            if (!id) {
                setError("Rating ID is required");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await ratingApi.getRatingById(id);
                
                if (response.code === 200) {
                    setRating(response.data);
                } else {
                    setError(response.message || "Failed to fetch rating details");
                }
            } catch (err: any) {
                console.error("Failed to fetch rating details:", err);
                setError(err.message || "An error occurred while fetching rating details");
            } finally {
                setIsLoading(false);
            }
        }

        fetchRatingDetails();
    }, [id]);

    // Handle back navigation
    const handleBack = () => navigate(-1);

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

    // Render star rating
    const renderStars = (ratingValue: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <i key={i} className={`fa fa-star ${i < ratingValue ? "text-warning" : "text-muted"}`}></i>
        ));
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

    // Get payment status badge
    const getPaymentStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'paid': 'bg-success text-white',
            'unpaid': 'bg-warning text-dark',
            'failed': 'bg-danger text-white',
            'refunded': 'bg-info text-white'
        };
        return statusMap[status] || 'bg-secondary text-white';
    };

    // Safe data access function
    const getSafeValue = (value: any, fallback: string = "N/A") => value !== undefined && value !== null ? value : fallback;

    // Loading state
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="row g-3">
                    <div className="col-md-4">
                        <DriverDetails loading={true} />
                    </div>
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm rounded h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold placeholder-glow">
                                        <span className="placeholder col-4"></span>
                                    </h5>
                                    <div className="placeholder-glow">
                                        <span className="placeholder col-2"></span>
                                    </div>
                                </div>
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="mb-3">
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-3"></span>
                                            <span className="placeholder col-9"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <DashboardLayout>
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded">
                            <div className="card-body text-center py-5">
                                <i className="fa fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                                <h4 className="text-danger">Error Loading Rating</h4>
                                <p className="text-muted">{error}</p>
                                <button className="btn btn-primary" onClick={handleBack}>
                                    <i className="fa fa-arrow-left me-2"></i> Back to Ratings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="row g-3">
                {/* Left Sidebar - Rating & User Details */}
                <div className="col-md-4">
                    <DriverDetails rating={rating} />
                </div>

                {/* Right Panel - Booking & Trip Details */}
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm rounded h-100 d-flex flex-column">
                        <div className="card-body">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold">
                                    Booking Details - {getSafeValue(rating?.booking?.bookingRef)}
                                </h5>
                                <button className="btn btn-sm btn-light border-0" onClick={handleBack} title="Go back">
                                    <i className="fa fa-times fa-lg text-dark"></i>
                                </button>
                            </div>

                            <div className="row mb-4">

                            	{/* Delivery Images */}
                                <div className="col-sm-12 col-md-4 text-center">
                                    <p className="fw-semibold text-left mb-2">Delivery Image</p>
                                    <img alt="No image available" className="img-fluid rounded shadow-sm"
                                        style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                                        src={rating?.booking?.deliveredImageUrl || packageImage} 
                                    />
                                </div>

	                            {/* Booking Information */}
	                            <div className="col-sm-12 col-md-8 row">
		                            <div className="row">
		                                <div className="col-md-6">
		                                    <div className="mb-3">
		                                        <p className="fw-semibold mb-1">Booking Status</p>
		                                        <span className={`badge ${getBookingStatusBadge(rating?.booking?.status)} px-3 py-2`}>
		                                            {getSafeValue(rating?.booking?.status)}
		                                        </span>
		                                    </div>
		                                    <div className="mb-3">
		                                        <p className="fw-semibold mb-1">Payment Status</p>
		                                        <span className={`badge ${getPaymentStatusBadge(rating?.booking?.paymentStatus)} px-3 py-2`}>
		                                            {getSafeValue(rating?.booking?.paymentStatus)}
		                                        </span>
		                                    </div>
		                                </div>
		                                <div className="col-md-6">
		                                    <div className="mb-3">
		                                        <p className="fw-semibold mb-1">Total Amount</p>
		                                        <h5 className="text-success">
		                                            {formatCurrency(rating?.booking?.total, rating?.booking?.currency)}
		                                        </h5>
		                                    </div>
		                                    <div className="mb-3">
		                                        <p className="fw-semibold mb-1">Fleet Type</p>
		                                        <span className="text-capitalize">
		                                            {rating?.booking?.fleetType ?? 'N/A'}
		                                        </span>
		                                    </div>
		                                </div>
		                            </div>
	                            </div>
	                        </div>


                            {/* Rating Details */}
                            <div className="bg-light rounded p-3 mb-4">
                                <h6 className="fw-semibold mb-3">
                                    <i className="fa fa-star me-2 text-warning"></i>Rating Details
                                </h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <span className="fw-semibold">Rating:</span>
                                            <div className="mt-1">
                                                {renderStars(rating?.rating || 0)}
                                                <span className="ms-2 fw-bold text-warning">
                                                    {rating?.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-semibold">Rating Type:</span>
                                            <div className="text-capitalize">
                                                {rating?.ratingType ?? 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <span className="fw-semibold">Review:</span>
                                            <div className="mt-1">
                                                {rating?.review ? (
                                                    <p className="mb-0 text-muted">
                                                        <i className="fa fa-quote-left me-1 text-muted"></i>
                                                        {rating.review}
                                                        <i className="fa fa-quote-right ms-1 text-muted"></i>
                                                    </p>
                                                ) : (
                                                    <span className="text-muted">No review provided</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Information */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <p className="fw-semibold mb-2">Timeline</p>
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Booking Created:</span>
                                            <span>{formatDate(rating?.booking?.createdAt)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Last Updated:</span>
                                            <span>{formatDate(rating?.booking?.updatedAt)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Rating Submitted:</span>
                                            <span>{formatDate(rating?.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <p className="fw-semibold mb-2">Financial Details</p>
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Subtotal:</span>
                                            <span>{formatCurrency(rating?.booking?.subtotal, rating?.booking?.currency)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Fees:</span>
                                            <span>{formatCurrency(rating?.booking?.fees, rating?.booking?.currency)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted">Taxes:</span>
                                            <span>{formatCurrency(rating?.booking?.taxes, rating?.booking?.currency)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-light rounded p-3">
                                <h6 className="fw-semibold mb-3">
                                    <i className="fa fa-info-circle me-2"></i>Additional Information
                                </h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <span className="fw-semibold">Rating ID:</span>
                                            <div className="text-muted small font-monospace">
                                                {getSafeValue(rating?._id)}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-semibold">Booking ID:</span>
                                            <div className="text-muted small font-monospace">
                                                {getSafeValue(rating?.bookingId)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <span className="fw-semibold">Rater ID:</span>
                                            <div className="text-muted small font-monospace">
                                                {getSafeValue(rating?.raterId)}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-semibold">Ratee ID:</span>
                                            <div className="text-muted small font-monospace">
                                                {getSafeValue(rating?.rateeId)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}