// PromoCodeList.tsx
import Swal from "sweetalert2";
// import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import PaginationBar from "../../../components/PaginationBar.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import PromoCodeStatsCards from "./promoCodeListPartials/PromoCodeStatsCards.tsx";
import PromoCodeModal from "./promoCodeListPartials/PromoCodeModal.tsx";
import promoCodeApi, { type PromoCodeFilters } from "../services/promoCodeApi.ts";

export default function PromoCodeList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [metaData, setMetaData] = useState<any>(null);
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [editPromoCode, setEditPromoCode] = useState<any | null>(null);
    const [filters, setFilters] = useState<PromoCodeFilters>({search:"",type:"",status:"",promoScope:"",currency:""});

    // Extract the fetch function so it can be reused
	const fetchPromoCodes = async () => {
	    setIsLoading(true);
	    try {
	        const response = await promoCodeApi.getPromoCodes({page, limit: perPage, ...filters});
	        if (response.code === 200) {
	            setPromoCodes(response.data.items);
	            setTotalPages(response.data.meta.totalPages);
	            setTotalItems(response.data.meta.total);
	            setMetaData(response.data.meta);
	        }
	    } catch (err) {
	        console.error("Failed to fetch promo codes:", err);
	        Swal.fire({title: 'Error!', text: 'Failed to load promo codes', icon: 'error', confirmButtonText: 'OK'});
	    } finally {
	        setIsLoading(false);
	    }
	};

    // Fetch promo codes from API
    useEffect(() => {
	    fetchPromoCodes();
	}, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: keyof PromoCodeFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({search:"", type:"", status:"", promoScope:"", currency:""});
        setPage(1);
    };

    // Handle add promo code
    const handleAdd = () => {
        setEditPromoCode(null);
        setShowModal(true);
    };

    // Handle edit promo code
    const handleEdit = (promoCode: any) => {
        setEditPromoCode(promoCode);
        setShowModal(true);
    };

    // NEW: Format eligible users count
    const formatEligibleUsers = (promoCode: any) => {
        if (promoCode.promoScope === 'all') return 'All Users';
        const eligibleCount = promoCode.eligibleUsers?.length || 0;
        return `${eligibleCount} User${eligibleCount !== 1 ? 's' : ''}`;
    };

    // Handle save promo code
    const handleSave = async (data: any): Promise<void> => {
        try {
            if (editPromoCode) {
                // Update existing
                const response = await promoCodeApi.updatePromoCode(editPromoCode._id, data);
                if (response.code === 200 || response.code === 201) {
                    fetchPromoCodes();
                    Swal.fire({title: 'Success!', text: 'Promo code updated successfully', icon: 'success', confirmButtonText: 'OK'});
                    setShowModal(false); 
                    setEditPromoCode(null); // Clear edit data
                }
            } else {
                // Create new
                const response = await promoCodeApi.createPromoCode(data);
                if (response.code === 200 || response.code === 201) {
                    fetchPromoCodes();
                    Swal.fire({title: 'Success!', text: 'Promo code created successfully', icon: 'success', confirmButtonText: 'OK'});
                    setShowModal(false); 
                };
            }
        } catch (err) {
            console.error("Failed to save promo code:", err);
            Swal.fire({ title:'Error!', text:((err as any)?.response?.data?.message || 'Failed to save promo code'), icon:'error', confirmButtonText:'OK' });
            throw err;
        }
    };

    // Handle delete promo code
    const handleDelete = async (promoCode: any) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete promo code "${promoCode.code}". This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await promoCodeApi.deletePromoCode(promoCode._id);
                setPromoCodes(promoCodes.filter(pc => pc._id !== promoCode._id));
                Swal.fire("Deleted!", "The promo code has been removed.", "success");
            } catch (err) {
                console.error("Failed to delete promo code:", err);
                Swal.fire("Error!", "Failed to delete promo code.", "error");
            }
        }
    };

    // Format date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "No limit";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'active': 'bg-success-subtle text-success',
            'inactive': 'bg-secondary-subtle text-secondary',
            'expired': 'bg-danger-subtle text-danger'
        };
        return statusMap[status] || 'bg-secondary-subtle text-secondary';
    };

    // Get type badge
    const getTypeBadge = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'percentage': 'bg-primary-subtle text-primary',
            'flat': 'bg-info-subtle text-info',
            'free': 'bg-warning-subtle text-warning'
        };
        return typeMap[type] || 'bg-secondary-subtle text-secondary';
    };

    // NEW: Get scope badge
    const getScopeBadge = (scope: string) => {
        const scopeMap: { [key: string]: string } = {
            'all': 'bg-success-subtle text-success',
            'specific': 'bg-warning-subtle text-warning'
        };
        return scopeMap[scope] || 'bg-secondary-subtle text-secondary';
    };

    // Format discount value
    const formatDiscount = (promoCode: any) => {
        switch (promoCode.type) {
            case 'percentage':
            	return (<>{promoCode.value}% {promoCode.maxDiscountAmount && (<small className=''>{' '}- (Min: {promoCode.minDiscountAmount} - Max: {promoCode.maxDiscountAmount})</small>)}</>);
            case 'flat':
                return `${promoCode.value} flat - (${promoCode.currency})`;
            case 'free':
                return 'Free';
            default:
                return `${promoCode.value}`;
        }
    };

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                            {/* Statistics Cards */}
                            <div className="mb-4">
                                <PromoCodeStatsCards metaData={metaData} loading={isLoading} />
                            </div>

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className="fw-bold mb-1">Promo Codes</h5>
                                    <p className="text-muted small mb-0">Manage promotional codes and discounts</p>
                                </div>
                                <button className="btn btn-primary btn-sm fw-semibold px-4 rounded d-flex align-items-center gap-2" onClick={handleAdd}>
                                    <i className="fa fa-plus"></i> Create Promo Code
                                </button>
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
                                            placeholder="Search promo codes..."
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
                                            <option value="percentage">Percentage</option>
                                            <option value="flat">Flat</option>
                                            <option value="free">Free</option>
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
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="expired">Expired</option>
                                        </select>
                                    </div>

                                    {/* NEW: Promo Scope Filter */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select 
                                            className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                            style={{ width: "auto" }}
                                            value={filters.promoScope}
                                            onChange={(e) => handleFilterChange("promoScope", e.target.value)}
                                        >
                                            <option value="">All Scopes</option>
                                            <option value="all">All Users</option>
                                            <option value="specific">Specific Users</option>
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
                                        Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems} promo codes
                                    </span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0 table-sm table-striped">
                                    <thead className="table-light small">
                                        <tr>
                                            <th style={{ width: "2%" }} className="py-3">#</th>
                                            <th style={{ width: "12%" }} className="py-3">PROMO CODE</th>
                                            <th style={{ width: "12%" }} className="py-3">DESCRIPTION</th>
                                            <th style={{ width: "7%" }} className="py-3">TYPE</th>
                                            <th style={{ width: "12%" }} className="py-3">DISCOUNT</th>
                                            <th style={{ width: "8%" }} className="py-3">SCOPE</th>
                                            <th style={{ width: "10%" }} className="py-3">USAGE</th>
                                            <th style={{ width: "10%" }} className="py-3">VALIDITY</th>
                                            <th style={{ width: "7%" }} className="py-3">STATUS</th>
                                            <th style={{ width: "10%" }} className="py-3">CREATED</th>
                                            <th style={{ width: "6%" }} className="py-3">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={10} className="text-muted py-4 text-center">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading promo codes...
                                                </td>
                                            </tr>
                                        ) : promoCodes.length === 0 ? (
                                            <tr>
                                                <td colSpan={10} className="text-muted py-4 text-center">
                                                    No promo codes found
                                                </td>
                                            </tr>
                                        ) : (
                                            promoCodes.map((promoCode, index) => (
                                                <tr key={promoCode._id}>
                                                    {/* Sequential Number */}
                                                    <td className="text-muted py-2 px-1 fw-bold align-top">
                                                        {(page - 1) * perPage + index + 1}
                                                    </td>
                                                    
                                                    {/* Promo Code */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-primary">
                                                            {promoCode.code}
                                                        </div>
                                                        <small className="text-muted">
                                                            Min order: {promoCode.minOrderAmount || 'None'}
                                                        </small>
                                                    </td>
                                                    
                                                    {/* Description */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small">
                                                            {promoCode.description || 'N/A'}
                                                        </div>
                                                        {promoCode.applicableServiceTypes && promoCode.applicableServiceTypes.length > 0 && (
                                                            <small className="text-muted">
                                                                Services: {promoCode.applicableServiceTypes.join(', ')}
                                                            </small>
                                                        )}
                                                    </td>
                                                    
                                                    {/* Type */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`badge ${getTypeBadge(promoCode.type)} col-sm-12`}>
                                                            {promoCode.type.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    
                                                    {/* Discount */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="fw-semibold text-success">
                                                            {formatDiscount(promoCode)}
                                                        </div>
                                                    </td>

                                                    {/* NEW: Scope */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`badge ${getScopeBadge(promoCode.promoScope)} mb-1 col-sm-12`}>
                                                            {formatEligibleUsers(promoCode)}
                                                        </span>
                                                        {promoCode.promoScope === 'specific' && promoCode.eligibleUsersDetails && promoCode.eligibleUsersDetails.length > 0 && (
                                                            <small className="text-muted">
                                                                {promoCode.eligibleUsersDetails.slice(0, 2).map((user: any) => user.fullName).join(', ')}
                                                                {promoCode.eligibleUsersDetails.length > 2 && '...'}
                                                            </small>
                                                        )}
                                                    </td>
                                                    
                                                    {/* Usage */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">
                                                            <div>Used: {promoCode.usedCount}</div>
                                                            <div>Max: {promoCode.maxUsageCount || '∞'}</div>
                                                            <div>Per user: {promoCode.maxUsagePerUser || '∞'}</div>
                                                        </div>
                                                    </td>
                                                        
                                                    {/* Validity */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">
                                                            <div>From: {formatDate(promoCode.startDate)}</div>
                                                            <div>To: {formatDate(promoCode.endDate)}</div>
                                                        </div>
                                                    </td>
                                                        
                                                    {/* Status */}
                                                    <td className="py-2 px-1 align-top">
                                                        <span className={`badge ${getStatusBadge(promoCode.status)}`}>
                                                             {promoCode.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                        
                                                    {/* Created Date */}
                                                    <td className="py-2 px-1 align-top">
                                                        <div className="small text-muted">
                                                            {formatDate(promoCode.createdAt)}
                                                        </div>
                                                        <small className="text-muted">
                                                            By: {promoCode.createdByUser?.fullName}
                                                        </small>
                                                    </td>
                                                        
                                                    {/* Actions */}
                                                    <td className="text-muted py-2 px-1 align-top">
                                                        <div className="btn-group">
                                                            <button className="btn btn-sm px-2 py-1 btn-outline-primary" title="Edit Promo Code" onClick={() => handleEdit(promoCode)}>
                                                                <i className="fa fa-edit small"></i>
                                                            </button>
                                                            <button className="btn btn-sm px-2 py-1 btn-outline-danger" title="Delete Promo Code" onClick={() => handleDelete(promoCode)}>
                                                                <i className="fa fa-trash small"></i>
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

                            {/* Modal */}
                            <PromoCodeModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={editPromoCode}/>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}