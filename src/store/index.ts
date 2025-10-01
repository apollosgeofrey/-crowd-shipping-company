import { configureStore } from "@reduxjs/toolkit";
import { detectPlatform } from "../utils/detectPlatform.ts";
import authReducer from "../features/auth/store/authSlice.ts";
import platformReducer from "../features/platform/store/platformSlice.ts";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const initialPlatform = detectPlatform(); // compute once here

export const store = configureStore({
	reducer: {
    	platform: platformReducer,
		auth: authReducer,
	},
	preloadedState: {
	    platform: {
	      platform: initialPlatform,
	      isPlatformCompany: initialPlatform === "company",
	      isPlatformAdministrator: initialPlatform === "admin",
	      overridden: false,
	    },
	    // if you have other reducers with preloadedState, include them here
	}
  	// middleware/devtools config (optional)
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
