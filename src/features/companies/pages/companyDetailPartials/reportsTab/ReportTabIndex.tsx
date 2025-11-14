import { useState } from "react";
import ReportTab from "./partials/ReportTab.tsx"
// import TransactionTab from "./partials/TransactionTab.tsx"
import { FaInfoCircle } from "react-icons/fa";

export default function ReportTabIndex({ vehicleOwner }: any) {
    // logic
    // props destructuring (if any)

    // helper functions (if any)

    // state (if any)

    // side effects (if any)

    // constants (if any)

    // computed values (if any)

    // event handlers (if any)

    const [activeReportTab, setActiveReportTab] = useState("reports");
    const reportTabs = [
        { id: "reports", label: "Reports", icon: <FaInfoCircle /> },
        // { id: "payment-details", label: "Payment Details", icon: <FaCreditCard /> },
    ];
    // other logic (if any)
    
    // Render
    return (
        <div className="">
            {vehicleOwner?.fullName}
            {/* Report Tabs */}
            <ul className="nav nav-tabs mb-3">
                {reportTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button type="button"
                            onClick={() => setActiveReportTab(tab.id)}
                            className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                                ${activeReportTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>


            {/* Report Tab Content */}
            {activeReportTab === "reports" && (<ReportTab />)}

            {/* Payment Details Tab Content */}
            {/* {activeReportTab === "payment-details" && (<PaymentDetailTab />)} */}
        </div>
    );
}
