// pages/users/tabs/PendingTab.tsx
// import React from "react";

interface PendingTrip {
  id: number;
  driver: string;
  dateSent: string;
  deliveryDate?: string; // optional since pending is not delivered
  status: "Waiting";
}

export default function PendingTab({
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
    const trips: PendingTrip[] = [
        { id: 1, driver: "23456 - Prince Emmae", dateSent: "Feb 01, 2025", status: "Waiting" },
        { id: 2, driver: "23466 - Mercy", dateSent: "Feb 12, 2025", status: "Waiting" },
        { id: 3, driver: "34567 - Daniel", dateSent: "April 05, 2025", status: "Waiting" },
        { id: 4, driver: "23566 - Luke Ball", dateSent: "May 12, 2025", status: "Waiting" },
    ];

    // Badge renderer
    const getStatusBadge = (status: PendingTrip["status"]) => {
        return "badge rounded bg-warning-subtle text-warning fw-semibold px-3 py-2";
        // Yellow background, dark text — matches screenshot
    };
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
                            <th style={{ width: "40%" }}>Driver</th>
                            <th style={{ width: "15%" }}>Date Sent</th>
                            <th style={{ width: "15%" }}>Delivery Date</th>
                            <th style={{ width: "15%" }}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                            {trips.map((trip) => (
                                <tr key={trip.id}>
                                    <td className="text-muted py-2 px-2">{trip.id}</td>
                                    <td className="text-muted py-2 px-2">{trip.driver}</td>
                                    <td className="text-muted py-2 px-2">{trip.dateSent}</td>
                                    <td className="text-muted py-2 px-2">
                                        {trip.deliveryDate ? trip.deliveryDate : "-----------"}
                                    </td>
                                    <td className="py-2 px-2">
                                        <span className={`col-sm-12 ${getStatusBadge(trip.status)}`}>{trip.status}</span>
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
