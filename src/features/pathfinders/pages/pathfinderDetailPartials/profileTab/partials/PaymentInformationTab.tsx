export default function PaymentInformationTab({ pathfinder }: {props: any}) {
    
    const wallet = pathfinder?.wallet || {};
    const paymentInfo = wallet?.wallet || {
        accountName: wallet?.accountName,
        accountNumber: wallet?.accountNumber,
        bankName: wallet?.bankName        
    };

    // Format currency values
    const formatCurrency = (amount: number = 0) => `₦${amount.toLocaleString()}`;

    // Get wallet status badge color
    const getWalletStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'suspended': return 'danger';
            case 'pending': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <>
            {/* Wallet Balance Section */}
            <div className="row g-0 mb-4">
                <div className="col-12">
                    <h5 className="fw-semibold mb-3 text-primary">💰 Wallet Information</h5>
                </div>
                
                {/* Total Balance */}
                <div className="col-md-3">
                    <p className="fw-semibold mb-0">Total Balance</p>
                    <p className="fs-5 fw-bold text-success">{formatCurrency(wallet?.balance)}</p>
                </div>

                {/* Available Balance */}
                <div className="col-md-3">
                    <p className="fw-semibold mb-0">Available Balance</p>
                    <p className="fs-6 text-dark">{formatCurrency(wallet?.availableBalance)}</p>
                </div>

                {/* Locked Funds */}
                <div className="col-md-3">
                    <p className="fw-semibold mb-0">Locked Funds</p>
                    <p className="fs-6 text-warning">{formatCurrency(wallet?.lockedFund)}</p>
                </div>

                {/* Wallet Status */}
                <div className="col-md-3">
                    <p className="fw-semibold mb-0">Wallet Status</p>
                    <span className={`badge bg-${getWalletStatusColor(wallet?.status)}`}>
                        {wallet?.status ? wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1) : 'Unknown'}
                    </span>
                </div>
            </div>

            <hr className="my-4" />

            {/* Bank Account Section */}
            <div className="row g-0">
                <div className="col-12">
                    <h5 className="fw-semibold mb-3 text-primary">🏦 Bank Account Details</h5>
                </div>

                {/* Bank Name */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Bank Name</p>
                    <p className="text-muted">{paymentInfo.bankName || wallet?.bankName || "Not specified"}</p>
                </div>

                {/* Account Holder */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Account Holder</p>
                    <p className="text-muted">{paymentInfo.accountName || wallet?.accountName || "Not specified"}</p>
                </div>

                <div className="col-12">
                    <hr className="my-2" />
                </div>

                {/* Account Number */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Account Number</p>
                    <p className="text-muted font-monospace">{paymentInfo.accountNumber || wallet?.accountNumber || "Not specified"}</p>
                </div>

                {/* Account Type */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-0">Account Type</p>
                    <p className="text-muted">{paymentInfo.bankName ? "Savings" : "Not specified"}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="row mt-4 pt-3 border-top">
                <div className="col-12">
                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-outline-primary btn-sm" disabled={!wallet?.accountNumber}>
                            📋 Copy Account Details
                        </button>
                        <button className="btn btn-primary btn-sm" disabled={!wallet?.accountNumber}>
                            ✏️ Edit Bank Details
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}