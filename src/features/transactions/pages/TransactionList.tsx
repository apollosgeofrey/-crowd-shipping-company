// TransactionList.tsx
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import TransactionStatsCards from "./transactionListPartials/TransactionStatsCards.tsx";
import TransactionDetailModal from "./transactionListPartials/TransactionDetailModal.tsx";
import transactionApi, { type TransactionFilters } from "../services/transactionApi.ts";

export default function TransactionList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [metaData, setMetaData] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
    const [filters, setFilters] = useState<TransactionFilters>({search: "", type: "", status: "", purpose: ""});

    // Fetch transactions from API
    useEffect(() => {
        async function fetchTransactions() {
            setIsLoading(true);
            try {
                const response = await transactionApi.getTransactions({page, limit: perPage, ...filters});

                if (response.code === 200) {
                    setTransactions(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                    setMetaData(response.data.meta);
                }
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTransactions();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({ search: "", type: "", status: "", purpose: "" });
        setPage(1);
    };

    // Handle view transaction details
    const handleView = (transaction: any) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
    };

    // Handle export transactions
    const handleExport = async () => {
        try {
            const blob = await transactionApi.exportTransactions(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export transactions:", err);
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
        }).format(amount / 100); // Divide by 100 since amounts are in kobo
    };

    // Get transaction type badge
    const getTypeBadge = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'credit': 'bg-success-subtle text-success',
            'debit': 'bg-danger-subtle text-danger'
        };
        return typeMap[type] || 'bg-secondary text-white';
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'completed': 'bg-success-subtle text-success',
            'pending': 'bg-warning-subtle text-warning',
            'failed': 'bg-danger-subtle text-danger'
        };
        return statusMap[status] || 'bg-secondary-subtle text-secondary';
    };

    // Get purpose badge
    const getPurposeBadge = (purpose: string) => {
        const purposeMap: { [key: string]: string } = {
            'payment': 'bg-primary-subtle text-primary',
            'wallet_funding': 'bg-info-subtle text-info',
            'refund': 'bg-warning-subtle textwarning',
            'transfer': 'bg-secondary-subtle textsecondarye'
        };
        return purposeMap[purpose] || 'bg-secondary text-white';
    };

    // Capitalize first letter
    const capitalizeFirst = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Safe data access functions
    const getSafeValue = (value: any, fallback: string = "N/A") => {
        return value !== undefined && value !== null ? value : fallback;
    };

    const getRelatedEntityInfo = (transaction: any) => {
        if (!transaction?.relatedEntity) return 'Standalone';        
        const entityType = getSafeValue(transaction.relatedEntity.entityType);
        const entityId = getSafeValue(transaction.relatedEntity.entityId);        
        return (entityType && entityId) ? `${capitalizeFirst(entityType)}: ${entityId}` : 'Standalone';
    };

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                            {/* Statistics Cards */}
                            <div className="mb-4">
                                <TransactionStatsCards metaData={metaData} />
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
                                        <input 
                                            type="text"
                                            className="form-control form-control-sm border-1 bg-transparent shadow-lg" 
                                            placeholder="Search reference or description..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange("search", e.target.value)}
                                            style={{ minWidth: "200px" }}
                                        />
                                    </div>

                                    {/* Type Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.type}
                                            onChange={(e) => handleFilterChange("type", e.target.value)}
                                        >
                                            <option value="">All Types</option>
                                            <option value="credit">Credit</option>
                                            <option value="debit">Debit</option>
                                        </select>
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
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>

                                    {/* Purpose Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.purpose}
                                            onChange={(e) => handleFilterChange("purpose", e.target.value)}
                                        >
                                            <option value="">All Purposes</option>
                                            <option value="payment">Payment</option>
                                            <option value="wallet_funding">Wallet Funding</option>
                                            <option value="refund">Refund</option>
                                            <option value="transfer">Transfer</option>
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
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} transactions
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
                                            <th style={{ width: "18%" }} className="py-3">REFERENCE</th>
                                            <th style={{ width: "18%" }} className="py-3">USER & WALLET</th>
                                            <th style={{ width: "8%" }} className="py-3">TYPE</th>
                                            <th style={{ width: "20%" }} className="py-3">DESCRIPTION</th>
                                            <th style={{ width: "15%" }} className="py-3">BALANCE INFO</th>
                                            <th style={{ width: "6%" }} className="py-3">STATUS</th>
                                            <th style={{ width: "12%" }} className="py-3">DATE</th>
                                            <th style={{ width: "5%" }} className="py-3">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-muted py-4">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading transactions...
                                                </td>
                                            </tr>
                                        ) : transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-muted py-4">No transactions found</td>
                                            </tr>
                                        ) : (
                                            transactions.map((transaction, index) => (
                                                <tr key={transaction._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-2 px-1 align-top text-center fw-bold">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Reference */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-primary">
                                                            {transaction?.referenceId ?? 'N/A'}
                                                        </div>
                                                        <small className="text-muted">
                                                            {getRelatedEntityInfo(transaction)}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* User & Wallet */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-0">
                                                            <div className="small">
                                                            	<span className="fw-semibold text-muted me-1">User:</span>
                                                                <span className="float-end">{transaction?.user?.fullName ?? 'N/A'}</span>
                                                            </div>
                                                            <small className="text-muted">
                                                            	<span className="fw-semibold text-muted me-1">Email:</span>
                                                                <span className="float-end">{transaction?.user?.email  ?? 'N/A'}</span>
                                                            </small>
                                                        </div>
                                                        <div>
                                                            <div className="small">
                                                            	<span className="fw-semibold text-muted me-1">Wallet:</span>
                                                                <span className="float-end">{transaction?.wallet?.walletId}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Type */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="mb-0">
                                                            <span className={`badge ${getTypeBadge(transaction.type)} col-sm-12`}>
                                                                <span className="me-2">
                                                                	{(transaction?.type ?? 'unknown').toUpperCase()}:
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="mb-0">
                                                            <span className={`badge ${getPurposeBadge(transaction?.purpose)} col-sm-12`}>
                                                                { (transaction?.purpose) ? transaction?.purpose?.replace(/_/g, ' ')?.toUpperCase() : "N/A" }
                                                            </span>
                                                        </div>                                                        
                                                    </td>
                                                    
                                                    {/* Description */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small">
                                                            <div className="fw-semibold mb-0">
                                                                {transaction?.title ?? 'N/A'}
                                                            </div>
                                                            <div className="text-muted mt-0">
                                                                {transaction?.description ?? ''}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Balance Info */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">                                                        	
                                                            <div className="mb-0">
                                                                <span className="fw-semibold me-1">Before:</span>
                                                                <span className="float-end">{formatCurrency(transaction.previousBalance, transaction.currency)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="fw-semibold me-1">Amount:</span>
                                                                <span className="float-end">{formatCurrency(transaction.amount, transaction.currency)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="fw-semibold me-1">After:</span>
                                                                <span className="float-end">{formatCurrency(transaction.currentBalance, transaction.currency)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Status */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`badge ${getStatusBadge(transaction.status)}`}>
                                                            {capitalizeFirst(transaction?.status || 'unknown')}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Date */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">
                                                            {formatDate(transaction.createdAt)}
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Actions */}
                                                    <td className="text-muted py-2 px-1 align-top">
                                                        <div className="btn-group">
                                                            <button className="btn btn-sm px-1 py-0 btn-outline-primary" title="View Transaction" onClick={() => handleView(transaction)}>
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

                            {/* Transaction Detail Modal */}
                            <TransactionDetailModal show={showModal} onClose={() => setShowModal(false)} transaction={selectedTransaction}/>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}