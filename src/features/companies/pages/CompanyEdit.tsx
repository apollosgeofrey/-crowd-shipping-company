import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { companyApi } from "../services/companyApi";
import { userApi } from "../../users/services/userApi";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function CompanyEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // form states
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({type: "", text: ""});
    
    // Users state for contact person selection
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // form data
    const [formData, setFormData] = useState<any>({
        // Company basic info
        name: "",
        email: "",
        phoneNumber: "",
        incorporationDate: "",
        rcNumber: "",
        taxId: "",
        address: "",
        cityState: "",
        status: "pending",
        
        // Contact person info
        contactPersonId: ""
    });

    // Fetch company data on component mount
    useEffect(() => {
        const fetchCompany = async () => {
            if (!id) return;
            
            try {
                setFetchLoading(true);
                const res = await companyApi.getCompanyById(id);
                if (res.code === 200 && res.data) {
                    const company = res.data;
                    setFormData({
                        name: company.name || "",
                        email: company.email || "",
                        phoneNumber: company.phoneNumber || "",
                        incorporationDate: company.incorporationDate ? company.incorporationDate.split('T')[0] : "",
                        rcNumber: company.rcNumber || "",
                        taxId: company.taxId || "",
                        address: company.address || "",
                        cityState: company.cityState || "",
                        status: company.status || "pending",
                        contactPersonId: company.contactPersonId || ""
                    });
                } else {
                    setMessage({ type: "error", text: "Failed to load company data." });
                }
            } catch (err: any) {
                setMessage({type: "error", text: err?.response?.data?.message || "An error occurred while loading data."});
            } finally {
                setFetchLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    // Fetch users for contact person selection
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await userApi.getUsers({ 
                limit: 100, 
                status: 'active',
                search: searchTerm || undefined
            });
            if (res.code === 200 && res.data) setUsers(res.data.items || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Load users when search term changes (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm || users.length === 0) fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // handlers for form inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // Select user handler
    const handleSelectUser = (userId: string) => {
        setFormData(prev => ({ ...prev, contactPersonId: userId }));
        setSearchTerm(""); // Clear search after selection
    };

    // Clear selected user
    const handleClearSelectedUser = () => setFormData(prev => ({ ...prev, contactPersonId: "" }));

    // form submit handler for updating company
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            setMessage({ type: "error", text: "Invalid company ID." });
            return;
        }

        // Basic company validation
        if (!formData.name || !formData.email) {
            setMessage({ type: "error", text: "Company name and email are required." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Prepare payload - only include fields that have values
            const payload: any = {name: formData.name, email: formData.email, status: formData.status};

            // Add optional fields if provided
            if (formData.phoneNumber) payload.phoneNumber = formData.phoneNumber;
            if (formData.incorporationDate) payload.incorporationDate = formData.incorporationDate;
            if (formData.rcNumber) payload.rcNumber = formData.rcNumber;
            if (formData.taxId) payload.taxId = formData.taxId;
            if (formData.address) payload.address = formData.address;
            if (formData.cityState) payload.cityState = formData.cityState;
            
            // Handle contact person - send null if empty string
            if (formData.contactPersonId === "") {
                payload.contactPersonId = null;
            } else if (formData.contactPersonId) {
                payload.contactPersonId = formData.contactPersonId;
            }

            const res = await companyApi.updateCompany(id, payload);
            if (res.code === 200) {
                setMessage({ type: "success", text: res.message || "Company updated successfully." });
                Swal.fire("Success", (res.message || "Company updated successfully."), "success");
            } else {
                setMessage({ type: "error", text: res.message || "Failed to update company." });
                Swal.fire("Error", (res.message || "Failed to update company."), "error");
            }
        } catch (err: any) {
            setMessage({type: "error", text: err?.response?.data?.message || "An error occurred while updating."});
            Swal.fire("Error", (err?.response?.data?.message || "An error occurred while updating."), "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel and go back
    const handleCancel = () => navigate(-1);

    // Get selected user details
    const selectedUser = users.find(user => user._id === formData.contactPersonId);

    if (fetchLoading) {
        return (
            <DashboardLayout>
                <div className="container mt-0">
                    <div className="row justify-content-center">
                        <div className="col-sm-12">
                            <div className="card shadow-sm border-0 p-5 d-flex align-items-center justify-content-center text-center" style={{ minHeight: "250px" }}>
                                <div>
                                    <div className="spinner-border text-primary mb-2" role="status" style={{ width: "3rem", height: "3rem" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 mb-0 text-muted fw-semibold">Loading company data...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="card shadow-sm rounded p-4">
                <div className="container mt-0">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10">

                            {/* main card */}
                            <div className="card shadow-sm border-0 p-2">

                                {/* Header with back button */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <button type="button" onClick={handleCancel} className="btn btn-sm btn-outline-primary">
                                        <i className="fa fa-angle-double-left me-1"></i> Go Back
                                    </button>
                                    
                                    <div className="d-flex">
                                        <button type="button" className="btn btn-link text-decoration-none text-primary fw-semibold border-bottom" style={{ borderBottom: "3px solid #E35D3F" }}>
                                            <h5 className="mb-0">
                                                <i className="fa fa-edit me-1"></i> Edit Company Information
                                            </h5>
                                        </button>
                                    </div>
                                    
                                    <div style={{ width: "80px" }}></div> {/* Spacer for balance */}
                                </div>

                                <div className="card-body">
                                    {/* alerts */}
                                    {message.text && (
                                        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2`}>{message.text}</div>
                                    )}

                                    <form onSubmit={handleSubmit}>

                                        {/* Company Basic Information */}
                                        <p className="fw-semibold mb-2">
                                            <span className="fa fa-building"></span> COMPANY BASIC INFORMATION
                                        </p>
                                        <div className="row g-3">
                                            {/* Company Name */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Company Name:<span className="text-danger">*</span>
                                                </label>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control shadow-lg" placeholder="e.g. Tech Innovations Ltd"/>
                                            </div>

                                            {/* Company Email */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Company Email:<span className="text-danger">*</span>
                                                </label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control shadow-lg" placeholder="company@example.com"/>
                                            </div>

                                            {/* Phone Number */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Phone Number:
                                                </label>
                                                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-control shadow-lg" placeholder="+234 801 234 5678"/>
                                            </div>

                                            {/* Status */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Status:<span className="text-danger">*</span>
                                                </label>
                                                <select name="status" value={formData.status} onChange={handleChange} required className="form-select shadow-lg">
                                                    <option value="pending">Pending</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="rejected">Rejected</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        {/* Company Additional Information */}
                                        <p className="fw-semibold mb-2">
                                            <span className="fa fa-info-circle"></span> COMPANY ADDITIONAL INFORMATION
                                        </p>
                                        <div className="row g-3">
                                            {/* RC Number */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    RC Number:
                                                </label>
                                                <input type="text" name="rcNumber" value={formData.rcNumber} onChange={handleChange} className="form-control shadow-lg" placeholder="RC123456789"/>
                                            </div>

                                            {/* Tax ID */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Tax ID:
                                                </label>
                                                <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="form-control shadow-lg" placeholder="TIN987654321"/>
                                            </div>

                                            {/* Incorporation Date */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Incorporation Date:
                                                </label>
                                                <input type="date" name="incorporationDate" value={formData.incorporationDate} onChange={handleChange} className="form-control shadow-lg" />
                                            </div>

                                            {/* City/State */}
                                            <div className="col-sm-12 col-md-6 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    City & State:
                                                </label>
                                                <input type="text" name="cityState" value={formData.cityState} onChange={handleChange} className="form-control shadow-lg" placeholder="Lagos, Nigeria"/>
                                            </div>

                                            {/* Address */}
                                            <div className="col-sm-12 mb-2">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Address:
                                                </label>
                                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control shadow-lg" placeholder="123 Business Avenue, Victoria Island"/>
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        {/* Contact Person Management */}
                                        <p className="fw-semibold mb-2">
                                            <span className="fa fa-user"></span> CONTACT PERSON MANAGEMENT <sup className="text-muted">(Optional)</sup>
                                        </p>
                                        
                                        {/* Selected User Display */}
                                        {selectedUser && (
                                            <div className="alert alert-info py-2 mb-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Current Contact Person:</strong>
                                                        <div className="mt-1">
                                                            <span className="fw-semibold">{selectedUser.fullName}</span> • 
                                                            <span className="text-muted ms-2">{selectedUser.email}</span> • 
                                                            <span className="text-muted ms-2">{selectedUser.userId}</span>
                                                        </div>
                                                    </div>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleClearSelectedUser}>
                                                        <i className="fa fa-times"></i> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* User Search and Selection */}
                                        {!selectedUser && (
                                            <div className="row g-3">
                                                <div className="col-sm-12 mb-2">
                                                    <label className="form-label text-dark fw-bold mb-2 small">
                                                        Assign New Contact Person:
                                                    </label>
                                                    
                                                    {/* Search Input */}
                                                    <div className="input-group mb-2">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-search"></i>
                                                        </span>
                                                        <input type="text" className="form-control shadow-lg" placeholder="Search by name, email, or user ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                                    </div>

                                                    {/* Users List */}
                                                    <div className="border rounded">
                                                        {loadingUsers ? (
                                                            <div className="text-center p-4">
                                                                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                                                <span className="text-muted">Loading users...</span>
                                                            </div>
                                                        ) : users.length === 0 ? (
                                                            <div className="text-center p-4 text-muted">
                                                                <i className="fa fa-user me-2"></i> 
                                                                {searchTerm ? "No users found matching your search" : "No users available"}
                                                            </div>
                                                        ) : (
                                                            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                                                                {users.map((user) => (
                                                                    <div key={user._id} onClick={() => handleSelectUser(user._id)} style={{ cursor: 'pointer' }}
                                                                        className={`px-3 py-1 border-bottom cursor-pointer ${
                                                                            formData.contactPersonId === user._id ? "bg-primary text-white" : "bg-light hover-bg"
                                                                        }`}
                                                                    >
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div>
                                                                                <h6 className="mb-0 fw-semibold">{user.fullName || "Unknown User"}</h6>
                                                                                <small className={formData.contactPersonId === user._id ? "text-light" : "text-muted"}>
                                                                                    {user.email} • {user.userId}
                                                                                </small>
                                                                                <div className={formData.contactPersonId === user._id ? "text-light" : "text-muted"}>
                                                                                    <small><b>Status:</b> {user.status} • <b>Phone:</b> {user.phoneNumber || "N/A"}</small>
                                                                                </div>
                                                                            </div>
                                                                            {formData.contactPersonId === user._id && (<i className="fa fa-check text-white"></i>)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <small className="text-muted mt-2 d-block">
                                                        Click on a user to assign them as the company contact person. Leave empty to remove current contact person.
                                                    </small>
                                                </div>
                                            </div>
                                        )}

                                        {/* footer buttons */}
                                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                            <button type="button" onClick={handleCancel} className="btn btn-light border">
                                                <i className="fa fa-times me-1"></i> Cancel
                                            </button>
                                            <button type="submit" disabled={loading} className="btn btn-sm btn-primary" style={{ backgroundColor: "#E35D3F", borderColor: "#E35D3F" }}>
                                                {loading ? (
                                                    <><span className="spinner-border spinner-border-sm text-white me-2" role="status"></span> Updating...</>
                                                ) : (
                                                    <><i className="fa fa-save me-1"></i> Update Company</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}