// components/StateComponents.tsx
import DashboardLayout from "../layouts/DashboardLayout";

// Loading Component
export function StateLoading() {
    return (
        <DashboardLayout>
            <div className="mb-4">
                <div className="mb-4">
                    <div className="h3 bg-secondary rounded w-25 mb-2 placeholder"></div>
                    <div className="text-muted bg-secondary rounded w-16 placeholder"></div>
                </div>
                <div className="row g-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="col-12 col-sm-6">
                            <div className="card shadow-sm h-100 placeholder-wave">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-secondary rounded me-3 placeholder" style={{width: '16px', height: '16px'}}></div>
                                        <div className="bg-secondary rounded placeholder" style={{width: '80px', height: '16px'}}></div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="h4 bg-secondary rounded placeholder" style={{width: '48px'}}></div>
                                        <div className="badge bg-secondary rounded placeholder" style={{width: '40px', height: '20px'}}></div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white">
                                    <div className="text-muted small bg-secondary rounded placeholder" style={{width: '96px', height: '14px'}}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

// Error Component
interface StateErrorProps {
    error: string;
    onRetry?: () => void;
}

export function StateError({ error, onRetry }: StateErrorProps) {
    return (
        <DashboardLayout>
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 py-5">
                <div className="text-danger display-4 mb-4">⚠️</div>
                <div className="text-center mb-4">
                    <h2 className="h3 fw-bold text-dark mb-3">Something went wrong</h2>
                    <p className="text-muted lead">{error}</p>
                </div>
                <div className="d-flex gap-3 mt-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="btn btn-primary btn-lg px-4"
                    >
                        Refresh Page
                    </button>
                    <button 
                        onClick={onRetry}
                        className="btn btn-outline-secondary btn-lg px-4"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Empty Component
interface StateEmptyProps {
    onRetry?: () => void;
    message?: string;
}

export function StateEmpty({ onRetry, message = "We couldn't find any data to display." }: StateEmptyProps) {
    return (
        <DashboardLayout>
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 py-5">
                <div className="display-4 text-muted mb-4">📊</div>
                <div className="text-center mb-4">
                    <h2 className="h3 fw-bold text-dark mb-3">No Data Available</h2>
                    <p className="text-muted">{message}</p>
                </div>
                <button 
                    onClick={onRetry}
                    className="btn btn-primary btn-lg px-4"
                >
                    Refresh Data
                </button>
            </div>
        </DashboardLayout>
    );
}