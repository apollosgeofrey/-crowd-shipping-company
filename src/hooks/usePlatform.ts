// src/hooks/usePlatform.ts
import { useSelector } from "react-redux";
import type { RootState } from "../store"; // path may vary; adjust if your store file is elsewhere

export const usePlatform = () => useSelector((s: RootState) => s.platform.platform);
export const useIsAdmin = () => useSelector((s: RootState) => s.platform.isPlatformAdministrator);
export const useIsCompany = () => useSelector((s: RootState) => s.platform.isPlatformCompany);
