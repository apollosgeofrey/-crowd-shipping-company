// services/userApi.ts
import api from '@/services/api';

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
    total: number;                  // Total number of items
    perPage: number;                // Items per page
    currentPage: number;            // Current page number
    totalPages: number;             // Total number of pages
}

/**  Paginated response interface */
export interface PaginatedResponse<T = any> {
    items: T[];                     // Array of items for current page
    meta: PaginationMeta;           // Pagination metadata
}

/** Payload for updating user information || All fields are optional since we may update only specific fields */
export interface UserPayload {
    fullName?: string;              // Optional: New full name
    email?: string;                 // Optional: New email address
    phoneNumber?: string;           // Optional: New phone number
    password?: string;              // Optional: New password
    confirmPassword?: string;       // Optional: Password confirmation
    status?: string;                // Optional: Account status update
    role?: string;                  // Optional: Role assignment
    userType?: string;              // Optional: User type update
    isApproved?: boolean;           // Optional: Approval status
    kycStatus?: string;             // Optional: KYC status update
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
 * User API Service - Collection of methods for user management operations
 * All methods follow the backend API structure and return standardized responses
 */
export const userApi = {
    /**
     * Fetch users with pagination and filtering
     * @param params - Query parameters for pagination and filtering
     * @returns Promise resolving to API response with paginated users
     */
    getUsers: async (params?: {
        page?: number;              // Page number (default: 1)
        limit?: number;             // Items per page (default: 20)
        search?: string;            // Search by name or email
        status?: string;            // Filter by status
        isApproved?: boolean;       // Filter by approval status
        kycStatus?: string;         // Filter by KYC status
    }): Promise<ApiResponse<PaginatedResponse>> => {
        const response = await api.get('/v1/admin/users', { params });
        return response.data;
    },

    /**
     * Fetch a single user by their unique ID
     * @param userId - The unique identifier of the user to fetch
     * @returns Promise resolving to API response with user data
     */
    getUserById: async (userId: string): Promise<ApiResponse> => {
        const response = await api.get(`/v1/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Create a new user account
     * @param userData - Required user information for account creation
     * @returns Promise resolving to API response with created user data
     */
    createUser: async (userData: UserPayload): Promise<ApiResponse> => {
        const response = await api.post('/v1/admin/users', userData);
        return response.data;
    },

    /**
     * Update user-specific information
     * @param userId - The unique identifier of the user to update
     * @param userData - Partial user data with fields to update
     * @returns Promise resolving to API response with updated user data
     */
    updateUser: async (userId: string, userData: UserPayload): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/users/${userId}`, userData);
        return response.data;
    },

    /**
     * Update user KYC status
     * @param userId - The unique identifier of the user
     * @param kycStatus - New KYC status ('pending', 'verified', 'rejected')
     * @returns Promise resolving to API response with updated user data
     */
    updateUserKyc: async (userId: string, kycStatus: string): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/users/${userId}`, {
            kycStatus
        });
        return response.data;
    },
};

// Export for default import - Preferred usage in components
export default userApi;