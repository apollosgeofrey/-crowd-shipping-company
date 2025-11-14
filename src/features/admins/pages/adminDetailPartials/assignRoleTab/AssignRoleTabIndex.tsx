import Swal from "sweetalert2";
import { useState } from "react";
import { adminApi } from "../../../services/adminApi";

interface AssignRoleTabIndexProps {
    admin: any;
    onAdminUpdate: (updatedAdmin: any) => void;
}


export default function AssignRoleTabIndex({ admin, onAdminUpdate }: AssignRoleTabIndexProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        status: admin?.status || "active",
        role: admin?.role || "",
        notes: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();        
        if (!admin?._id) {
            Swal.fire("Error", "Admin ID not found", "error");
            return;
        }

        if (!formData.role) {
            Swal.fire("Error", "Please select a role", "error");
            return;
        }
        setLoading(true);

        try {
            // Prepare update data - only send role and status, exclude notes if empty
            const updateData: any = {role: formData.role, status: formData.status};

            // Only include notes if provided
            if (formData.notes.trim()) updateData.notes = formData.notes.trim();

            const res = await adminApi.updateAdmin(admin._id, updateData);            
            if (res.code === 200) {
                Swal.fire({timer:2000, icon:"success", title:"Role Updated", showConfirmButton:true, text:(res.message || "Admin role and status updated successfully")});
                onAdminUpdate(res.data);
            } else {
                Swal.fire("Error", res.message || "Failed to update role", "error");
            }
        } catch (err: any) {
            console.log(err);
            Swal.fire("Error", (err?.response?.data?.message || "An error occurred while updating role"), "error");
        } finally {
            setLoading(false);
        }
    };
    const handleReset = () => setFormData({role:(admin?.role || ""), status:(admin?.status || "active"), notes:""});

    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <i className="fa fa-user-shield text-primary"></i> Assign Role & Manage Status
                </h5>

                {/* Current Admin Info */}
                {admin && (
                    <div className="alert alert-info mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Current Admin:</strong> {admin.fullName} <br />
                                <small className="text-muted">
                                    Email: {admin?.email} | Current Role: <span className="badge bg-primary">{admin?.role}</span> | 
                                    Status: <span className={`badge bg-${admin?.status === 'active' ? 'success' : 'warning'}`}>
                                        {admin?.status}
                                    </span>
                                </small>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="row g-3">
                    {/* Select Role */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Select Role <span className="text-danger">*</span>
                        </label>
                        <select name="role" className="form-select shadow-sm" value={formData.role} onChange={handleChange} required>
                            <option value="">-- Choose Role --</option>
                            <option value="admin">Admin</option>
                            <option value="super-admin">Super Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="support">Support</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Status <span className="text-danger">*</span>
                        </label>
                        <select name="status" className="form-select shadow-sm" value={formData.status} onChange={handleChange} required>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                            <option value="blocked">Blocked</option>
                            <option value="deactivated">Deactivated</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div className="col-12">
                        <label className="form-label fw-semibold">Assignment Notes</label>
                        <textarea name="notes" className="form-control shadow-sm" rows={3} value={formData.notes} onChange={handleChange} placeholder="Optional remarks about this role assignment (e.g., reason for change, specific permissions, etc.)"/>
                        <small className="text-muted">This note will be recorded in the admin's update history</small>
                    </div>

                    {/* Role Permissions Info */}
                    <div className="col-12">
                        <div className="card bg-light border-0">
                            <div className="card-body py-3">
                                <h6 className="fw-semibold mb-2">Role Permissions Overview:</h6>
                                <div className="row small text-muted">
                                    <div className="col-md-4">
                                        <strong>Super Admin:</strong> Full system access
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Admin:</strong> Manage users & content
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Moderator:</strong> Content moderation
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Support:</strong> Customer support access
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Viewer:</strong> Read-only access
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button type="button" onClick={handleReset} className="btn btn-outline-secondary px-4" disabled={loading}>
                            <i className="fa fa-times me-2"></i> Reset
                        </button>
                        <button type="submit" className="btn btn-primary px-4" disabled={loading} >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Updating...</>
                            ) : (
                                <><i className="fa fa-key me-2"></i> Update Role & Status</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}