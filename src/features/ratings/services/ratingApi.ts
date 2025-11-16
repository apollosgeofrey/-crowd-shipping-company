// services/ratingApi.ts
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
 * Filter parameters for rating queries
 */
export interface RatingFilters {
    page?: number;
    limit?: number;
    search?: string;
    ratingType?: string;
    minRating?: string;
    maxRating?: string;
    hasReview?: string;
    dateFrom?: string;
    dateTo?: string;
    raterId?: string;
    rateeId?: string;
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
 * Rating summary interface
 */
export interface RatingSummary {
    totalRatings: number;
    todayRatings: number;
    typeCounts: {
        customer: number;
        driver: number;
    };
    ratingDistribution: {
        oneStar: number;
        twoStar: number;
        threeStar: number;
        fourStar: number;
        fiveStar: number;
    };
    averageRatings: {
        overall: number;
        customer: number;
        driver: number;
    };
    reviews: {
        withReviews: number;
        withoutReviews: number;
    };
    summaryUpdate: string;
}

/**
 * Rating API Service
 */
export const ratingApi = {
    /**
     * Fetch ratings with pagination and filtering
     */
    getRatings: async (params?: RatingFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get('/v1/admin/ratings', { params });
        return response.data;
    },

    /**
     * Fetch a single rating by ID
     */
    getRatingById: async (ratingId: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/v1/admin/ratings/${ratingId}`);
        return response.data;
    },

    /**
     * Fetch ratings by rater ID
     */
    getRatingsByRater: async (raterId: string, params?: RatingFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get(`/v1/admin/raters/${raterId}/ratings`, { params });
        return response.data;
    },

    /**
     * Fetch ratings by ratee ID
     */
    getRatingsByRatee: async (rateeId: string, params?: RatingFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get(`/v1/admin/ratees/${rateeId}/ratings`, { params });
        return response.data;
    },

    /**
     * Fetch ratings by booking ID
     */
    getRatingsByBooking: async (bookingId: string, params?: RatingFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get(`/v1/admin/bookings/${bookingId}/ratings`, { params });
        return response.data;
    },

    /**
     * Export ratings to CSV/Excel
     */
    exportRatings: async (params?: RatingFilters): Promise<Blob> => {
        const response = await api.get('/v1/admin/ratings/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Get rating statistics and summary
     */
    getRatingStats: async (): Promise<ApiResponse<RatingSummary>> => {
        const response = await api.get('/v1/admin/ratings/stats');
        return response.data;
    },

    /**
     * Delete a rating (admin only)
     */
    deleteRating: async (ratingId: string): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/v1/admin/ratings/${ratingId}`);
        return response.data;
    }
};

export default ratingApi;