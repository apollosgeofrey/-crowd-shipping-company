// ResolutionTab.tsx
// import { useState } from "react";

interface ResolutionTabProps {
    report: any;
    onReportUpdate?: (updatedReport: any) => void;
}

export default function ResolutionTab({ report }: ResolutionTabProps) {

    const formatCurrency = (amount: number) => {
        if (amount === undefined || amount === null) return "N/A";
        return new Intl.NumberFormat('en-NG', { 
            style: 'currency', 
            currency: 'NGN', 
            minimumFractionDigits: 2 
        }).format(amount / 100);
    };

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

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    const resolutionOptions = [
        { value: 'refund_issued', label: 'Refund Issued' },
        { value: 'compensation_given', label: 'Compensation Given' },
        { value: 'apology_issued', label: 'Apology Issued' },
        { value: 'service_credit', label: 'Service Credit' },
        { value: 'replacement_sent', label: 'Replacement Sent' },
        { value: 'issue_resolved', label: 'Issue Resolved' },
        { value: 'false_report', label: 'False Report' },
        { value: 'duplicate_report', label: 'Duplicate Report' }
    ];

    return (
        <div className="p-3">
            <div className="row g-3">
                {/* Resolution Status */}
                <div className="col-12">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="fw-semibold mb-3">Resolution Status</h6>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="mb-2">
                                        <strong>Current Status:</strong>
                                        <span className={`badge ms-2 ${getStatusBadge(report.status)}`}>
                                            {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-2">
                                        <strong>Resolution Type:</strong>
                                        <span className="ms-2 text-capitalize">
                                            {report.resolution ? report.resolution.replace(/_/g, ' ') : 'Not specified'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-2">
                                        <strong>Last Updated:</strong>
                                        <span className="ms-2">{formatDate(report.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {report.supportTeam && (
                                <div className="mt-2">
                                    <strong>Handled by:</strong>
                                    <span className="ms-2">{report.supportTeam.fullName}</span>
                                    <small className="text-muted ms-2">({report.supportTeam.email})</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Financial Information */}
                <div className="col-md-6">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="fw-semibold mb-3">Financial Summary</h6>
                            
                            <div className="mb-2 d-flex justify-content-between">
                                <strong>Report Amount:</strong>
                                <span className="text-danger fw-semibold">{formatCurrency(report.reportAmount)}</span>
                            </div>
                            
                            <div className="mb-2 d-flex justify-content-between">
                                <strong>Amount Refunded:</strong>
                                <span className="text-success fw-semibold">{formatCurrency(report.amountRefunded)}</span>
                            </div>
                            
                            <div className="mb-2 d-flex justify-content-between">
                                <strong>Booking Amount:</strong>
                                <span>{formatCurrency(report.booking?.total)}</span>
                            </div>
                            
                            <hr />
                            
                            <div className="mb-2 d-flex justify-content-between">
                                <strong>Net Amount:</strong>
                                <span className="fw-bold">{formatCurrency((report.booking?.total || 0) - (report.amountRefunded || 0))}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resolution Details */}
                <div className="col-md-6">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <h6 className="fw-semibold mb-3">Resolution Details</h6>
                            
                            <div className="mb-3">
                                <label className="form-label fw-semibold mb-0">Select Resolution Type</label>
                                <select className="form-select" defaultValue={report.resolution || ""} disabled={true}>
                                    <option value="">Choose resolution type...</option>
                                    {resolutionOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>

                            
                            <div className="mt-3">
                                <strong>Resolution Notes:</strong>
                                <textarea className="form-control bg-light p-2 rounded small" rows={5} readOnly value={report.resolutionNotes || ''} placeholder="N/A" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}