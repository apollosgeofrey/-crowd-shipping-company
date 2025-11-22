// DetailedReportStats.tsx
import Swal from "sweetalert2";
import { useState } from "react";
import reportApi from "../../services/reportApi.ts";
import userMale from "../../../../assets/images/user_male.png";

interface DetailedReportStatsProps {
    report: any;
    onReportUpdate?: (updatedReport: any) => void;
}

export default function DetailedReportStats({ report, onReportUpdate }: DetailedReportStatsProps) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [resolutionNotes, setResolutionNotes] = useState(report?.resolutionNotes || "");
    const [amountRefunded, setAmountRefunded] = useState(report?.amountRefunded || 0);
    const [resolutionType, setResolutionType] = useState(report?.resolution || "refund_issued");

    // Format currency
    const formatCurrency = (amount: number) => {
        if (amount === undefined || amount === null) return "N/A";
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(amount / 100);
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'});
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Get status badge style
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'bg-warning-subtle text-warning',
            'resolved': 'bg-success-subtle text-success',
            'underReview': 'bg-info-subtle text-info',
            'escalated': 'bg-danger-subtle text-danger',
            'rejected': 'bg-secondary-subtle text-secondary'
        };
        return statusMap[status] || 'bg-light text-dark';
    };

    // Handle status update
    const handleStatusUpdate = async () => {
        if (!report?._id) return;

        setIsUpdating(true);
        try {
            const newStatus = report?.status === 'resolved' ? 'pending' : 'resolved';
            const updateData: any = { status: newStatus };            

            // Only include resolution details if marking as resolved
            if (newStatus === 'resolved') {
                updateData.resolution = resolutionType;
                updateData.resolutionNotes = resolutionNotes;
                if (amountRefunded > 0) updateData.amountRefunded = amountRefunded;
            }

            const response = await reportApi.updateReportStatus(report._id, updateData);
            
            if (response.code === 200) {
                // Notify parent component about the update
                if (onReportUpdate) onReportUpdate(response.data);
                setShowStatusModal(false);
                Swal.fire(`${newStatus === 'resolved'?'Resolved':'Reopened'}`, `Report ${newStatus === 'resolved'?'resolved':'reopened'} successfully!`, "success");
            }
        } catch (err: any) {
            console.error("Failed to update report status:", err);
            Swal.fire("Error", (err?.response?.data?.message || "An error occurred while updating status."), "error");
        } finally {
            setIsUpdating(false);
        }
    };

    // Open status modal with current data
    const openStatusModal = () => {
        setResolutionNotes(report?.resolutionNotes || "");
        setAmountRefunded(report?.amountRefunded || 0);
        setResolutionType(report?.resolution || "refund_issued");
        setShowStatusModal(true);
    };

    return (
        <>
            <div className="card border-0 shadow-sm rounded h-100">
                <div className="card-body">
                    {/* Reporter Information */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <img src={report?.raisedBy?.profile?.profilePicUrl || userMale} alt="Reporter" className="rounded" style={{ width: "70px", height: "70px", objectFit: "cover" }}/>
                        <div>
                            <h6 className="fw-bold text-muted mb-0">Reporter</h6>
                            <h5 className="fw-bold text-primary mb-0">{report?.raisedBy?.fullName || 'N/A'}</h5>
                            <div className="text-muted mb-0 small">{report?.raisedBy?.phoneNumber || ''} || {report?.raisedBy?.email || ''}</div>
                        </div>
                    </div>

                    {/* Report Details */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted mb-0">Report Information</h6>                    
                        <div className="mb-3">
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Report Type:</span>
                                <span className="float-end text-capitalize">{report?.reportType || 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Nature of Report:</span>
                                <span className="float-end">{report?.natureOfReport || 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Status:</span>
                                <span className={`float-end badge ${getStatusBadge(report?.status)}`}>{report?.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Created:</span>
                                <span className="float-end">{report?.createdAt ? formatDate(report.createdAt) : 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Last Updated:</span>
                                <span className="float-end">{report?.updatedAt ? formatDate(report.updatedAt) : 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted mb-0">Financial Details</h6>                    
                        <div className="mb-3">
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Report Amount:</span>
                                <span className="float-end text-danger fw-bold">{report?.reportAmount ? formatCurrency(report.reportAmount) : 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Amount Refunded:</span>
                                <span className="float-end text-success fw-bold">{report?.amountRefunded ? formatCurrency(report.amountRefunded) : 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Booking Amount:</span>
                                <span className="float-end">{report?.booking?.total ? formatCurrency(report.booking.total) : 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Booking Information */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-muted mb-0">Booking Information</h6>                    
                        <div className="mb-3">
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Booking Reference:</span>
                                <span className="float-end">{report?.booking?.bookingRef || 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Booking Status:</span>
                                <span className="float-end text-capitalize">{report?.booking?.status || 'N/A'}</span>
                            </p>
                            <p className="mb-0">
                                <span className="fw-semibold text-primary">Tracking ID:</span>
                                <span className="float-end">{report?.parcelGroup?.trackingId || 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {report?.description && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-muted mb-0">Description</h6>
                            <textarea className="form-control bg-light p-3 rounded small" readOnly value={report.description || ''} placeholder="N/A" />
                        </div>
                    )}

                    {/* Resolution Notes */}
                    {report?.resolutionNotes && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-muted mb-0">Resolution Notes</h6>
                            <div className="bg-light p-3 rounded small">{report.resolutionNotes}</div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4">
                        <div className="gap-2 text-center">
                            {/* Evidence */}
                            {report?.evidence && (
                                <a href={report.evidence} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary fw-semibold mx-1">
                                    View Evidence
                                </a>
                            )}
                            <button className="btn btn-sm btn-outline-primary fw-semibold mx-1" onClick={openStatusModal} disabled={isUpdating}>
                                {isUpdating ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Updating...</>
                                ) : (
                                    report?.status === 'resolved' ? 'Reopen Report' : 'Mark as Resolved'
                                )}
                            </button>
                            {/*<button className="btn btn-sm btn-outline-secondary fw-semibold mx-1">Escalate to Manager</button>*/}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {report?.status === 'resolved' ? 'Reopen Report' : 'Resolve Report'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowStatusModal(false)}
                                    disabled={isUpdating}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {report?.status !== 'resolved' && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Resolution Type</label>
                                            <select className="form-select" value={resolutionType} onChange={(e) => setResolutionType(e.target.value)} disabled={isUpdating}>
                                                <option value="refund_issued">Refund Issued</option>
                                                <option value="compensation_given">Compensation Given</option>
                                                <option value="issue_fixed">Issue Fixed</option>
                                                <option value="apology_issued">Apology Issued</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Amount Refunded (₦)</label>
                                            <input type="number" className="form-control" value={amountRefunded} onChange={(e) => setAmountRefunded(parseFloat(e.target.value) || 0)} disabled={isUpdating} step="0.01" min="0"/>
                                            <div className="form-text">
                                                Enter the amount to be refunded in Naira
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Resolution Notes</label>
                                            <textarea className="form-control" rows={4} value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} disabled={isUpdating} placeholder="Add notes about how this report was resolved..."/>
                                        </div>
                                    </>
                                )}
                                
                                {report?.status === 'resolved' && (
                                    <div className="alert alert-warning">
                                        <i className="fa fa-exclamation-triangle me-2"></i>
                                        Are you sure you want to reopen this report? This will change the status back to pending.
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowStatusModal(false)} disabled={isUpdating}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-sm btn-primary" onClick={handleStatusUpdate} disabled={isUpdating} >
                                    {isUpdating ? (
                                        <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Updating...</>
                                    ) : (
                                        report?.status === 'resolved' ? 'Reopen Report' : 'Resolve Report'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}