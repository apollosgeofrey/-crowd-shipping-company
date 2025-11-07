import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { companyApi } from "../services/companyApi";

export default function CompanyCreate() {
    // form states
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({type: "", text: ""});
    const [companyOnboardingType, setCompanyOnboardingType] = useState<"new_contact_person" | "existing_contact_person">("new_contact_person");
    
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
            setFormData(prev => ({
                ...prev,
                contactPersonId: ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                contactPersonFullName: "",
                contactPersonEmail: "",
                contactPersonPhoneNumber: "",
                contactPersonPassword: "",
                contactPersonConfirmPassword: ""
            }));
        }
    };

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
                handleClear();
            } else {
                setMessage({ type: "error", text: res.message || "Failed to create company." });
            }
        } catch (err: any) {
            setMessage({type: "error", text: err?.response?.data?.message || "An error occurred while creating company."});
        } finally {
            setLoading(false);
        }
    };

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
                                                <label className="form-label text-dark fw-bold mb-3">
                                                    Onboarding Type:<span className="text-danger">*</span>
                                                </label>
                                                <div className="d-flex gap-3">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="onboardingType"
                                                            id="newContactPerson"
                                                            checked={companyOnboardingType === "new_contact_person"}
                                                            onChange={() => handleOnboardingTypeChange("new_contact_person")}
                                                        />
                                                        <label className="form-check-label fw-semibold" htmlFor="newContactPerson">
                                                            Create New Contact Person
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="onboardingType"
                                                            id="existingContactPerson"
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
                                        <p className="fw-semibold mb-3">
                                            <span className="fa fa-building"></span> COMPANY BASIC INFORMATION
                                        </p>
                                        <div className="row g-3">
                                            {/* Company Name */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Company Name:<span className="text-danger">*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="name" 
                                                    value={formData.name} 
                                                    onChange={handleChange} 
                                                    required 
                                                    className="form-control shadow-lg" 
                                                    placeholder="e.g. Tech Innovations Ltd"
                                                />
                                            </div>

                                            {/* Company Email */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Company Email:<span className="text-danger">*</span>
                                                </label>
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    value={formData.email} 
                                                    onChange={handleChange} 
                                                    required 
                                                    className="form-control shadow-lg" 
                                                    placeholder="company@example.com"
                                                />
                                            </div>

                                            {/* Phone Number */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Phone Number:
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    name="phoneNumber" 
                                                    value={formData.phoneNumber} 
                                                    onChange={handleChange} 
                                                    className="form-control shadow-lg" 
                                                    placeholder="+234 801 234 5678"
                                                />
                                            </div>

                                            {/* Status */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Status:<span className="text-danger">*</span>
                                                </label>
                                                <select 
                                                    name="status" 
                                                    value={formData.status} 
                                                    onChange={handleChange} 
                                                    required 
                                                    className="form-select shadow-lg"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        {/* Company Additional Information */}
                                        <p className="fw-semibold mb-3">
                                            <span className="fa fa-info-circle"></span> COMPANY ADDITIONAL INFORMATION
                                        </p>
                                        <div className="row g-3">
                                            {/* RC Number */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    RC Number:
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="rcNumber" 
                                                    value={formData.rcNumber} 
                                                    onChange={handleChange} 
                                                    className="form-control shadow-lg" 
                                                    placeholder="RC123456789"
                                                />
                                            </div>

                                            {/* Tax ID */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Tax ID:
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="taxId" 
                                                    value={formData.taxId} 
                                                    onChange={handleChange} 
                                                    className="form-control shadow-lg" 
                                                    placeholder="TIN987654321"
                                                />
                                            </div>

                                            {/* Incorporation Date */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Incorporation Date:
                                                </label>
                                                <input 
                                                    type="date" 
                                                    name="incorporationDate" 
                                                    value={formData.incorporationDate} 
                                                    onChange={handleChange} 
                                                    className="form-control shadow-lg" 
                                                />
                                            </div>

                                            {/* City/State */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    City & State:
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="cityState" 
                                                    value={formData.cityState} 
                                                    onChange={handleChange} 
                                                    className="form-control shadow-lg" 
                                                    placeholder="Lagos, Nigeria"
                                                />
                                            </div>

                                            {/* Address */}
                                            <div className="col-sm-12 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Address:
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="address" 
                                                    value={formData.address} 
                                                    onChange={handleChange} 
                                                    className="form-control shadow-lg" 
                                                    placeholder="123 Business Avenue, Victoria Island"
                                                />
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        {/* Contact Person Information */}
                                        {companyOnboardingType === "new_contact_person" ? (
                                            <>
                                                <p className="fw-semibold mb-3">
                                                    <span className="fa fa-user"></span> CONTACT PERSON INFORMATION
                                                </p>
                                                <div className="row g-3">
                                                    {/* Contact Person Full Name */}
                                                    <div className="col-sm-12 col-md-6 mb-3">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Full Name:<span className="text-danger">*</span>
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            name="contactPersonFullName" 
                                                            value={formData.contactPersonFullName} 
                                                            onChange={handleChange} 
                                                            required 
                                                            className="form-control shadow-lg" 
                                                            placeholder="e.g. John Adebayo"
                                                        />
                                                    </div>

                                                    {/* Contact Person Email */}
                                                    <div className="col-sm-12 col-md-6 mb-3">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Email:<span className="text-danger">*</span>
                                                        </label>
                                                        <input 
                                                            type="email" 
                                                            name="contactPersonEmail" 
                                                            value={formData.contactPersonEmail} 
                                                            onChange={handleChange} 
                                                            required 
                                                            className="form-control shadow-lg" 
                                                            placeholder="person@example.com"
                                                        />
                                                    </div>

                                                    {/* Contact Person Phone */}
                                                    <div className="col-sm-12 col-md-6 mb-3">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Phone Number:<span className="text-danger">*</span>
                                                        </label>
                                                        <input 
                                                            type="tel" 
                                                            name="contactPersonPhoneNumber" 
                                                            value={formData.contactPersonPhoneNumber} 
                                                            onChange={handleChange} 
                                                            required 
                                                            className="form-control shadow-lg" 
                                                            placeholder="+234 801 234 5678"
                                                        />
                                                    </div>
                                                </div>

                                                <hr className="my-4" />

                                                {/* Contact Person Security */}
                                                <p className="fw-semibold mb-3">
                                                    <span className="fa fa-lock"></span> CONTACT PERSON SECURITY ACCESS
                                                </p>
                                                <div className="row g-3">
                                                    <div className="col-sm-12 col-md-6 mb-3">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Password:<span className="text-danger">*</span>
                                                        </label>
                                                        <input 
                                                            type="password" 
                                                            name="contactPersonPassword" 
                                                            value={formData.contactPersonPassword} 
                                                            onChange={handleChange} 
                                                            required 
                                                            className="form-control shadow-lg" 
                                                            placeholder="Minimum 8 characters"
                                                        />
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 mb-3">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Confirm Password:<span className="text-danger">*</span>
                                                        </label>
                                                        <input 
                                                            type="password" 
                                                            name="contactPersonConfirmPassword" 
                                                            value={formData.contactPersonConfirmPassword} 
                                                            onChange={handleChange} 
                                                            required 
                                                            className="form-control shadow-lg" 
                                                            placeholder="Re-enter password"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="fw-semibold mb-3">
                                                    <span className="fa fa-user"></span> EXISTING CONTACT PERSON
                                                </p>
                                                <div className="row g-3">
                                                    <div className="col-sm-12 mb-3">
                                                        <label className="form-label text-dark fw-bold mb-0 small">
                                                            Contact Person ID:<span className="text-danger">*</span>
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            name="contactPersonId" 
                                                            value={formData.contactPersonId} 
                                                            onChange={handleChange} 
                                                            required 
                                                            className="form-control shadow-lg" 
                                                            placeholder="Enter existing contact person ID"
                                                        />
                                                        <small className="text-muted">
                                                            Enter the user ID of an existing contact person to assign as company representative.
                                                        </small>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* footer buttons */}
                                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                            <button type="button" onClick={handleClear} className="btn btn-light border">
                                                <span className="fa fa-times"></span> Clear
                                            </button>
                                            <button type="submit" disabled={loading} className="btn btn-sm btn-primary" style={{ backgroundColor: "#E35D3F", borderColor: "#E35D3F" }}>
                                                {loading ? <><span className="spinner-border spinner-border-sm text-white" role="status"></span> Creating...</> : <><span className="fa fa-save"></span> Create Company</>}
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