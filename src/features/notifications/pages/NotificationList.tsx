// NotificationList.tsx
// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import PaginationBar from "../../../components/PaginationBar.tsx";
import notificationApi, { type NotificationFilters } from "../services/notificationApi.ts";

export default function NotificationList() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [metaData, setMetaData] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filters, setFilters] = useState<NotificationFilters>({search: "", type: "", channel: "", status: ""});

    // Fetch notifications from API
    useEffect(() => {
        async function fetchNotifications() {
            setIsLoading(true);
            try {
                const response = await notificationApi.getNotifications({page, limit: perPage, ...filters});

                if (response.code === 200) {
                    setNotifications(response.data.items);
                    setTotalPages(response.data.meta.totalPages);
                    setTotalItems(response.data.meta.total);
                    setMetaData(response.data.meta);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchNotifications();
    }, [page, perPage, filters]);

    // Handle filter changes
    const handleFilterChange = (key: keyof NotificationFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({ search: "", type: "", channel: "", status: "" });
        setPage(1);
    };


    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
        }
    };


    // Format date for time ago
    const formatTimeAgo = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Get notification type color
    const getNotificationTypeColor = (type: string, index: number) => {
        const typeMap: { [key: string]: string } = {
            'system': 'primary',
            'booking': 'success', 
            'payment': 'info',
            'security': 'warning',
            'promotion': 'secondary'
        };
        return typeMap[type] || (index % 2 === 0 ? 'primary' : 'warning');
    };

    // Safe data access function
    const getSafeValue = (value: any, fallback: string = "N/A") => {
        return value !== undefined && value !== null ? value : fallback;
    };

    return (
        <DashboardLayout>
            <div className="card border-0 shadow-sm rounded">
                <div className="card-body">
                    {/* Header */}
                    {/*<div className="d-flex justify-content-between align-items-center mb-3 py-3">
                        <h3 className="fw-bold mb-0">
                            <span className="fa fa-bell"></span> Notifications
                        </h3>
                        <Link to="/notifications/create" className="btn btn-danger fw-semibold">
                            <i className="fa fa-paper-plane me-2"></i> Send notification
                        </Link>
                    </div>*/}

                    {/* Quick Stats */}
                    {metaData?.summary && (
                        <div className="row mb-4">
                            <div className="col-md-3">
                                <div className="card bg-primary text-white">
                                    <div className="card-body py-2">
                                        <small className="d-block">Total</small>
                                        <h5 className="mb-0">{metaData.summary.totalNotifications?.toLocaleString()}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card bg-warning text-dark">
                                    <div className="card-body py-2">
                                        <small className="d-block">Unread</small>
                                        <h5 className="mb-0">{metaData.summary.statusCounts?.unread?.toLocaleString()}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card bg-success text-white">
                                    <div className="card-body py-2">
                                        <small className="d-block">Today</small>
                                        <h5 className="mb-0">{metaData.summary.todayNotifications?.toLocaleString()}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card bg-info text-white">
                                    <div className="card-body py-2">
                                        <small className="d-block">System</small>
                                        <h5 className="mb-0">{metaData.summary.typeCounts?.system?.toLocaleString()}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Bar */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <div className="d-flex flex-wrap bg-light border rounded-3 shadow-sm gap-0 ps-0 pe-0 p-2">
                        
                            {/* Filter By */}
                            <button className="btn btn-sm btn-light border-0 fw-semibold px-3" disabled={true}>
                                <i className="fa fa-filter me-1"></i> Filter By
                            </button>

                            {/* Search Input */}
                            <div className="d-flex align-items-center px-2">
                                <input 
                                    type="text"
                                    className="form-control form-control-sm border-1 bg-transparent shadow-lg" 
                                    placeholder="Search notifications..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    style={{ minWidth: "200px" }}
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="d-flex align-items-center border-start px-2">
                                <select 
                                    className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                    style={{ width: "auto" }}
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange("type", e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="system">System</option>
                                    <option value="booking">Booking</option>
                                    <option value="payment">Payment</option>
                                    <option value="security">Security</option>
                                    <option value="promotion">Promotion</option>
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="d-flex align-items-center border-start px-2">
                                <select 
                                    className="form-select form-select-sm border-0 bg-transparent fw-semibold" 
                                    style={{ width: "auto" }}
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="read">Read</option>
                                    <option value="unread">Unread</option>
                                </select>
                            </div>

                            {/* Reset Filter */}
                            <div className="d-flex align-items-center border-start px-2">
                                <button className="btn btn-sm btn-light border-0 fw-semibold px-3 text-danger" onClick={resetFilters}>
                                    <i className="fa fa-undo me-1"></i> Reset
                                </button>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                {notifications.some(n => !n.isRead) && (
                                    <button className="btn btn-outline-primary btn-sm fw-bold" onClick={handleMarkAllAsRead}>
                                        <i className="fa fa-check-double me-1"></i> Mark All as Read
                                    </button>
                                )}
                            </div>
                        </div>


                        {/* Pagination Info */}
                        <div className="text-muted small">
                            Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalItems)} of {totalItems}
                        </div>
                    </div>


                    {/* Notifications List */}
                    <div className="list-group">
                        {isLoading ? (
                            <div className="text-center text-muted py-4">
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <p className="text-danger text-center small py-5">
                                Oops... No notifications available!
                            </p>
                        ) : (
                            /* Notifications List */
                            <div className="list-group list-group-flush">
                                {notifications.map((notification, index) => (
                                    <div 
                                        key={notification._id} 
                                        className={`list-group-item border-0 py-3 border-start border-4 border-${getNotificationTypeColor(notification.type, index)}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    {!notification.isRead && ( <span className="small text-warning">New</span> )}
                                                    <span className={`badge text-${getNotificationTypeColor(notification.type, index)}`}>
                                                        <span className='me-1'>TYPE:</span> {getSafeValue(notification.type).toUpperCase()}
                                                    </span>
                                                    {/*<span className="badge bg-secondary-subtle text-secondary">
                                                        <span className='me-1'>CHANNEL:</span> {getSafeValue(notification.channel).toUpperCase()}
                                                    </span>*/}
                                                </div>
                                                
                                                <h6 className="fw-semibold mb-1 text-dark">{getSafeValue(notification.title)}</h6>
                                                <p className="text-muted mb-2 small">{getSafeValue(notification.message)}</p>
                                                
                                                <div className="d-flex flex-wrap gap-3 text-muted small">
                                                    <span>
                                                        <i className="fa fa-user me-1"></i>
                                                        To: {getSafeValue(notification.userId?.fullName)}
                                                    </span>
                                                    <span>
                                                        <i className="fa fa-user-tag me-1"></i>
                                                        From: {getSafeValue(notification.triggeredById?.fullName)}
                                                    </span>
                                                    {notification.data?.bidId && (
                                                        <span className="badge bg-info-subtle text-info">
                                                            Bid: {notification.data.bidId}
                                                        </span>
                                                    )}
                                                    {notification.data?.bookingId && (
                                                        <span className="badge bg-success-subtle text-success">
                                                            Booking: {notification.data.bookingId}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <p className="fw-semibold small mb-0 mt-2">
                                                    <i className="fa fa-clock me-1"></i>
                                                    {formatTimeAgo(notification.createdAt)}
                                                </p>
                                            </div>
                                            
                                            <div className="dropdown">
                                                <button 
                                                    className="btn btn-sm btn-light border-0" 
                                                    type="button" 
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li>
                                                        <button className="dropdown-item">
                                                            <i className="fa fa-eye me-2"></i> View Details
                                                        </button>
                                                    </li>
                                                    {!notification.isRead && (
                                                        <li>
                                                            <button className="dropdown-item">
                                                                <i className="fa fa-check me-2"></i> Mark as Read
                                                            </button>
                                                        </li>
                                                    )}
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button className="dropdown-item text-danger">
                                                            <i className="fa fa-trash me-2"></i> Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                        
                    {/* Pagination Bar */}
                    <PaginationBar page={page} perPage={perPage} totalPages={totalPages} onPageChange={setPage} onPerPageChange={setPerPage}/>
                </div>
            </div>
        </DashboardLayout>
    );
}