import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function DriverList() {
    const [page, setPage] = useState(1);

    const drivers = [
        { id: "01", name: "Christine Brooks", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 1, status: "Active" },
        { id: "02", name: "John Ashernine", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 10, status: "Inactive" },
        { id: "03", name: "Darrell Caldwell", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 3, status: "Rejected" },
        { id: "04", name: "Gilbert Johnston", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 4, status: "Active" },
        { id: "05", name: "Alan Cain", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 40, status: "Processing" },
        { id: "06", name: "Alfred Murray", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 5, status: "Active" },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active": return "badge rounded bg-success-subtle text-success fw-semibold px-3 py-2";
            case "Inactive": return "badge rounded bg-secondary-subtle text-secondary fw-semibold px-3 py-2";
            case "Rejected": return "badge rounded bg-danger-subtle text-danger fw-semibold px-3 py-2";
            case "Processing": return "badge rounded bg-info-subtle text-info fw-semibold px-3 py-2";
            default: return "badge rounded bg-light text-dark fw-semibold px-3 py-2";
        }
    };

    return (
        <DashboardLayout>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded" style={{ overflowX: "auto", maxWidth: "100vw" }}>
                        <div className="card-body">
                        
                            {/* Filter Bar */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
                                
                                    {/* Filter By (first item, no border-left) */}
                                    <button className="btn btn-sm btn-light border-0 fw-semibold px-3">
                                        <i className="fa fa-filter me-1"></i> Filter By
                                    </button>

                                    {/* Divider applied to subsequent items */}
                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }}>
                                        <option>Date</option>
                                        </select>
                                    </div>

                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }}>
                                        <option>Verification</option>
                                        </select>
                                    </div>

                                    <div className="d-flex align-items-center border-start px-2">
                                        <select className="form-select form-select-sm border-0 bg-transparent fw-semibold" style={{ width: "auto" }}>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        </select>
                                    </div>

                                    <div className="d-flex align-items-center border-start px-2">
                                        <button className="btn btn-sm btn-light border-0 fw-semibold px-3 text-danger">
                                        <i className="fa fa-undo me-1"></i> Reset Filter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary btn-sm fw-bold">
                                        <span className="">Export</span> <span className="fa fa-angle-down"></span>
                                    </button>

                                    {/* Create Admin URL */}
                                    <Link to="/drivers/create" className="btn btn-primary btn-sm fw-bold">
                                        <span className="fa fa-plus"></span> Create Driver
                                    </Link>
                                </div>
                            </div>


                            {/* Table */}
                            <div className="table-responsive rounded-3 shadow-sm border">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                        <th style={{ width: "5%" }}>ID</th>
                                        <th style={{ width: "30%" }}>NAME</th>
                                        <th style={{ width: "25%" }}>Email</th>
                                        <th style={{ width: "15%" }}>DATE</th>
                                        <th style={{ width: "15%" }}>Total Bookings</th>
                                        <th style={{ width: "10%" }}>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {drivers.map((d) => (
                                        <tr key={d.id}>
                                            <td className="text-muted py-3 px-2">{d.id}</td>
                                            <td className="text-muted py-3 px-2">
                                                <Link to={`/drivers/${d.id}/show`} className="text-decoration-none text-primary">{d.name}</Link>
                                            </td>
                                            <td className="text-muted py-3 px-2">{d.email}</td>
                                            <td className="text-muted py-3 px-2">{d.date}</td>
                                            <td className="text-muted py-3 px-2">{d.bookings}</td>
                                            <td className="text-muted py-3 px-2">
                                                <span className={`col-sm-12 ${getStatusBadge(d.status)}`}>{d.status}</span>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                                
                            {/* Pagination */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <select className="form-select form-select-sm rounded border-primary fw-bold" style={{ width: "auto" }}>
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="text-dark fw-bold small">
                                        Page <button className="btn btn-outline-primary btn-sm rounded px-2 mx-2">{page}</button> of 2
                                    </span>
                                    <button className="btn btn-outline-primary btn-sm rounded" disabled={page === 1} onClick={() => setPage(page - 1)}>
                                        <i className="fa fa-angle-left me-1"></i> Previous
                                    </button>
                                    <button className="btn btn-outline-primary btn-sm rounded" onClick={() => setPage(page + 1)}>
                                        Next <i className="fa fa-angle-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}