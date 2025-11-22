// services/reportApi.ts
import api from '../../../services/api';


/** Pagination metadata interface */
export interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
    summary?: any;
}


/**  Paginated response interface */
export interface PaginatedResponse<T = any> {
    items: T[];
    meta: PaginationMeta;
}


/**  Filter parameters for report queries */
export interface ReportFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    reportType?: string;
    // language?: string;
    dateFrom?: string;
    dateTo?: string;
    raisedById?: string;
}


/**  Standard API response format */
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}


/** Payload for updating user information || All fields are optional since we may update only specific fields */
export interface updateStatusPayload {
    status?: string;   
    resolution?: string;      
    resolutionNotes?: string;
    amountRefunded?: number;   
}


/** Send message payload */
export interface SendMessagePayload {
    message: string;
    messageType?: 'text' | 'image' | 'file' | 'voice';
    attachments?: string[];
}


/**  Report summary interface */
export interface ReportSummary {
    totalReports: number;
    todayReports: number;
    statusCounts: {
        pending: number;
        underReview: number;
        resolved: number;
        escalated: number;
        rejected: number;
    };
    typeCounts: {
        customer: number;
        booking: number;
        other: number;
    };
    financials: {
        totalAmountRefunded: number;
        totalReportAmount: number;
    };
    summaryUpdate: string;
}


/**
 * Report API Service
 */
export const reportApi = {
    /**
     * Fetch reports with pagination and filtering
     */
    getReports: async (params?: ReportFilters): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get('/v1/admin/reports', { params });
        return response.data;
    },

    /**
     * Fetch a single report by ID
     */
    getReportById: async (reportId: string): Promise<ApiResponse<any>> => {
        const response = await api.get(`/v1/admin/reports/${reportId}`);
        return response.data;
    },

    /**
     * Update report status
     */
    updateReportStatus: async (reportId: string, updateStatusPayload: updateStatusPayload): Promise<ApiResponse<void>> => {
        const response = await api.put(`/v1/admin/reports/${reportId}`, updateStatusPayload);
        return response.data;
    },

    /** Export reports to CSV/Excel */
    exportReports: async (params?: ReportFilters): Promise<Blob> => {
        const response = await api.get('/v1/admin/reports/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    },


    // Add these methods to your existing reportApi object:

    /**
     * Fetch conversation messages
     */
    getConversationMessages: async (
        reportId: string, 
        conversationId: string, 
        params?: { page?: number; limit?: number }
    ): Promise<ApiResponse<PaginatedResponse<any>>> => {
        const response = await api.get(
            `/v1/admin/reports/${reportId}/conversation/${conversationId}/messages`, 
            { params }
        );
        return response.data;
    },

    /**
     * Send a new message
     */
    sendMessage: async (
        reportId: string,
        conversationId: string,
        messageData: SendMessagePayload
    ): Promise<ApiResponse<any>> => {
        const response = await api.post(`/v1/admin/reports/${reportId}/conversation/${conversationId}/messages`, messageData);
        return response.data;
    },

    /**
     * Update a message
     */
    updateMessage: async (
        reportId: string,
        conversationId: string,
        messageId: string,
        updateData: Partial<SendMessagePayload & { status?: string; isDeleted?: boolean }>
    ): Promise<ApiResponse<any>> => {
        const response = await api.put(`/v1/admin/reports/${reportId}/conversation/${conversationId}/message/${messageId}`, updateData);
        return response.data;
    },

    /**
     * Delete a message (soft delete)
     */
    deleteMessage: async (
        reportId: string,
        conversationId: string,
        messageId: string
    ): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/v1/admin/reports/${reportId}/conversation/${conversationId}/message/${messageId}`);
        return response.data;
    },

};

export default reportApi;