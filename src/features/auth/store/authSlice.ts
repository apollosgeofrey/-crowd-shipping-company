import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { meApi, logoutApi } from "../services/authService"; // Keep REGUARE api FUNCITONS


interface AuthState {
	user: any;
	token: string | null;
	loading: boolean;
	error: string | null;
	message: string | null;
	isAuthenticated: boolean;
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

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
		setAuth: (state, action: PayloadAction<{ user: any; token: string }>) => {
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

	  	// Get Current User
	  	.addCase(getCurrentUser.pending, (state) => {
	  		console.log('getCurrentUser.pending');
	    	state.loading = true;
	  	}).addCase(getCurrentUser.fulfilled, (state, action) => {
	  		console.log('getCurrentUser.fulfilled');
		    state.loading = false;
		    state.user = action.payload.data.user;
		    if (typeof window !== "undefined") {
		      localStorage.setItem("authUser", JSON.stringify(action.payload.data.user));
		    }
	  	}).addCase(getCurrentUser.rejected, (state) => {
	  		console.log('getCurrentUser.rejected');
		    state.loading = false;
		    state.user = null;
		    state.token = null;
	  	})

	  	// Logout
	    .addCase(logout.pending, (state) => {
	    	console.log('logout.pending');
	      	state.loading = true;
	    }).addCase(logout.fulfilled, (state, action) => {
	    	console.log('logout.fulfilled');
		    state.loading = false;
		    state.user = null;
		    state.token = null;
		    state.error = null;
		    state.message = null;
	      	state.message = action.payload.message;
	    }).addCase(logout.rejected, (state, action) => {
	    	console.log('logout.rejected');
	      	state.loading = false;
	      	state.error = action.payload as string;
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