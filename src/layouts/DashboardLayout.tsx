import { PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/store";
import { clearAuth } from "../features/auth/store/authSlice";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const logout = () => { dispatch(clearAuth()); nav("/login"); };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Admin</h2>
        <ul>
          <li><Link to="/dashboard" className="block py-2">Dashboard</Link></li>
          <li><Link to="/shipments" className="block py-2">Shipments</Link></li>
          <li><Link to="/tax" className="block py-2">Tax</Link></li>
          <li><button className="mt-4 btn btn-danger w-full" onClick={logout}>Logout</button></li>
        </ul>
      </aside>
      <main className="flex-1 bg-gray-50">
        <nav className="bg-white border-b p-4 flex justify-end">
          <span className="mr-4"><i className="fa-regular fa-bell"></i></span>
          <span className="font-medium">Hi, Admin</span>
        </nav>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
