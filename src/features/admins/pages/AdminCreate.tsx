// pages/admin/AdminCreate.tsx
import { useState } from "react";
import NewUser from "./adminCreatePartials/NewUser.tsx";
import DashboardLayout from "../../../layouts/DashboardLayout";
import ExistingUser from "./adminCreatePartials/ExistingUser.tsx";

export default function AdminCreate() {
const [userType, setUserType] = useState<"existing" | "new" | null>(null);

	return (
		<DashboardLayout>
			<div className="card shadow-sm rounded p-4">

				{/* Step 1: Choose user type */}
				{!userType && (
					<div className="text-center py-5">
						<h5 className="fw-bold mb-2">Choose User Type</h5>
						<p className="text-muted">Decide whether this is a new user or an existing user</p>

						<div className="d-flex justify-content-center gap-5 mt-4">
							<button className="btn btn-outline-primary px-4 py-2 fw-semibold" onClick={() => setUserType("existing")}>
								<i className="fa fa-user me-2"></i> Promote Existing User
							</button>
							<button className="btn btn-primary px-4 py-2 fw-semibold" onClick={() => setUserType("new")}>
								<i className="fa fa-user-plus me-2"></i> Create New User
							</button>
						</div>
					</div>
				)}

				{/* Step 2: Render form based on choice */}
				{userType === "existing" && (
					<>
						<ExistingUser />
						<div className="text-center mt-4">
		                    <button className="btn btn-outline-primary" onClick={() => setUserType(null)}>
		                        <i className="fa fa-angle-double-left me-2"></i> Go Back
		                    </button>
		                </div>
					</>
				)}

				{userType === "new" && (
					<>
						<NewUser />
						<div className="text-center mt-4">
		                    <button className="btn btn-outline-primary" onClick={() => setUserType(null)}>
		                        <i className="fa fa-angle-double-left me-2"></i> Go Back
		                    </button>
		                </div>
		            </>
				)}
			</div>
		</DashboardLayout>
	);
}
