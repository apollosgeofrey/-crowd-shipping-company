// pages/users/tabs/CompanyInformationTab.tsx
// import React from "react";

export default function CompanyInformationTab({
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
        <>
            <div className="row g-0 small">
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Company Name</p>
                    <p className="text-muted border-bottom pb-2">God is Good Motors</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Company ID</p>
                    <p className="text-muted border-bottom pb-2">00001</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Contact Person</p>
                    <p className="text-muted border-bottom pb-2">John Ashernine</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Email Address</p>
                    <p className="text-muted border-bottom pb-2">contact@gigmotors.com</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Phone Number</p>
                    <p className="text-muted border-bottom pb-2">+2347018799032</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Incorporation Date</p>
                    <p className="text-muted border-bottom pb-2">July 14, 2010</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">RC Number</p>
                    <p className="text-muted border-bottom pb-2">RC1234567</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Tax ID</p>
                    <p className="text-muted border-bottom pb-2">TIN-987654321</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Address</p>
                    <p className="text-muted border-bottom pb-2">2464 Royal Ln, Ikeja, Lagos</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">City/State</p>
                    <p className="text-muted border-bottom pb-2">Lagos, Nigeria</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Status</p>
                    <p className="text-success fw-bold border-bottom pb-2">Active</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Total Drivers</p>
                    <p className="text-muted border-bottom pb-2">100</p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <span className="fw-semibold text-danger">Verified by:</span>(Nil)
                <div className="d-flex gap-3">
                    <button className="btn btn-primary px-4 fw-semibold rounded-pill">Verify</button>
                    <button className="btn btn-outline-primary px-4 fw-semibold rounded-pill">Decline</button>
                </div>
            </div>
        </>
    );
}
