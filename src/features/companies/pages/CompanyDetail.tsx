import { useState } from "react";
// import { useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import orgDefault from "../../../assets/images/org_default.png";
import { FaUniversity, FaMoneyBillWave, FaCar, FaChartBar } from "react-icons/fa";
import ProfileTabIndex from "./companyDetailPartials/profileTab/ProfileTabIndex.tsx";
import EarningTabIndex from "./companyDetailPartials/earningsTab/EarningTabIndex.tsx";
import DriverTabIndex from "./companyDetailPartials/driversTab/DriverTabIndex.tsx";
import ReportTabIndex from "./companyDetailPartials/reportsTab/ReportTabIndex.tsx"

export default function CompanyDetail    () {
    // const { id } = useParams<{ id: string }>();

    // Separate states for main tab and profile sub-tab
    const [activeMainTab, setActiveMainTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: <FaUniversity /> },
        { id: "earnings", label: "Earnings", icon: <FaMoneyBillWave /> },
        { id: "drivers", label: "Drivers", icon: <FaCar /> },
        { id: "reports", label: "Reports", icon: <FaChartBar /> },
    ];


    return (
        <DashboardLayout>
            <div className="card shadow-sm rounded p-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                    <div className="d-flex align-itCreateems-center gap-3">
                        <img src={orgDefault} alt="Company" className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }}/>
                        <div>
                            <h5 className="fw-bold mb-2">Sunshine Logistics</h5>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-id-card me-2"></span><span className="text-primary">Unverified</span>
                            </p>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-wallet me-2"></span><span className="text-info">Company</span>
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
                        
                        {activeMainTab === "drivers" && (<DriverTabIndex />)}

                        {activeMainTab === "reports" && (<ReportTabIndex />)}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
