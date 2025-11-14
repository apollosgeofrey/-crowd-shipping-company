import { useState, useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";

interface ChargeModalProps {
	show: boolean;
	onClose: () => void;
	onSave: (charge: any) => void;
	initialData?: any; // when editing
	status?: string;
}

export default function PromoCodeModal({ show, onClose, onSave, initialData }: ChargeModalProps) {
	const [formData, setFormData] = useState<any>({
		promoCode: initialData?.promoCode || "",
	    discount: initialData?.discount || "",
	    validFrom: initialData?.validFrom || "",
	    validUntil: initialData?.validUntil || "",
	    status: initialData?.status || "",
	});

	useEffect(() => {
	    if (initialData) {
	    	setFormData(initialData); // prefill for edit
	    } else {
	    	setFormData({ promoCode: "", discount: "", validFrom: "", validUntil: "", status: "" });
	    }
	}, [initialData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
	   	setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = () => {
	    onSave(formData);
	    onClose();
	};

	return (
		<>
			{show && (
				<>
					{/* Backdrop*/}
			    	<div className="modal-backdrop fade show"></div>
					<div className="modal fade show d-block" tabIndex={1000} aria-hidden="true" id="chargeModal">
					  	<div className="modal-dialog modal-dialog-centered modal-md">
					    	<div className="modal-content rounded shadow-sm">
					      		<div className="modal-header bg-primary-subtle">
					            	<h6 className="modal-title fw-bold text-primary">
									  	{initialData ? (
										    <><span className="fa fa-edit"></span> Edit Promo Code</>
									  	) : (
										    <><span className="fa fa-plus-square"></span> Create New Promo Code</>
									  	)}
									</h6>
					            	<button type="button" className="btn-close" onClick={onClose}></button>
					          	</div>

					          	<div className="modal-body">
						             <div className="mb-3">
						            	<label className="form-label mb-0 fw-bold small">Promo Code:</label>
						              	<input type="text" className="form-control" name="promoCode" value={formData.promoCode} placeholder='Enter Promo Code' onChange={handleChange}/>
						            </div>


						            <div className="mb-3">
						            	<label className="form-label mb-0 fw-bold small">Discount: (%)</label>
						              	<input type="number" className="form-control" name="discount" value={formData.discount} placeholder='Enter Discount Percentage' onChange={handleChange}/>
						            </div>

						            <div className="mb-3">
						              	<label className="form-label mb-0 fw-bold small">Valid From:</label>
						              	<input type="date" className="form-control" name="validFrom" value={formData.validFrom} onChange={handleChange}/>
						            </div>

						            <div className="mb-3">
						              	<label className="form-label mb-0 fw-bold small">Valid Until:</label>
						              	<input type="date" className="form-control" name="validUntil" value={formData.validUntil} onChange={handleChange}/>
						            </div>

						            <div className="mb-3">
						              	<label className="form-label mb-0 fw-bold small">Status:</label>
						              	<select className="form-select" name="status" value={formData.status || "Active"} onChange={handleChange}>
										  	<option value="Inactive">Inactive</option>
										  	<option value="Active">Active</option>
										</select>
						            </div>
					          	</div>

					          	<div className="modal-footer bg-primary-subtle d-flex justify-content-between">
									{/* Left-aligned */}
									<button className="btn btn-secondary btn-sm" onClick={onClose}>
										<span className="fa fa-times"></span> Cancel
									</button>
									{/* Right-aligned */}
									<button className="btn btn-primary btn-sm" onClick={handleSubmit}>
										<span className="fa fa-save"></span> {initialData ? "Update Promo" : "Add Promo"}
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
