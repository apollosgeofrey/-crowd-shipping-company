import { useState } from "react";
import { adminApi } from "../../services/adminApi";

export default function NewUser() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({type: "", text: ""});    
    const [formData, setFormData] = useState({userId:"", fullName:"", email:"", phoneNumber:"", password:"", confirmPassword:"", role:"admin", status:"active"});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // gandlue clear
    const handleClear = () => setFormData({userId:"", fullName:"", email:"", phoneNumber:"", password:"", confirmPassword:"", role:"admin", status:"active"});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        if (formData.password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Remove userId if empty (optional field)
            const submitData = { ...formData };
            if (!submitData.userId) delete submitData.userId;

            const res = await adminApi.createAdmin(submitData);
            if (res.code === 201) {
                setMessage({ type: "success", text: res.message || "Admin created successfully." });
                handleClear();
            } else {
                setMessage({ type: "error", text: res.message || "Failed to create admin." });
            }
        } catch (err: any) {
            setMessage({type: "error", text: err?.response?.data?.message || "An error occurred."});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-0">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10">

                    <div className="card shadow-sm border-0 p-2">
                        {/* Header */}
                        <div className="d-flex mb-4">
                            <button type="button" className="btn btn-link text-decoration-none text-primary fw-semibold border-bottom" style={{ borderBottom: "3px solid #E35D3F" }}>
                                <h5><i className="fa fa-user-shield me-1"></i> Create New Admin</h5>
                            </button>
                        </div>

                        <div className="card-body">
                            {/* alerts */}
                            {message.text && (
                                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} py-2`}>{message.text}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Staff ID (Optional) */}
                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">Staff ID:</label>
                                        <input type="text" name="userId" value={formData.userId} onChange={handleChange} className="form-control shadow-lg" placeholder="CS/STAFF/2025/002 (Optional)"/>
                                    </div>

                                    {/* Full Name */}
                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">
                                            Full Name:<span className="text-danger">*</span>
                                        </label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="form-control shadow-lg" placeholder="e.g. Jane Admin"/>
                                    </div>

                                    {/* Email */}
                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">
                                            Email Address:<span className="text-danger">*</span>
                                        </label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange}required className="form-control shadow-lg" placeholder="Enter email address"/>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">
                                            Phone Number:<span className="text-danger">*</span>
                                        </label>
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}required className="form-control shadow-lg" placeholder="+2348012345678"/>
                                    </div>

                                    {/* Role */}
                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">
                                            Role:<span className="text-danger">*</span>
                                        </label>
                                        <select name="role" value={formData.role} onChange={handleChange}required className="form-select shadow-lg">
                                            <option value="admin">Admin</option>
                                            <option value="super-admin">Super Admin</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="support">Support</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">
                                            Status:<span className="text-danger">*</span>
                                        </label>
                                        <select name="status" value={formData.status} onChange={handleChange}required className="form-select shadow-lg">
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
                                <p className="fw-semibold mb-3">
                                    <span className="fa fa-lock"></span> SECURITY ACCESS
                                </p>
                                <div className="row g-3">
                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">
                                            Password:<span className="text-danger">*</span>
                                        </label>
                                        <input type="password" name="password" value={formData.password} onChange={handleChange}required className="form-control shadow-lg" placeholder="Minimum 8 characters"/>
                                    </div>

                                    <div className="col-sm-12 col-md-6 mb-3">
                                        <label className="form-label text-dark fw-bold mb-0 small">
                                            Confirm Password:<span className="text-danger">*</span>
                                        </label>
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}required className="form-control shadow-lg" placeholder="Re-enter password"/>
                                    </div>
                                </div>

                                {/* footer buttons */}
                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <button type="button" onClick={handleClear} className="btn btn-secondary border">
                                        <span className="fa fa-times"></span> Clear
                                    </button>
                                    <button type="submit" disabled={loading} className="btn btn-sm btn-primary" style={{ backgroundColor: "#E35D3F", borderColor: "#E35D3F" }}>
                                        {loading ? (
                                            <><span className="spinner-border spinner-border-sm text-white" role="status"></span> Creating...</>
                                        ) : (
                                            <><span className="fa fa-save"></span> Create Admin</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}