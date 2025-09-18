import { useState } from "react";
import PendingTab from "./partials/PendingTab.tsx";
import DeclinedTab from "./partials/DeclinedTab.tsx";
import CompletedTab from "./partials/CompletedTab.tsx";
import AcceptedTab from "./partials/AcceptedTab.tsx";
import { FaCheckSquare, FaBriefcase, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

export default function TripTabIndex({
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

    const [activeTripTab, setActiveTripTab] = useState("accepted");
    const tripTabs = [
        { id: "completed", label: "Completed", icon: <FaCheckSquare /> },
        { id: "accepted", label: "Accepted", icon: <FaBriefcase /> },
        { id: "pending", label: "Pending", icon: <FaHourglassHalf /> },
        { id: "declined", label: "Declined", icon: <FaTimesCircle /> },
    ];

    // other logic (if any)

    // Render
    return (
        <div className="">
            {/* Trip Tabs */}
            <ul className="nav nav-tabs mb-3">
                {tripTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button
                            type="button"
                            onClick={() => setActiveTripTab(tab.id)}
                            className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                                ${activeTripTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Completed Tab Content */}
            {activeTripTab === "completed" && (<CompletedTab />)}

            {/* Accepted Tab Content */}
            {activeTripTab === "accepted" && (<AcceptedTab />)}

            {/* Pending Tab Content */}
            {activeTripTab === "pending" && (<PendingTab />)}

            {/* Declined Tab Content */}
            {activeTripTab === "declined" && (<DeclinedTab />)}
        </div>
    );
}
