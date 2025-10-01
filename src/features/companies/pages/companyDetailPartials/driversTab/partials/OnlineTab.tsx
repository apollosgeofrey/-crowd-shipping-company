// pages/users/tabs/OnlineTab.tsx
// import React from "react";

interface OnlineDrivers {
    id: number;
    name: string;
    totalDeliveries: string;
    dateJoind: string;
    status: "Online";
}

export default function OnlineTab({
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


    // Mock demo data
    const drivers: OnlineDrivers[] = [
        { id: 1, totalDeliveries: "2", name: "23456 - Prince Emmae", dateJoind: "Mar 05, 2025", status: "Online" },
        { id: 2, totalDeliveries: "4", name: "23466 - Mercy", dateJoind: "April 20, 2025", status: "Online" },
        { id: 3, totalDeliveries: "5", name: "34567 - Daniel",  dateJoind: "October 05, 2025", status: "Online" },
        { id: 4, totalDeliveries: "7", name: "23566 - Luke Ball", dateJoind: "August 12, 2025", status: "Online" },
    ];

    // other logic (if any)
    
    // Render
    return (
        <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
            <div className="card-body">
                <div className="table-responsive small">
                    <table className="table align-middle border table-hover">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "5%" }}>#</th>
                                <th style={{ width: "35%" }}>Driver</th>
                                <th style={{ width: "20%" }}>Completed Deliveries</th>
                                <th style={{ width: "15%" }}>Date Onboarded</th>
                                <th style={{ width: "15%" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver) => (
                                <tr key={driver.id}>
                                    <td className="text-muted py-2 px-2">{driver.id}</td>
                                    <td className="text-muted py-2 px-2">{driver.name}</td>
                                    <td className="text-muted py-2 px-2">{driver.totalDeliveries}</td>
                                    <td className="text-muted py-2 px-2">{driver.dateJoind}</td>
                                    <td className="py-2 px-2">
                                        <span className={`col-sm-12 badge rounded bg-success-subtle text-success fw-semibold px-3 py-2`}>{driver.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
