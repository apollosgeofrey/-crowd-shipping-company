// services/tripApi.ts
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
 * Trip filters
 */
export interface TripFilters {
    page?: number;
    limit?: number;
    search?: string;
    fleetType?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
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
 * Trip API Service
 */
export const tripApi = {
    /**
     * Fetch trips with pagination + filters
     */
    getTrips: async (
        params?: TripFilters
    ): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get('/v1/admin/trips', { params });
        return response.data;
    },

    /**
     * Fetch single trip
     */
    getTripById: async (tripId: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/v1/admin/trips/${tripId}`);
        return response.data;
    },

    /**
     * Export trips (CSV/Excel)
     */
    exportTrips: async (params?: TripFilters): Promise<Blob> => {
        const response = await api.get('/v1/admin/trips/export', {
            params,
            responseType: 'blob',
        });
        return response.data;
    }
};

export default tripApi;
