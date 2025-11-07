import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pathfinderApi } from "../services/pathfinderApi";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function PathfinderEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // form states
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({type: "", text: ""});
    const [formData, setFormData] = useState({fullName: "", email: "", phoneNumber: "", password: "", confirmPassword: "", status: "active"});

    // Fetch pathfinder data on component mount
    useEffect(() => {
        const fetchPathfinder = async () => {
            if (!id) return;
            
            try {
                setFetchLoading(true);
                const res = await pathfinderApi.getPathfinderById(id);
                if (res.code === 200 && res.data) {
                    const pathfinder = res.data;
                    setFormData({
                        fullName: pathfinder.fullName || "",
                        email: pathfinder.email || "",
                        phoneNumber: pathfinder.phoneNumber || "",
                        password: "", // Don't pre-fill password for security
                        confirmPassword: "",
                        status: pathfinder.status || "active"
                    });
                } else {
                    setMessage({ type: "error", text: "Failed to load pathfinder data." });
                }
            } catch (err: any) {
                setMessage({type: "error", text: err?.response?.data?.message || "An error occurred while loading data."});
            } finally {
                setFetchLoading(false);
            }
        };

        fetchPathfinder();
    }, [id]);

    // handlers for form inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // form submit handler for updating pathfinder
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            setMessage({ type: "error", text: "Invalid pathfinder ID." });
            return;
        }

        // Only validate passwords if they are provided (for update)
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        if (formData.password && formData.password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Remove password fields if they are empty (don't update password)
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.confirmPassword;
            }

            const res = await pathfinderApi.updatePathfinder(id, updateData);
            if (res.code === 200) {
                setMessage({ type: "success", text: res.message || "Pathfinder updated successfully." });
                
                // Clear password fields after successful update
                setFormData(prev => ({...prev, password: "", confirmPassword: ""}));
            } else {
                setMessage({ type: "error", text: res.message || "Failed to update pathfinder." });
            }
        } catch (err: any) {
            setMessage({type: "error", text: err?.response?.data?.message || "An error occurred while updating."});
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel and go back and Go back to previous page
    const handleCancel = () => navigate(-1);

    if (fetchLoading) {
        return (
            <DashboardLayout>
                <div className="container mt-0">
                    <div className="row justify-content-center">
                        <div className="col-sm-12">
                            <div className="card shadow-sm border-0 p-5 d-flex align-items-center justify-content-center text-center" style={{ minHeight: "250px" }}>
                                <div>
                                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 mb-0 text-muted fw-semibold">Loading pathfinder data...</p>
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
                                                <i className="fa fa-edit me-1"></i> Edit Information
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

                                        {/* security - Optional for update */}
                                        <p className="fw-semibold mb-3">
                                            <span className="fa fa-lock"></span> CHANGE PASSWORD <sup className='text-danger'>(Optional)</sup>
                                        </p>
                                        <div className="row g-3">
                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    New Password:
                                                </label>
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control shadow-lg" placeholder="Leave blank to keep current password"/>
                                                <small className="text-muted">Minimum 8 characters</small>
                                            </div>

                                            <div className="col-sm-12 col-md-6 mb-3">
                                                <label className="form-label text-dark fw-bold mb-0 small">
                                                    Confirm New Password:
                                                </label>
                                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control shadow-lg" placeholder="Re-enter new password"/>
                                            </div>
                                        </div>

                                        {/* footer buttons */}
                                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                            <button type="button" onClick={handleCancel} className="btn btn-light border">
                                                <span className="fa fa-times"></span> Cancel
                                            </button>
                                            <button type="submit" disabled={loading} className="btn btn-sm btn-primary" style={{ backgroundColor: "#E35D3F", borderColor: "#E35D3F" }}>
                                                {loading ? (
                                                    <><span className="spinner-border spinner-border-sm text-white" role="status"></span> Updating...</>
                                                ) : (
                                                    <><span className="fa fa-save"></span> Update Pathfinder</>
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