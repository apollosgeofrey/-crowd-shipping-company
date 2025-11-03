import { useState } from "react";
import { FaUser, FaFileAlt } from "react-icons/fa";
import DocumentsTab from "./partials/DocumentsTab.tsx";
import PersonalInformationTab from "./partials/PersonalInformationTab.tsx";

export default function ProfileTabIndex({ admin }: { admin: any }) {
    const [activeProfileTab, setActiveProfileTab] = useState("personal-information");
    
    const profileTabs = [
        { id: "personal-information", label: "Personal Information", icon: <FaUser /> },
        { id: "documents", label: "Documents", icon: <FaFileAlt /> },
    ];

    return (
        <div className="">
            {/* Profile Tabs */}
            <ul className="nav nav-tabs mb-3">
                {profileTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button type="button" onClick={() => setActiveProfileTab(tab.id)}
                        className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                            ${activeProfileTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Personal Info Tab Content */}
            {activeProfileTab === "personal-information" && (<PersonalInformationTab admin={admin} />)}

            {/* Documents Tab Content */}
            {activeProfileTab === "documents" && (<DocumentsTab admin={admin} />)}
        </div>
    );
}