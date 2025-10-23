import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Keep REGUARE api FUNCITONS
import {
	meApi, 
	loginApi, 
	logoutApi, 
	registerApi,
	verifyEmailApi,
	forgotPasswordApi, 
	resetPasswordApi,	
} from "../services/authService";

// Import ALL types separately
import type { 
	AdminUser,
	AuthResponse,
	LoginPayload,
	ResetPayload, 
	RegisterPayload, 
} from "../services/authService";

interface AuthState {
	user: AdminUser | null;
	token: string | null;
	loading: boolean;
	error: string | null;
	message: string | null;
}

const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
const storedUser = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;

const initialState: AuthState = {
	user: storedUser ? JSON.parse(storedUser) : null,
	token,
	error: null,
	message: null,
	loading: false,
	isAuthenticated: !!token && !!storedUser
};

// Async thunks
export const login = createAsyncThunk("auth/login",
	async (payload: LoginPayload, { rejectWithValue }) => {
		try {
			const response = await loginApi(payload);
			if (typeof window !== "undefined") {
				localStorage.setItem("authToken", response.token);
				localStorage.setItem("authUser", JSON.stringify(response.user)); // Fix: response.user (not response.data)
			}
			return response;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials.");
		}
	}
);

export const register = createAsyncThunk("auth/register",
	async (payload: RegisterPayload, { rejectWithValue }) => {
		try {
			const response = await registerApi(payload);
			if (typeof window !== "undefined") {
				localStorage.setItem("authToken", response.token);
				localStorage.setItem("authUser", JSON.stringify(response.data));
			}
			return response;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Registration failed. Please try again.");
		}
	}
);

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser",
	async (_, { rejectWithValue }) => {
		try {
		  	return await meApi();
		} catch (error: any) {
		  	return rejectWithValue(error.response?.data?.message || "Failed to get user information");
		}
	}
);


// features/auth/store/authSlice.ts
export const logout = createAsyncThunk("auth/logout",
  	async (_, { rejectWithValue, dispatch }) => {
	    try {
	      const response = await logoutApi(); // Call logout API	      
	      dispatch(clearAuth());	       // Clear local state regardless of API success
	      return response; // Return API response
	    } catch (error: any) {
	      dispatch(clearAuth());	      
	      return rejectWithValue(error.response?.data?.message || "Logout completed locally");
	    }
  	}
);


export const requestPasswordReset = createAsyncThunk("auth/requestPasswordReset",
	async (email: string, { rejectWithValue }) => {
		try {
		  	return await forgotPasswordApi(email);
		} catch (error: any) {
		  return rejectWithValue(error.response?.data?.message || "Failed to request password reset");
		}
	}
);

export const resetPassword = createAsyncThunk("auth/resetPassword",
	async (payload: ResetPayload, { rejectWithValue }) => {
		try {
		  	return await resetPasswordApi(payload);
		} catch (error: any) {
		  	return rejectWithValue(error.response?.data?.message || "Failed to reset password");
		}
	}
);

export const verifyEmail = createAsyncThunk("auth/verifyEmail",
	async (otpOrHash: string, { rejectWithValue }) => {
		try {
		  	return await verifyEmailApi(otpOrHash);
		} catch (error: any) {
		  return rejectWithValue(error.response?.data?.message || "Email verification failed");
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
		setAuth: (state, action: PayloadAction<{ user: AdminUser; token: string }>) => {
		  	state.error = null;
		  	state.isAuthenticated = true;
		  	state.user = action.payload.user;
		  	state.token = action.payload.token;
		  	if (typeof window !== "undefined") {
			    localStorage.setItem("authToken", action.payload.token);
			    localStorage.setItem("authUser", JSON.stringify(action.payload.user));
		  	}
		},
		clearAuth: (state) => {
		  	state.user = null;
			state.token = null;
		  	state.error = null;
		  	state.message = null;
		  	state.isAuthenticated = false;
		  	if (typeof window !== "undefined") {
			    localStorage.removeItem("authToken");
			    localStorage.removeItem("authUser");
		  	}
		},
		clearError: (state) => { state.error = null; },
		clearMessage: (state) => { state.message = null; },
	},
	extraReducers: (builder) => {
		builder
	  	// Login
	  	.addCase(login.pending, (state) => {
	    	state.loading = true;
	    	state.error = null;
	  	}).addCase(login.fulfilled, (state, action) => {
	  		console.log('store');
	  		console.log(action);
	  		console.log(action.payload);
	  		console.log(action.payload.user);
	  		console.log(action.payload.token);
		  	state.loading = false;
		  	state.user = action.payload.user; // Fix: action.payload.user (not action.payload.data)
		  	state.token = action.payload.token; // Fix: action.payload.token
		  	state.error = null;
		  	state.message = "Login successful"; // You can set a custom message
		}).addCase(login.rejected, (state, action) => {
	    	state.loading = false;
	    	state.user = null;
	    	state.token = null;
	    	state.error = action.payload as string;
	  	})
	  	
	  	// Register
	  	.addCase(register.pending, (state) => {
	    	state.loading = true;
	    	state.error = null;
	  	}).addCase(register.fulfilled, (state, action) => {
		    state.loading = false;
		    state.user = action.payload.data;
		    state.token = action.payload.token;
		    state.error = null;
		    state.message = action.payload.message;
	  	}).addCase(register.rejected, (state, action) => {
		    state.loading = false;
		    state.user = null;
		    state.token = null;
		    state.error = action.payload as string;
	  	})

	  	// Get Current User
	  	.addCase(getCurrentUser.pending, (state) => {
	    	state.loading = true;
	  	}).addCase(getCurrentUser.fulfilled, (state, action) => {
		    state.loading = false;
		    state.user = action.payload;
		    if (typeof window !== "undefined") {
		      localStorage.setItem("authUser", JSON.stringify(action.payload));
		    }
	  	}).addCase(getCurrentUser.rejected, (state) => {
		    state.loading = false;
		    state.user = null;
		    state.token = null;
	  	})

	  	// Logout
	    .addCase(logout.pending, (state) => {
	      	state.loading = true;
	    }).addCase(logout.fulfilled, (state, action) => {
		    state.loading = false;
		    state.user = null;
		    state.token = null;
		    state.error = null;
		    state.message = null;
	      	state.message = action.payload.message;
	    }).addCase(logout.rejected, (state, action) => {
	      	state.loading = false;
	      	state.error = action.payload as string;
	    })

		// Password Reset
		.addCase(requestPasswordReset.fulfilled, (state, action) => {
		    state.loading = false;
		    state.message = action.payload.message;
		    state.error = null;
		}).addCase(resetPassword.fulfilled, (state, action) => {
		    state.loading = false;
		    state.message = action.payload.message;
		    state.error = null;
		})
	},
});

export const { 
	setLoading, 
	setAuth, 
	clearAuth, 
	clearError, 
	clearMessage 
} = authSlice.actions;

export default authSlice.reducer;