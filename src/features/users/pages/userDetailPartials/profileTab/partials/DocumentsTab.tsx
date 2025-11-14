import { FaEye, FaDownload, FaUser, FaIdCard } from "react-icons/fa";

export default function DocumentsTab({ user }: { user: any }) {
    const profile = user?.profile || {};
    const documents = profile?.documentIds || [];
    const profileImage = profile?.profilePicUrl || '';
    const identificationType = profile?.identificationType;

    // Create document items from actual data
    const documentItems = [
        {
            id: 1, 
            title: "Profile Picture", 
            img: profileImage, 
            fallbackText: "No Profile Picture", 
            icon: <FaUser className="text-primary" />
        },
        {
            id: 2, 
            title: identificationType || "Identification Document", 
            img: "", // Users might not have uploaded documents yet
            fallbackText: "No Document Uploaded", 
            icon: <FaIdCard className="text-success" />
        }
    ];

    // Handle view document
    const handleViewDocument = (imageUrl: string, title: string) => {
        imageUrl ? window.open(imageUrl, '_blank') : alert(`No ${title} available`);
    };

    // Handle download document
    const handleDownloadDocument = (imageUrl: string, title: string) => {
        if (imageUrl) {
            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `${title.replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert(`No ${title} available to download`);
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                {/* Profile Images Section */}
                <div className="row g-4 mb-5">
                    {documentItems.map((doc) => (
                        <div key={doc.id} className="col-md-6">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    {doc.icon} {doc.title}
                                </h6>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleViewDocument(doc.img, doc.title)} disabled={!doc.img}>
                                        <FaEye />
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleDownloadDocument(doc.img, doc.title)} disabled={!doc.img}>
                                        <FaDownload />
                                    </button>
                                </div>
                            </div>
                            <div className="border rounded overflow-hidden shadow-sm text-center bg-light">
                                {doc.img ? (
                                    <img src={doc.img} alt={doc.title} className="img-fluid w-100" style={{ height: "200px", objectFit: "cover" }}/>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center text-muted" style={{ height: "200px" }}>
                                        <div>
                                            <div className="mb-2" style={{ fontSize: "2rem" }}>{doc.icon}</div>
                                            <small>{doc.fallbackText}</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Document IDs Section */}
                <div className="border-top pt-4">
                    <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                        <FaIdCard className="text-info" /> Uploaded Document IDs ({documents.length})
                    </h6>
                    
                    {documents.length > 0 ? (
                        <div className="row g-3">
                            {{documents.map((docId: string, index: number) => (
                                <div key={index} className="col-md-6 col-lg-4">
                                    <div className="card border shadow-sm">
                                        <div className="card-body text-center py-3">
                                            <FaIdCard className="text-muted mb-2" size={24} />
                                            <h6 className="fw-semibold mb-1">Document {index + 1}</h6>
                                            <small className="text-muted d-block text-truncate" title={docId}>
                                                ID: {docId}
                                            </small>
                                            <div className="mt-2 d-flex gap-1 justify-content-center">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigator.clipboard.writeText(docId)} title="Copy Document ID">
                                                    Copy ID
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            <FaIdCard size={48} className="mb-3" />
                            <p>No documents uploaded</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}