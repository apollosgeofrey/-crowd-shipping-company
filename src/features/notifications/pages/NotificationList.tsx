import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";

export default function NotificationList() {
    const [notifications, setNotifications] = useState<any[]>([
        {
            id: "01",
            type: "driver",
            title: "New driver registration",
            message: "John Doe has applied to become a driver",
            timeAgo: "2 hours ago"
        }, {
            id: "02",
            type: "trip",
            title: "Trip completed",
            message: "Trip #TRP-001 has been successfully completed",
            timeAgo: "4 hours ago"
        }, {
            id: "03",
            type: "driver",
            title: "New driver registration",
            message: "John Doe has applied to become a driver",
            timeAgo: "2 hours ago"
        }, {
            id: "04",
            type: "trip",
            title: "Trip completed",
            message: "Trip #TRP-001 has been successfully completed",
            timeAgo: "4 hours ago"
        },
    ]);

    useEffect(() => {
        // Example: fetch from API in real use
        // fetch("/api/notifications").then(...)
        setNotifications(notifications);
    }, []);

    return (
        <DashboardLayout>
            <div className="card border-0 shadow-sm rounded">
                <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3 py-3">
                        <h3 className="fw-bold mb-0">
                            <span className="fa fa-bell"></span> Notifications
                        </h3>
                        <Link to="/notifications/create" className="btn btn-danger fw-semibold">
                            <i className="fa fa-paper-plane me-2"></i> Send notification
                        </Link>
                    </div>

                    {/* Notifications List */}
                    <div className="list-group">
                        {notifications.length === 0 ? (
                            <p className="text-danger text-center small py-5">
                                Oops... No notifications available!
                            </p>
                        ) : (
                            /* Notifications List */
                            <div className="list-group list-group-flush">
                                {notifications.map((n, i) => (
                                    <div key={n.id} className={`list-group-item border-0 py-3 border-start border-4 border-${(i%2) === 0 ? "primary" : "warning"}`}>
                                        <Link key={n.id} to={n.link || "#"} className={`list-group-item list-group-item-action border-0 py-3 d-flex flex-column`}>
                                            <h6 className="fw-semibold mb-1 text-dark">{n.title}</h6>
                                            <p className="text-muted mb-1 small">{n.message}</p>
                                            <p className="fw-semibold small mb-0">{n.timeAgo}</p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
