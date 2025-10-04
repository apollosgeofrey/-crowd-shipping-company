import api from "../../../services/api";

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	email: string;
	password: string;
}

export interface ResetPayload {
	token: string;
	email: string;
	password: string;
	password_confirmation: string;
}

export const loginApi = async (payload: LoginPayload) => {
	const { data } = await api.post("/auth/login", payload);
	// expected: {token: string, user: {...}}
	return data;
};

export const registerApi = async (payload: RegisterPayload) => {
	const { data } = await api.post("/auth/register", payload);
	// expected: {token: string, user: {...}}
	return data;
};

export const forgotPasswordApi = async (email: string) => {
	const { data } = await api.post("/auth/forgot-password", { email });
	return data;
};

export const resetPasswordApi = async (payload: ResetPayload) => {
	const { data } = await api.post("/auth/reset-password", payload);
	return data;
};

export const verifyEmailApi = async (otpOrHash: string) => {
	const { data } = await api.post("/auth/verify-email", { code: otpOrHash });
	return data;
};

export const meApi = async () => {
	const { data } = await api.get("/auth/me");
	return data;
};
