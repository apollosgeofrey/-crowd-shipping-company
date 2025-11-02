import { FaCar, FaEye, FaIdCard, FaPalette, FaCalendarAlt, FaFileAlt, FaCheckCircle, FaClock } from "react-icons/fa";

export default function VehicleInformationTab({ vehicleOwner }: { vehicleOwner: any }) {
    
    const vehicle = vehicleOwner?.vehicle || {};
    const category = vehicle?.category || {};
    const vehicleDocuments = vehicle?.vehicleDocuments || [];

    // Helper function to get status badge color
    const getVehicleStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'approved': return 'success';
            case 'pending-approval': return 'warning';
            case 'suspended': return 'danger';
            case 'rejected': return 'danger';
            case 'not-approved': return 'secondary';
            default: return 'secondary';
        }
    };

    // Helper function to format status text
    const formatStatusText = (status: string) => {
        return status?.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') || 'Unknown';
    };

    // Helper function to get document status icon and color
    const getDocumentStatus = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return { icon: <FaCheckCircle className="text-success" />, text: 'Approved' };
            case 'not-approved': return { icon: <FaClock className="text-warning" />, text: 'Pending' };
            case 'rejected': return { icon: <FaClock className="text-danger" />, text: 'Rejected' };
            default: return { icon: <FaClock className="text-secondary" />, text: 'Pending' };
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                <div className="row">
                    {/* Vehicle Image */}
                    {vehicle?.image && (
                        <div className="col-sm-12 col-md-3">
                            <div className="text-center mb-4">
                                <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className="img-fluid rounded shadow-sm" style={{ maxHeight: '200px', objectFit: 'cover' }}/>
                            </div>
                        </div>
                    )}

                    {/* Vehicle Basic Information */}
                    <div className={`col-sm-12 ${vehicle?.image ? 'col-md-9' : 'col-md-12'}`}>
                        <div className="row g-0 mb-4">
                            <div className="col-12">
                                <h5 className="fw-semibold mb-3 text-primary d-flex align-items-center gap-2"><FaCar /> Vehicle Details</h5>
                            </div>

                            {/* Make & Model */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    <FaCar className="text-muted" /> Make & Model
                                </p>
                                <p className="text-muted small">{vehicle.make} {vehicle.model}</p>
                            </div>

                            {/* Year */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    <FaCalendarAlt className="text-muted" /> Year
                                </p>
                                <p className="text-muted small">{vehicle.year || "Not specified"}</p>
                            </div>

                            {/* License Plate */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    <FaIdCard className="text-muted" /> License Plate
                                </p>
                                <p className="text-muted small font-monospace">{vehicle.licensePlate || "Not specified"}</p>
                            </div>

                            {/* Color */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    <FaPalette className="text-muted" /> Color
                                </p>
                                <p className="text-muted small text-capitalize">{vehicle.color || "Not specified"}</p>
                            </div>

                            {/* Vehicle Type */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-0">Vehicle Type</p>
                                <p className="text-muted small text-capitalize">{vehicle.type || "Not specified"}</p>
                            </div>

                            {/* Category */}
                            <div className="col-md-6">
                                <p className="fw-semibold mb-0">Category</p>
                                <p className="text-muted small">{category.name || "Not specified"}</p>
                            </div>

                            {/* Vehicle Status */}
                            <div className="col-12">
                                <p className="fw-semibold mb-0">Vehicle Status</p>
                                <span className={`badge bg-${getVehicleStatusColor(vehicle.status)}`}>
                                    {formatStatusText(vehicle.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                {/* Vehicle Documents */}
                <div className="row g-3">
                    <div className="col-12">
                        <h5 className="fw-semibold mb-3 text-primary d-flex align-items-center gap-2">
                            <FaFileAlt /> Vehicle Documents ({vehicleDocuments.length})
                        </h5>
                    </div>

                    {vehicleDocuments.length > 0 ? (
                        vehicleDocuments.map((doc: any, index: number) => {
                            const docStatus = getDocumentStatus(doc.status);
                            return (
                                <div key={doc._id || index} className="col-md-6">
                                    <div className="card border shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="fw-semibold mb-0">{doc.name}</h6>
                                                <div className="d-flex align-items-center gap-1">
                                                    {docStatus.icon}
                                                    <small className="text-muted">{docStatus.text}</small>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 mt-3">
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => window.open(doc.document, '_blank')}
                                                >
                                                    <FaEye /> View
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = doc.document;
                                                        link.download = `${doc.name.replace(/\s+/g, '_')}.jpg`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                >
                                                    <FaIdCard /> Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center py-4 text-muted">
                            <FaFileAlt size={48} className="mb-3" />
                            <p>No vehicle documents uploaded</p>
                        </div>
                    )}
                </div>

                {/* Registration Date */}
                <div className="row mt-4 pt-3 border-top">
                    <div className="col-12">
                        <p className="fw-semibold mb-1">Registration Date</p>
                        <p className="text-muted small">
                            {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : "Not specified"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}