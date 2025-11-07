// pages/users/tabs/CompanyInformationTab.tsx
import { useState } from "react";
import { companyApi } from "../../../../services/companyApi";
import { useUserData } from '../../../../../../hooks/useUserData';

interface Props {
    company: any;
    onCompanyUpdate?: (updatedCompany: any) => void;
}

export default function CompanyInformationTab({ company, onCompanyUpdate }: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });

    // Helper function to format date
    const { user } = useUserData();
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'text-success';
            case 'pending': return 'text-warning';
            case 'inactive': return 'text-secondary';
            case 'rejected': return 'text-danger';
            case 'suspended': return 'text-danger';
            default: return 'text-secondary';
        }
    };

    // Helper function to capitalize first letter
    const capitalizeFirst = (str: string) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Handle verification action
    const handleVerification = async (action: 'verify' | 'decline' | 'revoke') => {
        if (!company?._id) {
            setMessage({ type: "error", text: "Invalid company ID" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            let payload: any = {};            
            if (action === 'verify') { // For verification, set verifiedBy to current admin ID and status to active
                payload = {verifiedBy: user?._id, status: "active"};
            } else if (action === 'decline') { // For decline, set status to rejected and clear verifiedBy
                payload = {verifiedBy: null, status: "rejected"};
            } else if (action === 'revoke') { // For revoke, clear verifiedBy and set status to pending
                payload = {verifiedBy: null, status: "pending"};
            }

            const res = await companyApi.updateCompany(company._id, payload);
            
            if (res.code === 200) {
                const successMessage = 
                    action === 'verify' ? "Company verified successfully!" :
                    action === 'decline' ? "Company verification declined!" :
                    "Verification revoked successfully!";
                
                setMessage({ type: "success", text: successMessage });
                
                // Notify parent component about the update
                if (onCompanyUpdate && res.data) onCompanyUpdate(res.data);
            } else {
                setMessage({ type: "error", text: res.message || `Failed to ${action} company` });
            }
        } catch (err: any) {
            setMessage({ 
                type: "error", 
                text: err?.response?.data?.message || `An error occurred while ${action}ing company` 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Message Alert */}
            {message.text && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2 mb-3`}>
                    {message.text}
                </div>
            )}

            <div className="row g-0 small">
                {/* Company Name */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Company Name</p>
                    <p className="text-muted border-bottom pb-2">{company?.name || "N/A"}</p>
                </div>

                {/* Company ID */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Company ID</p>
                    <p className="text-muted border-bottom pb-2">{company?._id || "N/A"}</p>
                </div>

                {/* Contact Person */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Contact Person</p>
                    <p className="text-muted border-bottom pb-2">
                        {company?.contactPerson?.fullName || "No Contact Person"}
                    </p>
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Email Address</p>
                    <p className="text-muted border-bottom pb-2">
                        {company?.email ? (
                            <a href={`mailto:${company.email}`} className="text-decoration-none text-muted">{company.email}</a>
                        ) : (
                            "N/A"
                        )}
                    </p>
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Phone Number</p>
                    <p className="text-muted border-bottom pb-2">
                        {company?.phoneNumber ? (
                            <a href={`tel:${company.phoneNumber}`} className="text-decoration-none text-muted">
                                {company.phoneNumber}
                            </a>
                        ) : (
                            "N/A"
                        )}
                    </p>
                </div>

                {/* Incorporation Date */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Incorporation Date</p>
                    <p className="text-muted border-bottom pb-2">
                        {formatDate(company?.incorporationDate)}
                    </p>
                </div>

                {/* RC Number */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">RC Number</p>
                    <p className="text-muted border-bottom pb-2">{company?.rcNumber || "N/A"}</p>
                </div>

                {/* Tax ID */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Tax ID</p>
                    <p className="text-muted border-bottom pb-2">{company?.taxId || "N/A"}</p>
                </div>

                {/* Address */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Address</p>
                    <p className="text-muted border-bottom pb-2">{company?.address || "N/A"}</p>
                </div>

                {/* City/State */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">City/State</p>
                    <p className="text-muted border-bottom pb-2">{company?.cityState || "N/A"}</p>
                </div>

                {/* Status */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Status</p>
                    <p className={`fw-bold border-bottom pb-2 ${getStatusColor(company?.status)}`}>
                        {capitalizeFirst(company?.status) || "N/A"}
                    </p>
                </div>

                {/* Created Date */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Created Date</p>
                    <p className="text-muted border-bottom pb-2">
                        {formatDate(company?.createdAt)}
                    </p>
                </div>

                {/* Last Updated */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Last Updated</p>
                    <p className="text-muted border-bottom pb-2">
                        {formatDate(company?.updatedAt)}
                    </p>
                </div>

                {/* Verified By */}
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Verified By</p>
                    <p className="text-muted border-bottom pb-2">
                        {company?.verifiedBy ? company.verifiedByUser?.fullName || "Admin User" : "Not Verified"}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold text-muted">Verification Status:</span>
                    <span className={`fw-bold ${company?.verifiedBy ? 'text-success' : 'text-warning'}`}>
                        {company?.verifiedBy ? 'Verified' : 'Pending Verification'}
                    </span>
                </div>
                
                <div className="d-flex gap-2">
                    {!company?.verifiedBy ? (
                        <>
                            <button onClick={() => handleVerification('verify')} disabled={loading} className="btn btn-primary px-4 fw-semibold rounded-pill">
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-1" role="status"></span> Verifying...</>
                                ) : (
                                    <><i className="fa fa-check me-1"></i> Verify</>
                                )}
                            </button>
                            <button onClick={() => handleVerification('decline')} disabled={loading} className="btn btn-outline-danger px-4 fw-semibold rounded-pill">
                                <i className="fa fa-times me-1"></i> Decline
                            </button>
                        </>
                    ) : (
                        <button onClick={() => handleVerification('revoke')} disabled={loading} className="btn btn-outline-secondary px-4 fw-semibold rounded-pill">
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-1" role="status"></span> Revoking...</>
                            ) : (
                                <><i className="fa fa-undo me-1"></i> Revoke Verification</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}