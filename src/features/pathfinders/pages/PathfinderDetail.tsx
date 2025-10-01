import { useState } from "react";
// import { useParams } from "react-router-dom";
import userMale from "../../../assets/images/user_male.png";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { FaUser, FaMoneyBillWave, FaClipboardCheck, FaChartBar, FaExchangeAlt } from "react-icons/fa";
import ProfileTabIndex from "./pathfinderDetailPartials/profileTab/ProfileTabIndex.tsx";
import EarningTabIndex from "./pathfinderDetailPartials/earningsTab/EarningTabIndex.tsx";
import BookingTabIndex from "./pathfinderDetailPartials/bookingsTab/BookingTabIndex.tsx";
import ReportTabIndex from "./pathfinderDetailPartials/reportsTab/ReportTabIndex.tsx"
import TripTabIndex from "./pathfinderDetailPartials/tripsTab/TripTabIndex.tsx"

export default function PathfinderDetail    () {
    // const { id } = useParams<{ id: string }>();

    // Separate states for main tab and profile sub-tab
    const [activeMainTab, setActiveMainTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: <FaUser /> },
        { id: "earnings", label: "Earnings", icon: <FaMoneyBillWave /> },
        { id: "trips", label: "Trips", icon: <FaExchangeAlt /> },
        { id: "bookings", label: "Bookings", icon: <FaClipboardCheck /> },
        { id: "reports", label: "Reports", icon: <FaChartBar /> },
    ];


    return (
        <DashboardLayout>
            <div className="card shadow-sm rounded p-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                    <div className="d-flex align-itCreateems-center gap-3">
                        <img src={userMale} alt="Pathfinder" className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }}/>
                        <div>
                            <h5 className="fw-bold mb-2">John Ashernine</h5>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-id-card me-2"></span><span className="text-primary">Unverified</span>
                            </p>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-wallet me-2"></span><span className="text-info">Pathfinder</span>
                            </p>
                        </div>
                    </div>
                    <div className="ms-auto">
                        <button className="btn btn-primary px-3">
                            <span className="fa fa-pencil-alt"></span> Edit Profile
                        </button>
                    </div>
                </div>
                <hr />

                <div className="row">
                    {/* Sidebar Tabs */}
                    <div className="col-md-3 mb-3">
                        <ul className="nav flex-column nav-pills gap-2">
                            {tabs.map((tab) => (
                                <li key={tab.id} className="nav-item">
                                    <button
                                        className={`nav-link d-flex align-items-center gap-2 col-sm-12 ${
                                        activeMainTab === tab.id ? "active bg-primary text-white" : "text-dark"}`}
                                        style={{ borderRadius: "6px" }}
                                        onClick={() => setActiveMainTab(tab.id)}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Content Area */}
                    <div className="col-md-9">
                        {activeMainTab === "profile" && (<ProfileTabIndex />)}

                        {activeMainTab === "earnings" && (<EarningTabIndex />)}
                        
                        {activeMainTab === "trips" && (<TripTabIndex />)}

                        {activeMainTab === "bookings" && (<BookingTabIndex />)}

                        {activeMainTab === "reports" && (<ReportTabIndex />)}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
