// pages/users/tabs/PersonalInformationTab.tsx
// import React from "react";

export default function PersonalInformationTab({
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
                    <p className="fw-semibold mb-1 text-dark">First Name</p>
                    <p className="text-muted border-bottom pb-2">John</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Last Name</p>
                    <p className="text-muted border-bottom pb-2">Ashernine</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Mobile Number</p>
                    <p className="text-muted border-bottom pb-2">+2347018799032</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Email Address</p>
                    <p className="text-muted border-bottom pb-2">brooklyn.s@example.com</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Date of Birth</p>
                    <p className="text-muted border-bottom pb-2">July 14, 1995</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Marital Status</p>
                    <p className="text-muted border-bottom pb-2">Married</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Gender</p>
                    <p className="text-muted border-bottom pb-2">Female</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Job Title</p>
                    <p className="text-muted border-bottom pb-2">Product Designer</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">Location</p>
                    <p className="text-muted border-bottom pb-2">2464 Royal Ln. Mesa, New Jersey</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">City</p>
                    <p className="text-muted border-bottom pb-2">California</p>
                </div>

                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">NIN</p>
                    <p className="text-muted border-bottom pb-2">2135689670</p>
                </div>
                <div className="col-md-6">
                    <p className="fw-semibold mb-1 text-dark">ID</p>
                    <p className="text-muted border-bottom pb-2">35624</p>
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
