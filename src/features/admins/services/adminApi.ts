// services/adminApi.ts
import api from '@/services/api';

/**
 * Admin entity interface representing the admin data structure
 * returned from the backend API
 */
export interface Admin {
    _id: string;                    // MongoDB unique identifier
    userId: string;                 // Application-specific user ID (e.g., UID-SEED-325291)
    fullName: string;               // Admin's full name
    email: string;                  // Encrypted email address
    phoneNumber: string;            // Encrypted phone number
    isApproved: boolean;            // Whether admin is approved
    isVerified: boolean;            // Whether admin has verified their account
    isVerifiedAt: string;           // Timestamp when admin was verified
    role: string;                   // Admin role (e.g., 'admin', 'super-admin')
    status: string;                 // Account status (e.g., 'active', 'suspended', 'inactive')
    kycStatus: string;              // KYC verification status
    userType: string;               // Type of user (e.g., 'staff', 'admin')
    twoFactorEnabled: boolean;      // Whether 2FA is enabled
    deviceTokens: string[];         // Push notification device tokens
    lastLogin: string;              // Last login timestamp
    createdAt: string;              // Account creation timestamp
    updatedAt: string;              // Last update timestamp
    __v: number;                    // Mongoose version key
    id: string;                     // Alias for _id
    profile?: {                     // Optional profile data
        _id: string;
    };
    wallet?: {                      // Optional wallet data
        _id: string;
        balance: number;
    };
}

/**
 * Payload for updating admin information
 * All fields are optional since we may update only specific fields
 */
export interface UpdateAdminPayload {
    fullName?: string;              // Optional: New full name
    email?: string;                 // Optional: New email address
    phoneNumber?: string;           // Optional: New phone number
    password?: string;              // Optional: New password
    confirmPassword?: string;       // Optional: Password confirmation
    status?: string;                // Optional: Account status update
    role?: string;                  // Optional: Role assignment
    userType?: string;              // Optional: User type update
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
 * Admin API Service - Collection of methods for admin management operations
 * All methods follow the backend API structure and return standardized responses
 */
export const adminApi = {
    /**
     * Fetch all admins with optional filtering and pagination
     * @param params - Optional query parameters for filtering and pagination
     * @returns Promise resolving to API response with admin array
     */
    getAllAdmins: async (params?: {
        page?: number;              // Page number for pagination
        limit?: number;             // Number of items per page
        search?: string;            // Search query string
        status?: string;            // Filter by account status
        role?: string;              // Filter by admin role
    }): Promise<ApiResponse<{ items: Admin[]; meta: any }>> => {
        const response = await api.get('/v1/admin/admins', { params });
        return response.data;
    },

    /**
     * Fetch a single admin by their unique ID
     * @param adminId - The unique identifier of the admin to fetch
     * @returns Promise resolving to API response with admin data
     */
    getAdminById: async (adminId: string): Promise<ApiResponse<Admin>> => {
        const response = await api.get(`/v1/admin/admins/${adminId}`);
        return response.data;
    },

    /**
     * Create a new admin account
     * @param adminData - Required admin information for account creation
     * @returns Promise resolving to API response with created admin data
     */
    createAdmin: async (adminData: {
        fullName: string;           // Required: Admin's full name
        email: string;              // Required: Admin's email address
        phoneNumber: string;        // Required: Admin's phone number
        password: string;           // Required: Account password
        confirmPassword: string;    // Required: Password confirmation
        role: string;               // Required: Admin role assignment
        userType: string;           // Required: Type of admin account
        status?: string;            // Optional: Initial account status
    }): Promise<ApiResponse<Admin>> => {
        const response = await api.post('/v1/admin/admins', adminData);
        return response.data;
    },

    /**
     * Update an existing admin's information
     * @param adminId - The unique identifier of the admin to update
     * @param adminData - Partial admin data with fields to update
     * @returns Promise resolving to API response with updated admin data
     */
    updateAdmin: async (adminId: string, adminData: UpdateAdminPayload): Promise<ApiResponse<Admin>> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, adminData);
        return response.data;
    },

    /**
     * Permanently delete an admin account
     * @param adminId - The unique identifier of the admin to delete
     * @returns Promise resolving to API response with null data
     */
    deleteAdmin: async (adminId: string): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/v1/admin/admins/${adminId}`);
        return response.data;
    },

    // =========================================================================
    // STATUS MANAGEMENT METHODS
    // All methods below use the same updateAdmin endpoint with specific status fields
    // =========================================================================

    /**
     * Approve an admin account - Sets status to 'active' and isApproved to true
     * @param adminId - The unique identifier of the admin to approve
     * @returns Promise resolving to API response with updated admin data
     */
    approveAdmin: async (adminId: string): Promise<ApiResponse<Admin>> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, {
            status: 'active',       // Set account status to active
            isApproved: true        // Mark account as approved
        });
        return response.data;
    },

    /**
     * Suspend an admin account - Sets status to 'suspended'
     * @param adminId - The unique identifier of the admin to suspend
     * @returns Promise resolving to API response with updated admin data
     */
    suspendAdmin: async (adminId: string): Promise<ApiResponse<Admin>> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, {
            status: 'suspended'     // Set account status to suspended
        });
        return response.data;
    },

    /**
     * Activate an admin account - Sets status to 'active'
     * Used for reactivating previously inactive or suspended accounts
     * @param adminId - The unique identifier of the admin to activate
     * @returns Promise resolving to API response with updated admin data
     */
    activateAdmin: async (adminId: string): Promise<ApiResponse<Admin>> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, {
            status: 'active'        // Set account status to active
        });
        return response.data;
    },

    /**
     * Deactivate an admin account - Sets status to 'inactive'
     * Used for temporary deactivation without suspension
     * @param adminId - The unique identifier of the admin to deactivate
     * @returns Promise resolving to API response with updated admin data
     */
    deactivateAdmin: async (adminId: string): Promise<ApiResponse<Admin>> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, {
            status: 'inactive'      // Set account status to inactive
        });
        return response.data;
    },

    /**
     * Promote an admin to super-admin role
     * @param adminId - The unique identifier of the admin to promote
     * @returns Promise resolving to API response with updated admin data
     */
    promoteToSuperAdmin: async (adminId: string): Promise<ApiResponse<Admin>> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, {
            role: 'super-admin'     // Set role to super-admin
        });
        return response.data;
    },

    /**
     * Demote a super-admin to admin role
     * @param adminId - The unique identifier of the admin to demote
     * @returns Promise resolving to API response with updated admin data
     */
    demoteToAdmin: async (adminId: string): Promise<ApiResponse<Admin>> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, {
            role: 'admin'           // Set role to admin
        });
        return response.data;
    },
};

// Export for default import - Preferred usage in components
export default adminApi;