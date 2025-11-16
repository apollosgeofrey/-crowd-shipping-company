// services/bookingApi.ts
import api from '../../../services/api';

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
    total: number;                  // Total number of items
    perPage: number;                // Items per page
    currentPage: number;            // Current page number
    totalPages: number;             // Total number of pages
    summary?: any;       // Booking statistics summary
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T = any> {
    items: T[];                     // Array of items for current page
    meta: PaginationMeta;           // Pagination metadata
}



/**
 * Payload for updating booking information
 */
export interface BookingPayload {
    status?: string;                // Booking status update
    paymentStatus?: string;         // Payment status update
    total?: number;                 // Total amount update
    subtotal?: number;              // Subtotal amount update
    fees?: number;                  // Fees amount update
    taxes?: number;                 // Taxes amount update
}

/**
 * Filter parameters for booking queries
 */
export interface BookingFilters {
    page?: number;                  // Page number (default: 1)
    limit?: number;                 // Items per page (default: 20)
    search?: string;                // Search by booking reference or tracking ID
    status?: string;                // Filter by booking status
    paymentStatus?: string;         // Filter by payment status
    fleetType?: string;            // Filter by fleet type
    dateFrom?: string;             // Filter by date range (start)
    dateTo?: string;               // Filter by date range (end)
    travellerId?: string;          // Filter by specific traveller
    senderId?: string;             // Filter by specific sender
}

/**
 * Standard API response format from the backend
 * @template T - Type of data payload
 */
export interface ApiResponse<T = any> {
    code: number;                   // HTTP status code (e.g., 200, 400, 500)
    message: string;                // Response message from server
    data: T;                        // Response payload data
}

/**
 * Booking API Service - Collection of methods for booking management operations
 * All methods follow the backend API structure and return standardized responses
 */
export const bookingApi = {
    /**
     * Fetch bookings with pagination and filtering
     * @param params - Query parameters for pagination and filtering
     * @returns Promise resolving to API response with paginated bookings
     */
    getBookings: async (params?: BookingFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get('/v1/admin/bookings', { params });
        return response.data;
    },

    /**
     * Fetch a single booking by its unique ID
     * @param bookingId - The unique identifier of the booking to fetch
     * @returns Promise resolving to API response with booking data
     */
    getBookingById: async (bookingId: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/v1/admin/bookings/${bookingId}`);
        return response.data;
    },

    /**
     * Fetch bookings by traveller ID
     * @param travellerId - The unique identifier of the traveller
     * @param params - Query parameters for pagination and filtering
     * @returns Promise resolving to API response with paginated bookings
     */
    getBookingsByTraveller: async (travellerId: string, params?: BookingFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get(`/v1/admin/travellers/${travellerId}/bookings`, { params });
        return response.data;
    },

    /**
     * Fetch bookings by sender ID
     * @param senderId - The unique identifier of the sender
     * @param params - Query parameters for pagination and filtering
     * @returns Promise resolving to API response with paginated bookings
     */
    getBookingsBySender: async (senderId: string, params?: BookingFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get(`/v1/admin/senders/${senderId}/bookings`, { params });
        return response.data;
    },

    /**
     * Update booking status
     * @param bookingId - The unique identifier of the booking to update
     * @param status - New booking status
     * @returns Promise resolving to API response with updated booking data
     */
    updateBookingStatus: async (bookingId: string, status: string): Promise<ApiResponse<any>> => {
        const response = await api.patch(`/v1/admin/bookings/${bookingId}/status`, { status });
        return response.data;
    },

    /**
     * Update booking payment status
     * @param bookingId - The unique identifier of the booking to update
     * @param paymentStatus - New payment status
     * @returns Promise resolving to API response with updated booking data
     */
    updatePaymentStatus: async (bookingId: string, paymentStatus: string): Promise<ApiResponse<any>> => {
        const response = await api.patch(`/v1/admin/bookings/${bookingId}/payment-status`, { paymentStatus });
        return response.data;
    },

    /**
     * Update booking information
     * @param bookingId - The unique identifier of the booking to update
     * @param bookingData - Partial booking data with fields to update
     * @returns Promise resolving to API response with updated booking data
     */
    updateBooking: async (bookingId: string, bookingData: BookingPayload): Promise<ApiResponse<any>> => {
        const response = await api.put(`/v1/admin/bookings/${bookingId}`, bookingData);
        return response.data;
    },

    /**
     * Cancel a booking
     * @param bookingId - The unique identifier of the booking to cancel
     * @param reason - Optional cancellation reason
     * @returns Promise resolving to API response with cancelled booking data
     */
    cancelBooking: async (bookingId: string, reason?: string): Promise<ApiResponse<any>> => {
        const response = await api.post(`/v1/admin/bookings/${bookingId}/cancel`, { reason });
        return response.data;
    },


    /**
     * Export bookings to CSV/Excel
     * @param params - Filter parameters for export
     * @returns Promise resolving to blob data for download
     */
    exportBookings: async (params?: BookingFilters): Promise<Blob> => {
        const response = await api.get('/v1/admin/bookings/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }
};

// Export for default import - Preferred usage in components
export default bookingApi;