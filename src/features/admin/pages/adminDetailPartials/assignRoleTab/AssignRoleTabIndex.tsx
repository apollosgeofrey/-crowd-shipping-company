// pages/admin/tabs/AssignRoleTabIndex.tsx
import { useState } from "react";
import Swal from "sweetalert2";

export default function AssignRoleTabIndex() {
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Active");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Replace with API call to assign role
        console.log("Assigned Role:", role, "Status:", status);
        Swal.fire("Error", "Invalid credentials", "error");
    };

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                <h5 className="fw-bold mb-4">Assign Role</h5>

                <form onSubmit={handleSubmit} className="row g-3">
                    {/* Select Role */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Select Role</label>
                        <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        >
                        <option value="">-- Choose Role --</option>
                        <option value="Admin 1">Admin 1</option>
                        <option value="Admin 2">Admin 2</option>
                        <option value="Admin 3">Admin 3</option>
                        <option value="Super Admin">Super Admin</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">Notes</label>
                        <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Optional remarks about this role assignment..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                        <button
                        type="reset"
                        className="btn btn-outline-secondary px-4"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="btn btn-primary px-4"
                        >
                        <i className="fa fa-key me-2"></i> Assign Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
