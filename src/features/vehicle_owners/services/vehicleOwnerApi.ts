// services/vehicleOwnerApi.ts
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
export interface VehicleOwnerPayload {
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
 * Vehicle Owner API Service - Collection of methods for vehicle owner management operations
 * All methods follow the backend API structure and return standardized responses
 */
export const vehicleOwnerApi = {
    /**
     * Fetch vehicle owners with pagination and filtering
     * @param params - Query parameters for pagination and filtering
     * @returns Promise resolving to API response with paginated vehicle owners
     */
    getVehicleOwners: async (params?: {
        page?: number;              // Page number (default: 1)
        limit?: number;             // Items per page (default: 20)
        search?: string;            // Search by name or email
        status?: string;            // Filter by status
        isApproved?: boolean;       // Filter by approval status
        kycStatus?: string;         // Filter by KYC status
    }): Promise<ApiResponse<PaginatedResponse>> => {
        const response = await api.get('/v1/admin/vehicle-owners', { params });
        return response.data;
    },

    /**
     * Fetch a single vehicle owner by their unique ID
     * @param vehicleOwnerId - The unique identifier of the vehicle owner to fetch
     * @returns Promise resolving to API response with vehicle owner data
     */
    getVehicleOwnerById: async (vehicleOwnerId: string): Promise<ApiResponse> => {
        const response = await api.get(`/v1/admin/vehicle-owners/${vehicleOwnerId}`);
        return response.data;
    },

    /**
     * Create a new vehicle owner account
     * @param vehicleOwnerData - Required vehicle owner information for account creation
     * @returns Promise resolving to API response with created vehicle owner data
     */
    createVehicleOwner: async (vehicleOwnerData: VehicleOwnerPayload): Promise<ApiResponse> => {
        const response = await api.post('/v1/admin/vehicle-owners', vehicleOwnerData);
        return response.data;
    },

    /**
     * Update vehicle owner-specific information
     * @param vehicleOwnerId - The unique identifier of the vehicle owner to update
     * @param vehicleOwnerData - Partial vehicle owner data with fields to update
     * @returns Promise resolving to API response with updated vehicle owner data
     */
    updateVehicleOwner: async (vehicleOwnerId: string, vehicleOwnerData: VehicleOwnerPayload): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/vehicle-owners/${vehicleOwnerId}`, vehicleOwnerData);
        return response.data;
    },

    /**
     * Update vehicle owner KYC status
     * @param vehicleOwnerId - The unique identifier of the vehicle owner
     * @param kycStatus - New KYC status ('pending', 'verified', 'rejected')
     * @returns Promise resolving to API response with updated vehicle owner data
     */
    updateVehicleOwnerKyc: async (vehicleOwnerId: string, kycStatus: string): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/vehicle-owners/${vehicleOwnerId}`, {
            kycStatus
        });
        return response.data;
    },
};

// Export for default import - Preferred usage in components
export default vehicleOwnerApi;