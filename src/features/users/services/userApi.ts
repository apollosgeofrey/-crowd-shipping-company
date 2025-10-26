// services/userApi.ts
import api from '@/services/api';

/**
 * User entity interface representing the user data structure
 * returned from the backend API
 */
export interface User {
    _id: string;                    // MongoDB unique identifier
    userId: string;                 // Application-specific user ID (e.g., UID-RZS5NUDD)
    fullName: string;               // User's full name
    email: string;                  // Encrypted email address
    phoneNumber: string;            // Encrypted phone number
    isApproved: boolean;            // Whether user is approved by admin
    isVerified: boolean;            // Whether user has verified their account
    isVerifiedAt: string;           // Timestamp when user was verified
    role: string;                   // User role (e.g., 'user', 'admin', 'super-admin')
    status: string;                 // Account status (e.g., 'active', 'suspended', 'inactive')
    kycStatus: string;              // KYC verification status
    userType: string;               // Type of user (e.g., 'user', 'staff', 'vehicle-owner')
    twoFactorEnabled: boolean;      // Whether 2FA is enabled
    deviceTokens: string[];         // Push notification device tokens
    lastLogin: string;              // Last login timestamp
    createdAt: string;              // Account creation timestamp
    updatedAt: string;              // Last update timestamp
    __v: number;                    // Mongoose version key
    id: string;                     // Alias for _id
}

/**
 * Payload for updating user information
 * All fields are optional since we may update only specific fields
 */
export interface UpdateUserPayload {
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
 * User API Service - Collection of methods for user management operations
 * All methods follow the backend API structure and return standardized responses
 */
export const userApi = {
    /**
     * Fetch all users with optional filtering and pagination
     * @param params - Optional query parameters for filtering and pagination
     * @returns Promise resolving to API response with user array
     */
    getAllUsers: async (params?: {
        page?: number;              // Page number for pagination
        limit?: number;             // Number of items per page
        search?: string;            // Search query string
        status?: string;            // Filter by account status
        role?: string;              // Filter by user role
    }): Promise<ApiResponse<User[]>> => {
        const response = await api.get('/v1/admin/users', { params });
        return response.data;
    },

    /**
     * Fetch a single user by their unique ID
     * @param userId - The unique identifier of the user to fetch
     * @returns Promise resolving to API response with user data
     */
    getUserById: async (userId: string): Promise<ApiResponse<User>> => {
        const response = await api.get(`/v1/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Create a new user account
     * @param userData - Required user information for account creation
     * @returns Promise resolving to API response with created user data
     */
    createUser: async (userData: {
        fullName: string;           // Required: User's full name
        email: string;              // Required: User's email address
        phoneNumber: string;        // Required: User's phone number
        password: string;           // Required: Account password
        confirmPassword: string;    // Required: Password confirmation
        role: string;               // Required: User role assignment
        userType: string;           // Required: Type of user account
        status?: string;            // Optional: Initial account status
    }): Promise<ApiResponse<User>> => {
        const response = await api.post('/v1/admin/users', userData);
        return response.data;
    },

    /**
     * Update an existing user's information
     * @param userId - The unique identifier of the user to update
     * @param userData - Partial user data with fields to update
     * @returns Promise resolving to API response with updated user data
     */
    updateUser: async (userId: string, userData: UpdateUserPayload): Promise<ApiResponse<User>> => {
        const response = await api.put(`/v1/admin/users/${userId}`, userData);
        return response.data;
    },

    /**
     * Permanently delete a user account
     * @param userId - The unique identifier of the user to delete
     * @returns Promise resolving to API response with null data
     */
    deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/v1/admin/users/${userId}`);
        return response.data;
    },

    // =========================================================================
    // STATUS MANAGEMENT METHODS
    // All methods below use the same updateUser endpoint with specific status fields
    // =========================================================================

    /**
     * Approve a user account - Sets status to 'active' and isApproved to true
     * @param userId - The unique identifier of the user to approve
     * @returns Promise resolving to API response with updated user data
     */
    approveUser: async (userId: string): Promise<ApiResponse<User>> => {
        const response = await api.put(`/v1/admin/users/${userId}`, {
            status: 'active',       // Set account status to active
            isApproved: true        // Mark account as approved
        });
        return response.data;
    },

    /**
     * Suspend a user account - Sets status to 'suspended'
     * @param userId - The unique identifier of the user to suspend
     * @returns Promise resolving to API response with updated user data
     */
    suspendUser: async (userId: string): Promise<ApiResponse<User>> => {
        const response = await api.put(`/v1/admin/users/${userId}`, {
            status: 'suspended'     // Set account status to suspended
        });
        return response.data;
    },

    /**
     * Activate a user account - Sets status to 'active'
     * Used for reactivating previously inactive or suspended accounts
     * @param userId - The unique identifier of the user to activate
     * @returns Promise resolving to API response with updated user data
     */
    activateUser: async (userId: string): Promise<ApiResponse<User>> => {
        const response = await api.put(`/v1/admin/users/${userId}`, {
            status: 'active'        // Set account status to active
        });
        return response.data;
    },

    /**
     * Deactivate a user account - Sets status to 'inactive'
     * Used for temporary deactivation without suspension
     * @param userId - The unique identifier of the user to deactivate
     * @returns Promise resolving to API response with updated user data
     */
    deactivateUser: async (userId: string): Promise<ApiResponse<User>> => {
        const response = await api.put(`/v1/admin/users/${userId}`, {
            status: 'inactive'      // Set account status to inactive
        });
        return response.data;
    },
};

// Export for default import - Preferred usage in components
export default userApi;