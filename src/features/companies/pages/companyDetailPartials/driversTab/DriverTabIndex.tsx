import { useState } from "react";
import InactiveTab from "./partials/InactiveTab.tsx";
import DeletedTab from "./partials/DeletedTab.tsx";
import OnlineTab from "./partials/OnlineTab.tsx";
import OfflineTab from "./partials/OfflineTab.tsx";
import { FaGlobe, FaPlug, FaPauseCircle, FaTrashAlt } from "react-icons/fa";


export default function DriverTabIndex({ company }: any) {
    // logic
    // props destructuring (if any)

    // helper functions (if any)

    // state (if any)

    // side effects (if any)

    // constants (if any)

    // computed values (if any)

    // event handlers (if any)

    const [activeDriverTab, setActiveDriverTab] = useState("online");
    const driverTabs = [
        { id: "online", label: "Online", icon: <FaGlobe className="text-success" /> },
        { id: "offline", label: "Offline", icon: <FaPlug className="text-secondary" /> },
        { id: "inactive", label: "In Active", icon: <FaPauseCircle className="text-warning" /> },
        { id: "deleted", label: "Deleted", icon: <FaTrashAlt className="text-danger" /> },
    ];

    // other logic (if any)

    // Render
    return (
        <div className="">
            <div className="col-sm-12">{company?.rcNumber}</div>
            {/* Driver Tabs */}
            <ul className="nav nav-tabs mb-3">
                {driverTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button
                            type="button"
                            onClick={() => setActiveDriverTab(tab.id)}
                            className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                                ${activeDriverTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Online Tab Content */}
            {activeDriverTab === "online" && (<OnlineTab />)}

            {/* InProgress Tab Content */}
            {activeDriverTab === "offline" && (<OfflineTab />)}

            {/* Inactive Tab Content */}
            {activeDriverTab === "inactive" && (<InactiveTab />)}

            {/* Declined Tab Content */}
            {activeDriverTab === "deleted" && (<DeletedTab />)}
        </div>
    );
}
