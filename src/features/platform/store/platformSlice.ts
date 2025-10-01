// src/features/platform/platformSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { detectPlatform, type Platform } from "../../../utils/detectPlatform.ts";

export interface PlatformState {
	platform: Platform;
	isPlatformAdministrator: boolean;
	isPlatformCompany: boolean;
	overridden?: boolean;
}

const initialPlatform = detectPlatform();

const initialState: PlatformState = {
	platform: initialPlatform,
	isPlatformCompany: initialPlatform === "company",
	isPlatformAdministrator: initialPlatform === "admin",
	overridden: false,
};

const platformSlice = createSlice({
	name: "platform",
	initialState,
	reducers: {
		setPlatform(state, action: PayloadAction<Platform>) {
			const p = action.payload;
			state.platform = p;
			state.isPlatformAdministrator = p === "admin";
			state.isPlatformCompany = p === "company";
			state.overridden = true;
			// make available globally for non-React code if useful
			if (typeof window !== "undefined") (window as any).__PLATFORM__ = p;
		},
		resetPlatform(state) {
			const p = detectPlatform();
			state.platform = p;
			state.isPlatformAdministrator = p === "admin";
			state.isPlatformCompany = p === "company";
			state.overridden = false;
			if (typeof window !== "undefined") delete (window as any).__PLATFORM__;
		},
	},
});

export const { setPlatform, resetPlatform } = platformSlice.actions;
export default platformSlice.reducer;
