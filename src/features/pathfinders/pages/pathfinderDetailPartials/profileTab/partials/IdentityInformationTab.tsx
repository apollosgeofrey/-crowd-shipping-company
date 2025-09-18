// pages/users/tabs/IdentityInformationTab.tsx
// import React from "react";
// import { FaCar } from "react-icons/fa";

export default function IdentityInformationTab({
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
    // Mock identity info (in real case, fetch from API or props)
    const identityInfo = {
        nin: "1234-5678-9012",              // National Identity Number
        identityType: "Driver’s License",  // Type of ID provided
        idNumber: "LAG-2023-ABC-9087",     // ID number
        fullName: "John Ashernine",
        email: "john.ashernine@example.com",
        dateOfBirth: "12-Apr-1985",
        gender: "Male",
        nationality: "Nigerian",
        issueDate: "23-Apr-2016",
        expiryDate: "16-Mar-2019",
        address: "12, Bank Anthony Way, Ikeja, Lagos",
    };

    // Render
    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                <div className="row g-3">
                    {/* NIN */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">National Identity Number (NIN)</p>
                        <p className="text-muted small">{identityInfo.nin}</p>
                    </div>

                    {/* Identity Type */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Identity Type</p>
                        <p className="text-muted small">{identityInfo.identityType}</p>
                    </div>

                    {/* ID Number */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">ID Number</p>
                        <p className="text-muted small">{identityInfo.idNumber}</p>
                    </div>

                    {/* Full Name */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Full Name</p>
                        <p className="text-muted small">{identityInfo.fullName}</p>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Email Address</p>
                        <p className="text-muted small">{identityInfo.email}</p>
                    </div>

                    {/* Date of Birth */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Date of Birth</p>
                        <p className="text-muted small">{identityInfo.dateOfBirth}</p>
                    </div>

                    {/* Gender */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Gender</p>
                        <p className="text-muted small">{identityInfo.gender}</p>
                    </div>

                    {/* Nationality */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Nationality</p>
                        <p className="text-muted small">{identityInfo.nationality}</p>
                    </div>

                    {/* Issue Date */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Issue Date</p>
                        <p className="text-muted small">{identityInfo.issueDate}</p>
                    </div>

                    {/* Expiry Date */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Expiry Date</p>
                        <p className="text-muted small">{identityInfo.expiryDate}</p>
                    </div>

                    {/* Address */}
                    <div className="col-12">
                        <p className="fw-semibold mb-1">Address</p>
                        <p className="text-muted small">{identityInfo.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}