import { useState } from "react";
import DocumentsTab from "./partials/DocumentsTab.tsx";
import { FaUser, FaFileAlt, FaLock } from "react-icons/fa";
import PaymentInformationTab from "./partials/PaymentInformationTab.tsx";
import VehicleInformationTab from "./partials/VehicleInformationTab.tsx";
import PersonalInformationTab from "./partials/PersonalInformationTab.tsx";

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

    const [activeProfileTab, setActiveProfileTab] = useState("personal-information");
    const profileTabs = [
        { id: "personal-information", label: "Personal Information", icon: <FaUser /> },
        { id: "vehicle-information", label: "Vehicle Information", icon: <FaLock /> },
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
                        <button
                            type="button"
                            onClick={() => setActiveProfileTab(tab.id)}
                            className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                                ${activeProfileTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>


            {/* Personal Info Tab Content */}
            {activeProfileTab === "personal-information" && (<PersonalInformationTab />)}

            {/* Vehicle Info Tab Content */}
            {activeProfileTab === "vehicle-information" && (<VehicleInformationTab />)}

            {/* Documents Tab Content */}
            {activeProfileTab === "documents" && (<DocumentsTab />)}

            {/* Account Access Tab Content */}
            {activeProfileTab === "payment-information" && (<PaymentInformationTab />)}
        </div>
    );
}
