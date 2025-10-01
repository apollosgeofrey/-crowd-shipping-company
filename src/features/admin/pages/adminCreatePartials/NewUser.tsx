// pages/admin/adminCreatePartials/NewUser.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NewUser() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        dob: "",
        maritalStatus: "",
        gender: "",
        role: "",
        address: "",
        city: "",
        state: "",
        staffId: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.currentTarget; // currentTarget is strongly typed
        setFormData(prev => ({ ...prev, [name]: value }));
        // setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="card shadow-sm rounded p-4">
        {/* Header */}
        <div className="d-flex align-items-center mb-3 border-bottom pb-2">
            <i className="fa fa-user text-danger me-2"></i>
            <h6 className="fw-bold text-danger mb-0">Personal Information</h6>
        </div>

        <form method="">
            <div className="row g-3">
                {/* Upload Image */}
                <div className="col-12 col-md-3 col-lg-2 text-center">
                    <div className="border rounded d-flex align-items-center justify-content-center"
                    style={{ width: "150px", height: "150px", cursor: "pointer" }}>
                        <i className="fa fa-camera text-muted"></i>
                    </div>
                </div>

                <div className="col-12 col-md-9 col-lg-10">
                    <div className="row g-3">
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFor="firstName">First Name:<sup className="text-danger">*</sup></label> */}
                            <input type="text" name="firstName" className="form-control" placeholder="First Name" value={formData.firstName} onChange={handleChange}/>
                        </div>
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFor="lastName">Last Name:<sup className="text-danger">*</sup></label> */}
                            <input type="text" name="lastName" className="form-control" placeholder="Last Name" value={formData.lastName} onChange={handleChange}/>
                        </div>
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFocol-lg-10r="mobile">Mobile Number:<sup className="text-danger">(Optional)</sup></label> */}
                            <input type="text" name="mobile" className="form-control" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange}/>
                        </div>
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFor="email">Email Address:<sup className="text-danger">*</sup></label> */}
                            <input type="email" name="email" className="form-control" placeholder="Email Address" value={formData.email} onChange={handleChange}/>
                        </div>
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFor="dob">Date of Birth:<sup className="text-danger">*</sup></label> */}
                            <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange}/>
                        </div>
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFor="maritalStatus">Marital Status:<sup className="text-danger">*</sup></label> */}
                            <select name="maritalStatus" className="form-select" value={formData.maritalStatus} onChange={handleChange}>
                                <option value="">Marital Status</option>
                                <option>Single</option>
                                <option>Married</option>
                                <option>Divorced</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFor="gender">Gender:<sup className="text-danger">*</sup></label> */}
                            <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                                <option value="">Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            {/* <label className="fw-bold" htmlFor="role">Role:<sup className="text-danger">*</sup></label> */}
                            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                                <option value="">Role</option>
                                <option>Admin</option>
                                <option>Super Admin</option>
                                <option>Admin 1</option>
                                <option>Admin 2</option>
                                <option>Admin 3</option>
                            </select>
                        </div>
                        <div className="col-12 mb-3">
                            {/* <label className="fw-bold" htmlFor="address">Address:<sup className="text-danger">*</sup></label> */}
                            <textarea name="address" className="form-control" placeholder="House Address" value={formData.address} onChange={handleChange}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            {/* <label className="fw-bold" htmlFor="city">City:<sup className="text-danger">*</sup></label> */}
                            <input type="text" name="city" className="form-control" placeholder="City" value={formData.city} onChange={handleChange}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            {/* <label className="fw-bold" htmlFor="state">State:<sup className="text-danger">*</sup></label> */}
                            <input type="text" name="state" className="form-control" placeholder="State" value={formData.state} onChange={handleChange}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            {/* <label className="fw-bold" htmlFor="staffId">Staff ID:<sup className="text-danger">*</sup></label> */}
                            <input type="text" name="staffId" className="form-control" placeholder="Staff ID No." value={formData.staffId} onChange={handleChange}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-end mt-4 gap-2">
                <button type="button" className="btn btn-outline-secondary">
                    <span className="fa fa-times"></span>Cancel
                </button>
                {/* <button type="submit" className="btn btn-primary">
                    Next<span className="fa fa-chevron-right"></span>
                </button> */}
                <Link to="/admin/1/show" className="btn btn-primary d-flex align-items-center gap-2">
                    Next <span className="fa fa-chevron-right"></span>
                </Link>

            </div>
        </form>
        </div>
    );
}
