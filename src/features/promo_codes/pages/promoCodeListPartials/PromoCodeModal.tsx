// PromoCodeModal.tsx
import { useState, useEffect } from "react";
import { userApi } from "../../../users/services/userApi";

interface PromoCodeModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (promoCode: any) => Promise<void>;
    initialData?: any;
}

// Service types options
const SERVICE_TYPES = ["parcel", "road", "air", "maritime", "logistics"];
// const SERVICE_TYPES = ["parcel", "food", "express", "road", "air", "maritime", "logistics"];

// Currency options
const CURRENCIES = ["NGN", "USD", "EUR", "GBP"];

// Tab definitions
const TABS = [
    { id: 'basic', name: 'Basic Info', icon: 'fa-info-circle' },
    { id: 'discount', name: 'Discount & Limits', icon: 'fa-percent' },
    { id: 'targeting', name: 'Targeting & Scope', icon: 'fa-users' },
    { id: 'validity', name: 'Validity & Settings', icon: 'fa-calendar' }
];

export default function PromoCodeModal({ show, onClose, onSave, initialData }: PromoCodeModalProps) {
    const [formData, setFormData] = useState<any>({
        code: "", description: "", promoScope: "all", eligibleUsers: [], type: "percentage", value: 0,
        maxDiscountAmount: "", minDiscountAmount: "", currency: "NGN", maxUsageCount: "", maxUsagePerUser: "",
        minOrderAmount: "", applicableServiceTypes: [], startDate: "", endDate: "", status: "active"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [serverError, setServerError] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // User selection states
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    
    // NEW: Active tab state
    const [activeTab, setActiveTab] = useState<string>('basic');

    // Initialize form data when modal opens or initialData changes
    useEffect(() => {
        if (initialData) {
            // Prefill for edit
            setFormData({
                code: initialData.code || "",
                description: initialData.description || "",
                promoScope: initialData.promoScope || "all",
                eligibleUsers: initialData.eligibleUsers || [],
                type: initialData.type || "percentage",
                value: initialData.value || 0,
                maxDiscountAmount: initialData.maxDiscountAmount || "",
                minDiscountAmount: initialData.minDiscountAmount || "",
                currency: initialData.currency || "NGN",
                maxUsageCount: initialData.maxUsageCount || "",
                maxUsagePerUser: initialData.maxUsagePerUser || "",
                minOrderAmount: initialData.minOrderAmount || "",
                applicableServiceTypes: initialData.applicableServiceTypes || [],
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
                status: initialData.status || "active",
            });
        } else {
            // Reset for create
            setFormData({
                code: "", description: "", promoScope: "all", eligibleUsers: [], type: "percentage", value: 0,
                maxDiscountAmount: "", minDiscountAmount: "", currency: "NGN", maxUsageCount: "", maxUsagePerUser: "",
                minOrderAmount: "", applicableServiceTypes: [], startDate: "", endDate: "", status: "active"
            });
            generatePromoCode();
        }
        setErrors({});
        setServerError("");
        setActiveTab('basic'); // Reset to first tab
        if (show) fetchUsers();
    }, [initialData, show]);

    // Fetch users on component mount
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const res = await userApi.getUsers({ limit: 100, status: 'active' });
            if (res.code === 200 && res.data) setUsers(res.data.items || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Advanced promo code generator function - FIXED
    const generatePromoCode = () => {
        const typePrefixes: Record<string, string[]> = {percentage:['SAVE','OFF','DISCOUNT','PERCENT'], flat:['FLAT','CASHBACK','CREDIT','AMOUNT'], free:['FREE','SHIPFREE','DELIVERFREE','ZERO']};
        
        const currentType = formData.type;
        const prefixes = typePrefixes[currentType] || ['PROMO', 'CODE', 'DEAL', 'OFFER'];
        const suffixes = ['10', '15', '20', '25', '30', '50', 'NOW', '24'];
        
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        // Generate based on discount type context
        let generatedCode = '';
        if (currentType === 'percentage' && formData.value) {
            generatedCode = `SAVE${formData.value}${randomNumber}`;
        } else if (currentType === 'flat' && formData.value) {
            generatedCode = `FLAT${formData.value}${randomNumber}`;
        } else if (currentType === 'free') {
            generatedCode = `FREE${randomSuffix}${randomNumber}`;
        } else {
            generatedCode = `${randomPrefix}${randomSuffix}${randomNumber}`;
        }
        
        setFormData((prev: any) => ({ ...prev, code: generatedCode }));
        if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
    };


    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        (type === 'number') ? setFormData({ ...formData, [name]: value === '' ? '' : Number(value) }) : setFormData({ ...formData, [name]: value });        
        // Clear errors when user starts typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (serverError) setServerError('');
    };

    // Handle promo scope change
    const handlePromoScopeChange = (scope: "all" | "specific") => setFormData((prev: any) => ({ ...prev, promoScope: scope, eligibleUsers: [] }));

    // Handle user selection
    const handleUserSelect = (user: any) => {
        const isSelected = formData.eligibleUsers.includes(user._id);
        
        if (isSelected) {
            // Remove user
            setFormData((prev: any) => ({ ...prev, eligibleUsers: prev.eligibleUsers.filter((id: string) => id !== user._id) }));
        } else {
            // Add user
            setFormData((prev: any) => ({ ...prev, eligibleUsers: [...prev.eligibleUsers, user._id] }));
        }
    };

    // Get selected users details
    const getSelectedUsers = () => users.filter(user => formData.eligibleUsers.includes(user._id));

    // Handle service type change
    const handleServiceTypeChange = (serviceType: string) => {
        setFormData((prev: any) => {
            const currentTypes = prev.applicableServiceTypes || [];
            if (currentTypes.includes(serviceType)) {
                return { ...prev, applicableServiceTypes: currentTypes.filter((type: string) => type !== serviceType) };
            } else {
                return { ...prev, applicableServiceTypes: [...currentTypes, serviceType] };
            }
        });
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Required fields
        if (!formData.code.trim()) newErrors.code = "Promo code is required";
        if (!formData.type) newErrors.type = "Discount type is required";
        if (formData.value === null || formData.value === undefined || formData.value < 0) newErrors.value = "Discount value is required and must be positive";
        if (formData.type === "percentage" && formData.value > 100) newErrors.value = "Percentage discount cannot exceed 100%";

        // Validate eligible users when scope is specific
        if (formData.promoScope === "specific" && formData.eligibleUsers.length === 0) newErrors.eligibleUsers = "At least one eligible user is required when scope is 'Specific Users'";

        // Date validation
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) newErrors.endDate = "End date must be after start date";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Clear previous errors
        setServerError("");
        
        // Client-side validation
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            // Prepare data for API
            const submitData: any = {
                code: formData.code.trim().toUpperCase(),
                description: formData.description.trim(),
                promoScope: formData.promoScope,
                eligibleUsers: formData.eligibleUsers,
                type: formData.type,
                value: Number(formData.value),
                currency: formData.currency,
                status: formData.status
            };

            // Add optional fields only if they have values
            if (formData.maxDiscountAmount) submitData.maxDiscountAmount = Number(formData.maxDiscountAmount);
            if (formData.minDiscountAmount) submitData.minDiscountAmount = Number(formData.minDiscountAmount);
            if (formData.maxUsageCount) submitData.maxUsageCount = Number(formData.maxUsageCount);
            if (formData.maxUsagePerUser) submitData.maxUsagePerUser = Number(formData.maxUsagePerUser);
            if (formData.minOrderAmount) submitData.minOrderAmount = Number(formData.minOrderAmount);
            if (formData.applicableServiceTypes.length > 0) submitData.applicableServiceTypes = formData.applicableServiceTypes;
            if (formData.startDate) submitData.startDate = new Date(formData.startDate + 'T00:00:00.000Z').toISOString();
            if (formData.endDate) submitData.endDate = new Date(formData.endDate + 'T23:59:59.999Z').toISOString();

            // For free type, value should be 0
            if (formData.type === 'free') submitData.value = 0;
            await onSave(submitData);
            onClose();
        } catch (error: any) {
            console.error("Save error:", error);
            
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else if (error.message) {
                setServerError(error.message);
            } else {
                setServerError("Failed to save promo code. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDiscountPlaceholder = () => {
        switch (formData.type) {
            case 'percentage':
                return 'Enter discount percentage (e.g., 10 for 10%)';
            case 'flat':
                return `Enter flat discount amount in ${formData.currency}`;
            case 'free':
                return 'Free delivery (automatically 0)';
            default:
                return 'Enter discount value';
        }
    };

    const isFreeType = formData.type === 'free';
    const isSpecificScope = formData.promoScope === 'specific';
    const selectedUsers = getSelectedUsers();

    // Tab content components
    const renderBasicInfoTab = () => (
        <div className="row">
            {/* Promo Code */}
            <div className="col-sm-12 col-md-8 mb-4">
                <label className="form-label mb-0 fw-semibold small">Promo Code: <span className="text-danger">*</span></label>
                <div className="input-group input-group-lg">
                    <input type="text" name="code" value={formData.code} placeholder="e.g., WELCOME10" onChange={handleChange} disabled={isSubmitting} className={`form-control shadow-lg ${errors.code ? 'is-invalid' : ''}`}/>
                    <button type="button" className="btn btn-outline-primary" onClick={generatePromoCode} disabled={isSubmitting} title="Generate new promo code">
                        <i className="fa fa-refresh"></i>
                    </button>
                </div>
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                <small className="text-muted">
                    Enter a custom code or click the refresh button to generate one automatically
                </small>
            </div>

            {/* Status */}
            <div className="col-sm-12 col-md-4 mb-5">
                <label className="form-label mb-0 fw-semibold small">Status: <span className="text-danger">*</span></label>
                <select className="form-select form-select-lg shadow-lg" name="status" value={formData.status} onChange={handleChange} disabled={isSubmitting}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Description */}
            <div className="col-sm-12 mb-5">
                <label className="form-label mb-0 fw-semibold small">Description: <sup className="text-danger">(Optional)</sup></label>
                <textarea className="form-control form-control-lg shadow-lg" name="description" value={formData.description}
                    placeholder="Enter promo code description" onChange={handleChange} rows={5} disabled={isSubmitting}
                />
            </div>
        </div>
    );

    const renderDiscountLimitsTab = () => (
        <div className="row">
            {/* Currency */}
            <div className="col-sm-12 col-md-2 mb-5">
                <label className="form-label mb-0 fw-semibold small">Currency <span className="text-danger">*</span></label>
                <select name="currency" value={formData.currency} onChange={handleChange} disabled={isSubmitting} className="form-select form-select-lg shadow-lg">
                    {CURRENCIES.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>

            {/* Discount Type */}
            <div className="col-sm-12 col-md-5 mb-5">
                <label className="form-label mb-0 fw-semibold small">Discount Type <span className="text-danger">*</span></label>
                <select name="type" value={formData.type} onChange={handleChange} disabled={isSubmitting} className={`form-select form-select-lg shadow-lg ${errors.type ? 'is-invalid' : ''}`}>
                    <option value="percentage">Percentage Discount</option>
                    <option value="flat">Flat Amount</option>
                    <option value="free">Free Delivery</option>
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
            </div>

            {/* Discount Value */}
            <div className="col-sm-12 col-md-5 mb-5">
                <label className="form-label mb-0 fw-semibold small">Discount Value <span className="text-danger">*</span></label>
                <input type="number" name="value" value={isFreeType ? 0 : formData.value} placeholder={getDiscountPlaceholder()} onChange={handleChange}
                    disabled={isFreeType || isSubmitting} min="0" className={`form-control form-control-lg shadow-lg ${errors.value ? 'is-invalid' : ''}`} step={formData.type === 'percentage' ? '1' : '0.01'}
                />
                {errors.value && <div className="invalid-feedback">{errors.value}</div>}
            </div>

            {/* Max Discount Amount (for percentage) */}
            {formData.type === 'percentage' && (
                <>
                    <div className="mb-5 col-sm-12 col-md-6">
                        <label className="form-label mb-0 fw-semibold small">Min Discount Amount: <span className="text-danger">*</span></label>
                        <input type="number" className="form-control form-control-lg shadow-lg" name="minDiscountAmount" value={formData.minDiscountAmount || 1} placeholder="Min discount amount" onChange={handleChange} disabled={isSubmitting} min="0" step="0.01"/>
                    </div>

                    <div className="mb-5 col-sm-12 col-md-6">
                        <label className="form-label mb-0 fw-semibold small">Max Discount Amount: <sup className="text-danger">(Optional)</sup></label>
                        <input type="number" className="form-control form-control-lg shadow-lg" name="maxDiscountAmount" value={formData.maxDiscountAmount} placeholder="Max discount amount (optional)" onChange={handleChange} disabled={isSubmitting} min="0" step="0.01"/>
                    </div>
                </>
            )}

            {/* Usage Limits */}
            <div className="mb-5 col-sm-12 col-md-4">
                <label className="form-label mb-0 fw-semibold small">Max Total Usage: <sup className="text-danger">(Optional)</sup></label>
                <input type="number" className="form-control form-control-lg shadow-lg" name="maxUsageCount" value={formData.maxUsageCount} placeholder="Leave empty for unlimited" onChange={handleChange} disabled={isSubmitting} min="0"/>
            </div>

            <div className="mb-5 col-sm-12 col-md-4">
                <label className="form-label mb-0 fw-semibold small">Max Usage Per User: <sup className="text-danger">(Optional)</sup></label>
                <input type="number" className="form-control form-control-lg shadow-lg" name="maxUsagePerUser" value={formData.maxUsagePerUser} placeholder="Leave empty for unlimited" onChange={handleChange} disabled={isSubmitting} min="0"/>
            </div>

            <div className="mb-5 col-sm-12 col-md-4">
                <label className="form-label mb-0 fw-semibold small">Minimum Order Amount: <sup className="text-danger">(Optional)</sup></label>
                <input type="number" className="form-control form-control-lg shadow-lg" name="minOrderAmount"  value={formData.minOrderAmount} placeholder={`Minimum order amount in ${formData.currency}`} onChange={handleChange} disabled={isSubmitting} min="0" step="0.01"/>
            </div>
        </div>
    );

    const renderTargetingScopeTab = () => (
        <div className="row">
            {/* Promo Scope */}
            <div className="col-sm-12 mb-5">
                <label className="form-label mb-0 fw-semibold small">Promo Scope <span className="text-danger">*</span></label>
                <div className="d-flex gap-3">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="promoScope" id="scope-all" checked={formData.promoScope === 'all'} onChange={() => handlePromoScopeChange('all')} disabled={isSubmitting}/>
                        <label className="form-check-label small" htmlFor="scope-all">
                            All Users
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="promoScope" id="scope-specific" checked={formData.promoScope === 'specific'} onChange={() => handlePromoScopeChange('specific')} disabled={isSubmitting}/>
                        <label className="form-check-label small" htmlFor="scope-specific">
                            Specific Users
                        </label>
                    </div>
                </div>
            </div>

            {/* User Selection (only show when scope is specific) */}
            {isSpecificScope && (
                <div className="col-sm-12 mb-5">
                    <label className="form-label mb-0 fw-semibold small">
                        Eligible Users <span className="text-danger">*</span>
                        <small className="text-muted ms-1">(Select multiple users)</small>
                    </label>
                    
                    {/* Selected Users Tags */}
                    {selectedUsers.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-2 p-2 border rounded bg-light">
                            {selectedUsers.map(user => (
                                <span key={user._id} className="badge bg-primary d-flex align-items-center gap-1">
                                    {user.fullName || user.email}
                                    <button type="button" className="btn-close btn-close-white" style={{ fontSize: '0.6rem' }} onClick={() => handleUserSelect(user)} disabled={isSubmitting}/>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Search and Dropdown */}
                    <div className="position-relative">
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa fa-search"></i></span>
                            <input type="text" className={`form-control form-control-lg shadow-lg ${errors.eligibleUsers ? 'is-invalid' : ''}`} placeholder="Search users by name or email..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsDropdownOpen(true)} disabled={isSubmitting} />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} disabled={isSubmitting} >
                                <i className={`fa fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                            </button>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="position-absolute w-100 bg-white border rounded mt-1 shadow-lg" style={{ zIndex: 1050, maxHeight: '300px', overflowY: 'auto' }}>
                                {loadingUsers ? (
                                    <div className="p-3 text-center text-muted">
                                        <div className="spinner-border spinner-border-sm me-2"></div> Loading users...
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="p-3 text-center text-muted"> No users found matching "{searchTerm}"</div>
                                ) : (
                                    filteredUsers.map(user => {
                                        const isSelected = formData.eligibleUsers.includes(user._id);
                                        return (
                                            <div key={user._id} className={`px-3 py-1 border-bottom cursor-pointer ${isSelected ? 'bg-success-subtle' : 'hover-bg-light'}`} onClick={() => handleUserSelect(user)} style={{ cursor: 'pointer' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="flex-grow-1">
                                                        <div className="fw-semibold small text-truncate">
                                                            {user.fullName || 'No Name'}
                                                            {isSelected && <i className="fa fa-check text-success ms-2"></i>}
                                                        </div>
                                                        <div className="text-muted small text-truncate">{user.email} | {user.phoneNumber} | {user.userId}</div>
                                                    </div>
                                                    <div className="text-muted small"> {isSelected ? 'Selected' : 'Click to select'} </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {errors.eligibleUsers && <div className="invalid-feedback d-block">{errors.eligibleUsers}</div>}
                    
                    <small className="text-muted">
                        {selectedUsers.length} user(s) selected. Search and click on users to select/deselect them.
                    </small>
                </div>
            )}

            {/* Service Types */}
            <div className="col-sm-12">
                <label className="form-label mb-0 fw-semibold small">Applicable Service Types: <sup className="text-danger">(Optional)</sup></label>
                <div className="border rounded p-2 bg-light">
                    <div className="row">
                        {SERVICE_TYPES.map(serviceType => (
                            <div key={serviceType} className="col-md-4 col-sm-6 mb-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id={`service-${serviceType}`} checked={formData.applicableServiceTypes.includes(serviceType)}
                                        onChange={() => handleServiceTypeChange(serviceType)} disabled={isSubmitting}
                                    />
                                    <label className="form-check-label small text-capitalize" htmlFor={`service-${serviceType}`}>
                                        {serviceType}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    {formData.applicableServiceTypes.length === 0 && (<small className="text-muted">Leave empty to apply to all service types</small>)}
                </div>
            </div>
        </div>
    );

    const renderValiditySettingsTab = () => (
        <div className="row">
            {/* Validity Period */}
            <div className="mb-5 col-sm-12 col-md-6">
                <label className="form-label mb-0 fw-semibold small">Start Date: <span className="text-danger">*</span></label>
                <input type="date" className="form-control form-control-lg shadow-lg" name="startDate"  value={formData.startDate} onChange={handleChange} disabled={isSubmitting}/>
            </div>

            <div className="mb-5 col-sm-12 col-md-6">
                <label className="form-label mb-0 fw-semibold small">End Date: <sup className="text-danger">(Optional)</sup></label>
                <input type="date" className={`form-control form-control-lg shadow-lg ${errors.endDate ? 'is-invalid' : ''}`} name="endDate" 
                    value={formData.endDate} onChange={handleChange} disabled={isSubmitting}
                />
                {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
            </div>

            {/* Additional Settings */}
            <div className="col-sm-12">
                <div className="alert alert-info">
                    <i className="fa fa-info-circle me-2"></i>
                    <small>
                        <strong>Note:</strong> The promo code will automatically expire after the end date. 
                        Set status to "Inactive" to temporarily disable the promo code.
                    </small>
                </div>
            </div>
        </div>
    );

    // Render active tab content
    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return renderBasicInfoTab();
            case 'discount':
                return renderDiscountLimitsTab();
            case 'targeting':
                return renderTargetingScopeTab();
            case 'validity':
                return renderValiditySettingsTab();
            default:
                return renderBasicInfoTab();
        }
    };

    return (
        <>
            {show && (
                <>
                    {/* Backdrop*/}
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content rounded shadow-sm">
                                <div className="modal-header bg-primary-subtle">
                                    <h6 className="modal-title fw-bold text-primary">
                                        {initialData ? (
                                            <><i className="fa fa-edit me-2"></i> Edit Promo Code</>
                                        ) : (
                                            <><i className="fa fa-plus-square me-2"></i> Create New Promo Code</>
                                        )}
                                    </h6>
                                    <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting}></button>
                                </div>

                                <div className="modal-body mx-3 mb-5">
                                    {/* Server Error Alert */}
                                    {serverError && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <i className="fa fa-exclamation-triangle me-2"></i>
                                            <div className="small">{serverError}</div>
                                        </div>
                                    )}

                                    {/* Tab Navigation */}
                                    <div className="mb-5">
                                        <ul className="nav nav-tabs nav-fill">
                                            {TABS.map(tab => (
                                                <li key={tab.id} className="nav-item">
                                                    <button className={`nav-link ${activeTab === tab.id ? 'active fw-bold' : ''} d-flex align-items-center gap-2`} onClick={() => setActiveTab(tab.id)} type="button" disabled={isSubmitting}>
                                                        <i className={`fa ${tab.icon}`}></i>
                                                        <span className="d-none d-sm-inline">{tab.name}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active">
                                            {renderActiveTabContent()}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer bg-primary-subtle d-flex justify-content-between">
                                    <div className="d-flex gap-2"></div>

                                    <div className="d-flex gap-2">
                                        {/* Cancel Button */}
                                        <button className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting}>
                                            <i className="fa fa-times me-1"></i> Cancel
                                        </button>


                                        {/* Save Button */}
                                        <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                                                    {initialData ? "Updating..." : "Creating..."}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-save me-1"></i> 
                                                    {initialData ? "Update" : "Create"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}