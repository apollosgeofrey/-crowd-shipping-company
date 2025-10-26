// services/pathfinderApi.ts
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
    isVerifiedAt?: string;          // Optional: Timestamp when user was verified
    role: string;                   // User role (e.g., 'user', 'admin', 'super-admin')
    status: string;                 // Account status (e.g., 'active', 'suspended', 'inactive')
    kycStatus: string;              // KYC verification status
    userType: string;               // Type of user (e.g., 'user', 'staff', 'vehicle-owner', 'pathfinder')
    twoFactorEnabled: boolean;      // Whether 2FA is enabled
    deviceTokens: string[];         // Push notification device tokens
    lastLogin: string;              // Last login timestamp
    profileId: string;              // Profile reference ID
    walletId: string;               // Wallet reference ID
    createdAt: string;              // Account creation timestamp
    updatedAt: string;              // Last update timestamp
    __v: number;                    // Mongoose version key
    profile?: {                     // Optional: Profile data
        _id: string;
    };
    wallet?: {                      // Optional: Wallet data
        _id: string;
        balance: number;
    };
}

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
    total: number;                  // Total number of items
    perPage: number;                // Items per page
    currentPage: number;            // Current page number
    totalPages: number;             // Total number of pages
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T = any> {
    items: T[];                     // Array of items for current page
    meta: PaginationMeta;           // Pagination metadata
}

/**
 * Pathfinder-specific interface extending User
 */
export interface Pathfinder extends User {
    // Pathfinder-specific fields can be added here if needed
    // Currently uses all User fields
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
        userType?: string;          // Filter by user type
    }): Promise<ApiResponse<User[]>> => {
        const response = await api.get('/v1/admin/users', { params });
        return response.data;
    },

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
    }): Promise<ApiResponse<PaginatedResponse<Pathfinder>>> => {
        const response = await api.get('/v1/admin/pathfinders', { params });
        return response.data;
    },

    /**
     * Fetch recent pathfinders (for dashboard)
     * @param limit - Number of recent pathfinders to fetch
     * @returns Promise resolving to API response with recent pathfinders
     */
    getRecentPathfinders: async (limit: number = 5): Promise<ApiResponse<Pathfinder[]>> => {
        const response = await api.get('/v1/admin/pathfinders', { 
            params: { 
                page: 1, 
                limit,
                sort: 'createdAt:desc' 
            } 
        });
        return response.data;
    },

    /**
     * Fetch pathfinder statistics (counts by status, etc.)
     * @returns Promise resolving to API response with pathfinder stats
     */
    getPathfinderStats: async (): Promise<ApiResponse<{
        total: number;
        active: number;
        pending: number;
        approved: number;
        kycCompleted: number;
    }>> => {
        const response = await api.get('/v1/admin/pathfinders/stats');
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
     * Fetch a single pathfinder by their unique ID
     * @param pathfinderId - The unique identifier of the pathfinder to fetch
     * @returns Promise resolving to API response with pathfinder data
     */
    getPathfinderById: async (pathfinderId: string): Promise<ApiResponse<Pathfinder>> => {
        const response = await api.get(`/v1/admin/pathfinders/${pathfinderId}`);
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
     * Update pathfinder-specific information
     * @param pathfinderId - The unique identifier of the pathfinder to update
     * @param userData - Partial pathfinder data with fields to update
     * @returns Promise resolving to API response with updated pathfinder data
     */
    updatePathfinder: async (pathfinderId: string, userData: UpdateUserPayload): Promise<ApiResponse<Pathfinder>> => {
        const response = await api.put(`/v1/admin/pathfinders/${pathfinderId}`, userData);
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
    // PATHFINDER-SPECIFIC STATUS MANAGEMENT METHODS
    // =========================================================================

    /**
     * Approve a pathfinder account
     * @param pathfinderId - The unique identifier of the pathfinder to approve
     * @returns Promise resolving to API response with updated pathfinder data
     */
    approvePathfinder: async (pathfinderId: string): Promise<ApiResponse<Pathfinder>> => {
        const response = await api.put(`/v1/admin/pathfinders/${pathfinderId}`, {
            status: 'active',
            isApproved: true
        });
        return response.data;
    },

    /**
     * Reject a pathfinder account
     * @param pathfinderId - The unique identifier of the pathfinder to reject
     * @returns Promise resolving to API response with updated pathfinder data
     */
    rejectPathfinder: async (pathfinderId: string): Promise<ApiResponse<Pathfinder>> => {
        const response = await api.put(`/v1/admin/pathfinders/${pathfinderId}`, {
            status: 'rejected',
            isApproved: false
        });
        return response.data;
    },

    /**
     * Update pathfinder KYC status
     * @param pathfinderId - The unique identifier of the pathfinder
     * @param kycStatus - New KYC status ('pending', 'verified', 'rejected')
     * @returns Promise resolving to API response with updated pathfinder data
     */
    updatePathfinderKyc: async (pathfinderId: string, kycStatus: string): Promise<ApiResponse<Pathfinder>> => {
        const response = await api.put(`/v1/admin/pathfinders/${pathfinderId}`, {
            kycStatus
        });
        return response.data;
    },

    // =========================================================================
    // EXISTING STATUS MANAGEMENT METHODS (Keep these for general users)
    // =========================================================================

    /**
     * Approve a user account - Sets status to 'active' and isApproved to true
     * @param userId - The unique identifier of the user to approve
     * @returns Promise resolving to API response with updated user data
     */
    approveUser: async (userId: string): Promise<ApiResponse<User>> => {
        const response = await api.put(`/v1/admin/users/${userId}`, {
            status: 'active',
            isApproved: true
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
            status: 'suspended'
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
            status: 'active'
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
            status: 'inactive'
        });
        return response.data;
    },
};

// Export for default import - Preferred usage in components
export default pathfinderApi;