import { useState } from "react";
import DocumentsTab from "./partials/DocumentsTab.tsx";
import { FaUniversity, FaFileAlt, FaLock, FaIdCard } from "react-icons/fa";
import PaymentInformationTab from "./partials/PaymentInformationTab.tsx";
import IdentityInformationTab from "./partials/IdentityInformationTab.tsx";
import CompanyInformationTab from "./partials/CompanyInformationTab.tsx";

export default function ProfileTabIndex({
    // props
}: {
    // props types
}) {
    // logic
    // props destructuring (if any)

    // helper functions (if any)

    // state (if any)

    // side effects (if any)

    // constants (if any)

    // computed values (if any)

    // event handlers (if any)

    const [activeProfileTab, setActiveProfileTab] = useState("company-information");
    const profileTabs = [
        { id: "company-information", label: "Company Information", icon: <FaUniversity /> },
        { id: "identity-information", label: "Identity Information", icon: <FaIdCard /> },
        { id: "documents", label: "Documents", icon: <FaFileAlt /> },
        { id: "payment-information", label: "Payment Information", icon: <FaLock /> },
    ];

    // other logic (if any)

    // Render
    return (
        <div className="">
            {/* Profile Tabs */}
            <ul className="nav nav-tabs mb-3">
                {profileTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button type="button" onClick={() => setActiveProfileTab(tab.id)} className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                        ${activeProfileTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}>
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>


            {/* Company Info Tab Content */}
            {activeProfileTab === "company-information" && (<CompanyInformationTab />)}

            {/* Identity Info Tab Content */}
            {activeProfileTab === "identity-information" && (<IdentityInformationTab />)}

            {/* Documents Tab Content */}
            {activeProfileTab === "documents" && (<DocumentsTab />)}

            {/* Account Access Tab Content */}
            {activeProfileTab === "payment-information" && (<PaymentInformationTab />)}
        </div>
    );
}
