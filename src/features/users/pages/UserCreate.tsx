import Swal from "sweetalert2";
import { useState } from "react";
import { userApi } from "../services/userApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function UserCreate() {
    // form states
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({type: "", text: ""});
    const [formData, setFormData] = useState<any>({fullName:"", email:"", phoneNumber:"", password:"", confirmPassword:"", status:"active"});

    // handlers for form inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    // handlers for form actions like clear
    const handleClear = () => {
        setFormData({fullName:"", email:"", phoneNumber:"", password:"", confirmPassword:"", status:"active"});
    };

    // form submit handler for creating user
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            Swal.fire("Success", ("Passwords do not match."), "success");
            return;
        }

        if (formData.password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters." });
            Swal.fire("Success", ("Password must be at least 8 characters."), "success");
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await userApi.createUser(formData);
            if (res.code === 201) {
                setMessage({ type: "success", text: res.message || "User created successfully." });
                Swal.fire("Success", (res.message || "User created successfully."), "success");
                handleClear();
            } else {
                setMessage({ type: "error", text: res.message || "Failed to create user." });
                Swal.fire("Error", (res.message || "Failed to create user."), "error");
            }
        } catch (err: any) {
            setMessage({type: "error", text: err?.response?.data?.message || "An error occurred."});
            Swal.fire("Error", (err?.response?.data?.message || "An error occurred."), "error");
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

                                {/* tabs bar (fake) to match your detail page */}
                                <div className="d-flex mb-4">
                                    <button type="button" className="btn btn-link text-decoration-none text-primary fw-semibold border-bottom" style={{ borderBottom: "3px solid #E35D3F" }}>
                                        <h5>
                                            <i className="fa fa-user me-1"></i> Basic Information
                                        </h5>
                                    </button>
                                    {/*<button type="button" className="btn btn-link text-decoration-none text-primary fw-semibold border-bottom" disabled>
                                        <i className="fa fa-file me-1"></i> Documents
                                    </button>
                                    <button type="button" className="btn btn-link text-decoration-none text-primary fw-semibold border-bottom" disabled>
                                        <i className="fa fa-credit-card me-1"></i> Payment Info                            
                                    </button>*/}
                                </div>

                                <div className="card-body">
                                    {/* alerts */}
                                    {message.text && (
                                        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2`}>{message.text}</div>
                                    )}

                                    <form onSubmit={handleSubmit}>

                                        <div className="row g-3">
                                            {/* Full Name */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Full Name:<span className="text-danger">*</span>
                                                </label>
                                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="form-control shadow-lg" placeholder="e.g. Emmanuel Okafor"/>
                                            </div>

                                            {/* Email */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Email Address:<span className="text-danger">*</span>
                                                </label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control shadow-lg" placeholder="Enter email address"/>
                                            </div>

                                            {/* Phone */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Phone Number:<span className="text-danger">*</span>
                                                </label>
                                                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="form-control shadow-lg" placeholder="+234 801 234 5678"/>
                                            </div>

                                            {/* Status */}
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Status:<span className="text-danger">*</span>
                                                </label>
                                                <select name="status" value={formData.status} onChange={handleChange} required className="form-select shadow-lg">
                                                    <option value="active">Active</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="blocked">Blocked</option>
                                                    <option value="suspended">Suspended</option>
                                                    <option value="deactivated">Deactivated</option>
                                                </select>
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        {/* security */}
                                        <p className="fw-semibold mb-3"><span className="fa fa-lock"></span> SECURITY ACCESS</p>
                                        <div className="row g-3">
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Password:<span className="text-danger">*</span>
                                                </label>
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-control shadow-lg" placeholder="Minimum 8 characters"/>
                                            </div>

                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Confirm Password:<span className="text-danger">*</span>
                                                </label>
                                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="form-control shadow-lg" placeholder="Re-enter password"/>
                                            </div>
                                        </div>

                                        {/* footer buttons like your detail page bottom-right */}
                                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                            <button type="button" onClick={handleClear} className="btn btn-light border">
                                                <span className="fa fa-times"></span> Clear
                                            </button>
                                            <button type="submit" disabled={loading} className="btn btn-sm btn-primary" style={{ backgroundColor: "#E35D3F", borderColor: "#E35D3F" }}>
                                                {loading ? (
                                                    <><span className="spinner-border spinner-border-sm text-white" role="status"></span> Creating...</>
                                                ) : (
                                                    <><span className="fa fa-save"></span> Create User</>
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