import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";

export default function UserTable() {
  const [page, setPage] = useState(1);

  const users = [
    { id: "00001", name: "Christine Brooks", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 1, status: "Active" },
    { id: "00002", name: "John Ashernine", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 10, status: "Inactive" },
    { id: "00003", name: "Darrell Caldwell", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 3, status: "Rejected" },
    { id: "00004", name: "Gilbert Johnston", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 4, status: "Active" },
    { id: "00005", name: "Alan Cain", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 40, status: "Processing" },
    { id: "00006", name: "Alfred Murray", email: "adedeji@gmail.com", date: "14 Feb 2019", bookings: 5, status: "Active" },
  ];

  const getStatusBadge = (status: String) => {
    switch (status) {
      case "Active": return "bg-success-subtle text-success fw-bold px-2 py-1 rounded";
      case "Inactive": return "bg-secondary-subtle text-secondary fw-bold px-2 py-1 rounded";
      case "Rejected": return "bg-danger-subtle text-danger fw-bold px-2 py-1 rounded";
      case "Processing": return "bg-warning-subtle text-warning fw-bold px-2 py-1 rounded";
      default: return "bg-light text-dark fw-bold px-2 py-1 rounded";
    }
  };

  return (
    <DashboardLayout>
      <div className="row mb-4">
        <div className="col-sm-12 col-md-12">
          <div className="card shadow rounded p-3">
            {/* Filters + Actions */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex gap-2">
                <select className="form-select form-select-sm">
                  <option>Filter By</option>
                  <option>Date</option>
                  <option>Verification</option>
                </select>
                <select className="form-select form-select-sm">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <button className="btn btn-link text-danger">Reset Filter</button>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm">Export</button>
                <button className="btn btn-danger btn-sm">+ Create User</button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>Email</th>
                    <th>DATE</th>
                    <th>Total Bookings</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.date}</td>
                      <td>{u.bookings}</td>
                      <td>
                        <span className={getStatusBadge(u.status)}>{u.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <select className="form-select form-select-sm" style={{ width: "70px" }}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <div className="d-flex align-items-center gap-2">
                <span>Page {page} of 2</span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
