// pages/users/tabs/CompletedTab.tsx
// import React from "react";

interface CompletedTrip {
  id: number;
  bokking: string;
  dateSent: string;
  deliveryDate: string;
  status: "Completed";
}

export default function CompletedTab({
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
    const bookings: CompletedTrip[] = [
        { id: 1, bokking: "23456 - Prince Emmae", dateSent: "Feb 01, 2025", deliveryDate: "Mar 05, 2025", status: "Completed" },
        { id: 2, bokking: "23466 - Mercy", dateSent: "Feb 12, 2025", deliveryDate: "April 20, 2025", status: "Completed" },
        { id: 3, bokking: "34567 - Daniel", dateSent: "April 05, 2025", deliveryDate: "October 05, 2025", status: "Completed" },
        { id: 4, bokking: "23566 - Luke Ball", dateSent: "May 12, 2025", deliveryDate: "August 12, 2025", status: "Completed" },
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
                                <th style={{ width: "40%" }}>Receiver</th>
                                <th style={{ width: "15%" }}>Date Sent</th>
                                <th style={{ width: "15%" }}>Delivery Date</th>
                                <th style={{ width: "15%" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((trip) => (
                                <tr key={trip.id}>
                                    <td className="text-muted py-2 px-2">{trip.id}</td>
                                    <td className="text-muted py-2 px-2">{trip.bokking}</td>
                                    <td className="text-muted py-2 px-2">{trip.dateSent}</td>
                                    <td className="text-muted py-2 px-2">{trip.deliveryDate}</td>
                                    <td className="py-2 px-2">
                                        <span className={`col-sm-12 badge rounded bg-success-subtle text-success fw-semibold px-3 py-2`}>{trip.status}</span>
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
