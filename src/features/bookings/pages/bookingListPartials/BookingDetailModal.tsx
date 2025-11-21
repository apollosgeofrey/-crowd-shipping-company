// BookingDetailModal.tsx

interface BookingDetailModalProps {
  show: boolean;
  onClose: () => void;
  booking: any; // Replace 'any' with your actual booking type
}

export default function BookingDetailModal({ show, onClose, booking }: BookingDetailModalProps) {
    if (!show || !booking) return null;

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number, currency: string = "NGN") => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Booking Details - {booking.bookingRef}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Sender Information</h6>
                                <p><strong>Name:</strong> {booking.sender?.fullName || "N/A"}</p>
                                <p><strong>Email:</strong> {booking.sender?.email || "N/A"}</p>
                                <p><strong>Phone:</strong> {booking.sender?.phoneNumber || "N/A"}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Receiver Information</h6>
                                <p><strong>Name:</strong> {booking.parcelGroup?.receiverName || "N/A"}</p>
                                <p><strong>Phone:</strong> {booking.parcelGroup?.receiverPhone || "N/A"}</p>
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Pathfinder Information</h6>
                                <p><strong>Name:</strong> {booking.traveller?.fullName || "N/A"}</p>
                                <p><strong>Email:</strong> {booking.traveller?.email || "N/A"}</p>
                                <p><strong>Phone:</strong> {booking.traveller?.phoneNumber || "N/A"}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Route Information</h6>
                                <p><strong>From:</strong> {booking.parcelGroup?.pickUpLocation?.address || "N/A"}</p>
                                <p><strong>To:</strong> {booking.parcelGroup?.dropOffLocation?.address || "N/A"}</p>
                                <p><strong>Weight:</strong> {booking.parcelGroup?.weight || "0"} kg</p>
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Financial Information</h6>
                                <p><strong>Total:</strong> {formatCurrency(booking.total, booking.currency)}</p>
                                <p><strong>Subtotal:</strong> {formatCurrency(booking.subtotal, booking.currency)}</p>
                                <p><strong>Fees:</strong> {formatCurrency(booking.fees, booking.currency)}</p>
                                <p><strong>Taxes:</strong> {formatCurrency(booking.taxes, booking.currency)}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Status Information</h6>
                                <p><strong>Booking Status:</strong> {booking.status}</p>
                                <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                                <p><strong>Fleet Type:</strong> {booking.fleetType}</p>
                                <p><strong>Parcel Status:</strong> {booking.parcelGroup?.status || "N/A"}</p>
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Dates</h6>
                                <p><strong>Created:</strong> {formatDate(booking.createdAt)}</p>
                                <p><strong>Updated:</strong> {formatDate(booking.updatedAt)}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-semibold text-muted mb-3">Tracking</h6>
                                <p><strong>Tracking ID:</strong> {booking.parcelGroup?.trackingId || "N/A"}</p>
                                <p><strong>Booking Ref:</strong> {booking.bookingRef}</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}