// pages/users/tabs/ReportTab.tsx

export default function ReportTab({
    // props
}: {
    // props types
}) {
    // props destructuring (if any)

    // helper functions (if any)

    // state (if any)

    // side effects (if any)

    // constants (if any)

    // computed values (if any)

    // event handlers (if any)   

    // Mock demo data
    const reports = [
        { id: 1, user: "23456 - Prince Emmae", date: "Feb 01, 2025", reason: "Abuse", status: "Resolved" },
        { id: 2, user: "23466 - Mercy", date: "Feb 12, 2025", reason: "Impersonation", status: "Blocked" },
        { id: 3, user: "34567 - Daniel", date: "April 05, 2025", reason: "Scam", status: "Reported" },
        { id: 4, user: "23566 - Luke Ball", date: "May 12, 2025", reason: "Abuse", status: "Blocked" },
    ];

    // Badge styling
    const getStatusBadge = (status: string) => {
        switch (status) {
        case "Reported":
            return "badge rounded bg-primary-subtle text-primary fw-semibold px-3 py-2";
        case "Blocked":
            return "badge rounded bg-danger-subtle text-danger fw-semibold px-3 py-2";
        case "Resolved":
            return "badge rounded bg-success-subtle text-success fw-semibold px-3 py-2";
        default:
            return "badge rounded bg-light-subtle text-dark fw-semibold px-3 py-2";
        }
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
                                <th style={{ width: "35%" }}>User</th>
                                <th style={{ width: "20%" }}>Date</th>
                                <th style={{ width: "20%" }}>Reason</th>
                                <th style={{ width: "20%" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((rep) => (
                                <tr key={rep.id}>
                                    <td className="text-muted py-2 px-2">{rep.id}</td>
                                    <td className="text-muted py-2 px-2">{rep.user}</td>
                                    <td className="text-muted py-2 px-2">{rep.date}</td>
                                    <td className="text-muted py-2 px-2">{rep.reason}</td>
                                    <td className="py-2 px-2">
                                        <span className={`col-sm-12 ${getStatusBadge(rep.status)}`}>{rep.status}</span>
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
