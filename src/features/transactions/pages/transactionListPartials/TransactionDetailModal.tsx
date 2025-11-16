import { useEffect } from "react";
import { X } from "lucide-react";

interface TransactionDetailModalProps {
    show: boolean;
    onClose: () => void;
    transaction?: any;
}

export default function TransactionDetailModal({ show, onClose, transaction }: TransactionDetailModalProps) {
    useEffect(() => {
        if (show) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }, [show]);

    // Format currency
    const formatCurrency = (amount: number, currency: string = "NGN") => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount / 100); // Divide by 100 since amounts are in kobo
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge class
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'completed': 'bg-success text-white',
            'pending': 'bg-warning text-dark',
            'failed': 'bg-danger text-white'
        };
        return statusMap[status] || 'bg-secondary text-white';
    };

    // Get type badge class
    const getTypeBadge = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'credit': 'bg-success text-white',
            'debit': 'bg-danger text-white'
        };
        return typeMap[type] || 'bg-secondary text-white';
    };

    // Capitalize first letter
    const capitalizeFirst = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    if (!show || !transaction) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>

            <div className="modal fade show d-block" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-4 border-0 shadow">
                        {/* Header */}
                        <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                            {/* Left aligned text */}
                            <h5 className="fw-bold mb-0">
                                Transaction Details - {transaction.referenceId}
                            </h5>

                            {/* Right aligned close button */}
                            <button className="btn btn-sm border-0 text-muted" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            {/* Transaction Overview */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="card border-0 bg-light">
                                        <div className="card-body">
                                            <h6 className="fw-bold text-muted mb-2">Transaction Overview</h6>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted">Amount:</span>
                                                <span className={`fw-bold ${transaction.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                                                    {formatCurrency(transaction.amount, transaction.currency)}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted">Type:</span>
                                                <span className={`badge ${getTypeBadge(transaction.type)}`}>
                                                    {capitalizeFirst(transaction.type)}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted">Status:</span>
                                                <span className={`badge ${getStatusBadge(transaction.status)}`}>
                                                    {capitalizeFirst(transaction.status)}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">Purpose:</span>
                                                <span className="fw-semibold">
                                                    {transaction.purpose ? transaction.purpose.replace('_', ' ').toUpperCase() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card border-0 bg-light">
                                        <div className="card-body">
                                            <h6 className="fw-bold text-muted mb-2">Balance Information</h6>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted">Previous Balance:</span>
                                                <span className="fw-semibold">
                                                    {formatCurrency(transaction.previousBalance, transaction.currency)}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-muted">Transaction Amount:</span>
                                                <span className={`fw-semibold ${transaction.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                                                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">Current Balance:</span>
                                                <span className="fw-bold text-primary">
                                                    {formatCurrency(transaction.currentBalance, transaction.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User & Wallet Information */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="card border-0">
                                        <div className="card-body">
                                            <h6 className="fw-bold text-muted mb-2">
                                                <i className="fa fa-user me-2"></i>User Information
                                            </h6>
                                            {transaction.user ? (
                                                <>
                                                    <p className="mb-1"><strong>Name:</strong> {transaction.user.fullName || 'N/A'}</p>
                                                    <p className="mb-1"><strong>Email:</strong> {transaction.user.email || 'N/A'}</p>
                                                    <p className="mb-1"><strong>Phone:</strong> {transaction.user.phoneNumber || 'N/A'}</p>
                                                    <p className="mb-0"><strong>User ID:</strong> {transaction.user.userId || 'N/A'}</p>
                                                </>
                                            ) : (
                                                <p className="text-muted">No user information available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card border-0">
                                        <div className="card-body">
                                            <h6 className="fw-bold text-muted mb-2">
                                                <i className="fa fa-wallet me-2"></i>Wallet Information
                                            </h6>
                                            {transaction.wallet ? (
                                                <>
                                                    <p className="mb-1"><strong>Wallet ID:</strong> {transaction.wallet.walletId || 'N/A'}</p>
                                                    <p className="mb-1"><strong>Currency:</strong> {transaction.currency || 'NGN'}</p>
                                                    <p className="mb-0"><strong>Current Balance:</strong> {formatCurrency(transaction.currentBalance, transaction.currency)}</p>
                                                </>
                                            ) : (
                                                <p className="text-muted">No wallet information available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="card border-0 mb-4">
                                <div className="card-body">
                                    <h6 className="fw-bold text-muted mb-2">Transaction Details</h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p className="mb-2"><strong>Title:</strong> {transaction.title || 'N/A'}</p>
                                            <p className="mb-2"><strong>Reference ID:</strong> {transaction.referenceId || 'N/A'}</p>
                                            <p className="mb-2"><strong>Transaction ID:</strong> {transaction._id || 'N/A'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-2"><strong>Created:</strong> {formatDate(transaction.createdAt)}</p>
                                            <p className="mb-2"><strong>Updated:</strong> {formatDate(transaction.updatedAt)}</p>
                                            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                                                <p className="mb-0"><strong>Metadata:</strong> Available</p>
                                            )}
                                        </div>
                                    </div>
                                    {transaction.description && (
                                        <div className="mt-3">
                                            <p className="text-muted mt-1 mb-0">
                                            	<strong>Description:</strong> {transaction.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Related Entity Information */}
                            {transaction.relatedEntity && (
                                <div className="card border-0">
                                    <div className="card-body">
                                        <h6 className="fw-bold text-muted mb-2">Related Entity</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="mb-2"><strong>Entity Type:</strong> {capitalizeFirst(transaction.relatedEntity.entityType)}</p>
                                                <p className="mb-0"><strong>Entity ID:</strong> {transaction.relatedEntity.entityId}</p>
                                            </div>
                                            <div className="col-md-6">
                                                {transaction.relatedEntity.description && (
                                                    <p className="mb-0"><strong>Description:</strong> {transaction.relatedEntity.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Metadata (if available) */}
                            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                                <div className="card border-0 mt-4">
                                    <div className="card-body">
                                        <h6 className="fw-bold text-muted mb-2">Additional Metadata</h6>
                                        <div className="bg-light p-3 rounded">
                                            <pre className="mb-0 small">
                                                {JSON.stringify(transaction.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0">
                            <button className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}