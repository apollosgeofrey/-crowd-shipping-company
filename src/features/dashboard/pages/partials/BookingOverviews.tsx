// import { ProgressBar } from "react-bootstrap";

export default function BookingOverview() {
  const bookings = [
    {
      id: "TRP-001",
      description: "MacBook Pro",
      price: "₦450,000",
      driver: "Michael Brown",
      vehicle: "Toyota Camry - ABC123XY",
      route: "Lagos Island → Victoria Island",
      status: { text: "In Transit", color: "primary" },
      progress: 65,
      eta: "2:30 PM",
    },
    {
      id: "TRP-002",
      description: "Legal Papers",
      price: "₦25,000",
      driver: "James Anderson",
      vehicle: "Honda Accord - XYZ789AB",
      route: "Ikeja → Maryland",
      status: { text: "Picking Up", color: "warning" },
      progress: 20,
      eta: "2:30 PM",
    },
    {
      id: "TRP-003",
      description: "Legal Papers",
      price: "₦25,000",
      driver: "Daniel Lee",
      vehicle: "Nissan Altima - DEF456CD",
      route: "Lekki Phase 1 → Ajah",
      status: { text: "Delivered", color: "success" },
      progress: 100,
      eta: "2:30 PM",
    },
    {
      id: "TRP-004",
      description: "Designer Clothes",
      price: "₦185,000",
      driver: "James Anderson",
      vehicle: "Honda Accord - XYZ789AB",
      route: "San Francisco → San Bay",
      status: { text: "Delivered", color: "success" },
      progress: 100,
      eta: "2:30 PM",
    },
  ];

  return (
    <div className="card shadow rounded p-3" style={{ overflowX: "auto", maxWidth: "100vw" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold fs-6">Booking Overview</h6>
        <button className="btn btn-outline-secondary btn-sm rounded">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="table-xscroll small">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Status</th>
              <th>Progress</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>
                  <div className="fw-bold">{trip.description}</div>
                  <small className="text-muted">{trip.price}</small>
                </td>
                <td>
                  <div className="fw-bold">{trip.driver}</div>
                  <small className="text-muted">{trip.vehicle}</small>
                </td>
                <td className="text-muted">{trip.route}</td>
                <td>
                  <span className={`text-${trip.status.color}`}>
                    {trip.status.text}
                  </span>
                </td>
                <td style={{ width: "160px" }}>
                  <div className="progress" style={{ height: "8px" }}>
                    <div className={`progress-bar bg-${trip.status.color}`}
                      role="progressbar"
                      style={{ width: `${trip.progress}%` }}
                      aria-valuenow={trip.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <small className="text-muted">{trip.progress}%</small>
                </td>
                <td className="fw-bold">{trip.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
