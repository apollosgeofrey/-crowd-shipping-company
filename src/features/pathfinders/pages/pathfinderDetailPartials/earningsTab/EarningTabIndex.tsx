// pages/users/tabs/EarningTabIndex.tsx
// import { ProgressBar } from "react-bootstrap";
// import { FaCalendarAlt, FaWallet, FaClipboardList, FaFileAlt } from "react-icons/fa";

export default function EarningTabIndex({
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

    // other logic (if any)

    // Render
    return (
        <div className="row g-3">
            <div className="col-md-6">
                <div className="card p-3 shadow-sm">
                    <div className="d-flex align-items-center w-100 mt-2">
                        <span className="text-primary"><span className="fa fa-users"></span></span>
                        <span className="mx-3">Total Trips</span>
                    </div>
                    <h6 className="fw-semibold"></h6>
                    <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                        <span className="fs-3 fw-bold">5</span>
                        <span className="badge bg-success-subtle text-success">+12%</span>
                    </div>
                    <hr className="my-0" />
                    <p className="small text-muted mb-0">Update: July 16, 2023</p>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card p-3 shadow-sm">
                    <div className="d-flex align-items-center w-100 mt-2">
                        <span className="text-primary"><span className="fa fa-briefcase"></span></span>
                        <span className="mx-3">Amount Earned</span>
                    </div>
                    <h6 className="fw-semibold"></h6>
                    <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                        <span className="fs-3 fw-bold">₦100,400</span>
                        <span className="badge bg-success-subtle text-success">+5%</span>
                    </div>
                    <hr className="my-0" />
                    <p className="small text-muted mb-0">Update: July 14, 2023</p>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card p-3 shadow-sm">
                    <div className="d-flex align-items-center w-100 mt-2">
                        <span className="text-primary"><span className="fa fa-briefcase"></span></span>
                        <span className="mx-3">Total Paid Out</span>
                    </div>
                    <h6 className="fw-semibold"></h6>
                    <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                        <span className="fs-3 fw-bold">₦90,000</span>
                        <span className="badge bg-danger-subtle text-primary">-8%</span>
                    </div>
                    <hr className="my-0" />
                    <p className="small text-muted mb-0">Update: July 14, 2023</p>
                </div>
            </div>
            
            <div className="col-md-6">
                <div className="card p-3 shadow-sm">
                    <div className="d-flex align-items-center w-100 mt-2">
                        <span className="text-primary"><span className="fa fa-briefcase"></span></span>
                        <span className="mx-3">Completed Trips</span>
                    </div>
                    <h6 className="fw-semibold"></h6>
                    <div className="d-flex align-items-center justify-content-between w-100 mt-2">
                        <span className="fs-3 fw-bold">3</span>
                        <span className="badge bg-success-subtle text-success">+12%</span>
                    </div>
                    <hr className="my-0" />
                    <p className="small text-muted mb-0">Update: July 10, 2023</p>
                </div>
            </div>
        </div>
    );
}
