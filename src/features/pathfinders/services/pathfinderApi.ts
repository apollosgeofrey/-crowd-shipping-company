// services/pathfinderApi.ts
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
export interface PathfinderPayload {
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
export const pathfinderApi = {
    /**
     * Fetch pathfinders with pagination and filtering
     * @param params - Query parameters for pagination and filtering
     * @returns Promise resolving to API response with paginated pathfinders
     */
    getPathfinders: async (params?: {
        page?: number;              // Page number (default: 1)
        limit?: number;             // Items per page (default: 20)
        search?: string;            // Search by name or email
        status?: string;            // Filter by status
        isApproved?: boolean;       // Filter by approval status
        kycStatus?: string;         // Filter by KYC status
    }): Promise<ApiResponse<PaginatedResponse>> => {
        const response = await api.get('/v1/admin/pathfinders', { params });
        return response.data;
    },


    /**
     * Fetch a single pathfinder by their unique ID
     * @param pathfinderId - The unique identifier of the pathfinder to fetch
     * @returns Promise resolving to API response with pathfinder data
     */
    getPathfinderById: async (pathfinderId: string): Promise<ApiResponse> => {
        const response = await api.get(`/v1/admin/pathfinders/${pathfinderId}`);
        return response.data;
    },


    /**
     * Create a new pathfinder account
     * @param pathfinderData - Required pathfinder information for account creation
     * @returns Promise resolving to API response with created pathfinder data
     */
    createPathfinder: async (pathfinderData: PathfinderPayload): Promise<ApiResponse> => {
        const response = await api.post('/v1/admin/pathfinders', pathfinderData);
        return response.data;
    },


    /**
     * Update pathfinder-specific information
     * @param pathfinderId - The unique identifier of the pathfinder to update
     * @param pathfinderData - Partial pathfinder data with fields to update
     * @returns Promise resolving to API response with updated pathfinder data
     */
    updatePathfinder: async (pathfinderId: string, pathfinderData: PathfinderPayload): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/pathfinders/${pathfinderId}`, pathfinderData);
        return response.data;
    },

    /**
     * Update pathfinder KYC status
     * @param pathfinderId - The unique identifier of the pathfinder
     * @param kycStatus - New KYC status ('pending', 'verified', 'rejected')
     * @returns Promise resolving to API response with updated pathfinder data
     */
    updatePathfinderKyc: async (pathfinderId: string, kycStatus: string): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/pathfinders/${pathfinderId}`, {
            kycStatus
        });
        return response.data;
    },

};

// Export for default import - Preferred usage in components
export default pathfinderApi;