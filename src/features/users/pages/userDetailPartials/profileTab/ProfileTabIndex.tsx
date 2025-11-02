import { useState } from "react";
import DocumentsTab from "./partials/DocumentsTab.tsx";
import { FaUser, FaFileAlt, FaLock } from "react-icons/fa";
import AccountAccessTab from "./partials/AccountAccessTab.tsx";
import PersonalInformationTab from "./partials/PersonalInformationTab.tsx";

export default function ProfileTabIndex({ user }: { user: any }) {
    const [activeProfileTab, setActiveProfileTab] = useState("personal-information");
    
    const profileTabs = [
        { id: "personal-information", label: "Personal Information", icon: <FaUser /> },
        { id: "documents", label: "Documents", icon: <FaFileAlt /> },
        { id: "account-access", label: "Account Access", icon: <FaLock /> },
    ];

    return (
        <div className="">
            {/* Profile Tabs */}
            <ul className="nav nav-tabs mb-3">
                {profileTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button type="button" onClick={() => setActiveProfileTab(tab.id)}
                        className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                        ${activeProfileTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}>
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Personal Info Tab Content */}
            {activeProfileTab === "personal-information" && (<PersonalInformationTab user={user} />)}

            {/* Documents Tab Content */}
            {activeProfileTab === "documents" && (<DocumentsTab user={user} />)}

            {/* Account Access Tab Content */}
            {activeProfileTab === "account-access" && (<AccountAccessTab user={user} />)}
        </div>
    );
}