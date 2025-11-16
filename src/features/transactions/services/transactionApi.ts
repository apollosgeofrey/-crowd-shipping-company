// services/transactionApi.ts
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
 * Filter parameters for transaction queries
 */
export interface TransactionFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    purpose?: string;
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
 * Transaction API Service
 */
export const transactionApi = {
    /**
     * Fetch transactions with pagination and filtering
     */
    getTransactions: async (params?: TransactionFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get('/v1/admin/transactions', { params });
        return response.data;
    },

    /**
     * Fetch a single transaction by ID
     */
    getTransactionById: async (transactionId: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/v1/admin/transactions/${transactionId}`);
        return response.data;
    },

    /**
     * Fetch transactions by user ID
     */
    getTransactionsByUser: async (userId: string, params?: TransactionFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get(`/v1/admin/users/${userId}/transactions`, { params });
        return response.data;
    },

    /**
     * Export transactions to CSV/Excel
     */
    exportTransactions: async (params?: TransactionFilters): Promise<Blob> => {
        const response = await api.get('/v1/admin/transactions/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }
};

export default transactionApi;