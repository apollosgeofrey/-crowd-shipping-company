// InternalCommentTab.tsx
import { useState } from "react";

interface InternalCommentTabProps {
    report: any;
    onReportUpdate?: (updatedReport: any) => void;
}

export default function InternalCommentTab({ report }: InternalCommentTabProps) {
    const [internalComment, setInternalComment] = useState(report.resolutionNotes || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveComment = async () => {
        if (!internalComment.trim()) return;

        setIsSaving(true);
        try {
            // TODO: Implement API call to save internal comment
            console.log("Saving internal comment:", internalComment);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // This would typically call an API to update the report with the internal comment
            // const response = await reportApi.updateReport(report._id, { resolutionNotes: internalComment });
            // if (onReportUpdate) {
            //     onReportUpdate(response.data);
            // }
            
            alert("Internal comment saved successfully!");
        } catch (error) {
            console.error("Failed to save internal comment:", error);
            alert("Failed to save internal comment. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearComment = () => {
        setInternalComment("");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    return (
        <div className="p-3">
            <div className="mb-4">
                <h6 className="fw-semibold mb-3">Internal Comments & Notes</h6>
                <p className="text-muted small mb-3">
                    Add internal notes and comments that are visible only to support staff. 
                    These notes won't be visible to the customer.
                </p>
                
                <textarea 
                    className="form-control" 
                    rows={8}
                    value={internalComment}
                    onChange={(e) => setInternalComment(e.target.value)}
                    placeholder="Add internal comments, investigation notes, team communication, or any other relevant information..."
                    disabled={isSaving}
                />
                <div className="form-text">
                    Character count: {internalComment.length}/5000
                </div>
            </div>
            
            {/* Existing Resolution Notes */}
            {report.resolutionNotes && (
                <div className="mb-4">
                    <h6 className="fw-semibold mb-2">Existing Resolution Notes</h6>
                    <div className="bg-light p-3 rounded small">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <strong>Last updated:</strong>
                            <small className="text-muted">{formatDate(report.updatedAt)}</small>
                        </div>
                        {report.resolutionNotes}
                    </div>
                </div>
            )}

            {/* Support Team Information */}
            {report.supportTeam && (
                <div className="mb-4">
                    <h6 className="fw-semibold mb-2">Assigned Support Agent</h6>
                    <div className="bg-light p-3 rounded small">
                        <div className="row">
                            <div className="col-md-6">
                                <strong>Name:</strong> {report.supportTeam.fullName}
                            </div>
                            <div className="col-md-6">
                                <strong>Email:</strong> {report.supportTeam.email}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center">
                <button 
                    className="btn btn-outline-secondary btn-sm" 
                    onClick={handleClearComment}
                    disabled={isSaving || !internalComment.trim()}
                >
                    Clear
                </button>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        disabled={isSaving}
                    >
                        Save Draft
                    </button>
                    <button 
                        className="btn btn-primary btn-sm" 
                        onClick={handleSaveComment}
                        disabled={isSaving || !internalComment.trim()}
                    >
                        {isSaving ? (
                            <>
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Saving...
                            </>
                        ) : (
                            'Save Comment'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}