// PromoCodeModal.tsx
import { useState, useEffect } from "react";

interface PromoCodeModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (promoCode: any) => Promise<void>; // Changed to async
    initialData?: any;
}

// Service types options
const SERVICE_TYPES = ["parcel","food", "express","road","air","maritime","logistics"];

export default function PromoCodeModal({ show, onClose, onSave, initialData }: PromoCodeModalProps) {
    const [formData, setFormData] = useState<any>({code:"",description:"",type:"percentage",value: 0,maxDiscountAmount:"",minDiscountAmount:"",maxUsageCount:"",maxUsagePerUser:"",minOrderAmount:"",applicableServiceTypes: [],startDate:"",endDate:"",status:"active"});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string>("");

    // Initialize form data when modal opens or initialData changes
    useEffect(() => {
        if (initialData) {
            // Prefill for edit
            setFormData({
                code: initialData.code || "",
                description: initialData.description || "",
                type: initialData.type || "percentage",
                value: initialData.value || 0,
                maxDiscountAmount: initialData.maxDiscountAmount || "",
                minDiscountAmount: initialData.minDiscountAmount || "",
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
            setFormData({code:"",description:"",type: "percentage",value: 0,maxDiscountAmount:"",minDiscountAmount:"",maxUsageCount:"",maxUsagePerUser:"",minOrderAmount:"",applicableServiceTypes: [],startDate:"",endDate:"",status:"active"});
        }
        setErrors({});
        setServerError("");
    }, [initialData, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        (type === 'number') ? setFormData({ ...formData, [name]: value === '' ? '' : Number(value) }) :setFormData({ ...formData, [name]: value });        
        // Clear errors when user starts typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (serverError) setServerError('');
    };

    const handleServiceTypeChange = (serviceType: string) => {
        setFormData(prev => {
            const currentTypes = prev.applicableServiceTypes || [];
            if (currentTypes.includes(serviceType)) {
                return {...prev, applicableServiceTypes: currentTypes.filter(type => type !== serviceType)};
            } else {
                return {...prev, applicableServiceTypes: [...currentTypes, serviceType]};
            }
        });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Required fields
        if (!formData.code.trim()) newErrors.code = "Promo code is required";
        if (!formData.type) newErrors.type = "Discount type is required";
        if (formData.value === null || formData.value === undefined || formData.value < 0) newErrors.value = "Discount value is required and must be positive";
        if (formData.type === "percentage" && formData.value > 100) newErrors.value = "Percentage discount cannot exceed 100%";

        // Date validation
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) newErrors.endDate = "End date must be after start date";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
                type: formData.type,
                value: Number(formData.value),
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
            // Only close modal if save was successful (no error thrown)
            onClose();
        } catch (error: any) {
            // Handle server validation errors
            console.error("Save error:", error);
            
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else if (error.message) {
                setServerError(error.message);
            } else {
                setServerError("Failed to save promo code. Please try again.");
            }
            
            // Keep modal open to show errors
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDiscountPlaceholder = () => {
        switch (formData.type) {
            case 'percentage':
                return 'Enter discount percentage (e.g., 10 for 10%)';
            case 'flat':
                return 'Enter flat discount amount';
            case 'free':
                return 'Free delivery (automatically 0)';
            default:
                return 'Enter discount value';
        }
    };

    const isFreeType = formData.type === 'free';

    return (
        <>
            {show && (
                <>
                    {/* Backdrop*/}
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
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

                                <div className="modal-body">
                                    {/* Server Error Alert */}
                                    {serverError && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <i className="fa fa-exclamation-triangle me-2"></i>
                                            <div className="small">{serverError}</div>
                                        </div>
                                    )}

                                    <div className="row">                                           
                                        {/* Promo Code */}
                                    	<div className="col-sm-12 col-md-8 mb-3">
                                    		 <label className="form-label mb-0 fw-semibold small">
                                                Promo Code: <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" name="code" value={formData.code} placeholder="e.g., WELCOME10" onChange={handleChange} disabled={isSubmitting} className={`form-control shadow-lg ${errors.code ? 'is-invalid' : ''}`}/>
                                            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                                    	</div>

                                    	{/* Status */}
                                    	<div className="col-sm-12 col-md-4 mb-3">
                                            <label className="form-label mb-0 fw-semibold small">
                                            	Status: <span className="text-danger">*</span>
                                            </label>
                                            <select className="form-select shadow-lg" name="status" value={formData.status} onChange={handleChange} disabled={isSubmitting}>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>


                                        {/* Discount Type */}
                                        <div className="col-sm-12 col-md-6 mb-3">
                                            <label className="form-label mb-0 fw-semibold small">
                                                Discount Type <span className="text-danger">*</span>
                                            </label>
                                            <select name="type" value={formData.type} onChange={handleChange} disabled={isSubmitting} className={`form-select shadow-lg ${errors.type ? 'is-invalid' : ''}`}>
                                                <option value="percentage">Percentage Discount</option>
                                                <option value="flat">Flat Amount</option>
                                                <option value="free">Free Delivery</option>
                                            </select>
                                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                        </div>

                                        {/* Discount Value */}
                                        <div className="col-sm-12 col-md-6 mb-3">
                                            <label className="form-label mb-0 fw-semibold small">
                                                Discount Value <span className="text-danger">*</span>
                                            </label>
                                            <input type="number" name="value" value={isFreeType ? 0 : formData.value} placeholder={getDiscountPlaceholder()} onChange={handleChange}
                                            	disabled={isFreeType || isSubmitting} min="0" className={`form-control shadow-lg ${errors.value ? 'is-invalid' : ''}`} step={formData.type === 'percentage' ? '1' : '0.01'}
                                         	/>
                                            {errors.value && <div className="invalid-feedback">{errors.value}</div>}
                                        </div>


                                        {/* Max Discount Amount (for percentage) */}
                                        {formData.type === 'percentage' && (
                                        	<>
                                                <div className="mb-4 col-sm-12 col-md-6">
                                                    <label className="form-label mb-0 fw-semibold small">
                                                    	Min Discount Amount: <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="number" className="form-control shadow-lg" name="minDiscountAmount" value={formData.minDiscountAmount}
                                                        placeholder="Minimum discount amount" onChange={handleChange} disabled={isSubmitting} min="0" step="0.01"
                                                    />
                                                </div>

                                                <div className="mb-4 col-sm-12 col-md-6">
                                                    <label className="form-label mb-0 fw-semibold small">
                                                    	Max Discount Amount: <sup className="text-danger">(Optional)</sup>
                                                    </label>
                                                    <input type="number" className="form-control shadow-lg" name="maxDiscountAmount" value={formData.maxDiscountAmount}
                                                        placeholder="Maximum discount amount (optional)" onChange={handleChange} disabled={isSubmitting} min="0" step="0.01"
                                                    />
                                                </div>
                                            </>
                                        )}


	                                    {/* Start Validity Period */}
	                                    <div className="mb-4 col-sm-12 col-md-6">
	                                        <label className="form-label mb-0 fw-semibold small">
	                                        	Start Date: <span className="text-danger">*</span>
	                                        </label>
	                                        <input type="date" className="form-control shadow-lg" name="startDate"  value={formData.startDate} onChange={handleChange} disabled={isSubmitting}/>
	                                    </div>

	                                    {/* End Validity Period */}
	                                    <div className="mb-4 col-sm-12 col-md-6">
	                                        <label className="form-label mb-0 fw-semibold small">
	                                        	End Date: <sup className="text-danger">(Optional)</sup>
	                                        </label>
	                                        <input type="date" className={`form-control shadow-lg ${errors.endDate ? 'is-invalid' : ''}`} name="endDate" 
	                                            value={formData.endDate} onChange={handleChange} disabled={isSubmitting}
	                                        />
	                                        {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
	                                    </div> 


	                                    {/* Max Total Usage */}
                                        <div className="mb-4 col-sm-12 col-md-4">
                                            <label className="form-label mb-0 fw-semibold small">
                                            	Max Total Usage: <sup className="text-danger">(Optional)</sup>
                                            </label>
                                            <input type="number" className="form-control shadow-lg" name="maxUsageCount" value={formData.maxUsageCount}
                                                placeholder="Leave empty for unlimited" onChange={handleChange} disabled={isSubmitting} min="0"
                                            />
                                        </div>

	                                    {/* Max Total Usage Per User */}
                                        <div className="mb-4 col-sm-12 col-md-4">
                                            <label className="form-label mb-0 fw-semibold small">
                                            	Max Usage Per User: <sup className="text-danger">(Optional)</sup>
                                            </label>
                                            <input type="number" className="form-control shadow-lg" name="maxUsagePerUser" value={formData.maxUsagePerUser}
                                                placeholder="Leave empty for unlimited" onChange={handleChange} disabled={isSubmitting} min="0"
                                            />
                                        </div>

                                        {/* Minimum Order Amount */}
                                        <div className="mb-4 col-sm-12 col-md-4">
                                            <label className="form-label mb-0 fw-semibold small">
                                            	Minimum Order Amount: <sup className="text-danger">(Optional)</sup>
                                            </label>
                                            <input type="number" className="form-control shadow-lg" name="minOrderAmount"  value={formData.minOrderAmount}
                                                placeholder="Minimum order amount (optional)" onChange={handleChange} disabled={isSubmitting} min="0" step="0.01"
                                            />
                                        </div>  

                                    </div>

                                    {/* Description */}
                                    <div className="mb-4 col-sm-12">
                                        <label className="form-label mb-0 fw-semibold small">
                                        	Description: <sup className="text-danger">(Optional)</sup>
                                        </label>
                                        <textarea className="form-control shadow-lg" name="description" value={formData.description}
                                            placeholder="Enter promo code description" onChange={handleChange} rows={3} disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Service Types (Full Width) */}
                                    <div className="col-sm-12 mb-4">
                                        <label className="form-label mb-0 fw-semibold small">
                                        	Applicable Service Types: <sup className="text-danger">(Optional)</sup>
                                        </label>
                                        <div className="border rounded p-2 bg-light">
                                            <div className="row">
                                                {SERVICE_TYPES.map(serviceType => (
                                                    <div key={serviceType} className="col-md-4 col-sm-6 mb-2">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`service-${serviceType}`}
                                                                checked={formData.applicableServiceTypes.includes(serviceType)}
                                                                onChange={() => handleServiceTypeChange(serviceType)}
                                                                disabled={isSubmitting}
                                                            />
                                                            <label className="form-check-label small text-capitalize" htmlFor={`service-${serviceType}`}>
                                                                {serviceType}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {formData.applicableServiceTypes.length === 0 && (
                                                <small className="text-muted">Leave empty to apply to all service types</small>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer bg-primary-subtle d-flex justify-content-between">
                                    <button 
                                        className="btn btn-secondary btn-sm" 
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                    >
                                        <i className="fa fa-times me-1"></i> Cancel
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-sm" 
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                                                {initialData ? "Updating..." : "Creating..."}
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-save me-1"></i> 
                                                {initialData ? "Update Promo Code" : "Create Promo Code"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}