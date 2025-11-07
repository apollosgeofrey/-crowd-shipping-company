// pages/users/tabs/DocumentsTab.tsx
import { useState } from "react";
import { FaEye, FaDownload, FaUpload, FaTimes } from "react-icons/fa";

interface Props {
    company: any;
    onCompanyUpdate?: (updatedCompany: any) => void;
}

export default function DocumentsTab({ company }: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });

    // Mock documents data - in real app, this would come from API
    const documents = [
        // {
        //     id: 1,
        //     title: "Certificate of Incorporation",
        //     fileName: "certificate_of_incorporation.pdf",
        //     uploadDate: "2024-01-15",
        //     status: "verified",
        //     img: "https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=Certificate+of+Incorporation",
        // },
        // {
        //     id: 2,
        //     title: "Tax Identification Document",
        //     fileName: "tax_id_certificate.pdf", 
        //     uploadDate: "2024-01-16",
        //     status: "pending",
        //     img: "https://via.placeholder.com/400x250/50E3C2/FFFFFF?text=Tax+ID+Certificate",
        // },
        // {
        //     id: 3,
        //     title: "RC Registration Document",
        //     fileName: "rc_registration.pdf",
        //     uploadDate: "2024-01-14",
        //     status: "verified",
        //     img: "https://via.placeholder.com/400x250/9013FE/FFFFFF?text=RC+Registration",
        // },
        // {
        //     id: 4,
        //     title: "Proof of Address",
        //     fileName: "proof_of_address.pdf",
        //     uploadDate: "2024-01-17", 
        //     status: "rejected",
        //     img: "https://via.placeholder.com/400x250/F5A623/FFFFFF?text=Proof+of+Address",
        // }
    ];

    // Helper function to get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified': return 'badge bg-success';
            case 'pending': return 'badge bg-warning';
            case 'rejected': return 'badge bg-danger';
            default: return 'badge bg-secondary';
        }
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle document actions
    const handleViewDocument = (doc: any) => {
        setMessage({ type: "success", text: `Viewing document: ${doc.title}` });
        // In real app, this would open a modal or new tab with the document
    };

    const handleDownloadDocument = (doc: any) => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        
        // Simulate download
        setTimeout(() => {
            setMessage({ type: "success", text: `Downloading: ${doc.fileName}` });
            setLoading(false);
        }, 1000);
    };

    const handleUploadDocument = () => {
        setMessage({ type: "success", text: "Upload document functionality coming soon!" });
    };

    const handleDeleteDocument = (doc: any) => {
        if (window.confirm(`Are you sure you want to delete ${doc.title}?`)) {
            setMessage({ type: "success", text: `Document ${doc.title} deleted successfully!` });
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                {/* Header with upload button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="card-title mb-0">
                        <i className="fa fa-file-text me-2 text-primary"></i> Company Documents
                    </h6>
                    <button onClick={handleUploadDocument} className="btn btn-primary btn-sm">
                        <span className="fa fa-cloud-upload-alt me-1"></span> Upload Document
                    </button>
                </div>

                {/* Message Alert */}
                {message.text && (<div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2 mb-3`}> {message.text} </div>)}

                {/* Documents Grid */}
                <div className="row g-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    {/* Document Header */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h6 className="fw-semibold mb-1">{doc.title}</h6>
                                            <small className="text-muted">{doc.fileName}</small>
                                        </div>
                                        <span className={getStatusBadge(doc.status)}>{doc.status}</span>
                                    </div>

                                    {/* Document Preview */}
                                    <div className="border rounded overflow-hidden mb-3 text-center bg-light">
                                        <img src={doc.img} alt={doc.title} className="img-fluid w-100" style={{ height: "150px", objectFit: "cover" }}/>
                                    </div>

                                    {/* Document Info */}
                                    <div className="small text-muted mb-3">
                                        <div className="d-flex justify-content-between">
                                            <span>Uploaded:</span>
                                            <span>{formatDate(doc.uploadDate)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-between gap-1">
                                        <button onClick={() => handleViewDocument(doc)} className="btn btn-outline-primary btn-sm flex-fill">
                                            <span className="fa fa-eye me-1"></span> View
                                        </button>
                                        <button onClick={() => handleDownloadDocument(doc)} disabled={loading} className="btn btn-outline-success btn-sm flex-fill">
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                            ) : (
                                                <><span className="fa fa-download me-1"></span> Download</>
                                            )}
                                        </button>
                                        <button onClick={() => handleDeleteDocument(doc)} className="btn btn-outline-danger btn-sm" title="Delete Document">
                                            <FaTimes />                                            
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {documents.length === 0 && (
                    <div className="text-center py-5">
                        <i className="fa fa-folder-open fa-3x text-muted mb-3"></i>
                        <h6 className="text-muted">No documents uploaded yet</h6>
                        <p className="text-muted small mb-3">
                            Upload company documents to complete the verification process.
                        </p>
                        <button onClick={handleUploadDocument} className="btn btn-primary btn-sm">
                            <span className="fa fa-cloud-upload me-1"></span> Upload First Document
                        </button>
                    </div>
                )}

                {/* Document Statistics */}
                {documents.length > 0 && (
                    <div className="mt-4 pt-3 border-top">
                        <div className="row text-center">
                            <div className="col-4">
                                <div className="fw-bold text-primary">{documents.filter(d => d.status === 'verified').length}</div>
                                <small className="text-muted">Verified</small>
                            </div>
                            <div className="col-4">
                                <div className="fw-bold text-warning">{documents.filter(d => d.status === 'pending').length}</div>
                                <small className="text-muted">Pending</small>
                            </div>
                            <div className="col-4">
                                <div className="fw-bold text-danger">{documents.filter(d => d.status === 'rejected').length}</div>
                                <small className="text-muted">Rejected</small>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}