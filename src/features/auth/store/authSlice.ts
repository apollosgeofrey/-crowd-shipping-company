import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = { id: number; name: string; email: string } | null;

interface AuthState {
  user: User;
  token: string | null;
  loading: boolean;
}

const token =
  typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

const initialState: AuthState = {
  user: null,
  token,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", action.payload.token);
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    },
  },
});

export const { setLoading, setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
