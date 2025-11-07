import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { companyApi } from "../services/companyApi";
import DashboardLayout from "../../../layouts/DashboardLayout";
import orgDefault from "../../../assets/images/org_default.png";
import { FaUniversity, FaMoneyBillWave, FaCar, FaChartBar } from "react-icons/fa";
import ProfileTabIndex from "./companyDetailPartials/profileTab/ProfileTabIndex.tsx";
import EarningTabIndex from "./companyDetailPartials/earningsTab/EarningTabIndex.tsx";
import DriverTabIndex from "./companyDetailPartials/driversTab/DriverTabIndex.tsx";
import ReportTabIndex from "./companyDetailPartials/reportsTab/ReportTabIndex.tsx";

export default function CompanyDetail() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [error, setError] = useState<string | null>(null);

    // Handle company update from child components
    const handleCompanyUpdate = (updatedCompany: any) => setCompany(updatedCompany);

    // Separate states for main tab and profile sub-tab
    const [activeMainTab, setActiveMainTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: <FaUniversity /> },
        { id: "earnings", label: "Earnings", icon: <FaMoneyBillWave /> },
        { id: "drivers", label: "Drivers", icon: <FaCar /> },
        { id: "reports", label: "Reports", icon: <FaChartBar /> },
    ];

    // Fetch company data
    useEffect(() => {
        const fetchCompany = async () => {
            if (!id) {
                setError("Invalid company ID");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await companyApi.getCompanyById(id);
                if (res.code === 200 && res.data) {
                    setCompany(res.data);
                } else {
                    setError(res.message || "Failed to load company data");
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || "An error occurred while loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    // Helper function to get status badge color
    const getStatusTextColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'pending': return 'warning';
            case 'inactive': return 'secondary';
            case 'rejected': return 'danger';
            case 'suspended': return 'danger';
            default: return 'secondary';
        }
    };

    // Helper function to get verification status
    const getVerificationStatus = (company: any) => {
        if (company?.verifiedBy) return <span className="text-success fw-semibold">Verified</span>;
        return <span className="text-warning fw-semibold">Unverified</span>;
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="container mt-0">
                    <div className="row justify-content-center">
                        <div className="col-sm-12">
                            <div className="card shadow-sm border-0 p-5 d-flex align-items-center justify-content-center text-center" style={{ minHeight: "250px" }}>
                                <div>
                                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 mb-0 text-muted fw-semibold">Loading company details...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !company) {
        return (
            <DashboardLayout>
                <div className="card shadow-sm rounded p-4">
                    <div className="alert alert-danger">
                        <h5 className="alert-heading">Error Loading Company</h5>
                        <p className="mb-0">{error || "Company not found"}</p>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/companies" className="btn btn-primary">
                            <i className="fa fa-arrow-left me-2"></i> Back to Companies
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="card shadow-sm rounded p-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <img src={orgDefault} alt={company?.name} className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }}/>
                        <div>
                            <h5 className="fw-bold mb-2">
                                {company?.name}
                                <sup className={`text-${getStatusTextColor(company?.status)} text-sm`}>
                                    &nbsp; - <small>({company?.status?.toUpperCase()})</small>
                                </sup>
                            </h5>
                            <p className="mb-1 fw-semibold">
                                <span className="fa fa-id-card me-2"></span>
                                {getVerificationStatus(company)}
                            </p>
                            <p className="mb-0 fw-semibold">
                                <span className="fa fa-wallet me-2"></span>
                                <span className="text-dark">{company?.rcNumber || "No RC Number"}</span>
                            </p>
                            <p className="mb-0 text-muted small">
                                <span className="fa fa-calendar me-1"></span>
                                Created {formatDate(company?.createdAt)}
                                {company?.incorporationDate && (
                                    <> • Incorporated {formatDate(company?.incorporationDate)}</>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="ms-auto d-flex gap-2">                        
                        <Link to={`/companies/${company?._id}/edit`} className="btn btn-sm btn-primary px-3">
                            <span className="fa fa-pencil-alt me-1"></span> Edit Company
                        </Link>
                    </div>
                </div>
                <hr />

                {/* Stats Bar */}
                <div className="row mb-4">
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-primary">
                                {company?.contactPerson ? (
                                    <span title={company.contactPerson.fullName}>
                                        {company.contactPerson.fullName}
                                    </span>
                                ) : (
                                    "No Contact"
                                )}
                            </div>
                            <small className="text-muted">Contact Person</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-success">
                                {company?.email ? (
                                    <a href={`mailto:${company.email}`} className="text-decoration-none text-success">
                                        {company.email}
                                    </a>
                                ) : (
                                    "No Email"
                                )}
                            </div>
                            <small className="text-muted">Company Email</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-info">
                                {company?.phoneNumber ? (
                                    <a href={`tel:${company.phoneNumber}`} className="text-decoration-none text-info">
                                        {company.phoneNumber}
                                    </a>
                                ) : (
                                    "No Phone"
                                )}
                            </div>
                            <small className="text-muted">Phone Number</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-center p-2 border rounded">
                            <div className="fw-bold text-warning">
                                {company?.cityState || "No Location"}
                            </div>
                            <small className="text-muted">Location</small>
                        </div>
                    </div>
                </div>

                {/* Contact Person Info (if exists) */}
                {company?.contactPerson && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-0 bg-light">
                                <div className="card-body py-3">
                                    <h6 className="card-title mb-3">
                                        <i className="fa fa-user me-2"></i>Contact Person Information
                                    </h6>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <small className="text-muted d-block">Full Name</small>
                                            <strong>{company.contactPerson.fullName || "N/A"}</strong>
                                        </div>
                                        <div className="col-md-3">
                                            <small className="text-muted d-block">Email</small>
                                            <strong>
                                                {company.contactPerson.email ? (
                                                    <a href={`mailto:${company.contactPerson.email}`} className="text-decoration-none">
                                                        {company.contactPerson.email}
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </strong>
                                        </div>
                                        <div className="col-md-3">
                                            <small className="text-muted d-block">Phone</small>
                                            <strong>
                                                {company.contactPerson.phoneNumber ? (
                                                    <a href={`tel:${company.contactPerson.phoneNumber}`} className="text-decoration-none">
                                                        {company.contactPerson.phoneNumber}
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </strong>
                                        </div>
                                        <div className="col-md-3">
                                            <small className="text-muted d-block">Status</small>
                                            <strong className={`text-${getStatusTextColor(company.contactPerson.status)}`}>
                                                {company.contactPerson.status?.toUpperCase() || "N/A"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                        {activeMainTab === "profile" && (<ProfileTabIndex company={company} onCompanyUpdate={handleCompanyUpdate} />)}
                        {activeMainTab === "earnings" && (<EarningTabIndex company={company} />)}
                        {activeMainTab === "drivers" && (<DriverTabIndex company={company} />)}
                        {activeMainTab === "reports" && (<ReportTabIndex company={company} />)}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}