// services/vehicleOwnerApi.ts
import api from '@/services/api';

/**
 * Vehicle Owner-specific interface extending User
 */
export interface VehicleOwner extends User {
    // Vehicle owner-specific fields can be added here if needed
    // Currently uses all User fields
}

/**
 * Vehicle Owner API Service - Collection of methods for vehicle owner management operations
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
    }): Promise<ApiResponse<PaginatedResponse<VehicleOwner>>> => {
        const response = await api.get('/v1/admin/vehicle-owners', { params });
        return response.data;
    },

    /**
     * Fetch recent vehicle owners (for dashboard)
     * @param limit - Number of recent vehicle owners to fetch
     * @returns Promise resolving to API response with recent vehicle owners
     */
    getRecentVehicleOwners: async (limit: number = 5): Promise<ApiResponse<VehicleOwner[]>> => {
        const response = await api.get('/v1/admin/vehicle-owners', { 
            params: { 
                page: 1, 
                limit,
                sort: 'createdAt:desc' 
            } 
        });
        return response.data;
    },

    /**
     * Fetch a single vehicle owner by their unique ID
     * @param vehicleOwnerId - The unique identifier of the vehicle owner to fetch
     * @returns Promise resolving to API response with vehicle owner data
     */
    getVehicleOwnerById: async (vehicleOwnerId: string): Promise<ApiResponse<VehicleOwner>> => {
        const response = await api.get(`/v1/admin/vehicle-owners/${vehicleOwnerId}`);
        return response.data;
    },

    /**
     * Update vehicle owner-specific information
     * @param vehicleOwnerId - The unique identifier of the vehicle owner to update
     * @param userData - Partial vehicle owner data with fields to update
     * @returns Promise resolving to API response with updated vehicle owner data
     */
    updateVehicleOwner: async (vehicleOwnerId: string, userData: UpdateUserPayload): Promise<ApiResponse<VehicleOwner>> => {
        const response = await api.put(`/v1/admin/vehicle-owners/${vehicleOwnerId}`, userData);
        return response.data;
    },

    // =========================================================================
    // VEHICLE OWNER-SPECIFIC STATUS MANAGEMENT METHODS
    // =========================================================================

    /**
     * Approve a vehicle owner account
     * @param vehicleOwnerId - The unique identifier of the vehicle owner to approve
     * @returns Promise resolving to API response with updated vehicle owner data
     */
    approveVehicleOwner: async (vehicleOwnerId: string): Promise<ApiResponse<VehicleOwner>> => {
        const response = await api.put(`/v1/admin/vehicle-owners/${vehicleOwnerId}`, {
            status: 'active',
            isApproved: true
        });
        return response.data;
    },

    /**
     * Reject a vehicle owner account
     * @param vehicleOwnerId - The unique identifier of the vehicle owner to reject
     * @returns Promise resolving to API response with updated vehicle owner data
     */
    rejectVehicleOwner: async (vehicleOwnerId: string): Promise<ApiResponse<VehicleOwner>> => {
        const response = await api.put(`/v1/admin/vehicle-owners/${vehicleOwnerId}`, {
            status: 'rejected',
            isApproved: false
        });
        return response.data;
    },

    /**
     * Update vehicle owner KYC status
     * @param vehicleOwnerId - The unique identifier of the vehicle owner
     * @param kycStatus - New KYC status ('pending', 'verified', 'rejected')
     * @returns Promise resolving to API response with updated vehicle owner data
     */
    updateVehicleOwnerKyc: async (vehicleOwnerId: string, kycStatus: string): Promise<ApiResponse<VehicleOwner>> => {
        const response = await api.put(`/v1/admin/vehicle-owners/${vehicleOwnerId}`, {
            kycStatus
        });
        return response.data;
    },
};

// Export for default import - Preferred usage in components
export default vehicleOwnerApi;