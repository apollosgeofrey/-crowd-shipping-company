// services/companyApi.ts
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

/** Paginated response interface */
export interface PaginatedResponse<T = any> {
    items: T[];                     // Array of items for current page
    meta: PaginationMeta;           // Pagination metadata
}

/** Payload for updating company information */
export interface CompanyPayload {
    name?: string;                  // Optional: Company name
    email?: string;                 // Optional: Company email
    phoneNumber?: string;           // Optional: Company phone number
    rcNumber?: string;              // Optional: RC Number
    taxId?: string;                 // Optional: Tax ID
    address?: string;               // Optional: Company address
    cityState?: string;             // Optional: City and state
    status?: string;                // Optional: Company status
    incorporationDate?: string;     // Optional: Incorporation date
    contactPersonId?: string;       // Optional: Contact person ID
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
 * Company API Service - Collection of methods for company management operations
 */
export const companyApi = {
    /**
     * Fetch companies with pagination and filtering
     * @param params - Query parameters for pagination and filtering
     * @returns Promise resolving to API response with paginated companies
     */
    getCompanies: async (params?: {
        page?: number;              // Page number (default: 1)
        limit?: number;             // Items per page (default: 20)
        search?: string;            // Search by company name or email
        status?: string;            // Filter by status
        verification?: string;      // Filter by verification status
    }): Promise<ApiResponse<PaginatedResponse>> => {
        const response = await api.get('/v1/admin/companies', { params });
        return response.data;
    },

    /**
     * Fetch a single company by its unique ID
     * @param companyId - The unique identifier of the company to fetch
     * @returns Promise resolving to API response with company data
     */
    getCompanyById: async (companyId: string): Promise<ApiResponse> => {
        const response = await api.get(`/v1/admin/companies/${companyId}`);
        return response.data;
    },

    /**
     * Create a new company
     * @param companyData - Required company information for creation
     * @returns Promise resolving to API response with created company data
     */
    createCompany: async (companyData: CompanyPayload): Promise<ApiResponse> => {
        const response = await api.post('/v1/admin/companies', companyData);
        return response.data;
    },

    /**
     * Update company information
     * @param companyId - The unique identifier of the company to update
     * @param companyData - Partial company data with fields to update
     * @returns Promise resolving to API response with updated company data
     */
    updateCompany: async (companyId: string, companyData: CompanyPayload): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/companies/${companyId}`, companyData);
        return response.data;
    },

    /**
     * Update company verification status
     * @param companyId - The unique identifier of the company
     * @param verifiedBy - Admin user ID who verified the company
     * @returns Promise resolving to API response with updated company data
     */
    verifyCompany: async (companyId: string, verifiedBy: string): Promise<ApiResponse> => {
        const response = await api.put(`/v1/admin/companies/${companyId}`, {
            verifiedBy
        });
        return response.data;
    },
};

// Export for default import - Preferred usage in components
export default companyApi;