import { useState } from "react";
import DocumentsTab from "./partials/DocumentsTab.tsx";
import { FaUser, FaFileAlt, FaLock, FaCar } from "react-icons/fa";
import PaymentInformationTab from "./partials/PaymentInformationTab.tsx";
import VehicleInformationTab from "./partials/VehicleInformationTab.tsx";
import PersonalInformationTab from "./partials/PersonalInformationTab.tsx";


export default function ProfileTabIndex({vehicleOwner}: any) {
    const [activeProfileTab, setActiveProfileTab] = useState("personal-information");
    
    const profileTabs = [
        { id: "personal-information", label: "Personal Information", icon: <FaUser /> },
        { id: "vehicle-information", label: "Vehicle Information", icon: <FaCar /> },
        { id: "documents", label: "Documents", icon: <FaFileAlt /> },
        { id: "payment-information", label: "Payment Information", icon: <FaLock /> },
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
            {activeProfileTab === "personal-information" && (<PersonalInformationTab vehicleOwner={vehicleOwner}/>)}

            {/* Vehicle Info Tab Content */}
            {activeProfileTab === "vehicle-information" && (<VehicleInformationTab vehicleOwner={vehicleOwner}/>)}

            {/* Documents Tab Content */}
            {activeProfileTab === "documents" && (<DocumentsTab vehicleOwner={vehicleOwner}/>)}

            {/* Payment Info Tab Content */}
            {activeProfileTab === "payment-information" && (<PaymentInformationTab vehicleOwner={vehicleOwner}/>)}
        </div>
    );
}