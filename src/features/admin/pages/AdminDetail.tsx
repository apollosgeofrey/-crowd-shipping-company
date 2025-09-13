import { useState } from "react";
import { useParams } from "react-router-dom";
import userMale from "../../../assets/images/user_male.png";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ProfileTabIndex from "./adminDetailPartials/profileTab/ProfileTabIndex.tsx";
import AssignRoleTabIndex from "./adminDetailPartials/assignRoleTab/AssignRoleTabIndex.tsx"
import AnotherMenu1TabIndex from "./adminDetailPartials/anotherMenu1Tab/AnotherMenu1TabIndex.tsx";
import AnotherMenu2TabIndex from "./adminDetailPartials/anotherMenu2Tab/AnotherMenu2TabIndex.tsx";
import {FaUser, FaKey, FaList} from "react-icons/fa";

export default function AdminDetail() {
    const { id } = useParams<{ id: string }>();

    // Separate states for main tab and wallet sub-tab
    const [activeMainTab, setActiveMainTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: <FaUser /> },
        { id: "assign-role", label: "Assign Role", icon: <FaKey /> },
        { id: "another-menu-1", label: "Another Menu 1", icon: <FaList /> },
        { id: "another-menu-2", label: "Another Menu 2", icon: <FaList /> },
    ];

    return (
        <DashboardLayout>
            <div className="card shadow-sm rounded p-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src={userMale}
                            alt="User"
                            className="rounded"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                        <div>
                            <h5 className="fw-bold mb-2">Admin 1</h5>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-id-card me-2"></span><span className="text-primary">Active</span>
                            </p>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-wallet me-2"></span><span className="text-info">Basic Role</span>
                            </p>
                        </div>
                    </div>
                    <div className="ms-auto">
                        <button className="btn btn-primary px-3">
                            <span className="fa fa-pencil-alt"></span> Edit Profile
                        </button>
                    </div>
                </div>
                <hr />

                <div className="row">
                {/* Sidebar Tabs */}
                    <div className="col-md-3 mb-3">
                        <ul className="nav flex-column nav-pills gap-2">
                            {tabs.map((tab) => (
                                <li key={tab.id} className="nav-item">
                                    <button className={`nav-link d-flex align-items-center gap-2 col-sm-12 ${
                                        activeMainTab === tab.id ? "active bg-primary text-white" : "text-dark"}`}
                                        style={{ borderRadius: "6px" }}
                                        onClick={() => setActiveMainTab(tab.id)}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                {/* Content Area */}
                <div className="col-md-9">
                    {activeMainTab === "profile" && (<ProfileTabIndex />)}

                    {activeMainTab === "assign-role" && (<AssignRoleTabIndex />)}

                    {activeMainTab === "another-menu-1" && (<AnotherMenu1TabIndex />)}

                    {activeMainTab === "another-menu-2" && (<AnotherMenu2TabIndex />)}
                </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
