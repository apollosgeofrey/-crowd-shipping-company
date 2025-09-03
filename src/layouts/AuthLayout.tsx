import { PropsWithChildren } from "react";
import { APP_NAME } from "../config/constants";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h1 className="text-xl font-semibold text-center mb-4">{APP_NAME}</h1>
        {children}
      </div>
    </div>
  );
}
