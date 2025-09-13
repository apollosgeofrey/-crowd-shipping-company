
// pages/admin/AdminCreate.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

export default function AdminCreate() {
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("Admin 1");
    const roles = ["Admin", "Super Admin", "Admin 2", "Admin 1", "Admin 3", "Admin 4"];
    
    {/* Header Section */}
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="fw-bold mb-1">Choose User</h5>
                    <p className="text-muted small mb-0">Choose your user and continue</p>
                </div>

                {/* Only enable Next when user is selected */}
                {selectedUserId ? (
                <Link to={`/admin/${selectedUserId}/show`} className="btn btn-primary fw-semibold d-flex align-items-center gap-2">
                    <i className="fa fa-save"></i> Next
                </Link>
                ) : (
                <button className="btn btn-primary fw-semibold d-flex align-items-center gap-2" disabled>
                    <i className="fa fa-save"></i> Next
                </button>
                )}
            </div>

            {/* User Selection */}
            <div className="mb-4">
                <select className="form-select form-select-lg border rounded-3 shadow-sm" value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">-- Select a User --</option>
                    <option value="1">John Ashernine (john@example.com)</option>
                    <option value="2">Christine Brooks (christine@example.com)</option>
                    <option value="3">Alan Cain (alan@example.com)</option>
                </select>
            </div>

            <hr />
            <h5 className="fw-bold mb-3">Choose User Admin Role</h5>

            {/* Roles Grid */}
            <div className="row g-3">
                {roles.map((role) => (
                    <div key={role} className="col-md-6">
                        <button type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`w-100 d-flex justify-content-between align-items-center p-3 border rounded fw-semibold 
                            ${selectedRole === role ? "border-2 border-primary bg-light" : "bg-light-subtle"}`}
                        >
                            <span className={`${selectedRole === role ? "text-dark" : "text-muted"}`}>{role}</span>
                            {selectedRole === role && (<span className="text-primary fs-5"><FaCheck /></span>)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}




