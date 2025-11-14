// pages/users/tabs/PaymentInformationTab.tsx

interface Props {
    company: any;
    onCompanyUpdate?: (updatedCompany: any) => void;
}

export default function PaymentInformationTab({ company }: Props) {
    // Extract payment and wallet information
    const wallet = company?.wallet || {};
    const paymentInfo = company?.paymentInfo || {
        accountName: company?.accountName,
        accountNumber: company?.accountNumber,
        bankName: company?.bankName,
        bankCode: company?.bankCode
    };

    // Format currency values
    const formatCurrency = (amount: number = 0) => `₦${amount.toLocaleString()}`;

    // Get wallet status badge color
    const getWalletStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'suspended': return 'danger';
            case 'pending': return 'warning';
            case 'verified': return 'success';
            case 'unverified': return 'secondary';
            default: return 'secondary';
        }
    };

    // Handle copy account details
    const handleCopyAccountDetails = () => {
        const accountDetails = `Bank: ${paymentInfo.bankName || ''}\nAccount Name: ${paymentInfo.accountName || ''}\nAccount Number: ${paymentInfo.accountNumber || ''}`;
        navigator.clipboard.writeText(accountDetails);
        // You can add a toast notification here
        alert("Account details copied to clipboard!");
    };

    // Handle edit bank details
    const handleEditBankDetails = () => {
        // Implement edit functionality
        alert("Edit bank details functionality coming soon!");
    };

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                {/* Company Wallet Section */}
                <div className="row g-0 mb-4">
                    <div className="col-12">
                        <h5 className="fw-semibold mb-3 text-primary">
                            <i className="fa fa-wallet me-2"></i> Company Wallet Information
                        </h5>
                    </div>
                    
                    {/* Total Balance */}
                    <div className="col-md-3 col-6">
                        <p className="fw-semibold mb-1 small">Total Balance</p>
                        <p className="fs-5 fw-bold text-success">{formatCurrency(wallet?.balance)}</p>
                    </div>

                    {/* Available Balance */}
                    <div className="col-md-3 col-6">
                        <p className="fw-semibold mb-1 small">Available Balance</p>
                        <p className="fs-6 text-dark">{formatCurrency(wallet?.availableBalance)}</p>
                    </div>

                    {/* Locked Funds */}
                    <div className="col-md-3 col-6">
                        <p className="fw-semibold mb-1 small">Locked Funds</p>
                        <p className="fs-6 text-warning">{formatCurrency(wallet?.lockedFund)}</p>
                    </div>

                    {/* Wallet Status */}
                    <div className="col-md-3 col-6">
                        <p className="fw-semibold mb-1 small">Wallet Status</p>
                        <span className={`badge bg-${getWalletStatusColor(wallet?.status)}`}>
                            {wallet?.status ? wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1) : 'Not Setup'}
                        </span>
                    </div>
                </div>

                <hr className="my-4" />

                {/* Bank Account Section */}
                <div className="row g-0">
                    <div className="col-12">
                        <h5 className="fw-semibold mb-3 text-primary">
                            <i className="fa fa-university me-2"></i> Company Bank Account Details
                        </h5>
                    </div>

                    {/* Bank Name */}
                    <div className="col-md-6 mb-3">
                        <p className="fw-semibold mb-1 small">Bank Name</p>
                        <p className="text-muted">{paymentInfo.bankName || wallet?.bankName || "Not specified"}</p>
                    </div>

                    {/* Account Holder */}
                    <div className="col-md-6 mb-3">
                        <p className="fw-semibold mb-1 small">Account Holder</p>
                        <p className="text-muted">{paymentInfo.accountName || wallet?.accountName || company?.name || "Not specified"}</p>
                    </div>

                    {/* Account Number */}
                    <div className="col-md-6 mb-3">
                        <p className="fw-semibold mb-1 small">Account Number</p>
                        <p className="text-muted font-monospace">
                            {paymentInfo.accountNumber || wallet?.accountNumber || "Not specified"}
                        </p>
                    </div>

                    {/* Account Type */}
                    <div className="col-md-6 mb-3">
                        <p className="fw-semibold mb-1 small">Account Type</p>
                        <p className="text-muted">{paymentInfo.accountType || "Corporate"}</p>
                    </div>

                    {/* Bank Code */}
                    <div className="col-md-6 mb-3">
                        <p className="fw-semibold mb-1 small">Bank Code</p>
                        <p className="text-muted">{paymentInfo.bankCode || wallet?.bankCode || "Not specified"}</p>
                    </div>

                    {/* Verification Status */}
                    <div className="col-md-6 mb-3">
                        <p className="fw-semibold mb-1 small">Verification Status</p>
                        <span className={`badge bg-${getWalletStatusColor(paymentInfo.verificationStatus)}`}>
                            {paymentInfo.verificationStatus ? paymentInfo.verificationStatus.charAt(0).toUpperCase() + paymentInfo.verificationStatus.slice(1) : 'Not Verified'}
                        </span>
                    </div>
                </div>

                {/* Additional Payment Information */}
                <div className="row g-0 mt-3">
                    <div className="col-12">
                        <h6 className="fw-semibold mb-3 text-secondary">
                            <i className="fa fa-info-circle me-2"></i> Additional Information
                        </h6>
                    </div>

                    {/* Payment Method */}
                    <div className="col-md-6 mb-2">
                        <p className="fw-semibold mb-1 small">Default Payment Method</p>
                        <p className="text-muted">Bank Transfer</p>
                    </div>

                    {/* Settlement Frequency */}
                    <div className="col-md-6 mb-2">
                        <p className="fw-semibold mb-1 small">Settlement Frequency</p>
                        <p className="text-muted">Weekly</p>
                    </div>

                    {/* Last Settlement */}
                    <div className="col-md-6 mb-2">
                        <p className="fw-semibold mb-1 small">Last Settlement</p>
                        <p className="text-muted">
                            {wallet?.lastSettlement ? 
                                new Date(wallet.lastSettlement).toLocaleDateString() : 
                                "No settlements yet"
                            }
                        </p>
                    </div>

                    {/* Next Settlement */}
                    <div className="col-md-6 mb-2">
                        <p className="fw-semibold mb-1 small">Next Settlement</p>
                        <p className="text-muted">
                            {wallet?.nextSettlement ? 
                                new Date(wallet.nextSettlement).toLocaleDateString() : 
                                "Not scheduled"
                            }
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="row mt-4 pt-3 border-top">
                    <div className="col-12">
                        <div className="d-flex gap-2 justify-content-end">
                            <button 
                                className="btn btn-outline-primary btn-sm" 
                                disabled={!paymentInfo.accountNumber}
                                onClick={handleCopyAccountDetails}
                            >
                                <i className="fa fa-copy me-1"></i> Copy Account Details
                            </button>
                            <button 
                                className="btn btn-primary btn-sm" 
                                disabled={!paymentInfo.accountNumber}
                                onClick={handleEditBankDetails}
                            >
                                <i className="fa fa-edit me-1"></i> Edit Bank Details
                            </button>
                            <button className="btn btn-success btn-sm">
                                <i className="fa fa-refresh me-1"></i> Refresh Balance
                            </button>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {!paymentInfo.accountNumber && !wallet?.accountNumber && (
                    <div className="text-center py-4 mt-3 border rounded bg-light">
                        <i className="fa fa-university fa-2x text-muted mb-3"></i>
                        <h6 className="text-muted">No Payment Information</h6>
                        <p className="text-muted small mb-3">
                            This company hasn't set up their payment information yet.
                        </p>
                        <button className="btn btn-primary btn-sm">
                            <i className="fa fa-plus me-1"></i> Setup Payment Information
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}