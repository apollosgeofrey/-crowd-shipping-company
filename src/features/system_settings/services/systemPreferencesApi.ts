// services/systemPreferencesApi.ts
import api from '../../../services/api';


/**
 * Update Preferences interface
 */
export interface UpdatePreferences {
    enableEmail?: boolean;
    enableSms?: boolean;
    enablePushMobile?: boolean;
    enablePushDesktop?: boolean;
    receiveMarketing?: boolean;
    twoFactorEnabled?: boolean;
    theme?: string;
    language?: string;
    timezone?: string;
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

/**
 * Default system preferences
 */
export const DEFAULT_PREFERENCES: UpdatePreferences = {
    enableEmail: true,
    enableSms: false,
    enablePushMobile: false,
    enablePushDesktop: false,
    receiveMarketing: false,
    twoFactorEnabled: false,
    theme: 'system',
    language: 'en',
    timezone: 'UTC'
};

/**
 * System Preferences API Service
 */
export const systemPreferencesApi = {
    /**
     * Fetch system preferences
     */
    getPreferences: async (): Promise<ApiResponse<any>> => {
        const response = await api.get('/v1/admin/system-preferences');
        return response.data;
    },

    /**
     * Update system preferences
     */
    updatePreferences: async (data: UpdatePreferences): Promise<ApiResponse<any>> => {
        const response = await api.put('/v1/admin/system-preferences', data);
        return response.data;
    },

    /**
     * Reset system preferences to default using the update endpoint
     */
    resetPreferences: async (): Promise<ApiResponse<any>> => {
        // Use the update endpoint with default values
        const response = await api.put('/v1/admin/system-preferences', DEFAULT_PREFERENCES);
        return response.data;
    }
};

export default systemPreferencesApi;