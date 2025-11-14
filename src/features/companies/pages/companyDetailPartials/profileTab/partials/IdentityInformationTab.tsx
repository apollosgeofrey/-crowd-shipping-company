// pages/users/tabs/IdentityInformationTab.tsx
import { useState } from "react";
import { userApi } from "../../../../../users/services/userApi";

interface Props {
    company: any;
    onCompanyUpdate?: (updatedCompany: any) => void;
}

export default function IdentityInformationTab({ company }: Props) {
    const [loading, setLoading] = useState(false);
    const [contactPerson, setContactPerson] = useState(company?.contactPerson);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });

    // Helper function to format date
    // const formatDate = (dateString: string) => {
    //     if (!dateString) return "N/A";
    //     return new Date(dateString).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
    // };

    // Check if contact person exists and get their status
    const hasContactPerson = !!contactPerson;
    const contactPersonStatus = contactPerson?.status || 'pending';
    const [selectedStatus, setSelectedStatus] = useState(contactPersonStatus);

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'blocked': return 'secondary';
            case 'suspended': return 'danger';
            default: return 'secondary';
        }
    };

    // Handle contact person status update
    const handleUpdateContactPerson = async (newStatus: 'active' | 'blocked' | 'deactivated' | 'suspended') => {
        if (!contactPerson?._id) {
            setMessage({ type: "error", text: "No contact person found" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const payload = { status: newStatus }; // Only update the status field as per API requirements
            const res = await userApi.updateUser(company.contactPerson._id, payload); // Update the contact person's status            
            if (res.code === 200) {
                const successMessage = `Contact person status updated to ${newStatus} successfully!`;
                setMessage({ type: "success", text: successMessage });
                if (res.data) setContactPerson(res.data);
            } else {
                setMessage({ type: "error", text: res.message || `Failed to update contact person status` });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err?.response?.data?.message || `An error occurred while updating contact person` });
        } finally {
            setLoading(false);
        }
    };

    // Handle document download
    // const handleDownloadDocuments = () => setMessage({ type: "success", text: "Document download functionality coming soon!" });

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                {/* Message Alert */}
                {message.text && (
                    <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2 mb-3`}>{message.text}</div>
                )}

                {/* Header with status */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="card-title mb-0">
                        <i className="fa fa-id-card me-2 text-primary"></i> Contact Person Information
                    </h6>
                    <span className={`badge bg-${getStatusColor(contactPersonStatus)}`}>{contactPersonStatus.toUpperCase()}</span>
                </div>

                {!hasContactPerson && (
                    <div className="alert alert-warning py-2 mb-4">
                        <small>
                            <i className="fa fa-exclamation-triangle me-2"></i> No contact person assigned to this company.
                        </small>
                    </div>
                )}

                {hasContactPerson && (
                    <>
                        <div className="row g-3">
                            {/* Contact Person Reference */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-1 text-dark small">Contact Person</p>
                                <p className="text-muted small">{contactPerson?.fullName || "No name provided"}</p>
                            </div>

                            {/* Contact Person ID */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-1 text-dark small">Contact Person ID</p>
                                <p className="text-muted small">{contactPerson?._id || "N/A"}</p>
                            </div>

                            {/* Contact Person Status */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-1 text-dark small">Account Status</p>
                                <p className={`fw-bold small text-${getStatusColor(contactPersonStatus)}`}>{contactPersonStatus.toUpperCase()}</p>
                            </div>

                            {/* Email */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-1 text-dark small">Email Address</p>
                                <p className="text-muted small">
                                    {contactPerson?.email ? (
                                        <a href={`mailto:${contactPerson.email}`} className="text-decoration-none text-muted">{contactPerson.email}</a>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                            </div>

                            {/* Phone Number */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-1 text-dark small">Phone Number</p>
                                <p className="text-muted small">
                                    {contactPerson?.phoneNumber ? (
                                        <a href={`tel:${contactPerson.phoneNumber}`} className="text-decoration-none text-muted">{contactPerson.phoneNumber}</a>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                            </div>

                            {/* Additional identity information would go here if available from API */}
                            <div className="col-12">
                                <div className="alert alert-info py-2">
                                    <small>
                                        <i className="fa fa-info-circle me-2"></i>
                                        Detailed identity information (NIN, ID documents, etc.) would be displayed here when available from the API.
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">                            
                            {/* Status Management - Select with Apply Button */}
                            <div className="d-flex align-items-center gap-2">
                                <label className="form-label mb-0 fw-semibold small">Update Status:</label>
                                <select value={selectedStatus || contactPersonStatus} onChange={(e) => setSelectedStatus(e.target.value)} disabled={loading} className="form-select form-select-sm" style={{ width: 'auto' }}>
                                    <option value="active" className="text-success">🟢 Active</option>
                                    <option value="pending" className="text-warning">🟡 Pending</option>
                                    <option value="blocked" className="text-warning">🟡 Blocked</option>
                                    <option value="suspended" className="text-danger">🔴 Suspended</option>
                                    <option value="deactivated" className="text-danger">🔴 Deactivated</option>
                                </select>
                                
                                <button onClick={() => selectedStatus && handleUpdateContactPerson(selectedStatus)}className="btn btn-primary btn-sm"
                                disabled={loading || !selectedStatus || selectedStatus === contactPersonStatus}>
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-1" role="status"></span>Updating...</>
                                    ) : (
                                        <><i className="fa fa-check me-1"></i> Apply</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}