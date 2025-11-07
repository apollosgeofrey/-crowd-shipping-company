import { useState } from "react";
import DocumentsTab from "./partials/DocumentsTab.tsx";
import { FaUniversity, FaFileAlt, FaLock, FaIdCard } from "react-icons/fa";
import PaymentInformationTab from "./partials/PaymentInformationTab.tsx";
import IdentityInformationTab from "./partials/IdentityInformationTab.tsx";
import CompanyInformationTab from "./partials/CompanyInformationTab.tsx";

interface Props {
    company: any;
    onCompanyUpdate?: (updatedCompany: any) => void;
}

export default function ProfileTabIndex({ company, onCompanyUpdate }: Props) {
    const [activeProfileTab, setActiveProfileTab] = useState("company-information");
    
    const profileTabs = [
        { id: "company-information", label: "Company Information", icon: <FaUniversity /> },
        { id: "identity-information", label: "Identity Information", icon: <FaIdCard /> },
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
                                ${activeProfileTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Company Info Tab Content */}
            {activeProfileTab === "company-information" && (<CompanyInformationTab company={company} onCompanyUpdate={onCompanyUpdate} />)}

            {/* Identity Info Tab Content */}
            {activeProfileTab === "identity-information" && (<IdentityInformationTab company={company} onCompanyUpdate={onCompanyUpdate} />)}

            {/* Documents Tab Content */}
            {activeProfileTab === "documents" && (<DocumentsTab company={company} onCompanyUpdate={onCompanyUpdate} />)}

            {/* Payment Info Tab Content */}
            {activeProfileTab === "payment-information" && (<PaymentInformationTab company={company} onCompanyUpdate={onCompanyUpdate} />)}
        </div>
    );
}