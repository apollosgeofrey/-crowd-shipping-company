// pages/users/tabs/VehicleInformationTab.tsx
// import React from "react";
// import { FaCar } from "react-icons/fa";

export default function VehicleInformationTab({
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
    // Mock vehicle info (in real case, fetch from API or props)
    const vehicleInfo = {
        fleetType: "Road",
        vehicleType: "Bike",
        licenseNumber: "License Registration Number",
        email: "brooklyn.s@example.com",
        jobTitle: "Project Manager",
        customField: "xxxxxx",
        workingDays: "5 Days",
        joiningDate: "July 10, 2022",
    };

    // Render
    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                {/* Info Grid */}
                <div className="row g-3">
                    {/* Fleet Type */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Fleet Types</p>
                        <p className="text-muted small">{vehicleInfo.fleetType}</p>
                    </div>

                    {/* Vehicle Type */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Vehicle Type</p>
                        <p className="text-muted small">{vehicleInfo.vehicleType}</p>
                    </div>

                    {/* License Number */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">License Registration Number</p>
                        <p className="text-muted small">{vehicleInfo.licenseNumber}</p>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Email Address</p>
                        <p className="text-muted small">{vehicleInfo.email}</p>
                    </div>

                    {/* Job Title */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Job Title</p>
                        <p className="text-muted small">{vehicleInfo.jobTitle}</p>
                    </div>

                    {/* Custom / extra */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Custom Info</p>
                        <p className="text-muted small">{vehicleInfo.customField}</p>
                    </div>

                    {/* Working Days */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Working Days</p>
                        <p className="text-muted small">{vehicleInfo.workingDays}</p>
                    </div>

                    {/* Joining Date */}
                    <div className="col-md-6">
                        <p className="fw-semibold mb-1">Joining Date</p>
                        <p className="text-muted small">{vehicleInfo.joiningDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}