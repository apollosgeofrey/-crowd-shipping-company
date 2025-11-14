// pages/admin/AdminCreate.tsx
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import { FaCheck, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../../../users/services/userApi";

export default function AdminCreate() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedRole, setSelectedRole] = useState("admin");
    const [loadingFormSubmission, setLoadingFormSubmission] = useState(false);

    const roles = [
        { value: "admin", label: "Admin" },
        { value: "super-admin", label: "Super Admin" },
        { value: "moderator", label: "Moderator" },
        { value: "support", label: "Support" },
        { value: "manager", label: "Manager" },
        { value: "viewer", label: "Viewer" }
    ];

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const res = await userApi.getUsers({limit: 100, status: 'active'});
                if (res.code === 200 && res.data) setUsers(res.data.items || []);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get selected user details
    const selectedUser = users.find(user => user._id === selectedUserId);

    // Handle immediate admin creation
    const handlePromotionToAdmin = async () => {
        if (!selectedUserId || !selectedRole) return;

        try {
            // Update user role to admin
            setLoadingFormSubmission(true);
            const res = await adminApi.promoteToAdmin(selectedUserId, {role:selectedRole});

            if (res.code === 200) {
                Swal.fire("Success", `Successfully promoted ${selectedUser?.fullName} to ${selectedRole}`, "success");
                navigate("/admins"); // Redirect to admins list
            } else {
                Swal.fire("Error", (res.message || "Failed to promote admin"), "error");
            }
        } catch (error: any) {
            Swal.fire("Error", (error?.response?.data?.message || "Error promoting to admin"), "error");
        } finally {
            setLoadingFormSubmission(false);
        }
    };

    return (
        <div className="container mt-0">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10">
                    <div className="card shadow-sm border-0 p-4">
                        {/* Header Section */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    <span className="text-primary fa fa-user me-2"></span> Promote User to Admin
                                </h5>
                                <p className="text-muted small mb-0">Select an existing user and assign admin role</p>
                            </div>
                        </div>

                        {/* User Selection Section */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold mb-2"> Step 1: Select User </label>
                            
                            {/* Search Input */}
                            <div className="mb-0">
                                <div className="input-group">
                                    <span className="input-group-text"> <FaSearch className="text-muted" /> </span>
                                    <input type="text" className="form-control" placeholder="Search users by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                </div>
                            </div>

                            {/* Users List */}
                            <div className="border rounded">
                                {loadingUsers ? (
                                    <div className="text-center p-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2 text-muted">Loading users...</p>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="text-center p-4 text-muted">
                                        <p><span className="fa fa-user me-2"></span> No users found</p>
                                    </div>
                                ) : (
                                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                        {filteredUsers.map((user) => (
                                            <div key={user._id} onClick={() => setSelectedUserId(user._id)}
                                            className={`p-1 border-bottom cursor-pointer ${selectedUserId === user._id ? "bg-primary text-white" : "bg-light"}`}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-0">{user.fullName}</h6>
                                                        <small className={selectedUserId === user._id ? "text-light" : "text-muted"}>{user.email} • {user.userId}</small>
                                                    </div>
                                                    {selectedUserId === user._id && (<FaCheck className="text-white" />)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr />

                        {/* Role Selection Section */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold mb-2"> Step 2: Select Admin Role </label>
                            
                            <div className="row g-2">
                                {roles.map((role) => (
                                    <div key={role.value} className="col-md-6">
                                        <button type="button" onClick={() => setSelectedRole(role.value)}
                                        className={`w-100 d-flex justify-content-between align-items-center p-1 border rounded fw-semibold 
                                        ${selectedRole === role.value ? "border-2 border-primary bg-primary text-white" : "bg-light border"}`}>
                                            <span>{role.label}</span> {selectedRole === role.value && (<FaCheck />)}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selected User Summary */}
                        {selectedUser && (
                            <div className="card bg-light border-0 mb-0">
                                <div className="card-body">
                                    <h6 className="fw-semibold mb-2">Summary</h6>
                                    <div className="row small">
                                        <div className="col-md-6">
                                            <strong>User:</strong> {selectedUser.fullName}
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Email:</strong> {selectedUser.email}
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Current Role:</strong> 
                                            <span className="badge bg-secondary ms-2">{selectedUser.role}</span>
                                        </div>
                                        <div className="col-md-6">
                                            <strong>New Role:</strong> 
                                            <span className="badge bg-primary ms-2">{roles.find(r => r.value === selectedRole)?.label}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="d-flex justify-content-between gap-2 mt-4 pt-3 border-top">
                            <Link to="/admins" className="btn btn-sm btn-outline-secondary py-1 px-2">
                                <i className="fa fa-arrow-left me-1"></i> Back to Admins
                            </Link>
                            
                            <button type="button" onClick={handlePromotionToAdmin} disabled={!selectedUserId || !selectedRole || loadingFormSubmission} className="btn btn-sm btn-primary py-1 px-2">
                                {loadingFormSubmission ? (
                                    <><span className="spinner-border spinner-border-sm text-white" role="status"></span><i className="fa fa-user-shield me-1"></i> Promoting to Admin...</>
                                ) : (
                                    <><i className="fa fa-user-shield me-1"></i> Promote to Admin</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}