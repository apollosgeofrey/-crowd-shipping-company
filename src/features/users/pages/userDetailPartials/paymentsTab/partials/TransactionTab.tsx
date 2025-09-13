// pages/users/tabs/TransactionTab.tsx
// import React from "react";

export default function TransactionTab({
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
    
    const transactions = [
        { date: "July 02, 2025", time: "09:20 AM", id: "123456789tg", amount: "#3000", method: "Wallet", status: "Successful" },
        { date: "July 05, 2025", time: "10:00 AM", id: "123456789tg", amount: "#3000", method: "Card", status: "Declined" },
        { date: "July 07, 2025", time: "09:30 AM", id: "123456789tg", amount: "#3000", method: "Wallet", status: "Successful" },
        { date: "July 08, 2025", time: "09:52 AM", id: "123456789tg", amount: "#3000", method: "Card", status: "Declined" },
        { date: "July 09, 2025", time: "09:10 AM", id: "123456789tg", amount: "#3000", method: "Wallet", status: "Successful" },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
        case "Successful":
            return "badge rounded bg-success-subtle text-success px-3 py-2";
        case "Declined":
            return "badge rounded bg-danger-subtle text-danger px-3 py-2";
        default:
            return "badge rounded bg-secondary-subtle text-secondary px-3 py-2";
        }
    };
    // other logic (if any)

    // Render
    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Id</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-4">
                                        No transactions available.
                                    </td>
                                </tr>
                            ) : (transactions.map((txn, idx) => (
                                <tr key={idx}>
                                    <td className="text-muted">{txn.date}</td>
                                    <td className="text-muted">{txn.time}</td>
                                    <td className="text-muted">{txn.id}</td>
                                    <td className="text-muted">{txn.amount}</td>
                                    <td className="text-muted">{txn.method}</td>
                                    <td className="text-muted py-3 px-2">
                                        <span className={`col-sm-12 ${getStatusBadge(txn.status)}`}>{txn.status}</span>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
