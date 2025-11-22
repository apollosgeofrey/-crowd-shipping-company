// ReportDetail.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import reportApi from "../services/reportApi.ts";
import MessageTab from "./reportDetailPartials/MessageTab.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import ResolutionTab from "./reportDetailPartials/ResolutionTab.tsx";
// import InternalCommentTab from "./reportDetailPartials/InternalCommentTab.tsx";
import DetailedReportStats from "./reportDetailPartials/DetailedReportStats.tsx";

export default function ReportDetail() {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("message");
    const [error, setError] = useState<string | null>(null);

    // Add this function to handle report updates
    const handleReportUpdate = (updatedReport: any) => setReport(updatedReport);

    // Fetch report details from API
    useEffect(() => {
        async function fetchReport() {
            if (!id) {
                setError("No report ID provided in URL");
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            setError(null);
            
            try {
                console.log("Fetching report with ID:", id); // Debug log
                const response = await reportApi.getReportById(id);
                console.log("API Response:", response); // Debug log
                
                if (response.code === 200) {
                    setReport(response.data);
                } else {
                    setError(`API Error: ${response.message}`);
                }
            } catch (err: any) {
                console.error("Failed to fetch report:", err);
                setError(err.response?.data?.message || err.message || "Failed to load report");
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchReport();
    }, [id]);

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Get status badge style
    const getStatusBadge = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'bg-warning-subtle text-warning',
            'resolved': 'bg-success-subtle text-success',
            'underReview': 'bg-info-subtle text-info',
            'escalated': 'bg-danger-subtle text-danger',
            'rejected': 'bg-secondary-subtle text-secondary'
        };
        return statusMap[status] || 'bg-light text-dark';
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="row g-3">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded">
                            <div className="card-body text-center py-5">
                                <div className="spinner-border text-primary me-2" role="status"></div> Loading report details...
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="row g-3">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded">
                            <div className="card-body text-center py-5">
                                <div className="text-danger mb-3"><i className="fa fa-exclamation-triangle fa-2x"></i></div>
                                <h5 className="text-danger">Error Loading Report</h5>
                                <p className="text-muted">{error}</p>
                                <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!report) {
        return (
            <DashboardLayout>
                <div className="row g-3">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded">
                            <div className="card-body text-center py-5">
                                <div className="text-muted mb-3"><i className="fa fa-file-alt fa-2x"></i></div>
                                <h5 className="text-muted">Report Not Found</h5>
                                <p className="text-muted">The report you're looking for doesn't exist.</p>
                                <button className="btn btn-primary" onClick={() => window.history.back()}>Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="row g-3">
                {/* Header with Report Reference */}
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0">#{report.reportRef}</h5>
                        <span className={`badge ${getStatusBadge(report.status)} px-3 py-2`}>
                            {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Left Sidebar - Report Details */}
                <div className="col-md-4">
                    <DetailedReportStats report={report} onReportUpdate={handleReportUpdate}/>
                </div>

                {/* Right Panel - Tabs */}
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm rounded h-100 d-flex flex-column">
                        <div className="card-body d-flex flex-column p-0">
                            
                            {/* Report Header */}
                            <div className="p-3 border-bottom">
                                <h6 className="fw-bold mb-1">{report.natureOfReport}</h6>
                                <p className="small text-muted mb-0">
                                    <span className="fw-semibold">Report Date:</span> {formatDate(report.createdAt)} &nbsp; | &nbsp;
                                    <span className="fw-semibold">Type:</span> 
                                    <span className="text-capitalize"> {report.reportType}</span>
                                </p>
                            </div>

                            <div className="flex-grow-1 d-flex flex-column">
                                {/* Tabs Navigation */}
                                <ul className="nav nav-tabs px-3 pt-3">
                                    <li className="nav-item">
                                        <button type="button" onClick={() => setActiveTab('message')} className={`nav-link fw-semibold ${activeTab === 'message' ? "active text-primary" : ""}`}>
                                            Message
                                        </button>
                                    </li>
                                    {/*<li className="nav-item">
                                        <button type="button" onClick={() => setActiveTab('internal-comment')} className={`nav-link fw-semibold ${activeTab === 'internal-comment' ? "active text-primary" : ""}`}>
                                            Internal Comment
                                        </button>
                                    </li>*/}
                                    <li className="nav-item">
                                        <button type="button" onClick={() => setActiveTab('resolution')} className={`nav-link fw-semibold ${activeTab === 'resolution' ? "active text-primary" : ""}`}>
                                            Resolution
                                        </button>
                                    </li>
                                </ul>

                                {/* Tab Content */}
                                <div className="flex-grow-1 d-flex flex-column">
                                    {activeTab === "message" && (<MessageTab report={report} onReportUpdate={handleReportUpdate} />)}

                                    {/*{activeTab === "internal-comment" && (<InternalCommentTab report={report} onReportUpdate={handleReportUpdate} />)}*/}

                                    {activeTab === "resolution" && (<ResolutionTab report={report} onReportUpdate={handleReportUpdate} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}