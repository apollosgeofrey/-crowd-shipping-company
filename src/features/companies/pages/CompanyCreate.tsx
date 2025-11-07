import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { companyApi } from "../services/companyApi";
import { userApi } from "../../users/services/userApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function CompanyCreate() {
    // form states
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({type: "", text: ""});
    const [companyOnboardingType, setCompanyOnboardingType] = useState<"new_contact_person" | "existing_contact_person">("new_contact_person");
    
    // Users state for existing contact persons
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // form data
    const [formData, setFormData] = useState({
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
        
        // Contact person info (for new contact person)
        contactPersonFullName: "",
        contactPersonEmail: "",
        contactPersonPhoneNumber: "",
        contactPersonPassword: "",
        contactPersonConfirmPassword: "",
        
        // For existing contact person
        contactPersonId: ""
    });

    // Fetch users when component mounts or when switching to existing contact person
    useEffect(() => {
        if (companyOnboardingType === "existing_contact_person") {
            fetchUsers();
        }
    }, [companyOnboardingType]);

    // Fetch users from API
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
            setMessage({ type: "error", text: "Failed to load users. Please try again." });
        } finally {
            setLoadingUsers(false);
        }
    };

    // Search users with debounce
    useEffect(() => {
        if (companyOnboardingType === "existing_contact_person" && searchTerm) {
            const timer = setTimeout(() => {
                fetchUsers();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, companyOnboardingType]);

    // handlers for form inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handle onboarding type change
    const handleOnboardingTypeChange = (type: "new_contact_person" | "existing_contact_person") => {
        setCompanyOnboardingType(type);
        // Reset contact person fields when switching types
        if (type === "new_contact_person") {
            setFormData(prev => ({...prev, contactPersonId: ""}));
        } else {
            setFormData(prev => ({
                ...prev,
                contactPersonFullName: "",
                contactPersonEmail: "",
                contactPersonPhoneNumber: "",
                contactPersonPassword: "",
                contactPersonConfirmPassword: ""
            }));
            // Fetch users when switching to existing contact person
            fetchUsers();
        }
    };

    // Select user handler
    const handleSelectUser = (userId: string) => {
        setFormData(prev => ({ ...prev, contactPersonId: userId }));
        setSearchTerm(""); // Clear search after selection
    };

    // Clear selected user
    const handleClearSelectedUser = () => setFormData(prev => ({ ...prev, contactPersonId: "" }));

    // handlers for form actions like clear
    const handleClear = () => {
        setFormData({
            name: "",
            email: "",
            phoneNumber: "",
            incorporationDate: "",
            rcNumber: "",
            taxId: "",
            address: "",
            cityState: "",
            status: "pending",
            contactPersonFullName: "",
            contactPersonEmail: "",
            contactPersonPhoneNumber: "",
            contactPersonPassword: "",
            contactPersonConfirmPassword: "",
            contactPersonId: ""
        });
        setCompanyOnboardingType("new_contact_person");
        setSearchTerm("");
    };

    // form submit handler for creating company
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for new contact person
        if (companyOnboardingType === "new_contact_person") {
            if (formData.contactPersonPassword !== formData.contactPersonConfirmPassword) {
                setMessage({ type: "error", text: "Contact person passwords do not match." });
                return;
            }

            if (formData.contactPersonPassword && formData.contactPersonPassword.length < 8) {
                setMessage({ type: "error", text: "Contact person password must be at least 8 characters." });
                return;
            }
        }

        // Validation for existing contact person
        if (companyOnboardingType === "existing_contact_person" && !formData.contactPersonId) {
            setMessage({ type: "error", text: "Please select an existing contact person." });
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
            // Prepare payload based on onboarding type
            const payload: any = {
                companyOnboardingType,
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                status: formData.status
            };

            // Add optional company fields if provided
            if (formData.incorporationDate) payload.incorporationDate = formData.incorporationDate;
            if (formData.rcNumber) payload.rcNumber = formData.rcNumber;
            if (formData.taxId) payload.taxId = formData.taxId;
            if (formData.address) payload.address = formData.address;
            if (formData.cityState) payload.cityState = formData.cityState;

            // Add contact person data based on type
            if (companyOnboardingType === "new_contact_person") {
                payload.contactPersonFullName = formData.contactPersonFullName;
                payload.contactPersonEmail = formData.contactPersonEmail;
                payload.contactPersonPhoneNumber = formData.contactPersonPhoneNumber;
                payload.contactPersonPassword = formData.contactPersonPassword;
                payload.contactPersonConfirmPassword = formData.contactPersonConfirmPassword;
            } else {
                payload.contactPersonId = formData.contactPersonId;
            }

            const res = await companyApi.createCompany(payload);
            if (res.code === 201) {
                setMessage({ type: "success", text: res.message || "Company created successfully." });
                Swal.fire("Success", (res.message || "Company created successfully."), "success");
                handleClear();
            } else {
                setMessage({ type: "error", text: res.message || "Failed to create company." });
                Swal.fire("Error", (res.message || "Failed to create company."), "error");
            }
        } catch (err: any) {
            setMessage({type: "error", text: err?.response?.data?.message || "An error occurred while creating company."});
            Swal.fire("Error", (err?.response?.data?.message || "An error occurred while creating company."), "error");
        } finally {
            setLoading(false);
        }
    };

    // Get selected user details
    const selectedUser = users.find(user => user._id === formData.contactPersonId);

    return (
        <DashboardLayout>
            <div className="card shadow-sm rounded p-4">
                <div className="container mt-0">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10">

                            {/* main card */}
                            <div className="card shadow-sm border-0 p-2">

                                {/* tabs bar */}
                                <div className="d-flex mb-4">
                                    <button type="button" className="btn btn-link text-decoration-none text-primary fw-semibold border-bottom" style={{ borderBottom: "3px solid #E35D3F" }}>
                                        <h5>
                                            <i className="fa fa-building me-1"></i> Company Information
                                        </h5>
                                    </button>
                                </div>

                                <div className="card-body">
                                    {/* alerts */}
                                    {message.text && (
                                        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>

                                        {/* Onboarding Type Selection */}
                                        <div className="row mb-4">
                                            <div className="col-12">
                                                <label className="form-label text-dark fw-bold mb-2">
                                                    Onboarding Type:<span className="text-danger">*</span>
                                                </label>
                                                <div className="d-flex gap-3">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="onboardingType" id="newContactPerson"
                                                            checked={companyOnboardingType === "new_contact_person"}
                                                            onChange={() => handleOnboardingTypeChange("new_contact_person")}
                                                        />
                                                        <label className="form-check-label fw-semibold" htmlFor="newContactPerson">
                                                            Create New Contact Person
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="onboardingType" id="existingContactPerson"
                                                            checked={companyOnboardingType === "existing_contact_person"}
                                                            onChange={() => handleOnboardingTypeChange("existing_contact_person")}
                                                        />
                                                        <label className="form-check-label fw-semibold" htmlFor="existingContactPerson">
                                                            Use Existing Contact Person
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="my-4" />

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
                                                <input type="date" name="incorporationDate" value={formData.incorporationDate} onChange={handleChange} className="form-control shadow-lg"/>
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

                                        {/* Contact Person Information */}
                                        {companyOnboardingType === "new_contact_person" ? (
                                            <>
                                                <p className="fw-semibold mb-2">
                                                    <span className="fa fa-user"></span> CONTACT PERSON INFORMATION
                                                </p>
                                                <div className="row g-3">
                                                    {/* Contact Person Full Name */}
                                                    <div className="col-sm-12 col-md-6 mb-2">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Full Name:<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" name="contactPersonFullName" value={formData.contactPersonFullName} onChange={handleChange} required className="form-control shadow-lg" placeholder="e.g. John Adebayo"/>
                                                    </div>

                                                    {/* Contact Person Email */}
                                                    <div className="col-sm-12 col-md-6 mb-2">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Email:<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="email" name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleChange} required className="form-control shadow-lg" placeholder="person@example.com"/>
                                                    </div>

                                                    {/* Contact Person Phone */}
                                                    <div className="col-sm-12 col-md-6 mb-2">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Phone Number:<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="tel" name="contactPersonPhoneNumber" value={formData.contactPersonPhoneNumber} onChange={handleChange} required className="form-control shadow-lg" placeholder="+234 801 234 5678"/>
                                                    </div>
                                                </div>

                                                <hr className="my-4" />

                                                {/* Contact Person Security */}
                                                <p className="fw-semibold mb-2">
                                                    <span className="fa fa-lock"></span> CONTACT PERSON SECURITY ACCESS
                                                </p>
                                                <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 mb-2">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Password:<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="password" name="contactPersonPassword" value={formData.contactPersonPassword} onChange={handleChange} required className="form-control shadow-lg" placeholder="Minimum 8 characters"/>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 mb-2">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Confirm Password:<span className="text-danger">*</span>
                                                        </label>
                                                        <input type="password" name="contactPersonConfirmPassword" value={formData.contactPersonConfirmPassword} onChange={handleChange} required className="form-control shadow-lg" placeholder="Re-enter password"/>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="fw-semibold mb-2">
                                                    <span className="fa fa-user"></span> EXISTING CONTACT PERSON
                                                </p>
                                                
                                                {/* Selected User Display */}
                                                {selectedUser && (
                                                    <div className="alert alert-info py-2 mb-2">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>Selected Contact Person:</strong>
                                                                <div className="mt-1">
                                                                    <span className="fw-semibold">{selectedUser.fullName}</span> • 
                                                                    <span className="text-muted ms-2">{selectedUser.email}</span> • 
                                                                    <span className="text-muted ms-2">{selectedUser.userId}</span>
                                                                </div>
                                                            </div>
                                                            <button type="button" className="btn btn-sm btn-outline-danger"onClick={handleClearSelectedUser}>
                                                                <i className="fa fa-times"></i> Change
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* User Search and Selection */}
                                                {!selectedUser && (
                                                    <div className="row g-3">
                                                        <div className="col-sm-12 mb-2">
                                                            <label className="form-label text-dark fw-bold mb-2 small">
                                                                Search and Select Contact Person:<span className="text-danger">*</span>
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
                                                                    <div className="text-center p-4 py-0 text-muted">
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
                                                                                        <h6 className="mb-1 fw-semibold">{user.fullName || "Unknown User"}</h6>
                                                                                        <small className={formData.contactPersonId === user._id ? "text-light" : "text-muted"}>
                                                                                            {user.email} • {user.userId}
                                                                                        </small>
                                                                                        <div className={formData.contactPersonId === user._id ? "text-light" : "text-muted"}>
                                                                                            <small>Status: {user.status} • Phone: {user.phoneNumber || "N/A"}</small>
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
                                                                Click on a user to select them as the company contact person.
                                                            </small>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* footer buttons */}
                                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                            <button type="button" onClick={handleClear} className="btn btn-light border">
                                                <i className="fa fa-times me-1"></i> Clear
                                            </button>
                                            <button type="submit" disabled={loading} className="btn btn-sm btn-primary" style={{ backgroundColor: "#E35D3F", borderColor: "#E35D3F" }}>
                                                {loading ? (
                                                    <><span className="spinner-border spinner-border-sm text-white me-2" role="status"></span> Creating...</>
                                                ) : (
                                                    <><i className="fa fa-save me-1"></i> Create Company</>
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