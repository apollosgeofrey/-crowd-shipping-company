import api from "../../../services/api";

// Export interfaces FIRST
export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	email: string;
	password: string;
	confirm_password: string;
	fullName?: string;
	phone?: string;
}

export interface ResetPayload {
	token: string;
	email: string;
	password: string;
	confirm: string;
}

export interface ApiResponse {
	code: number;
	message: string;
	data?: any | null;
}



export const loginApi = async (payload: LoginPayload): Promise<ApiResponse> => {
	try {
		const response = await api.post<ApiResponse>("/v1/admin/sign-in", payload);
		console.log("API response:", response.data);
		return response.data;
	} catch (error: any) {
		console.log("Error Encountered:", error);
		throw error;
	}
};

export const registerApi = async (payload: RegisterPayload): Promise<ApiResponse> => {
	try {
		const response = await api.post<ApiResponse>("/v1/admin/register", payload);
		return response.data;
	} catch (error: any) {
		console.log("Error Encountered:", error);
		throw error;
	}
};

export const logoutApi = async (): Promise<ApiResponse> => {
	try {
	  	const response = await api.delete<ApiResponse>("/v1/admin/sign-out");
		console.log("API response Out:", response);
		return response?.data;
	} catch (error: any) {
		console.log("Error Encountered:", error);
		throw error;
	}
}

export const forgotPasswordApi = async (email: string): Promise<ApiResponse> => {
	try {
		const response = await api.post<ApiResponse>("/v1/admin/forgot-password", { email });
		return response.data;
	} catch (error: any) {
		console.log("Error Encountered:", error);
		throw error;
	}
};

export const resetPasswordApi = async (payload: ResetPayload): Promise<ApiResponse> => {
	try {
		const response = await api.post<ApiResponse>("/v1/admin/reset-password", payload);
		return response.data;
	} catch (error: any) {
		console.log("Error Encountered:", error);
		throw error;
	}
};

export const verifyEmailApi = async (otpOrHash: string): Promise<ApiResponse> => {
	try {
		const response = await api.post<ApiResponse>("/v1/admin/verify-email", { code: otpOrHash });
		return response.data;
	} catch (error: any) {
		console.log("Error Encountered:", error);
		throw error;
	}
};

export const meApi = async (): Promise<ApiResponse> => {
	try {
		const response = await api.get<ApiResponse>("/v1/admin/me");
		return response.data;
	} catch (error: any) {
		console.log("Error Encountered:", error);
		throw error;
	}
};
