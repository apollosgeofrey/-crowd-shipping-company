import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import PaginationBar from "../../../components/PaginationBar.tsx";

export default function AdminList() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(50);
  const [admins, setAdmins] = useState<any[]>([
    { id: "01", name: "Admin 1 David", email: "adedeji@gmail.com", date: "14 Feb 2019", role: "Admin 1", status: "Active" },
    { id: "02", name: "Rosie Pearson", email: "adedeji@gmail.com", date: "14 Feb 2019", role: "Admin 2", status: "Inactive" },
    { id: "03", name: "Darrell Caldwell", email: "adedeji@gmail.com", date: "14 Feb 2019", role: "Admin 3", status: "Rejected" },
    { id: "04", name: "Gilbert Johnston", email: "adedeji@gmail.com", date: "14 Feb 2019", role: "Admin 4", status: "Active" },
    { id: "05", name: "Alan Cain", email: "adedeji@gmail.com", date: "14 Feb 2019", role: "Admin 5", status: "Processing" },
    { id: "06", name: "Alfred Murray", email: "adedeji@gmail.com", date: "14 Feb 2019", role: "Admin 6", status: "Active" },
  ]);

  // Fetch data whenever page changes
  useEffect(() => {
    async function fetchAdmins() {
      setIsLoading(true);
      try {
        // Example API call (replace with your backend endpoint)
        // const res = await fetch(`/api/admins?page=${page}`);
        // const data = await res.json();

        // Laravel paginate-style response often has: data, total, per_page, current_page
        setAdmins(admins);
        // optionally update totalPages dynamically: setTotalPages(data.last_page);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdmins();
  }, [page, perPage]);

  // Get Status Badge Classes 
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
                      <option>Admin Role</option>
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
                    <span className="">Export</span> <i className="fa fa-angle-down"></i>
                  </button>
                  {/* Create Admin URL */}
                  <Link to="/admin/create" className="btn btn-primary btn-sm fw-bold">
                    <span className="fa fa-plus"></span> Create Admin
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
                      <th style={{ width: "15%" }}>Admin Role</th>
                      <th style={{ width: "10%" }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-3">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      // Render table rows
                      admins.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-muted py-3">No record admins found</td></tr>
                      ) : (
                        admins.map((a) => (
                          <tr key={a.id}>
                            <td className="text-muted py-3 px-2">{a.id}</td>
                            <td className="text-muted py-3 px-2">
                              <Link to={`/admins/${a.id}/show`} className="text-decoration-none text-primary">{a.name}</Link>
                            </td>
                            <td className="text-muted py-3 px-2">{a.email}</td>
                            <td className="text-muted py-3 px-2">{a.date}</td>
                            <td className="text-muted py-3 px-2">{a.role}</td>
                            <td className="text-muted py-3 px-2">
                              <span className={`col-sm-12 ${getStatusBadge(a.status)}`}>{a.status}</span>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage} />

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
