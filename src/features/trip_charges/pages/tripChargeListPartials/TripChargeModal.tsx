import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ChargeModalProps {
	show: boolean;
	onClose: () => void;
	onSave: (charge: any) => void;
	initialData?: any; // when editing
	status?: string;
}

export default function TripChargeModal({ show, onClose, onSave, initialData, status }: ChargeModalProps) {
	const [formData, setFormData] = useState({
		chargeType: initialData?.chargeType || "",
	    amount: initialData?.amount || "",
	    area: initialData?.area || "",
	    dateApplied: initialData?.dateApplied || "",
	    status: initialData?.status || "",
	});

	useEffect(() => {
	    if (initialData) {
	    	setFormData(initialData); // prefill for edit
	    } else {
	    	setFormData({ chargeType: "", amount: "", area: "", dateApplied: "" });
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
										    <><span className="fa fa-edit"></span> Edit Trip Charge</>
									  	) : (
										    <><span className="fa fa-plus-square"></span> Add New Charge</>
									  	)}
									</h6>
					            	<button type="button" className="btn-close" onClick={onClose}></button>
					          	</div>

					          	<div className="modal-body">
						            <div className="mb-3">
						              	<label className="form-label mb-0 fw-bold small">Charge Type:</label>
						              	<select className="form-select" name="chargeType" value={formData.chargeType} onChange={handleChange}>
							                <option value="">-- None Selected --</option>
							                <option value="Surge Pricing">Surge Pricing</option>
							                <option value="Toll Fee">Toll Fee</option>
							                <option value="Waiting Time">Waiting Time</option>
							                <option value="Cancellation Fee">Cancellation Fee</option>
						              	</select>
						            </div>

					            	<div className="mb-3">
						              	<label className="form-label mb-0 fw-bold small">Amount: (₦)</label>
						              	<input type="number" className="form-control" name="amount" value={formData.amount} placeholder='Enter Amount' onChange={handleChange}/>
						            </div>

						            <div className="mb-3">
						            	<label className="form-label mb-0 fw-bold small">Applicable Area: <sup className="text-danger">(Optional)</sup></label>
						              	<input type="text" className="form-control" name="area" value={formData.area} placeholder='eg. Lagos Badagry' onChange={handleChange}/>
						            </div>

						            <div className="mb-3">
						              	<label className="form-label mb-0 fw-bold small">Date Applied:</label>
						              	<input type="date" className="form-control" name="dateApplied" value={formData.dateApplied} onChange={handleChange}/>
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
										<span className="fa fa-save"></span> {initialData ? "Update Charge" : "Add Charge"}
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
