// services/notificationApi.ts
import api from '../../../services/api';

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
    summary?: any;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T = any> {
    items: T[];
    meta: PaginationMeta;
}

/**
 * Filter parameters for notification queries
 */
export interface NotificationFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    channel?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}


/**
 * Notification API Service
 */
export const notificationApi = {
    /**
     * Fetch notifications with pagination and filtering
     */
    getNotifications: async (params?: NotificationFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get('/v1/admin/notifications', { params });
        return response.data;
    },

    /**
     * Fetch a single notification by ID
     */
    getNotificationById: async (notificationId: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/v1/admin/notifications/${notificationId}`);
        return response.data;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: string): Promise<ApiResponse<void>> => {
        const response = await api.patch(`/v1/admin/notifications/${notificationId}/read`);
        return response.data;
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<ApiResponse<void>> => {
        const response = await api.patch('/v1/admin/notifications/read-all');
        return response.data;
    },

    /**
     * Delete a notification
     */
    deleteNotification: async (notificationId: string): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/v1/admin/notifications/${notificationId}`);
        return response.data;
    },

    /**
     * Export notifications to CSV/Excel
     */
    exportNotifications: async (params?: NotificationFilters): Promise<Blob> => {
        const response = await api.get('/v1/admin/notifications/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Get notification statistics and summary
     */
    getNotificationStats: async (): Promise<ApiResponse<any>> => {
        const response = await api.get('/v1/admin/notifications/stats');
        return response.data;
    },

    /**
     * Send a new notification
     */
    sendNotification: async (data: {
        userIds: string[];
        type: string;
        channel: string;
        title: string;
        message: string;
        data?: any;
    }): Promise<ApiResponse<void>> => {
        const response = await api.post('/v1/admin/notifications/send', data);
        return response.data;
    }
};

export default notificationApi;