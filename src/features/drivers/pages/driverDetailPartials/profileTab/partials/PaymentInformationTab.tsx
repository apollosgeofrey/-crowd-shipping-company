// pages/users/tabs/PaymentInformationTab.tsx
// import React from "react";

export default function PaymentInformationTab({
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
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                <div className="row g-3">
                    {/* Bank Name */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Bank Name</p>
                        <p className="text-muted">Zenith Bank</p>
                    </div>

                    {/* Account Holder */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Account Holder</p>
                        <p className="text-muted">John Ashernine</p>
                    </div>

                    <hr className="my-2" />

                    {/* Account Number */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Account Number</p>
                        <p className="text-muted">2118727682</p>
                    </div>

                    {/* Extra field (placeholder / lorem ipsum) */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">xxxxx</p>
                        <p className="text-muted">lorem ipsum</p>
                    </div>
                </div>
            </div>
        </div>
    );
}