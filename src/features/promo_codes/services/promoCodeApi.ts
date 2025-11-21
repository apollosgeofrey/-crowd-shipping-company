// services/promoCodeApi.ts
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
 * Filter parameters for promo code queries
 */
export interface PromoCodeFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    promoScope?: string;
    currency?: string;    
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
 * Promo Code summary interface
 */
export interface PromoCodeSummary {
    totalPromoCodes: number;
    todayPromoCodes: number;
    activePromoCodes: number;
    typeCounts: {
        percentage: number;
        flat: number;
        free: number;
    };
    statusCounts: {
        active: number;
        inactive: number;
        expired: number;
    };
    usageStats: {
        totalUsage: number;
        averageUsage: number;
        maxUsage: number;
    };
    scopeCounts: {
        global: number;
        companySpecific: number;
    };
    summaryUpdate: string;
}

/**
 * Create/Update Promo Code interface
 */
export interface CreateOrUpdatePromoCode {
    code: string;
    description?: string;
    type: 'percentage' | 'flat' | 'free';
    value: number;
    maxDiscountAmount?: number;
    minDiscountAmount?: number;
    maxUsageCount?: number;
    maxUsagePerUser?: number;
    minOrderAmount?: number;
    applicableServiceTypes?: string[];
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'inactive';
    companyId?: string;
}

/**
 * Promo Code API Service
 */
export const promoCodeApi = {
    /**
     * Fetch promo codes with pagination and filtering
     */
    getPromoCodes: async (params?: PromoCodeFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get('/v1/admin/promo-codes', { params });
        return response.data;
    },

    /**
     * Fetch a single promo code by ID
     */
    getPromoCodeById: async (promoCodeId: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/v1/admin/promo-codes/${promoCodeId}`);
        return response.data;
    },

    /**
     * Create a new promo code
     */
    createPromoCode: async (data: CreateOrUpdatePromoCode): Promise<ApiResponse<any>> => {
        const response = await api.post('/v1/admin/promo-codes', data);
        return response.data;
    },

    /**
     * Update a promo code
     */
    updatePromoCode: async (promoCodeId: string, data: Partial<CreateOrUpdatePromoCode>): Promise<ApiResponse<any>> => {
        const response = await api.put(`/v1/admin/promo-codes/${promoCodeId}`, data);
        return response.data;
    },

    /**
     * Delete a promo code
     */
    deletePromoCode: async (promoCodeId: string): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/v1/admin/promo-codes/${promoCodeId}`);
        return response.data;
    },

    /**
     * Export promo codes to CSV/Excel
     */
    exportPromoCodes: async (params?: PromoCodeFilters): Promise<Blob> => {
        const response = await api.get('/v1/admin/promo-codes/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Get promo code statistics and summary
     */
    getPromoCodeStats: async (): Promise<ApiResponse<PromoCodeSummary>> => {
        const response = await api.get('/v1/admin/promo-codes/stats');
        return response.data;
    }
};

export default promoCodeApi;