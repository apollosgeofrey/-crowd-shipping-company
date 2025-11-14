import api from '@/services/api';

/** Pagination metadata interface */
export interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
}

/** Paginated response interface */
export interface PaginatedResponse<T = any> {
    items: T[];
    meta: PaginationMeta;
}

/** Payload for creating/updating admin */
export interface AdminPayload {
    userId?: string;              // Optional: Staff ID
    fullName?: string;            // Optional: Full name
    email?: string;               // Optional: Email address
    phoneNumber?: string;         // Optional: Phone number
    password?: string;            // Optional: Password
    confirmPassword?: string;     // Optional: Password confirmation
    role?: string;                // Optional: Admin role
    status?: string;              // Optional: Account status
}


/** Standard API response format */
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}


/** Admin API Service */
export const adminApi = {

    /** Fetch admins with pagination and filtering */
    getAdmins: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        role?: string;
        isVerified?: boolean;
    }): Promise<ApiResponse<PaginatedResponse>> => {
        const response = await api.get('/v1/admin/admins', { params });
        return response.data;
    },


    /** Fetch a single admin by ID */
    getAdminById: async (adminId: string): Promise<ApiResponse> => {
        const response = await api.get(`/v1/admin/admins/${adminId}`);
        return response.data;
    },


    /** Create a new admin account */
    createAdmin: async (adminData: AdminPayload): Promise<ApiResponse> => {
        const response = await api.post('/v1/admin/admins', adminData);
        return response.data;
    },


    /** Update admin information */
    updateAdmin: async (adminId: string, adminData: AdminPayload): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, adminData);
        return response.data;
    },


    /** Promote user to admin */
    promoteToAdmin: async (adminId: string, adminData: AdminPayload): Promise<ApiResponse> => {
        console.log(adminData);
        const response = await api.put(`/v1/admin/admins/promote/${adminId}`, adminData);
        return response.data;
    },


    /** Update admin status */
    updateAdminStatus: async (adminId: string, status: string): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/admins/${adminId}`, {
            status
        });
        return response.data;
    },
};

export default adminApi;