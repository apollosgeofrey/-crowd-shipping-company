import { useState } from "react";
import PendingTab from "./partials/PendingTab.tsx";
import DeclinedTab from "./partials/DeclinedTab.tsx";
import CompletedTab from "./partials/CompletedTab.tsx";
import AcceptedTab from "./partials/AcceptedTab.tsx";
import { FaCheckSquare, FaBriefcase, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

export default function BookingTabIndex({
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

    const [activeBookingTab, setActiveBookingTab] = useState("completed");
    const bookingTabs = [
        { id: "completed", label: "Completed", icon: <FaCheckSquare /> },
        { id: "accepted", label: "Accepted", icon: <FaBriefcase /> },
        { id: "pending", label: "Pending", icon: <FaHourglassHalf /> },
        { id: "declined", label: "Declined", icon: <FaTimesCircle /> },
    ];

    // other logic (if any)

    // Render
    return (
        <div className="">
            {/* Booking Tabs */}
            <ul className="nav nav-tabs mb-3">
                {bookingTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button
                            type="button"
                            onClick={() => setActiveBookingTab(tab.id)}
                            className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                                ${activeBookingTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Completed Tab Content */}
            {activeBookingTab === "completed" && (<CompletedTab />)}

            {/* InProgress Tab Content */}
            {activeBookingTab === "accepted" && (<AcceptedTab />)}

            {/* Pending Tab Content */}
            {activeBookingTab === "pending" && (<PendingTab />)}

            {/* Declined Tab Content */}
            {activeBookingTab === "declined" && (<DeclinedTab />)}
        </div>
    );
}
