import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = { id: number; name: string; email: string } | null;

interface AuthState {
  user: User;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("auth_token"),
  loading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload; },
    setAuth: (s, a: PayloadAction<{ user: User; token: string }>) => {
      s.user = a.payload.user;
      s.token = a.payload.token;
      localStorage.setItem("auth_token", a.payload.token);
    },
    clearAuth: (s) => {
      s.user = null; s.token = null;
      localStorage.removeItem("auth_token");
    }
  }
});

export const { setLoading, setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
